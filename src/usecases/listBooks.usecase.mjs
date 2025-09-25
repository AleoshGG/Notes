import { db } from "../db/deps.mjs";

export const listBooksUC = async () => {
  try {
    const books = await db.getAllBooksComplete();
    return books;

  } catch (e) {
    throw new Error(`Error to create book: ${e}`);
  }
};
