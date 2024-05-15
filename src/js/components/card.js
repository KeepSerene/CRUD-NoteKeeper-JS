/**
 * @copyright KeepSerene 2024
 */

"use strict";

// Import modules
import { Tooltip } from "./tooltip.js";
import { formatElapsedTime } from "../utils.js";
import { CreationModal, DeletionModal } from "./modal.js";
import { db } from "../db.js";
import { UIManager } from "../UIManager.js";

/**
 * Constructs a DOM element ('card') to visually represent a note, using the provided note data.
 *
 * @param {Object} noteInfo Information about the note to be displayed in the card
 * @returns {HTMLElement} The created card element
 */

export function Card(noteInfo) {
  const { id, parentNotebookID, title, body, postedAt } = noteInfo;

  const /** {HTMLElement} */ $cardEl = document.createElement("div");
  $cardEl.classList.add("card");
  $cardEl.setAttribute("data-note", id);

  $cardEl.innerHTML = `
  <h3 class="card-title | text-title medium">${title}</h3>

  <p class="card-text text-body-large">${body}</p>

  <div class="wrapper">
    <span class="card-elapsed-time text-label-large">${formatElapsedTime(
      postedAt
    )}</span>

    <button
      type="button"
      class="icon-btn large"
      aria-label="Delete note"
      data-tooltip="Delete note"
      data-delete-btn
    >
      <i class="material-symbols-rounded" aria-hidden="true">delete</i>

      <div class="state-layer"></div>
    </button>
  </div>

  <div class="state-layer"></div>
  `;

  Tooltip($cardEl.querySelector("[data-tooltip]"));

  $cardEl.addEventListener("click", () => {
    const /** {Object} */ noteModal = CreationModal(
        title,
        body,
        formatElapsedTime(postedAt)
      );

    noteModal.show();

    noteModal.onSave((newNoteInfo) => {
      const updatedNoteInfo = db.update.updateNote(id, newNoteInfo);

      // Update the note in the UI
      UIManager.note.update(id, updatedNoteInfo);

      // Finally, close the note modal window
      noteModal.close();
    });
  });

  // Note deletion functionality

  /**
   * Sets up a click event listener on the delete button element within the card.
   * When the delete button is clicked, a confirmation modal is displayed for deleting the associated note.
   * Upon confirmation, the UI and database are updated to remove the note.
   */

  const /** {HTMLElement} */ $deleteBtnEl =
      $cardEl.querySelector("[data-delete-btn]");

  $deleteBtnEl.addEventListener("click", (event) => {
    event.stopImmediatePropagation();

    const /** {Object} */ deletionModal = DeletionModal(title);

    deletionModal.show();

    deletionModal.onConfirmation((shouldDelete) => {
      if (shouldDelete) {
        const /** {Array<Object>} */ remainingNotes = db.remove.deleteNote(
            parentNotebookID,
            id
          );

        // Update the UI to reflect the current changes
        UIManager.note.delete(id, remainingNotes.length);
      }

      deletionModal.close();
    });
  });

  return $cardEl;
}
