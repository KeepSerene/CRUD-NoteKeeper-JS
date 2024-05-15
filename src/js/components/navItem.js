/**
 * @copyright KeepSerene 2024
 */

"use strict";

// Import modules
import { Tooltip } from "./tooltip.js";
import { activateNotebookField, enableEditingAndFocus } from "../utils.js";
import { db } from "../db.js";
import { UIManager } from "../UIManager.js";
import { DeletionModal } from "./modal.js";

const /** {HTMLElement} */ $notePanelTitleEl = document.querySelector(
    "[data-note-panel-title]"
  );

/**
 * Generates a navigation item for a notebook, displaying its name and enabling editing, deletion, and note display.
 *
 * @param {string} id The unique identifier of the notebook
 * @param {string} name The title of the notebook
 * @returns {HTMLElement} The HTML element representing the notebook's navigation item
 */

export function NavItem(id, name) {
  const /** {HTMLElement} */ $navItemEl = document.createElement("div");
  $navItemEl.classList.add("nav-item");
  $navItemEl.setAttribute("data-notebook", id);

  $navItemEl.innerHTML = `
    <span class="text text-label-large" data-notebook-field
    >${name}</span>

    <button
    type="button"
    class="icon-btn small"
    data-tooltip="Edit title"
    data-edit-btn
    aria-label="Edit notebook"
    >
        <i class="material-symbols-rounded" aria-hidden="true">edit</i>

        <div class="state-layer"></div>
    </button>

    <button
    type="button"
    class="icon-btn small"
    data-tooltip="Delete notebook"
    data-delete-btn
    aria-label="Delete notebook"
    >
        <i class="material-symbols-rounded" aria-hidden="true">delete</i>

        <div class="state-layer"></div>
    </button>

    <div class="state-layer"></div>
  `;

  // Attach tooltips for dynamically created notebook fields
  const /** {HTMLElement} */ $tooltipAnchorEls =
      $navItemEl.querySelectorAll("[data-tooltip]");

  $tooltipAnchorEls.forEach(($tooltipAnchorEl) => Tooltip($tooltipAnchorEl));

  /**
   * Manage click events on navigation items, update the note panel title, retrieve associated notes from local storage,
   and highlight the current item.
   */

  $navItemEl.addEventListener("click", function () {
    $notePanelTitleEl.innerText = name;

    activateNotebookField.call(this);

    const /** {Array<Object>} */ noteList = db.get.fetchNotes(
        this.dataset.notebook
      );

    UIManager.note.readAndRender(noteList);
  });

  /**
   * Edit notebook functionality
   */

  const /** {HTMLElement} */ $navItemEditBtnEl =
      $navItemEl.querySelector("[data-edit-btn]");

  const /** {HTMLElement} */ $navItemFieldEl = $navItemEl.querySelector(
      "[data-notebook-field]"
    );

  $navItemEditBtnEl.addEventListener(
    "click",
    enableEditingAndFocus.bind(null, $navItemFieldEl)
  );

  $navItemFieldEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      this.removeAttribute("contenteditable");

      // Update the edited title in the local storage
      const updatedNotebook = db.update.updateNotebookTitle(id, this.innerText);

      // Render updated notebook in the UI
      UIManager.notebook.update(id, updatedNotebook);
    }
  });

  /**
   * Delete notebook functionality
   */

  const /** {HTMLElement} */ $navItemDeleteBtnEl =
      $navItemEl.querySelector("[data-delete-btn]");

  $navItemDeleteBtnEl.addEventListener("click", () => {
    const /** {Object} */ notebookDeletionModal = DeletionModal(name);

    notebookDeletionModal.show();

    notebookDeletionModal.onConfirmation((shouldDelete) => {
      if (shouldDelete) {
        db.remove.deleteNotebook(id);
        UIManager.notebook.delete(id);
      }

      notebookDeletionModal.close();
    });
  });

  return $navItemEl;
}
