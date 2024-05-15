/**
 * @copyright KeepSerene 2024
 */

"use strict";

// Initialize the app-theme
const /** {string | null} */ previousTheme =
    localStorage.getItem("noteKeeperTheme");

const /** {Boolean} */ isSysThemeDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

const /** {string} */ initialTheme =
    previousTheme ?? (isSysThemeDark ? "dark" : "light");

document.documentElement.setAttribute("data-theme", initialTheme);

// Toggle theme
window.addEventListener("DOMContentLoaded", () => {
  const /** {HTMLElement} */ $themeBtnEl =
      document.querySelector("[data-theme-btn]");

  if ($themeBtnEl) $themeBtnEl.addEventListener("click", toggleTheme);
});

/**
 * Toggles the theme between light and dark.
 * Also, manages the theme setting both in the DOM and in the local storage.
 */

function toggleTheme() {
  const /** {string} */ currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";

  const /** {string} */ newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.dataset.theme = newTheme;
  localStorage.setItem("noteKeeperTheme", newTheme);
}
