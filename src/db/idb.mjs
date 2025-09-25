import { openDB } from "https://cdn.jsdelivr.net/npm/idb@8/build/index.js";

const DB_NAME = "NotesAppDB";
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // 1. Almacén para Libros
    if (!db.objectStoreNames.contains("books")) {
      db.createObjectStore("books", { keyPath: "id", autoIncrement: true });
    }

    // 2. Almacén para Secciones
    if (!db.objectStoreNames.contains("sections")) {
      const sectionStore = db.createObjectStore("sections", {
        keyPath: "id",
        autoIncrement: true,
      });
      // Índice para buscar secciones por el ID del libro
      sectionStore.createIndex("by-book", "bookId");
    }

    // 3. Almacén para Notas
    if (!db.objectStoreNames.contains("notes")) {
      const noteStore = db.createObjectStore("notes", {
        keyPath: "id",
        autoIncrement: true,
      });
      // Índice para buscar notas por el ID de la sección
      noteStore.createIndex("by-section", "sectionId");
    }
  },
});