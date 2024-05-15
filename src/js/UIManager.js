/**
 * @copyright KeepSerene 2024
 */

"use strict";

// Import modules
import { NavItem } from "./components/navItem.js";
import { activateNotebookField } from "./utils.js";
import { Card } from "./components/card.js";

const /** {HTMLElement} */ $sidebarListEl = document.querySelector(
    "[data-sidebar-list]"
  );

const /** {HTMLElement} */ $notePanelTitleEl = document.querySelector(
    "[data-note-panel-title]"
  );

const /** {HTMLElement} */ $notePanelEl =
    document.querySelector("[data-note-panel]");

const /** {Array<HTMLElement>} */ $addNoteBtnEls = document.querySelectorAll(
    "[data-add-note-btn]"
  );

const /** {string} */ emptyNotePanelTemplate = `
  <div class="empty-note-panel">
    <i class="material-symbols-rounded" aria-hidden="true">note_stack</i>

    <div class="text-headline-small">No notes</div>
  </div>
`;

/**
 * Controls the availability of 'Add note' buttons based on the presence of notebooks in the UI.
 *
 * @param {boolean} hasNotebooks Indicates whether notebooks are present in the UI
 */

function controlAddNoteBtns(hasNotebooks) {
  $addNoteBtnEls.forEach(($btn) => {
    $btn[hasNotebooks ? "removeAttribute" : "setAttribute"]("disabled", "");
  });
}

/**
 * Manages interactions with the UI for creating, reading, updating, and deleting notebooks and notes.
 * Provides methods for CRUD operations and updates the UI accordingly.
 *
 * @namespace
 * @property {Object} notebook Methods for managing notebooks in the UI
 * @property {Object} note Methods for managing notes in the UI
 */

export const UIManager = {
  notebook: {
    /**
     * Renders a new notebook in the UI, based on the given notebook information.
     *
     * @param {Object} notebookInfo Data representing the new notebook
     */

    create(notebookInfo) {
      const /** {HTMLElement} */ $navItem = NavItem(
          notebookInfo.id,
          notebookInfo.name
        );

      $sidebarListEl.appendChild($navItem);
      activateNotebookField.call($navItem);
      $notePanelTitleEl.innerText = notebookInfo.name;
      $notePanelEl.innerHTML = emptyNotePanelTemplate;
      controlAddNoteBtns(true);
    },

    /**
     * Reads and renders all the existing notebooks from the database into the UI.
     *
     * @param {Array<Object>} notebookList An array of notebook objects
     */

    readAndRender(notebookList) {
      controlAddNoteBtns(notebookList.length);

      notebookList.forEach((notebookInfo, index) => {
        const /** {HTMLElement} */ $navItemEl = NavItem(
            notebookInfo.id,
            notebookInfo.name
          );

        if (index === 0) {
          activateNotebookField.call($navItemEl);
          $notePanelTitleEl.innerText = notebookInfo.name;
        }

        $sidebarListEl.appendChild($navItemEl);
      });
    },

    /**
     * Updates the UI to reflect the changes in an existing notebook.
     *
     * @param {string} oldNotebookID The unique identifier of the old notebook
     * @param {Object} newNotebook The updated notebook object
     */

    update(oldNotebookID, newNotebook) {
      const /** {HTMLElement} */ $oldNoteBook = document.querySelector(
          `[data-notebook="${oldNotebookID}"]`
        );

      const /** {HTMLElement} */ $newNotebook = NavItem(
          newNotebook.id,
          newNotebook.name
        );

      $notePanelTitleEl.innerText = newNotebook.name;

      $sidebarListEl.replaceChild($newNotebook, $oldNoteBook);

      activateNotebookField.call($newNotebook);
    },

    /**
     * Removes a notebook from the UI
     *
     * @param {string} notebookID The ID of the target notebook
     */

    delete(notebookID) {
      const /** {HTMLElement} */ $targetNotebookEl = document.querySelector(
          `[data-notebook="${notebookID}"]`
        );

      const /** {HTMLElement} */ $activeNotebookFieldEl =
          $targetNotebookEl.nextElementSibling ??
          $targetNotebookEl.previousElementSibling;

      if ($activeNotebookFieldEl) $activeNotebookFieldEl.click();
      else {
        $notePanelTitleEl.innerText = "";
        $notePanelEl.innerHTML = "";
        controlAddNoteBtns(false);
      }

      $targetNotebookEl.remove();
    },
  },

  note: {
    /**
     * Generates a new note card in the user interface using the provided note information.
     *
     * @param {Object} noteInfo Data describing the new note
     */

    create(noteInfo) {
      // Remove the 'emptyNotePanelTemplate' from the UI after adding a note to an empty notebook
      if (!$notePanelEl.querySelector("[data-note]"))
        $notePanelEl.innerHTML = "";

      // Append the note-card in the note panel
      const /** {HtMLElement} */ $cardEl = Card(noteInfo);

      $notePanelEl.prepend($cardEl);
    },

    /**
     * Retrieves and displays all existing notes belonging to a notebook in the user interface.
     *
     * @param {Array<Object>} noteList An array containing all existing notes
     */

    readAndRender(noteList) {
      if (noteList.length) {
        $notePanelEl.innerHTML = "";

        noteList.forEach((noteInfo) => {
          const /** {HTMLElement} */ $cardEl = Card(noteInfo);

          $notePanelEl.appendChild($cardEl);
        });
      } else {
        $notePanelEl.innerHTML = emptyNotePanelTemplate;
      }
    },

    /**
     * Refreshes a note card in the user interface with updated note information.
     *
     * @param {string} noteID The ID of the note being updated
     * @param {Object} updatedNoteInfo The new data for the note
     */

    update(noteID, updatedNoteInfo) {
      const /** {HTMLElement} */ $oldCardEl = document.querySelector(
          `[data-note="${noteID}"]`
        );

      const /** {HTMLElement} */ $newCardEl = Card(updatedNoteInfo);

      $notePanelEl.replaceChild($newCardEl, $oldCardEl);
    },

    /**
     * Removes a note card from the user interface.
     *
     * @param {string} noteID The ID of the note to be deleted
     * @param {boolean} hasNotes Indicates whether there are other notes remaining
     */

    delete(noteID, hasNotes) {
      document.querySelector(`[data-note="${noteID}"]`).remove();

      if (!hasNotes) $notePanelEl.innerHTML = emptyNotePanelTemplate;
    },
  },
};
