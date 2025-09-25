import { addNewSectionUc } from "../usecases/addNewSection.usecase.mjs";

export const addNewSection = (refreshBookList) => {
  const fileTree = document.querySelector(".file-tree");

  // --- DELEGACIÓN DE EVENTOS MEJORADA ---
  fileTree.addEventListener("click", (event) => {
    // Usamos .closest() para encontrar el botón de añadir sección más cercano
    const addSectionButton = event.target.closest(".add-section-btn");

    if (addSectionButton) {
      const bookId = addSectionButton.dataset.bookId;
      const bookElement = addSectionButton.closest(".folder[data-book-id]");
      const sectionList = bookElement.querySelector(".section-list");

      // Llama a la función para mostrar el campo de texto para la nueva sección
      showNewItemInput(sectionList, "Nueva sección...", async (name) => {
        await addNewSectionUc(name, parseInt(bookId));
        await refreshBookList(); // Refresca toda la lista para ver el cambio
      });
    }
  });
};

export function showNewItemInput(parentElement, placeholder, onSave) {
  // Evita crear un input si ya existe uno
  if (parentElement.querySelector(".new-item-input")) return;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = placeholder;
  input.className = "new-item-input";

  // 1. Añadimos una bandera para controlar la ejecución
  let isSaving = false;

  const saveAndRemove = async () => {
    // 2. Si ya se está guardando, detenemos la segunda ejecución
    if (isSaving) return;

    // 3. Activamos la bandera para "cerrar la puerta"
    isSaving = true;

    const value = input.value.trim();
    if (value) {
      await onSave(value);
    }
    input.remove();
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveAndRemove();
    }
    if (e.key === "Escape") {
      // Al escapar, nos aseguramos de que 'blur' no guarde
      isSaving = true;
      input.remove();
    }
  });

  input.addEventListener("blur", saveAndRemove);

  parentElement.appendChild(input);
  input.focus();
}
