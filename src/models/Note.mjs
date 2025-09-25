export class Note {
  sectionId;
  title;
  description;

  constructor(title, description, sectionId) {
    this.title = title;
    this.description = description;
    this.sectionId = sectionId;
  }
}
