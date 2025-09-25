import { addNewSection } from "./src/controllers/addNewSection.mjs";
import { listBooksUC } from "./src/usecases/listBooks.usecase.mjs";
import { renderBooks } from "./src/controllers/listBooks.mjs";
import { addNewBook } from "./src/controllers/addNewBook.mjs";
import {
  initNoteController,
  updateCurrentBooks,
} from "./src/controllers/noteController.mjs";
import { renderNoteEditor } from "./src/controllers/addNewNote.mjs";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log(
          `Service Worker registrato con exito: ${registration.scope}`
        );
      })
      .catch((error) => {
        console.log(`Error al registrar el Service Worker: ${error}`);
      });
  });
}

// --- FUNCIÓN PRINCIPAL Y ARRANQUE ---
async function refreshBookList() {
  const books = await listBooksUC();
  //console.log(books);
  updateCurrentBooks(books);
  renderBooks(books);
  renderNoteEditor();
}

// Inicia la aplicación cargando los libros
initNoteController(refreshBookList);
await refreshBookList();
addNewBook(refreshBookList);
addNewSection(refreshBookList);
