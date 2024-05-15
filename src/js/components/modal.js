/**
 * @copyright KeepSerene 2024
 */

"use strict";

const /** {HTMLElement} */ $modalOverlay = document.createElement("div");
$modalOverlay.classList.add("modal-overlay", "overlay");

/**
 * Manages a confirmation modal for deleting an item.
 *
 * @param {string} title The title of the item to be deleted
 * @returns {Object} An object with methods for modal control and confirmation handling.
 */

function DeletionModal(title) {
  const /** {HTMLElement} */ $deletionModalEl = document.createElement("div");
  $deletionModalEl.classList.add("modal");

  $deletionModalEl.innerHTML = `
    <h3 class="modal-title | text-title-medium">
    Are you sure you want to delete <strong>"${title}"</strong>?
    </h3>

    <div class="modal-footer">
        <button type="submit" class="btn | text" data-modal-action-value="false">
            <span class="text-label-large">Cancel</span>

            <div class="state-layer"></div>
        </button>

        <button type="submit" class="btn | fill" data-modal-action-value="true">
            <span class="text-label-large">Delete</span>

            <div class="state-layer"></div>
        </button>
    </div>
  `;

  /**
   * Make the deletion modal window appear by appending it to the document body
   */

  const show = () => {
    document.body.appendChild($deletionModalEl);
    document.body.appendChild($modalOverlay);
  };

  /**
   * Closes the deletion modal by removing it from the document body
   */

  const close = () => {
    document.body.removeChild($deletionModalEl);
    document.body.removeChild($modalOverlay);
  };

  const /** {Array<HTMLElement>} */ modalActionBtnEls =
      $deletionModalEl.querySelectorAll("[data-modal-action-value]");

  /**
   * Handles delete confirmation.
   *
   * @param {Function} confirmationHandler The function to execute based on the confirmation: 'true' for deletion, and 'false' for cancellation
   */

  const onConfirmation = (confirmationHandler) => {
    modalActionBtnEls.forEach(($btn) => {
      $btn.addEventListener("click", function () {
        const /** {Boolean} */ shouldDelete =
            this.dataset.modalActionValue === "true" ? true : false;

        confirmationHandler(shouldDelete);
      });
    });
  };

  return { show, close, onConfirmation };
}

/**
 * Manages a modal window for adding and editing notes, providing input fields for title and text.
 * Allows users to submit and save notes, with options to customize default title, text, and elapsed time.
 *
 * @param {string} [title='Untitled'] The default title for the note
 * @param {string} [text='Compose a note...'] The default text for the note
 * @param {string} [elapsedTime=''] The elapsed time since note creation
 * @returns {Object} An object with methods for modal control and note submissions
 */

function CreationModal(
  title = "Untitled",
  text = "Compose a note...",
  elapsedTime = ""
) {
  const /** {HTMLElement} */ $creationModalEl = document.createElement("div");
  $creationModalEl.classList.add("modal");

  $creationModalEl.innerHTML = `
    <button type="button" class="icon-btn" data-close-btn aria-label="Close modal">
      <i class="material-symbols-rounded" aria-hidden="true">close</i>

      <div class="state-layer"></div>
    </button>

    <input
      type="text"
      placeholder="Title"
      value="${title}"
      class="modal-title | text-title-medium"
      data-note-field
    />

    <textarea
      placeholder="Note..."
      class="modal-text | text-body-large custom-scrollbar"
      data-note-field
    >${text}</textarea>

    <div class="modal-footer">
      <span class="elapsed-time | text-label-large">${elapsedTime}</span>

      <button type="submit" class="btn | text" data-submit-btn>
        <span class="text-label-large">Save</span>

        <div class="state-layer"></div>
      </button>
    </div>
  `;

  const /** {HTMLElement} */ [$titleFieldEl, $textFieldEl] =
      $creationModalEl.querySelectorAll("[data-note-field]");

  const /** {HTMLElement} */ $saveBtnEl =
      $creationModalEl.querySelector("[data-submit-btn]");

  $saveBtnEl.disabled = true;

  /**
   * Enables the submission functionality based on the presence of content in the title and text fields.
   * If the title field is empty and the text field has content, the submission is disabled.
   * Otherwise, the submission is enabled.
   */

  const enableSubmission = () =>
    ($saveBtnEl.disabled =
      !$titleFieldEl.value.trim() && $textFieldEl.value.trim());

  $titleFieldEl.addEventListener("keyup", enableSubmission);
  $textFieldEl.addEventListener("keyup", enableSubmission);

  /**
   * Opens the note modal by appending it to the document body and sets focus on the title field.
   */

  function show() {
    document.body.appendChild($creationModalEl);
    document.body.appendChild($modalOverlay);
    $titleFieldEl.focus();
  }

  /**
   * Closes the note modal window by removing it from the document body.
   */

  function close() {
    document.body.removeChild($creationModalEl);
    document.body.removeChild($modalOverlay);
  }

  /**
   * Close the note modal window
   */

  const /** {HTMLElement} */ $noteModalCloseBtnEl =
      $creationModalEl.querySelector("[data-close-btn]");

  $noteModalCloseBtnEl.addEventListener("click", close);

  /**
   * Manages the submission process for a note within the note modal window.
   *
   * @param {Function} submissionHandler The callback function to handle the submitted note data
   */

  function onSave(submissionHandler) {
    $saveBtnEl.addEventListener("click", () => {
      const /** {Object} */ noteInfo = {
          title: $titleFieldEl.value.trim(),
          body: $textFieldEl.value.trim(),
        };

      submissionHandler(noteInfo);
    });
  }

  return { show, close, onSave };
}

export { DeletionModal, CreationModal };
