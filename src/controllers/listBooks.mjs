export const renderBooks = (books) => {
  const fileTree = document.querySelector(".file-tree");
  if (!fileTree) return;

  fileTree.innerHTML = ""; // Limpia la vista actual

  books.forEach((book) => {
    const bookLi = document.createElement("li");
    bookLi.className = "folder open";
    bookLi.dataset.bookId = book.id;

    bookLi.innerHTML = `
        <div class="folder-header">
            <span class="name">${book.name}</span>
            <div class="explorer-actions">
            <button 
                class="action-btn add-section-btn" 
                title="Nueva Sección" 
                data-book-id="${book.id}"
            >+</button>
            </div>
        </div>
        <ul class="section-list"></ul>
        `;

    const sectionListUl = bookLi.querySelector(".section-list");
    book.sections.forEach((section) => {
      const sectionLi = document.createElement("li");
      sectionLi.className = "folder open";
      sectionLi.dataset.sectionId = section.id;

      sectionLi.innerHTML = `
          <div class="folder-header">
            <span class="name">${section.name}</span>
            <div class="explorer-actions">
              <button class="action-btn add-note-btn" title="Nueva Nota" data-section-id="${
                section.id
              }">+</button>
            </div>
          </div>
          <ul class="note-list">
            ${section.notes
              .map(
                (note) => `
              <li class="file" data-note-id="${note.id}">
                <span class="name">${note.title}</span>
              </li>
            `
              )
              .join("")}
          </ul>
        `;
      sectionListUl.appendChild(sectionLi);
    });

    fileTree.appendChild(bookLi);
  });
};
