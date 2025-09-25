export class Section {
  bookId;
  name;
  notes = [];

  constructor(name, bookId) {
    this.name = name;
    this.bookId = bookId;
  }
}
