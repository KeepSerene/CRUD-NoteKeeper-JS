/**
 * @copyright KeepSerene 2024
 */

"use strict";

// Import modules
import {
  addEventListenerToElems,
  getGreetingMsg,
  getFormattedDateStr,
  activateNotebookField,
  enableEditingAndFocus,
} from "./utils.js";

import { Tooltip } from "./components/tooltip.js";
import { db } from "./db.js";
import { UIManager } from "./UIManager.js";
import { CreationModal } from "./components/modal.js";

// Update copyright year
const copyrightYearEl = document.querySelector("[data-copyright-year]");
copyrightYearEl.innerText = `${new Date().getFullYear()},`;

// Toggle sidebar on small screens
const /** {HTMLElement} */ $sidebarEl =
    document.querySelector("[data-sidebar]");
const /** {Array<HTMLElement>} */ $sidebarTogglerEls =
    document.querySelectorAll("[data-sidebar-toggler]");
const /** {HTMLElement} */ $sidebarOverlayEl = document.querySelector(
    "[data-sidebar-overlay]"
  );

addEventListenerToElems($sidebarTogglerEls, "click", () => {
  $sidebarEl.classList.toggle("active");
  $sidebarOverlayEl.classList.toggle("active");
});

// Update main body greeting message
const /** {HTMLElement} */ $greetingMsgEl = document.querySelector(
    "[data-greeting-msg]"
  );
const /** {number} */ currentHours = new Date().getHours();

$greetingMsgEl.innerText = getGreetingMsg(currentHours);

// Update main body date
const /** {HTMLElement} */ $presentDateEl = document.querySelector(
    "[data-present-date]"
  );
$presentDateEl.innerText = getFormattedDateStr(new Date());

// Initialize tooltips for certain (static or permanent) DOM elements
const /** {Array<HTMLElement>} */ $tooltipAnchorEls =
    document.querySelectorAll("[data-tooltip]");

$tooltipAnchorEls.forEach(($tooltipAnchorEl) => Tooltip($tooltipAnchorEl));

// Handle creation of new notebooks
const /** {HTMLElement} */ $addNotebookBtnEl = document.querySelector(
    "[data-add-notebook]"
  );
const /** {HTMLElement} */ $sidebarListEl = document.querySelector(
    "[data-sidebar-list]"
  );

$addNotebookBtnEl.addEventListener("click", handleNewNotebookFieldCreation);

/**
 * Enables 'Add notebook' button functionality.
 * Generates an editable field on button click.
 * Finalizes creation on 'Enter' key press.
 */

function handleNewNotebookFieldCreation() {
  const $navItemEl = document.createElement("div");
  $navItemEl.classList.add("nav-item");

  $navItemEl.innerHTML = `
    <span class="text text-label-large" data-notebook-field></span>

    <div class="state-layer"></div>
  `;

  $sidebarListEl.appendChild($navItemEl);

  const /** {HTMLElement} */ $noteBookFieldEl = $navItemEl.querySelector(
      "[data-notebook-field]"
    );

  // Activate the newly created notebook field after deactivating the last one
  activateNotebookField.call($navItemEl);

  // Enable editing for the newly created notebook field and set focus on it
  enableEditingAndFocus($noteBookFieldEl);

  // Handle the 'Enter' keypress
  $noteBookFieldEl.addEventListener("keydown", createNewNotebook);
}

/**
 * Creates a new notebook upon clicking 'Enter,' and stores it in the database
 *
 * @param {KeyboardEvent} event The keyboard event that finalized the notebook creation
 */

function createNewNotebook(event) {
  if (event.key === "Enter") {
    // Store the newly created notebook in the database
    const /** {Object} */ notebook = db.post.addNotebook(
        this.innerText.trim() || "Untitled"
      ); // this: $noteBookFieldEl

    this.parentElement.remove();

    // Render the notebook
    UIManager.notebook.create(notebook);
  }
}

/**
 * Fetches existing notebooks from local storage and forwards them to the 'UIManager' for handling.
 */

function fetchNotebooksFromDB() {
  const /** {Array<Object>} */ notebookList = db.get.fetchNotebooks();

  UIManager.notebook.readAndRender(notebookList);
}

fetchNotebooksFromDB();

/**
 * Initiates the creation of a new note.
 *
 * Attaches event listeners to a set of DOM elements representing 'Create Note' buttons.
 * Upon button click, opens a modal for creating a new note and manages the submission
 * of the new note to the local storage (database) and the 'UIManager'.
 */

const /** {Array<HTMLElement>} */ $newNoteBtnEls = document.querySelectorAll(
    "[data-add-note-btn]"
  );

addEventListenerToElems($newNoteBtnEls, "click", () => {
  // Create and open a note creation modal window
  const /** {Object} */ noteCreationModal = CreationModal();

  noteCreationModal.show();

  // Handle the submission of the new note to the database and the 'UIManager'
  noteCreationModal.onSave((noteObj) => {
    const /** {string} */ activeNotebookID = document.querySelector(
        "[data-notebook].active"
      ).dataset.notebook;

    const /** {Object} */ noteInfo = db.post.addNote(activeNotebookID, noteObj);

    UIManager.note.create(noteInfo);

    noteCreationModal.close();
  });
});

/**
 * Displays existing notes within the active notebook tab. Retrieves note data from the database (local storage) based on the active notebook ID
 * and utilizes the UIManager to render the notes.
 */

function fetchNotesFromDB() {
  const /** {string | undefined} */ activeNotebookID = document.querySelector(
      "[data-notebook].active"
    )?.dataset.notebook;

  if (activeNotebookID) {
    const /** Array<Object> */ noteList = db.get.fetchNotes(activeNotebookID);

    // Render the existing notes in the UI
    UIManager.note.readAndRender(noteList);
  }
}

fetchNotesFromDB();
