(function () {
  "use strict";

  const button = document.createElement("button");
  button.className = "back-to-top";
  button.type = "button";
  button.setAttribute("aria-label", "Remonter en haut de la page");
  button.setAttribute("title", "Remonter en haut");
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 15 6-6 6 6"></path>
    </svg>
  `;

  document.body.appendChild(button);

  function updateVisibility() {
    button.classList.toggle("is-visible", window.scrollY > 320);
  }

  button.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
})();
