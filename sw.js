const CACHE_NAME = `static-v1`;

const APP_SHELL = [
  "manifest.json",
  "index.html",
  "style.css",
  "assets/notes.ico",
  "assets/notes 1.png",
  "assets/notes 2.png",
  "assets/notes 3.png",
  "assets/user.png",
  "assets/welcome.png",
  "main.mjs",
  "sw.js",
  "src/controllers/addNewBook.mjs",
  "src/controllers/addNewNote.mjs",
  "src/controllers/addNewSection.mjs",
  "src/controllers/debounce.mjs",
  "src/controllers/listBooks.mjs",
  "src/controllers/noteController.mjs",
  "src/controllers/updateNote.mjs",
  "src/db/deps.mjs",
  "src/db/idb.mjs",
  "src/db/queries.mjs",
  "src/models/Book.mjs",
  "src/models/Note.mjs",
  "src/models/Section.mjs",
  "src/usecases/addNewBook.usecase.mjs",
  "src/usecases/addNewNote.usecase.mjs",
  "src/usecases/addNewSection.usecase.mjs",
  "src/usecases/listBooks.usecase.mjs",
  "src/usecases/updateNote.usecase.mjs",
  "https://cdn.jsdelivr.net/npm/idb@8/build/index.js",
];

// Instalación del sw
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log("SW: Cacheando app shell (uno por uno)...");
      for (const path of APP_SHELL) {
        try {
          const resp = await fetch(path, { cache: "reload" });
          if (!resp || (!resp.ok && resp.type !== "opaque")) {
            throw new Error(`Bad response for ${path}: ${resp && resp.status}`);
          }
          await cache.put(path, resp.clone());
          console.log(`SW: cacheado -> ${path}`);
        } catch (err) {
          console.error(`SW: fallo al cachear ${path}:`, err);
        }
      }
      await self.skipWaiting();
    })()
  );
});

// Estado de activación
self.addEventListener("activate", (e) => {
  console.log("SW: Estado de activación");
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Interseptar peticiones
self.addEventListener("fetch", (e) => {
  const req = e.request;

  // Solo manejamos GET
  if (req.method !== "GET") return;

  // 1) Navegación: fallback a index.html (SPA) SOLO para modo 'navigate'
  if (req.mode === "navigate") {
    e.respondWith(
      caches.match("index.html").then((cached) => cached || fetch(req))
    );
    return;
  }

  // 2) Peticiones de script/module (.mjs, scripts): cache-first, luego red, NO index.html fallback
  const isScript =
    req.destination === "script" ||
    req.url.endsWith(".mjs") ||
    (req.headers.get("accept") &&
      req.headers.get("accept").includes("javascript"));
  if (isScript) {
    e.respondWith(
      caches
        .match(req)
        .then((cached) => {
          if (cached) return cached;
          return fetch(req).then((networkResp) => {
            // opcional: cachea dinámicamente
            if (networkResp && networkResp.ok && req.url.startsWith("http")) {
              const copy = networkResp.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            }
            return networkResp;
          });
        })
        .catch(() => {
          // Si falla red y no hay cache, devolvemos error (no index.html)
          return new Response("", {
            status: 503,
            statusText: "Service Unavailable",
          });
        })
    );
    return;
  }

  // 3) Resto de recursos: cache-first, fallback a red, y si todo falla -> index.html (opcional)
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((networkResp) => {
          // opcional: cachear dinámicamente recursos ok
          return networkResp;
        })
        .catch(() => {
          // si la petición era para un recurso estático y todo falla, opcionalmente devolvemos index
          return caches.match("index.html");
        });
    })
  );
});
