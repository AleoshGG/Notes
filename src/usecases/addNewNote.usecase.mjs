import { Note } from "../models/Note.mjs";
import { db } from "../db/deps.mjs";

export const addNewNoteUC = async (title, description, sectionId) => {
  try {
    const note = new Note(title, description, sectionId);
    await db.saveNote(note);
  } catch (e) {
    throw new Error(`Error to create secction ${e}`);
  }
};
