const HISTORY_KEY =
  "etsi-game-history";


const THEME_KEY =
  "etsi-theme";


const DEFAULT_SERIES_ID =
  "serie-generale-1";


const DEFAULT_SERIES_TITLE =
  "Série 1 — Situations générales";


const IS_LOCAL_SITE =
  [
    "localhost",
    "127.0.0.1"
  ].includes(
    window.location.hostname
  );


const APP_BASE_URL =
  IS_LOCAL_SITE
    ? window.location.origin
    : "https://et-si-code-one.vercel.app";


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


let currentAccountUser =
  null;


let isPasswordRecovery =
  false;


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


const accountPanel =
  document.querySelector(
    ".account-panel"
  );


const accountTitle =
  document.getElementById(
    "account-title"
  );


const accountKicker =
  document.getElementById(
    "account-kicker"
  );


const accountDescription =
  document.getElementById(
    "account-description"
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


const accountForgotPassword =
  document.getElementById(
    "account-forgot-password"
  );


const passwordResetForm =
  document.getElementById(
    "password-reset-form"
  );


const newPassword =
  document.getElementById(
    "new-password"
  );


const confirmNewPassword =
  document.getElementById(
    "confirm-new-password"
  );


const progressEmptyTitle =
  document.getElementById(
    "progress-empty-title"
  );


const progressEmptyText =
  document.getElementById(
    "progress-empty-text"
  );


const progressEmptyAction =
  document.getElementById(
    "progress-empty-action"
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

    if (currentAccountUser) {

      renderEmptyState();
      emptyState.hidden = false;

    }

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


function renderEmptyState() {

  if (currentAccountUser) {

    progressEmptyTitle.textContent =
      "Aucune tentative pour le moment";


    progressEmptyText.textContent =
      "Termine une première tentative de 10 questions pour afficher tes résultats.";


    progressEmptyAction.textContent =
      "Commencer une tentative →";


    progressEmptyAction.href =
      "jeu.html";


    return;

  }


  progressEmptyTitle.textContent =
    "Connecte-toi pour retrouver ta progression";


  progressEmptyText.textContent =
    "Crée un compte ou connecte-toi pour synchroniser tes résultats sur tous tes appareils.";


  progressEmptyAction.textContent =
    "Se connecter ou créer un compte ↑";


  progressEmptyAction.href =
    "#account-title";

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


  currentAccountUser =
    user || null;


  accountPanel.classList.toggle(
    "is-connected",
    isConnected
  );


  accountTitle.textContent =
    isConnected
      ? "Ton espace joueur"
      : "Retrouve ta progression partout";


  accountKicker.textContent =
    isConnected
      ? "COMPTE CONNECTÉ"
      : "SYNCHRONISATION";


  const hasLocalProgress =
    loadHistory().length > 0;


  accountDescription.textContent =
    isConnected
      ? "Tes résultats sont synchronisés sur tous tes appareils."
      : hasLocalProgress
        ? "Ta progression est enregistrée localement sur cet appareil. Connecte-toi pour la retrouver sur tous tes appareils."
        : "Connecte-toi pour conserver les mêmes résultats sur ton téléphone, ton ordinateur et tes différents navigateurs.";


  accountPanel.classList.toggle(
    "is-guest",
    !isConnected
  );


  if (isPasswordRecovery) {

    accountForm.hidden = true;
    accountConnected.hidden = true;
    return;

  }


  accountForm.hidden =
    isConnected;


  accountConnected.hidden =
    !isConnected;


  accountUserEmail.textContent =
    user?.email || "";

}


function showPasswordResetForm() {

  isPasswordRecovery = true;

  document.body.classList.add(
    "is-password-recovery"
  );

  accountForm.hidden = true;
  accountConnected.hidden = true;
  passwordResetForm.hidden = false;


  setAccountMessage(
    "Choisis maintenant ton nouveau mot de passe."
  );

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


    if (
      result.user &&
      !isPasswordRecovery
    ) {

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
              `${APP_BASE_URL}/progression.html`
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


accountForgotPassword?.addEventListener(
  "click",
  async () => {

    if (!window.ETSISync) {

      setAccountMessage(
        "La réinitialisation est momentanément indisponible.",
        "error"
      );

      return;

    }


    if (!accountEmail.value.trim()) {

      setAccountMessage(
        "Veuillez saisir votre adresse e-mail.",
        "error"
      );

      accountEmail.focus();
      return;

    }


    if (!accountEmail.checkValidity()) {

      setAccountMessage(
        "Veuillez saisir une adresse e-mail valide.",
        "error"
      );

      accountEmail.focus();
      return;

    }


    setAccountLoading(true);
    setAccountMessage("Envoi de l’e-mail…");


    const { error } =
      await window.ETSISync.client.auth
        .resetPasswordForEmail(
          accountEmail.value.trim(),
          {
            redirectTo:
              `${APP_BASE_URL}/progression.html?reset-password=1`
          }
        );


    setAccountLoading(false);


    if (error) {

      console.error(
        "Erreur de réinitialisation :",
        error
      );


      const errorText =
        String(
          error.message || ""
        ).toLowerCase();


      const resetErrorMessage =
        error.status === 429 ||
        errorText.includes("rate limit")
          ? "Trop d’e-mails ont été demandés récemment. Attends un peu avant de réessayer ou configure un service SMTP personnalisé."
          : errorText.includes("redirect")
            ? "L’adresse de redirection n’est pas autorisée dans Supabase. Vérifie les Redirect URLs."
            : `Impossible d’envoyer l’e-mail : ${error.message}`;

      setAccountMessage(
        resetErrorMessage,
        "error"
      );

      return;

    }


    setAccountMessage(
      "Un lien de réinitialisation vient de t’être envoyé par e-mail.",
      "success"
    );

  }
);


passwordResetForm?.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    if (
      newPassword.value !==
      confirmNewPassword.value
    ) {

      setAccountMessage(
        "Les deux mots de passe ne correspondent pas.",
        "error"
      );

      return;

    }


    const submitButton =
      passwordResetForm.querySelector(
        "button[type='submit']"
      );


    submitButton.disabled = true;


    const { error } =
      await window.ETSISync.client.auth
        .updateUser({
          password: newPassword.value
        });


    submitButton.disabled = false;


    if (error) {

      setAccountMessage(
        "Le mot de passe n’a pas pu être modifié. Demande un nouveau lien.",
        "error"
      );

      return;

    }


    newPassword.value = "";
    confirmNewPassword.value = "";
    passwordResetForm.hidden = true;
    isPasswordRecovery = false;

    document.body.classList.remove(
      "is-password-recovery"
    );


    window.history.replaceState(
      {},
      "",
      "progression.html"
    );


    setAccountMessage(
      "Ton mot de passe a bien été modifié.",
      "success"
    );


    await synchronizeAccount();

  }
);


if (window.ETSISync) {

  window.ETSISync.client.auth
    .onAuthStateChange(
      event => {

        if (event === "PASSWORD_RECOVERY") {

          showPasswordResetForm();

        }

      }
    );

}


if (
  new URLSearchParams(
    window.location.search
  ).get("reset-password") === "1"
) {

  showPasswordResetForm();

}


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
