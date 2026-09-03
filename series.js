const HISTORY_KEY = "etsi-game-history";
const SELECTED_SERIES_KEY = "etsi-selected-series";
const THEME_KEY = "etsi-theme";

const grid = document.getElementById("series-grid");
const themeToggle = document.getElementById("series-theme-toggle");
const themeFilters = document.getElementById("theme-filters");
const levelFilters = document.getElementById("level-filters");

let allSeries = [];
let selectedTheme = "all";
let selectedLevel = "all";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function loadHistory() {
  try {
    const history = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    );

    return Array.isArray(history) ? history : [];
  }
  catch (error) {
    return [];
  }
}

function getSeriesResults(seriesId) {
  return loadHistory().filter(
    result => result.seriesId === seriesId
  );
}

function renderSeries(series) {
  if (series.length === 0) {
    grid.innerHTML = `
      <p class="series-loading">
        Aucune série ne correspond encore à ces filtres.
      </p>
    `;
    return;
  }

  grid.innerHTML = series.map(item => {
    const results = getSeriesResults(item.id);
    const best = results.reduce(
      (current, result) =>
        !current || result.percentage > current.percentage
          ? result
          : current,
      null
    );

    return `
      <article class="series-choice ${item.available ? "is-available" : "is-locked"}">
        <div class="series-choice-top">
          <span class="series-choice-icon" aria-hidden="true">${escapeHtml(item.icon || "🚗")}</span>
          <span class="series-choice-status">
            ${item.available ? "Disponible" : "Bientôt"}
          </span>
        </div>

        <div class="series-choice-copy">
          <div class="series-choice-tags">
            <span>${escapeHtml(item.theme || "Général")}</span>
            <span>${escapeHtml(item.level || "Débutant")}</span>
          </div>
          <h2>${escapeHtml(item.title)}</h2>
          <p>${escapeHtml(item.description)}</p>
        </div>

        <div class="series-choice-metrics">
          <span><small>Questions</small><strong>${item.questionCount}</strong></span>
          <span><small>Tentatives</small><strong>${results.length}</strong></span>
          <span><small>Meilleur</small><strong>${best ? `${best.score}/${best.total}` : "—"}</strong></span>
        </div>

        ${item.available
          ? `<a href="jeu.html?series=${encodeURIComponent(item.id)}" data-series-id="${escapeHtml(item.id)}">Commencer cette série →</a>`
          : `<button type="button" disabled>Prochainement</button>`}
      </article>
    `;
  }).join("");
}

function uniqueValues(key) {
  return [...new Set(
    allSeries.map(item => item[key]).filter(Boolean)
  )];
}

function renderFilterOptions(container, values, selected, key) {
  container.innerHTML = ["all", ...values]
    .map(value => `
      <button
        class="${value === selected ? "is-active" : ""}"
        type="button"
        data-filter-key="${key}"
        data-filter-value="${escapeHtml(value)}"
        aria-pressed="${value === selected}"
      >
        ${value === "all" ? "Tous" : escapeHtml(value)}
      </button>
    `)
    .join("");
}

function applyFilters() {
  const displayed = allSeries.filter(item =>
    (selectedTheme === "all" || item.theme === selectedTheme) &&
    (selectedLevel === "all" || item.level === selectedLevel)
  );

  renderFilterOptions(
    themeFilters,
    uniqueValues("theme"),
    selectedTheme,
    "theme"
  );
  renderFilterOptions(
    levelFilters,
    uniqueValues("level"),
    selectedLevel,
    "level"
  );
  renderSeries(displayed);
}

document.querySelector(".series-filters")?.addEventListener("click", event => {
  const button = event.target.closest("[data-filter-key]");

  if (!button) return;

  if (button.dataset.filterKey === "theme") {
    selectedTheme = button.dataset.filterValue;
  }
  else {
    selectedLevel = button.dataset.filterValue;
  }

  applyFilters();
});

grid?.addEventListener("click", event => {
  const link = event.target.closest("[data-series-id]");

  if (link) {
    localStorage.setItem(
      SELECTED_SERIES_KEY,
      link.dataset.seriesId
    );
  }
});

themeToggle?.addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "light"
      ? "dark"
      : "light";

  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
});

async function init() {
  try {
    if (window.ETSISync) {
      await window.ETSISync.syncHistory();
    }
  }
  catch (error) {
    console.warn("Progression locale affichée :", error);
  }

  try {
    const response = await fetch("series.json", { cache: "no-store" });
    const series = await response.json();
    allSeries = Array.isArray(series) ? series : [];
    applyFilters();
  }
  catch (error) {
    grid.innerHTML = "<p class=\"series-loading\">Impossible de charger les séries pour le moment.</p>";
  }

}

init();
