import { addNewBookUc } from "../usecases/addNewBook.usecase.mjs";

export const addNewBook = (onBookAdded) => {
  const button = document.getElementById("addNewBook");
  const section = document.getElementById("newBookSection");
  const inputName = document.createElement("input");

  button.addEventListener("click", () => {
    section.appendChild(inputName);
  });

  inputName.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      if (inputName.value === "") {
        inputName.remove();
      } else {
        await addNewBookUc(inputName.value.trim());
        if (onBookAdded) {
          await onBookAdded();
        }
        inputName.value = "";
        inputName.remove();
      }
    }
  });

  inputName.addEventListener("blur", async () => {
    if (inputName.value === "") {
      inputName.remove();
    } else {
      await addNewBookUc(inputName.value.trim());
      if (onBookAdded) {
        await onBookAdded();
      }
      inputName.value = "";
      inputName.remove();
    }
  });
};
