/**
 * @copyright KeepSerene 2024
 */

"use strict";

/**
 * Attaches a tooltip to a given DOM element.
 * The generated tooltip appears right underneath the element.
 *
 * @param {HTMLElement} $tooltipAnchorEl The target DOM element
 */

export function Tooltip($tooltipAnchorEl) {
  const /** {HTMLElement} */ $tooltipEl = document.createElement("span");
  $tooltipEl.classList.add("tooltip", "text-body-small");

  $tooltipAnchorEl.addEventListener("mouseover", function () {
    $tooltipEl.innerText = this.dataset.tooltip;

    const { top, left, height, width } = this.getBoundingClientRect();

    $tooltipEl.style.top = top + height + 4 + "px";
    $tooltipEl.style.left = left + width / 2 + "px";
    $tooltipEl.style.transform = "translate(-50%, 0)";

    document.body.appendChild($tooltipEl);
  });

  $tooltipAnchorEl.addEventListener(
    "mouseleave",
    $tooltipEl.remove.bind($tooltipEl)
  );
}
