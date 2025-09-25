export const renderNoteEditor = (note, path) => {
  // 1. Selecciona todos los elementos necesarios
  const welcomeScreen = document.getElementById("welcome-screen");
  const noteEditor = document.querySelector(".note-editor");

  const pathElement = document.getElementById("path");
  const titleInput = document.getElementById("note-title");
  const descriptionTextarea = document.getElementById("note-description");

  // 2. Decide qué mostrar
  if (note) {
    // Si hay una nota, muestra el editor y oculta la bienvenida
    welcomeScreen.classList.add("hidden");
    noteEditor.classList.remove("hidden");

    // Rellena los campos con la información de la nota
    pathElement.textContent = path;
    titleInput.value = note.title;
    descriptionTextarea.value = note.description;
  } else {
    // Si NO hay nota, muestra la bienvenida y oculta el editor
    welcomeScreen.classList.remove("hidden");
    noteEditor.classList.add("hidden");

    // Limpia el path
    pathElement.textContent = "Bienvenido";
  }
};
