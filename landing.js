// =============================================================
// ET SI ? — LANDING.JS
// Page d'accueil
// =============================================================


// =============================================================
// STOCKAGE LOCAL
// =============================================================

const STORAGE_KEYS = {
  playerName: "etsi-player-name",
  avatar: "etsi-avatar",
  theme: "etsi-theme"
};


// =============================================================
// ÉLÉMENTS HTML
// =============================================================

const themeButton =
  document.getElementById("theme-toggle");

const profileModal =
  document.getElementById("profile-modal");

const profileCloseButton =
  document.getElementById("profile-close");

const playerNameInput =
  document.getElementById("player-name");

const profileStartButton =
  document.getElementById("profile-start");

const profileError =
  document.getElementById("profile-error");

const playButtons =
  document.querySelectorAll(".js-play");

const avatarButtons =
  document.querySelectorAll(".avatar-option");

const profileAvatarButtons =
  document.querySelectorAll(".profile-avatar");


// =============================================================
// AVATAR SÉLECTIONNÉ
// =============================================================

let selectedAvatar =
  localStorage.getItem(STORAGE_KEYS.avatar) === "boy"
    ? "boy"
    : "girl";


// =============================================================
// THÈME
// =============================================================

function getCurrentTheme() {

  const savedTheme =
    localStorage.getItem(
      STORAGE_KEYS.theme
    );


  if (
    savedTheme === "light" ||
    savedTheme === "dark"
  ) {

    return savedTheme;

  }


  const prefersLight =
    window.matchMedia &&
    window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;


  return prefersLight
    ? "light"
    : "dark";
}


function applyTheme(
  theme,
  save = true
) {

  const safeTheme =
    theme === "light"
      ? "light"
      : "dark";


  document.documentElement.setAttribute(
    "data-theme",
    safeTheme
  );


  if (save) {

    localStorage.setItem(
      STORAGE_KEYS.theme,
      safeTheme
    );

  }

}


function toggleTheme() {

  const currentTheme =
    document.documentElement.getAttribute(
      "data-theme"
    ) || "dark";


  const newTheme =
    currentTheme === "dark"
      ? "light"
      : "dark";


  applyTheme(newTheme);

}


// =============================================================
// AFFICHAGE DE L'AVATAR
// =============================================================

function updateAvatarUI() {

  // -----------------------------------------------------------
  // CARTES DANS LA SECTION "TON CONDUCTEUR"
  // -----------------------------------------------------------

  avatarButtons.forEach(
    button => {

      const active =
        button.dataset.avatar ===
        selectedAvatar;


      button.classList.toggle(
        "selected",
        active
      );


      button.setAttribute(
        "aria-pressed",
        String(active)
      );

    }
  );


  // -----------------------------------------------------------
  // CARTES DANS LA MODALE
  // -----------------------------------------------------------

  profileAvatarButtons.forEach(
    button => {

      const active =
        button.dataset.profileAvatar ===
        selectedAvatar;


      button.classList.toggle(
        "selected",
        active
      );


      button.setAttribute(
        "aria-pressed",
        String(active)
      );

    }
  );


  // -----------------------------------------------------------
  // AVATAR SUR L'IMAGE D'APERÇU
  // -----------------------------------------------------------

  const girlAvatar =
    document.getElementById(
      "preview-avatar-girl"
    );


  const boyAvatar =
    document.getElementById(
      "preview-avatar-boy"
    );


  if (girlAvatar) {

    girlAvatar.style.display =
      selectedAvatar === "girl"
        ? "grid"
        : "none";

  }


  if (boyAvatar) {

    boyAvatar.style.display =
      selectedAvatar === "boy"
        ? "grid"
        : "none";

  }

}


// =============================================================
// CHOIX AVATAR — SECTION
// =============================================================

avatarButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        selectedAvatar =
          button.dataset.avatar === "boy"
            ? "boy"
            : "girl";


        updateAvatarUI();

      }
    );

  }
);


// =============================================================
// CHOIX AVATAR — MODALE
// =============================================================

profileAvatarButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        selectedAvatar =
          button.dataset.profileAvatar === "boy"
            ? "boy"
            : "girl";


        updateAvatarUI();

      }
    );

  }
);


// =============================================================
// OUVERTURE DE LA MODALE
// =============================================================

function openProfileModal() {

  if (!profileModal) {
    return;
  }


  // -----------------------------------------------------------
  // RECHARGER L'AVATAR SAUVEGARDÉ
  // -----------------------------------------------------------

  selectedAvatar =
    localStorage.getItem(
      STORAGE_KEYS.avatar
    ) === "boy"
      ? "boy"
      : "girl";


  // -----------------------------------------------------------
  // RECHARGER LE PRÉNOM
  // -----------------------------------------------------------

  const savedName =
    localStorage.getItem(
      STORAGE_KEYS.playerName
    );


  if (playerNameInput) {

    playerNameInput.value =
      savedName || "";

  }


  // -----------------------------------------------------------
  // EFFACER ERREUR
  // -----------------------------------------------------------

  if (profileError) {

    profileError.textContent =
      "";

  }


  updateAvatarUI();


  // -----------------------------------------------------------
  // AFFICHER
  // -----------------------------------------------------------

  profileModal.classList.add(
    "open"
  );


  profileModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "modal-open"
  );


  // -----------------------------------------------------------
  // FOCUS
  // -----------------------------------------------------------

  setTimeout(
    () => {

      if (playerNameInput) {
        playerNameInput.focus();
      }

    },
    50
  );

}


// =============================================================
// FERMETURE DE LA MODALE
// =============================================================

function closeProfileModal() {

  if (!profileModal) {
    return;
  }


  profileModal.classList.remove(
    "open"
  );


  profileModal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "modal-open"
  );

}


