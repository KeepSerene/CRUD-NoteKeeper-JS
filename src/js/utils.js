/**
 * @copyright KeepSerene 2024
 */

"use strict";

/**
 * Attaches an event listener to a collection of DOM elements.
 *
 * @param {Array<HTMLElement>} $elements An array of DOM elements
 * @param {string} eventType The type of the intended event (e.g., 'click')
 * @param {Function} callback The function to be executed when the event takes place
 */

function addEventListenerToElems($elements, eventType, callback) {
  $elements.forEach(($element) => {
    $element.addEventListener(eventType, callback);
  });
}

/**
 * Generates a greeting message based on the current hour of the day.
 *
 * @param {number} currentHours The current hour (0-23) to determine the apt greeting message
 * @returns {string} A greeting message with a salutation corresponding to the time of the day
 */

function getGreetingMsg(currentHours) {
  const period =
    currentHours < 5
      ? "Night"
      : currentHours < 12
      ? "Morning"
      : currentHours < 15
      ? "Noon"
      : currentHours < 17
      ? "Afternoon"
      : currentHours < 20
      ? "Evening"
      : "Night";

  return `Good ${period}`;
}

/**
 * Returns a formatted string corresponding to the present date.
 *
 * @param {Date} date The present Date object
 * @returns {string} A formatted date string
 */

function getFormattedDateStr(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = days[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const dayOfMonth = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;
}

let /** {HTMLElement | undefined } */ $lastActiveNotebookFieldEl;

/**
 * Activates the newly created notebook field while deactivates the previous one.
 */

function activateNotebookField() {
  $lastActiveNotebookFieldEl?.classList.remove("active");
  this.classList.add("active"); // this: the new notebook field
  $lastActiveNotebookFieldEl = this;
}

/**
 * Enables editing mode for a specified DOM element and sets focus on it
 * @param {HTMLElement} $element The target DOM element
 */

function enableEditingAndFocus($element) {
  $element.setAttribute("contenteditable", "true");
  $element.focus();
}

/**
 * Generates a unique ID based on the current timestamp.
 *
 * @returns {string} A string representation of the current timestamp
 */

const generateID = () => new Date().getTime().toString();

/**
 * Retrieves a notebook from local storage based on its ID.
 *
 * @param {Object} db The database object containing notebook information
 * @param {string} notebookID The ID of the target notebook
 * @returns {Object | undefined} The target notebook, or 'undefined' if not found.
 */

const findNotebook = (db, notebookID) =>
  db.notebooks.find((notebook) => notebook.id === notebookID);

/**
 * Finds the index of a notebook by its ID within an array of notebooks stored in local storage.
 *
 * @param {Object} db The object containing the array of notebooks
 * @param {string} notebookID The ID of the target notebook
 * @returns {number} The index of the target notebook, or -1 if not found.
 */

const findNotebookIndex = (db, notebookID) =>
  db.notebooks.findIndex((notebook) => notebook.id === notebookID);

/**
 * Converts an initial timestamp, measured in milliseconds since an event, into a user-friendly elapsed time string.
 *
 * @param {number} initialTimestamp The initial timestamp in milliseconds
 * @returns {string} A human-readable representation of elapsed time (e.g., "Just now", "5 mins ago", "3 hours ago", "12 days ago", etc.)
 */

function formatElapsedTime(initialTimestamp) {
  const /** {Number} */ currentTimestamp = new Date().getTime();

  const /** {Number} */ mins = Math.round(
      (currentTimestamp - initialTimestamp) / 1000 / 60
    );
  const /** {Number} */ hours = Math.round(mins / 60);
  const /** {Number} */ days = Math.round(hours / 24);

  return mins < 1
    ? "Just now"
    : mins < 60
    ? `${mins} mins ago`
    : hours < 24
    ? `${hours} hours ago`
    : `${days} days ago`;
}

/**
 * Locates a particular note by its ID within a database storing notebooks and their respective notes.
 *
 * @param {Object} db The database containing notebooks and their associated notes
 * @param {string} noteID The ID of the note to locate
 * @returns {Object | undefined} The identified note object, or 'undefined' if not found
 */

function findNote(db, noteID) {
  let note;

  for (let notebook of db.notebooks) {
    note = notebook.notes.find((note) => note.id === noteID);

    if (note) break;
  }

  return note;
}

/**
 * Retrieves the index of a note within the array of notes in a specified notebook, using the note's ID.
 *
 * @param {Object} parentNotebook The notebook object containing an array of notes
 * @param {string} noteID The ID of the note to locate
 * @returns {number} The index of the located note, or -1 if not found
 */

const findNoteIndex = (parentNotebook, noteID) =>
  parentNotebook.notes.findIndex((note) => note.id === noteID);

export {
  addEventListenerToElems,
  getGreetingMsg,
  getFormattedDateStr,
  activateNotebookField,
  enableEditingAndFocus,
  generateID,
  findNotebook,
  findNotebookIndex,
  formatElapsedTime,
  findNote,
  findNoteIndex,
};
