import { dbPromise } from "./idb.mjs";

export class Queries {
  async saveBook(book) {
    const db = await dbPromise;
    return await db.add("books", book);
  }

  async saveSection(section) {
    const db = await dbPromise;
    return await db.add("sections", section);
  }

  async saveNote(note) {
    const db = await dbPromise;
    // Usa .put() para la operación de upsert
    const noteId = await db.put("notes", note);
    return noteId;
  }

  async getAllBooksComplete() {
    const db = await dbPromise;

    // 1. Obtener todos los datos de las 3 tablas en paralelo
    const [books, sections, notes] = await Promise.all([
      db.getAll("books"),
      db.getAll("sections"),
      db.getAll("notes"),
    ]);

    // 2. Unir los datos
    const sectionMap = new Map();
    sections.forEach((section) => {
      section.notes = []; // Preparamos el array para las notas
      sectionMap.set(section.id, section);
    });

    notes.forEach((note) => {
      const section = sectionMap.get(note.sectionId);
      if (section) {
        section.notes.push(note);
      }
    });

    books.forEach((book) => {
      book.sections = sections.filter((s) => s.bookId === book.id);
    });

    return books;
  }
}
