import { Section } from "../models/Section.mjs";
import { db } from "../db/deps.mjs";

export const addNewSectionUc = async (name, bookId) => {
  try {
    const secction = new Section(name, bookId);
    await db.saveSection(secction);
  } catch (e) {
    throw new Error(`Error to create secction ${e}`);
  }
};
