import { Book } from "../models/Book.mjs";
import { db } from "../db/deps.mjs";

export const addNewBookUc = async (name) => {
  try {
    const book = new Book(name);
    await db.saveBook(book);
  } catch (e) {
    throw new Error(`Error to create book: ${e}`);
  }
};
