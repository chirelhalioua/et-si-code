const HISTORY_KEY =
  "etsi-game-history";


const THEME_KEY =
  "etsi-theme";


const DEFAULT_SERIES_ID =
  "serie-generale-1";


const DEFAULT_SERIES_TITLE =
  "Série 1 — Situations générales";


const globalSummary =
  document.getElementById(
    "global-summary"
  );


const seriesSection =
  document.getElementById(
    "series-section"
  );


const seriesList =
  document.getElementById(
    "series-list"
  );


const emptyState =
  document.getElementById(
    "progress-empty"
  );


const themeToggle =
  document.getElementById(
    "progress-theme-toggle"
  );


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

    const raw =
      localStorage.getItem(
        HISTORY_KEY
      );


    const history =
      raw
        ? JSON.parse(raw)
        : [];


    if (!Array.isArray(history)) {

      return [];

    }


    return history
      .filter(
        result =>
          result &&
          Number.isInteger(result.score) &&
          Number.isInteger(result.total) &&
          result.total > 0
      )
      .map(
        result => ({
          ...result,
          seriesId:
            typeof result.seriesId === "string"
              ? result.seriesId
              : DEFAULT_SERIES_ID,
          seriesTitle:
            typeof result.seriesTitle === "string"
              ? result.seriesTitle
              : DEFAULT_SERIES_TITLE,
          percentage:
            Number.isFinite(result.percentage)
              ? result.percentage
              : Math.round(
                  (result.score / result.total) * 100
                )
        })
      );

  }

  catch (error) {

    console.warn(
      "Impossible de charger la progression :",
      error
    );


    return [];

  }

}


function groupBySeries(history) {

  const groups =
    new Map();


  history.forEach(
    result => {

      if (!groups.has(result.seriesId)) {

        groups.set(
          result.seriesId,
          {
            id: result.seriesId,
            title: result.seriesTitle,
            results: []
          }
        );

      }


      groups
        .get(result.seriesId)
        .results
        .push(result);

    }
  );


  return [...groups.values()];

}


function getAverage(results) {

  return results.length > 0
    ? Math.round(
        results.reduce(
          (sum, result) =>
            sum + result.percentage,
          0
        ) / results.length
      )
    : 0;

}


function getBest(results) {

  return results.reduce(
    (best, result) =>
      !best ||
      result.percentage > best.percentage
        ? result
        : best,
    null
  );

}


function renderSeriesCard(series) {

  const results =
    series.results;


  const best =
    getBest(results);


  const average =
    getAverage(results);


  const first =
    results[0];


  const last =
    results[results.length - 1];


  const evolution =
    last.percentage -
    first.percentage;


  const recent =
    results.slice(-5);


  const bars =
    recent
      .map(
        (result, index) => `
          <span class="series-bar-item">
            <i class="series-bar-track">
              <b style="--bar-value: ${result.percentage}"></b>
            </i>
            <small>${result.score}/${result.total}</small>
            <em>T${results.length - recent.length + index + 1}</em>
          </span>
        `
      )
      .join("");


  return `
    <article class="series-card">
      <div class="series-card-head">
        <div>
          <span>SÉRIE</span>
          <h3>${escapeHtml(series.title)}</h3>
        </div>

        <strong class="series-last-score">
          ${last.score}<small>/${last.total}</small>
        </strong>
      </div>

      <div class="series-metrics">
        <span>
          <small>Tentatives</small>
          <strong>${results.length}</strong>
        </span>
        <span>
          <small>Meilleur</small>
          <strong>${best.score}/${best.total}</strong>
        </span>
        <span>
          <small>Moyenne</small>
          <strong>${average}%</strong>
        </span>
        <span>
          <small>Évolution</small>
          <strong class="${evolution > 0 ? "positive" : evolution < 0 ? "negative" : ""}">
            ${evolution > 0 ? "+" : ""}${evolution} pt${Math.abs(evolution) > 1 ? "s" : ""}
          </strong>
        </span>
      </div>

      <div class="series-chart" aria-label="Cinq dernières tentatives">
        ${bars}
      </div>
    </article>
  `;

}


function renderProgress() {

  const history =
    loadHistory();


  if (history.length === 0) {

    emptyState.hidden = false;
    return;

  }


  const series =
    groupBySeries(history);


  const best =
    getBest(history);


  document.getElementById(
    "global-series-count"
  ).textContent =
    series.length;


  document.getElementById(
    "global-attempt-count"
  ).textContent =
    history.length;


  document.getElementById(
    "global-average"
  ).textContent =
    `${getAverage(history)}%`;


  document.getElementById(
    "global-best"
  ).textContent =
    `${best.score}/${best.total}`;


  seriesList.innerHTML =
    series
      .map(renderSeriesCard)
      .join("");


  globalSummary.hidden = false;
  seriesSection.hidden = false;

}


function updateThemeIcon() {

  const icon =
    themeToggle
      ?.querySelector(
        ".theme-icon"
      );


  if (icon) {

    icon.textContent =
      document.documentElement.dataset.theme === "light"
        ? "☀"
        : "☾";

  }

}


themeToggle
  ?.addEventListener(
    "click",
    () => {

      const nextTheme =
        document.documentElement.dataset.theme === "light"
          ? "dark"
          : "light";


      document.documentElement.dataset.theme =
        nextTheme;


      try {

        localStorage.setItem(
          THEME_KEY,
          nextTheme
        );

      }

      catch (error) {

        console.warn(
          "Impossible d’enregistrer le thème :",
          error
        );

      }


      updateThemeIcon();

    }
  );


updateThemeIcon();
renderProgress();
