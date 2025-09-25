import { updateNoteUC } from "../usecases/updateNote.usecase.mjs"; // Asumiendo que tienes una función de upsert
import { debounce } from "./debounce.mjs";

const inputTitle = document.getElementById("note-title");
const textDescription = document.getElementById("note-description"); // ID Corregido

let currentNoteId;
let currentSectionId;

/**
 * La función que realmente guarda los datos.
 */
const handleSave = async () => {
  if (!currentNoteId) return; // No hacer nada si no hay una nota activa

  const title = inputTitle.value;
  const description = textDescription.value;

  //console.log("Guardando nota...");
  await updateNoteUC(currentNoteId, title, description, currentSectionId);
};

// Creamos una versión de la función de guardado con un retraso de 500ms
const debouncedSave = debounce(handleSave, 500);

/**
 * Prepara el editor para que guarde automáticamente los cambios de una nota específica.
 * @param {object} activeNote - La nota que se está editando.
 */
export const initAutoSave = (activeNote) => {
  // Guardamos los IDs de la nota activa
  currentNoteId = activeNote.id;
  currentSectionId = activeNote.sectionId;

  // Disparamos la función debounced cada vez que el usuario escribe
  inputTitle.addEventListener("input", debouncedSave);
  textDescription.addEventListener("input", debouncedSave);
};

/**
 * Limpia los listeners para evitar guardados accidentales cuando no hay nota.
 */
export const clearAutoSave = () => {
  currentNoteId = null;
  currentSectionId = null;
  inputTitle.removeEventListener("input", debouncedSave);
  textDescription.removeEventListener("input", debouncedSave);
};
