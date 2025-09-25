// file: src/controllers/NoteController.mjs
import { initAutoSave, clearAutoSave } from "./updateNote.mjs";
import { addNewNoteUC } from "../usecases/addNewNote.usecase.mjs";
import { renderNoteEditor } from "./addNewNote.mjs";
import { showNewItemInput } from "./addNewSection.mjs";

// Variable para guardar el estado global de los libros cargados
let currentBooks = [];

/**
 * Inicializa todos los listeners para el árbol de archivos.
 * @param {Function} refreshBookList - Función para recargar y renderizar la lista de libros.
 */
export const initNoteController = (refreshBookList) => {
  const fileTree = document.querySelector(".file-tree");

  fileTree.addEventListener("click", (event) => {
    const addNoteButton = event.target.closest(".add-note-btn");
    const noteFile = event.target.closest(".file");

    // --- LÓGICA PARA AÑADIR UNA NUEVA NOTA ---
    if (addNoteButton) {
      const sectionId = addNoteButton.dataset.sectionId;
      const noteList = addNoteButton
        .closest(".folder[data-section-id]")
        .querySelector(".note-list");

      showNewItemInput(noteList, "Título de la nota...", async (title) => {
        // Guarda la nueva nota y obtén su ID
        const newNoteId = await addNewNoteUC(title, "", parseInt(sectionId));
        // Refresca la lista de libros para que incluya la nueva nota
        await refreshBookList();
        // Busca la nota recién creada y la muestra en el editor
        const { note, path } = findNoteAndPath(newNoteId);
        if (note) {
          renderNoteEditor(note, path);
          setActiveNote(newNoteId);
        }
      });
    }

    // --- LÓGICA PARA SELECCIONAR UNA NOTA EXISTENTE ---
    if (noteFile) {
      const noteId = noteFile.dataset.noteId;
      const { note, path } = findNoteAndPath(parseInt(noteId));
      if (note) {
        // 1. Limpia cualquier listener anterior
        clearAutoSave();
        // 2. Muestra la nota en el editor
        renderNoteEditor(note, path);
        // 3. Activa el autoguardado para ESTA nota
        initAutoSave(note);
        // 4. Marca la nota como activa en la lista
        setActiveNote(noteId);
      }
    }
  });
};

/**
 * Guarda la lista actual de libros para poder buscar en ella.
 * @param {Array} books - El array de libros completo.
 */
export const updateCurrentBooks = (books) => {
  currentBooks = books;
};

/**
 * Busca una nota por su ID y devuelve el objeto y su ruta (Libro/Sección).
 * @param {number} noteId - El ID de la nota a buscar.
 * @returns {{note: object, path: string}|{}}
 */
function findNoteAndPath(noteId) {
  for (const book of currentBooks) {
    for (const section of book.sections) {
      const foundNote = section.notes.find((note) => note.id === noteId);
      if (foundNote) {
        return {
          note: foundNote,
          path: `${book.name} / ${section.name} / ${foundNote.title}`,
        };
      }
    }
  }
  return {}; // Devuelve objeto vacío si no se encuentra
}

/**
 * Gestiona la clase 'active' para resaltar la nota seleccionada.
 * @param {number} noteId - El ID de la nota a activar.
 */
function setActiveNote(noteId) {
  const fileTree = document.querySelector(".file-tree");
  // Quita 'active' de cualquier nota que lo tuviera
  const currentActive = fileTree.querySelector(".file.active");
  if (currentActive) {
    currentActive.classList.remove("active");
  }
  // Añade 'active' a la nueva nota seleccionada
  const newActive = fileTree.querySelector(`.file[data-note-id="${noteId}"]`);
  if (newActive) {
    newActive.classList.add("active");
  }
}
