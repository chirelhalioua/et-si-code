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


const seriesFilter =
  document.getElementById(
    "series-filter"
  );


const seriesFilterNote =
  document.getElementById(
    "series-filter-note"
  );


const seriesFilterCount =
  document.getElementById(
    "series-filter-count"
  );


let availableSeries =
  [];


const emptyState =
  document.getElementById(
    "progress-empty"
  );


const themeToggle =
  document.getElementById(
    "progress-theme-toggle"
  );


const accountForm =
  document.getElementById(
    "account-form"
  );


const accountEmail =
  document.getElementById(
    "account-email"
  );


const accountPassword =
  document.getElementById(
    "account-password"
  );


const accountSignup =
  document.getElementById(
    "account-signup"
  );


const accountConnected =
  document.getElementById(
    "account-connected"
  );


const accountUserEmail =
  document.getElementById(
    "account-user-email"
  );


const accountLogout =
  document.getElementById(
    "account-logout"
  );


const accountMessage =
  document.getElementById(
    "account-message"
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

        <strong
          class="series-last-score"
          style="--score-percent: ${last.percentage}"
          aria-label="Dernier score : ${last.score} sur ${last.total}"
        >
          <span class="score-ring-icon" aria-hidden="true">★</span>
          <span>${last.score}<small>/${last.total}</small></span>
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


function renderSeriesFilter(series) {

  const hasSeveralSeries =
    series.length > 1;


  const disabledAttribute =
    hasSeveralSeries
      ? ""
      : " disabled";


  seriesFilter.innerHTML = `
    <button
      class="is-active"
      type="button"
      data-series-filter="all"
      aria-pressed="true"
      ${disabledAttribute}
    >
      Toutes les séries
    </button>

    ${series
      .map(
        item => `
          <button
            type="button"
            data-series-filter="${escapeHtml(item.id)}"
            aria-pressed="false"
            ${disabledAttribute}
          >
            ${escapeHtml(item.title)}
          </button>
        `
      )
      .join("")}
  `;


  seriesFilterCount.textContent =
    `${series.length} série${series.length > 1 ? "s" : ""} disponible${series.length > 1 ? "s" : ""}`;


  seriesFilterNote.hidden =
    hasSeveralSeries;

}


function applySeriesFilter(seriesId) {

  const displayedSeries =
    seriesId === "all"
      ? availableSeries
      : availableSeries.filter(
          series =>
            series.id === seriesId
        );


  seriesList.innerHTML =
    displayedSeries
      .map(renderSeriesCard)
      .join("");


  seriesFilter
    .querySelectorAll("button")
    .forEach(
      button => {

        const isActive =
          button.dataset.seriesFilter ===
          seriesId;


        button.classList.toggle(
          "is-active",
          isActive
        );


        button.setAttribute(
          "aria-pressed",
          String(isActive)
        );

      }
    );

}


function renderProgress() {

  emptyState.hidden = true;
  globalSummary.hidden = true;
  seriesSection.hidden = true;

  const history =
    loadHistory();


  if (history.length === 0) {

    emptyState.hidden = false;
    return;

  }


  const series =
    groupBySeries(history);


  availableSeries =
    series;


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


  document.getElementById(
    "global-best-ring"
  ).style.setProperty(
    "--score-percent",
    best.percentage
  );


  renderSeriesFilter(series);
  applySeriesFilter("all");


  globalSummary.hidden = false;
  seriesSection.hidden = false;

}


function setAccountMessage(
  message,
  type = ""
) {

  accountMessage.textContent =
    message;


  accountMessage.className =
    `account-message ${type}`.trim();

}


function setAccountLoading(isLoading) {

  accountForm
    .querySelectorAll("button, input")
    .forEach(
      element => {

        element.disabled =
          isLoading;

      }
    );

}


function renderAccount(user) {

  const isConnected =
    Boolean(user);


  accountForm.hidden =
    isConnected;


  accountConnected.hidden =
    !isConnected;


  accountUserEmail.textContent =
    user?.email || "";

}


async function synchronizeAccount() {

  if (!window.ETSISync) {

    setAccountMessage(
      "La connexion est momentanément indisponible.",
      "error"
    );

    return;

  }


  try {

    const result =
      await window.ETSISync.syncHistory();


    renderAccount(result.user);
    renderProgress();


    if (result.user) {

      setAccountMessage(
        "Tes tentatives sont à jour sur cet appareil.",
        "success"
      );

    }

  }

  catch (error) {

    console.error(error);


    setAccountMessage(
      "Impossible de synchroniser pour le moment. Tes résultats restent enregistrés sur cet appareil.",
      "error"
    );

  }

}


accountForm?.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    if (!window.ETSISync) {

      setAccountMessage(
        "La connexion est momentanément indisponible.",
        "error"
      );

      return;

    }


    setAccountLoading(true);
    setAccountMessage("Connexion en cours…");


    const { error } =
      await window.ETSISync.client.auth
        .signInWithPassword({
          email: accountEmail.value.trim(),
          password: accountPassword.value
        });


    setAccountLoading(false);


    if (error) {

      setAccountMessage(
        "E-mail ou mot de passe incorrect.",
        "error"
      );

      return;

    }


    accountPassword.value = "";
    await synchronizeAccount();

  }
);


accountSignup?.addEventListener(
  "click",
  async () => {

    if (!window.ETSISync) {

      setAccountMessage(
        "La création de compte est momentanément indisponible.",
        "error"
      );

      return;

    }

    if (!accountForm.reportValidity()) {

      return;

    }


    setAccountLoading(true);
    setAccountMessage("Création du compte…");


    const { data, error } =
      await window.ETSISync.client.auth
        .signUp({
          email: accountEmail.value.trim(),
          password: accountPassword.value,
          options: {
            emailRedirectTo:
              `${window.location.origin}/progression.html`
          }
        });


    setAccountLoading(false);


    if (error) {

      setAccountMessage(
        error.message,
        "error"
      );

      return;

    }


    if (data.session) {

      accountPassword.value = "";
      await synchronizeAccount();

    }

    else {

      setAccountMessage(
        "Compte créé. Consulte ton e-mail pour confirmer ton inscription, puis connecte-toi.",
        "success"
      );

    }

  }
);


accountLogout?.addEventListener(
  "click",
  async () => {

    if (!window.ETSISync) {

      return;

    }

    await window.ETSISync.client.auth
      .signOut();


    window.ETSISync
      .clearLocalAccountHistory();


    renderAccount(null);
    renderProgress();
    setAccountMessage(
      "Tu es déconnectée. Les nouvelles tentatives resteront enregistrées localement jusqu’à ta prochaine connexion."
    );

  }
);


seriesFilter?.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "button[data-series-filter]"
      );


    if (!button || button.disabled) {

      return;

    }


    applySeriesFilter(
      button.dataset.seriesFilter
    );

  }
);


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
synchronizeAccount();
