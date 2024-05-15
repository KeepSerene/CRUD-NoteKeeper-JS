/**
 * @copyright KeepSerene 2024
 */

"use strict";

// Import modules
import {
  generateID,
  findNotebook,
  findNotebookIndex,
  findNote,
  findNoteIndex,
} from "./utils.js";

// The global database object
let /** {Object} */ noteKeeperDB = {};

/**
 * Initializes a local database. If data already exists in the local storage, it is loaded;
 * otherwise, a new empty database structure is created, and stored.
 */

function initDB() {
  const /** {JSON | undefined} */ db = localStorage.getItem("noteKeeperDB");

  if (db) {
    noteKeeperDB = JSON.parse(db);
  } else {
    noteKeeperDB.notebooks = [];
    localStorage.setItem("noteKeeperDB", JSON.stringify(noteKeeperDB));
  }
}

initDB();

/**
 * Reads and loads data from the local storage in the global 'noteKeeperDB' object
 */

const readDB = () =>
  (noteKeeperDB = JSON.parse(localStorage.getItem("noteKeeperDB")));

/**
 * Writes the current state of the 'noteKeeper' object in the local storage
 */

const writeDB = () =>
  localStorage.setItem("noteKeeperDB", JSON.stringify(noteKeeperDB));

/**
 * Manages CRUD operations in a database using global objects and local storage.
 *
 * @namespace
 * @property {Object} get Methods for retrieving data
 * @property {Object} post Methods for adding data
 * @property {Object} update Methods for updating data
 * @property {Object} remove Methods for deleting data
 */

export const db = {
  get: {
    /**
     * Fetches existing notebooks from the local storage
     *
     * @method
     * @returns {Array<Object>} An array of notebook objects
     */

    fetchNotebooks() {
      readDB();

      return noteKeeperDB.notebooks;
    },

    /**
     * Fetches all existing notes from the local storage given the ID of a notebook.
     *
     * @param {string} parentNotebookID The ID of the parent notebook
     * @returns {Array<Object>} An array of note objects
     */

    fetchNotes(parentNotebookID) {
      readDB();

      const /** {Object} */ parentNotebook = findNotebook(
          noteKeeperDB,
          parentNotebookID
        );

      return parentNotebook.notes;
    },
  },

  post: {
    /**
     * Adds a new notebook into the database
     *
     * @method
     * @param {string} name The name of the notebook
     * @returns {Object} The newly created notebook object
     */

    addNotebook(name) {
      readDB();

      // Notebook structure
      const /** {Object} */ notebook = {
          id: generateID(),
          name,
          notes: [],
        };

      noteKeeperDB.notebooks.push(notebook);

      writeDB();

      return notebook;
    },

    /**
     * Inserts a new note into a designated notebook within the local storage database.
     *
     * @param {string} parentNotebookID The ID of the notebook where the note will be added
     * @param {Object} noteInfo Information about the new note (its title and body)
     * @returns {Object} The newly created note
     */

    addNote(parentNotebookID, noteInfo) {
      readDB();

      const /** {Object} */ parentNotebook = findNotebook(
          noteKeeperDB,
          parentNotebookID
        );

      // Note structure
      const newNoteObj = {
        id: generateID(),
        parentNotebookID,
        ...noteInfo,
        postedAt: new Date().getTime(),
      };

      parentNotebook.notes.unshift(newNoteObj);

      writeDB();

      return newNoteObj;
    },
  },

  update: {
    /**
     * Updates the title of an existing notebook in the local storage
     *
     * @method
     * @param {string} notebookID The unique identifier of the notebook
     * @param {string} title The new title of the notebook
     * @returns {Object} The notebook object with the updated title
     */

    updateNotebookTitle(notebookID, name) {
      const /** {Object} */ desiredNotebook = findNotebook(
          noteKeeperDB,
          notebookID
        );
      desiredNotebook.name = name;

      writeDB();

      return desiredNotebook;
    },

    /**
     * Modifies the content of a note stored in the database (local storage).
     *
     * @method
     * @param {string} noteID The ID of the note to be updated
     * @param {Object} updatedNoteInfo The new data for the note
     * @returns {Object} The updated note object
     */

    updateNote(noteID, updatedNoteInfo) {
      readDB();

      const /** {Object} */ oldNote = findNote(noteKeeperDB, noteID);
      const /** {Object} */ newNote = Object.assign(oldNote, updatedNoteInfo);

      writeDB();

      return newNote;
    },
  },

  remove: {
    /**
     * Removes a notebook from the local storage.
     *
     * @param {string} notebookID The ID of the notebook to be removed
     */

    deleteNotebook(notebookID) {
      readDB();

      const /** {Number} */ notebookIndex = findNotebookIndex(
          noteKeeperDB,
          notebookID
        );

      noteKeeperDB.notebooks.splice(notebookIndex, 1);

      writeDB();
    },

    /**
     * Removes a note from a designated notebook in the database (local storage).
     *
     * @param {string} parentNotebookID The ID of the notebook containing the note
     * @param {string} noteID The ID of the note to delete
     * @returns {Array<Object>} An array containing the remaining notes in the notebook
     */

    deleteNote(parentNotebookID, noteID) {
      readDB();

      const /** {Object} */ parentNotebook = findNotebook(
          noteKeeperDB,
          parentNotebookID
        );

      const /** {number} */ noteIndex = findNoteIndex(parentNotebook, noteID);

      parentNotebook.notes.splice(noteIndex, 1);

      writeDB();

      return parentNotebook.notes;
    },
  },
};
