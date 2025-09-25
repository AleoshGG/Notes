import { db } from "../db/deps.mjs";

export const updateNoteUC = async (id, title, description, sectionId) => {
  try {
    const note = {
      id: id,
      title: title,
      description: description,
      sectionId: sectionId,
    };
    await db.saveNote(note);
  } catch (e) {
    throw new Error(`Error to create secction ${e}`);
  }
};