// =============================================================
// NETTOYAGE DU PRÉNOM
// =============================================================

function sanitizePlayerName(
  value
) {

  return String(
    value || ""
  )

    .trim()

    .replace(
      /\s+/g,
      " "
    )

    .slice(
      0,
      20
    );

}


// =============================================================
// COMMENCER LE JEU
// =============================================================

function startGame() {

  const name =
    sanitizePlayerName(
      playerNameInput
        ? playerNameInput.value
        : ""
    );


  // -----------------------------------------------------------
  // PRÉNOM OBLIGATOIRE
  // -----------------------------------------------------------

  if (
    name.length < 2
  ) {

    if (profileError) {

      profileError.textContent =
        "Entre un prénom d'au moins 2 caractères.";

    }


    if (playerNameInput) {

      playerNameInput.focus();

    }


    return;

  }


  // -----------------------------------------------------------
  // SAUVEGARDER LE PRÉNOM
  // -----------------------------------------------------------

  localStorage.setItem(
    STORAGE_KEYS.playerName,
    name
  );


  // -----------------------------------------------------------
  // SAUVEGARDER L'AVATAR
  // -----------------------------------------------------------

  localStorage.setItem(
    STORAGE_KEYS.avatar,
    selectedAvatar
  );


  // -----------------------------------------------------------
  // OUVRIR LE JEU
  // -----------------------------------------------------------

  window.location.href =
    "jeu.html";

}


// =============================================================
// BOUTON THÈME
// =============================================================

if (themeButton) {

  themeButton.addEventListener(
    "click",
    toggleTheme
  );

}


// =============================================================
// TOUS LES BOUTONS "JOUER"
// =============================================================

playButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      openProfileModal
    );

  }
);


// =============================================================
// BOUTON FERMER
// =============================================================

if (profileCloseButton) {

  profileCloseButton.addEventListener(
    "click",
    closeProfileModal
  );

}


// =============================================================
// CLIC SUR LE FOND DE LA MODALE
// =============================================================

const profileBackdrop =
  profileModal
    ? profileModal.querySelector(
        ".profile-backdrop"
      )
    : null;


if (profileBackdrop) {

  profileBackdrop.addEventListener(
    "click",
    closeProfileModal
  );

}


// =============================================================
// BOUTON "PRENDRE LE VOLANT"
// =============================================================

if (profileStartButton) {

  profileStartButton.addEventListener(
    "click",
    startGame
  );

}


// =============================================================
// CHAMP PRÉNOM
// =============================================================

if (playerNameInput) {


  // -----------------------------------------------------------
  // EFFACER L'ERREUR DÈS QUE L'UTILISATEUR ÉCRIT
  // -----------------------------------------------------------

  playerNameInput.addEventListener(
    "input",
    () => {

      if (profileError) {

        profileError.textContent =
          "";

      }

    }
  );


  // -----------------------------------------------------------
  // ENTRÉE = COMMENCER
  // -----------------------------------------------------------

  playerNameInput.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        startGame();

      }

    }
  );

}


// =============================================================
// ÉCHAP = FERMER
// =============================================================

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      profileModal &&
      profileModal.classList.contains(
        "open"
      )
    ) {

      closeProfileModal();

    }

  }
);


// =============================================================
// NAVIGATION FLUIDE VERS LES SECTIONS
// =============================================================

const internalLinks =
  document.querySelectorAll(
    'a[href^="#"]'
  );


internalLinks.forEach(
  link => {

    link.addEventListener(
      "click",
      event => {

        const targetId =
          link.getAttribute("href");


        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }


        const targetSection =
          document.querySelector(
            targetId
          );


        if (!targetSection) {
          return;
        }


        event.preventDefault();


        const header =
          document.querySelector(
            ".site-header"
          );


        const headerHeight =
          header
            ? header.offsetHeight
            : 0;


        const targetTop =
          targetSection.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          16;


        window.scrollTo({
          top: targetTop,
          behavior: "smooth"
        });

      }
    );

  }
);


// =============================================================
// EFFET HEADER AU SCROLL
// =============================================================

window.addEventListener(
  "scroll",
  () => {

    const header =
      document.querySelector(
        ".site-header"
      );


    if (!header) {
      return;
    }


    header.classList.toggle(
      "scrolled",
      window.scrollY > 10
    );

  },
  {
    passive: true
  }
);


// =============================================================
// SYNCHRONISATION ENTRE ONGLETS
// =============================================================

window.addEventListener(
  "storage",
  event => {


    // ---------------------------------------------------------
    // THÈME
    // ---------------------------------------------------------

    if (
      event.key ===
      STORAGE_KEYS.theme
    ) {

      applyTheme(
        getCurrentTheme(),
        false
      );

    }


    // ---------------------------------------------------------
    // AVATAR
    // ---------------------------------------------------------

    if (
      event.key ===
      STORAGE_KEYS.avatar
    ) {

      selectedAvatar =
        event.newValue === "boy"
          ? "boy"
          : "girl";


      updateAvatarUI();

    }

  }
);


// =============================================================
// NAVIGATION FLUIDE VERS LES SECTIONS
// =============================================================


const internalLinks =
  document.querySelectorAll('a[href^="#"]');

internalLinks.forEach(link => {
  link.addEventListener("click", event => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const targetSection =
      document.querySelector(targetId);

    if (!targetSection) {
      return;
    }

    event.preventDefault();

    const header =
      document.querySelector(".site-header");

    const headerHeight =
      header ? header.offsetHeight : 0;

    const targetTop =
      targetSection.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      16;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth"
    });
  });
});

// =============================================================
// INITIALISATION
// =============================================================

applyTheme(
  getCurrentTheme(),
  false
);


updateAvatarUI();
