// =============================================================================
// ET SI ? — JEU
// SCRIPT PRINCIPAL
// =============================================================================


// =============================================================================
// ÉTAT DE LA SITUATION
// =============================================================================
//
// false : le joueur n'a pas encore répondu à la question finale.
// true  : la réponse finale a été donnée.
//
// Une situation terminée ne doit JAMAIS être proposée à la reprise.
//

let situationCompleted =
  false;



// =============================================================================
// 1. CONFIGURATION
// =============================================================================

const CONFIG = {

  // Endpoint Make
  makeWebhook:
    "TON_URL_MAKE_ICI",

  // Nom utilisé si aucun prénom n'a été enregistré
  defaultPlayerName:
    "Conducteur",

  // Avatar utilisé par défaut
  defaultAvatar:
    "girl",

  // Thème utilisé par défaut
  defaultTheme:
    "dark"

};



// =============================================================================
// 2. CLÉS LOCALSTORAGE
// =============================================================================
//
// Elles doivent être exactement les mêmes que sur index.html / landing.js.
//

const STORAGE_KEYS = {

  playerName:
    "etsi-player-name",

  avatar:
    "etsi-avatar",

  theme:
    "etsi-theme"

};



// =============================================================================
// 3. PETITE FONCTION DE LECTURE LOCALSTORAGE
// =============================================================================

function readStorage(
  key,
  fallback = null
) {

  try {

    const value =
      localStorage.getItem(
        key
      );


    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return fallback;

    }


    return value;

  }

  catch (error) {

    console.warn(
      `Impossible de lire "${key}" dans localStorage.`,
      error
    );


    return fallback;

  }

}



// =============================================================================
// 4. PETITE FONCTION D'ÉCRITURE LOCALSTORAGE
// =============================================================================

function writeStorage(
  key,
  value
) {

  try {

    localStorage.setItem(
      key,
      value
    );


    return true;

  }

  catch (error) {

    console.warn(
      `Impossible d'enregistrer "${key}" dans localStorage.`,
      error
    );


    return false;

  }

}



// =============================================================================
// 5. NETTOYAGE DU PRÉNOM
// =============================================================================

function sanitizePlayerName(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return CONFIG.defaultPlayerName;

  }


  const cleanedName =
    value
      .trim()
      .replace(
        /\s+/g,
        " "
      )
      .slice(
        0,
        20
      );


  if (
    cleanedName.length < 2
  ) {

    return CONFIG.defaultPlayerName;

  }


  return cleanedName;

}



// =============================================================================
// 6. RÉCUPÉRER LE PROFIL DU JOUEUR
// =============================================================================

function getPlayerProfile() {

  const storedName =
    readStorage(
      STORAGE_KEYS.playerName,
      CONFIG.defaultPlayerName
    );


  const storedAvatar =
    readStorage(
      STORAGE_KEYS.avatar,
      CONFIG.defaultAvatar
    );


  const safeAvatar =
    storedAvatar === "boy"
      ? "boy"
      : "girl";


  return {

    name:
      sanitizePlayerName(
        storedName
      ),

    avatar:
      safeAvatar

  };

}



// =============================================================================
// 7. PROFIL ACTUEL
// =============================================================================

const playerProfile =
  getPlayerProfile();


console.log(
  "Profil joueur :",
  playerProfile
);



// =============================================================================
// 8. ÉLÉMENTS HTML DU PROFIL
// =============================================================================
//
// Le code fonctionne avec plusieurs noms de classes / ID afin de rester
// compatible avec les différentes versions de jeu.html.
//

const playerNameElements =
  document.querySelectorAll(
    `
      [data-player-name],
      #player-name-display,
      #driver-name,
      .player-name
    `
  );


const girlAvatarElements =
  document.querySelectorAll(
    `
      [data-player-avatar="girl"],
      #game-avatar-girl,
      #avatar-girl,
      .avatar-girl
    `
  );


const boyAvatarElements =
  document.querySelectorAll(
    `
      [data-player-avatar="boy"],
      #game-avatar-boy,
      #avatar-boy,
      .avatar-boy
    `
  );



// =============================================================================
// 9. AFFICHER LE PRÉNOM
// =============================================================================

function renderPlayerName() {

  playerNameElements.forEach(
    element => {

      element.textContent =
        playerProfile.name;

    }
  );


  // Compatibilité avec ton ancien élément .name
  //
  // Exemple :
  //
  // <span class="name">Léa</span>
  //

  const legacyNameElement =
    document.querySelector(
      ".dialogue .name, .speaker .name, .name"
    );


  if (
    legacyNameElement &&
    !legacyNameElement.hasAttribute(
      "data-keep-name"
    )
  ) {

    legacyNameElement.textContent =
      playerProfile.name;

  }

}



// =============================================================================
// 10. AFFICHER LE BON AVATAR
// =============================================================================

function renderPlayerAvatar() {

  const isGirl =
    playerProfile.avatar ===
    "girl";


  const isBoy =
    playerProfile.avatar ===
    "boy";


  girlAvatarElements.forEach(
    element => {

      element.hidden =
        !isGirl;


      element.style.display =
        isGirl
          ? ""
          : "none";

    }
  );


  boyAvatarElements.forEach(
    element => {

      element.hidden =
        !isBoy;


      element.style.display =
        isBoy
          ? ""
          : "none";

    }
  );


  document.body.dataset.playerAvatar =
    playerProfile.avatar;

}



// =============================================================================
// 11. APPLIQUER LE PROFIL
// =============================================================================

function renderPlayerProfile() {

  renderPlayerName();

  renderPlayerAvatar();

}



// =============================================================================
// 12. THÈME
// =============================================================================

function getSavedTheme() {

  const savedTheme =
    readStorage(
      STORAGE_KEYS.theme,
      null
    );


  if (
    savedTheme === "light" ||
    savedTheme === "dark"
  ) {

    return savedTheme;

  }



  // Aucun thème enregistré :
  // on regarde la préférence du système.

  if (
    window.matchMedia &&
    window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches
  ) {

    return "light";

  }


  return CONFIG.defaultTheme;

}



// =============================================================================
// 13. APPLIQUER LE THÈME
// =============================================================================

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


  document.body?.setAttribute(
    "data-theme",
    safeTheme
  );


  if (save) {

    writeStorage(
      STORAGE_KEYS.theme,
      safeTheme
    );

  }


  updateThemeButton(
    safeTheme
  );

}



// =============================================================================
// 14. BOUTON CLAIR / SOMBRE
// =============================================================================
//
// Compatible avec :
//
// #theme-toggle
// #themeToggle
// .theme-toggle
//

const themeToggle =
  document.querySelector(
    `
      #theme-toggle,
      #themeToggle,
      .theme-toggle
    `
  );



// =============================================================================
// 15. METTRE À JOUR LE BOUTON DU THÈME
// =============================================================================

function updateThemeButton(
  theme
) {

  if (!themeToggle) {

    return;

  }


  const isDark =
    theme === "dark";


  themeToggle.setAttribute(
    "aria-label",
    isDark
      ? "Passer en mode clair"
      : "Passer en mode sombre"
  );


  themeToggle.setAttribute(
    "title",
    isDark
      ? "Mode clair"
      : "Mode sombre"
  );


  themeToggle.dataset.theme =
    theme;

}



// =============================================================================
// 16. INITIALISER LE THÈME
// =============================================================================

const initialTheme =
  getSavedTheme();


applyTheme(
  initialTheme,
  false
);



// =============================================================================
// 17. CHANGER DE THÈME
// =============================================================================

if (themeToggle) {

  themeToggle.addEventListener(
    "click",
    () => {

      const currentTheme =
        document.documentElement.getAttribute(
          "data-theme"
        ) || "dark";


      const nextTheme =
        currentTheme === "dark"
          ? "light"
          : "dark";


      applyTheme(
        nextTheme
      );

    }
  );

}



// =============================================================================
// 18. SYNCHRONISATION ENTRE PLUSIEURS ONGLETS
// =============================================================================
//
// Exemple :
// le joueur change de thème sur index.html alors que jeu.html est également
// ouvert dans un autre onglet.
//

window.addEventListener(
  "storage",
  event => {


    // -------------------------------------------------------------------------
// THÈME
    // -------------------------------------------------------------------------

    if (
      event.key ===
      STORAGE_KEYS.theme
    ) {

      if (
        event.newValue === "light" ||
        event.newValue === "dark"
      ) {

        applyTheme(
          event.newValue,
          false
        );

      }

    }



    // -------------------------------------------------------------------------
    // PRÉNOM
    // -------------------------------------------------------------------------

    if (
      event.key ===
      STORAGE_KEYS.playerName
    ) {

      playerProfile.name =
        sanitizePlayerName(
          event.newValue ||
          CONFIG.defaultPlayerName
        );


      renderPlayerName();

    }



    // -------------------------------------------------------------------------
    // AVATAR
    // -------------------------------------------------------------------------

    if (
      event.key ===
      STORAGE_KEYS.avatar
    ) {

      playerProfile.avatar =
        event.newValue === "boy"
          ? "boy"
          : "girl";


      renderPlayerAvatar();

    }

  }
);



// =============================================================================
// 19. INITIALISATION DU PROFIL
// =============================================================================

function initializePlayerProfile() {

  renderPlayerProfile();


  console.log(
    `ET SI ? — ${playerProfile.name} prend le volant avec l'avatar ${playerProfile.avatar}.`
  );

}



// =============================================================================
// 20. LANCEMENT
// =============================================================================
//
// Si script.js est chargé avec "defer", le DOM est normalement déjà prêt.
// Ce contrôle permet cependant au fichier de fonctionner dans les deux cas.
//

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializePlayerProfile,
    {
      once: true
    }
  );

}

else {

  initializePlayerProfile();

}



// =============================================================================
// PARTIE 2
// CONFIGURATION DU JEU + SCÉNARIO TEST + AVATAR SVG
// =============================================================================



// =============================================================================
// 21. CONFIGURATION MAKE
// =============================================================================

const GENERATE_SCENARIO_URL =
  window.ETSI_CONFIG?.GENERATE_SCENARIO_URL || "";

const SAVE_RESULT_URL =
  window.ETSI_CONFIG?.SAVE_RESULT_URL || "";



// =============================================================================
// 22. MODE TEST
// =============================================================================
//
// true  = scénario local
// false = scénario récupéré depuis Make
//

const TEST_MODE =
  true;



// =============================================================================
// 23. SCÉNARIO DE TEST
// LIMITATION 50 → 30 KM/H
// =============================================================================

const TEST_SCENARIO = {

  title:
    "Gestion de la vitesse : changement de limitation",

  category:
    "Vitesse",


  // ===========================================================================
  // VISUEL
  // ===========================================================================

  visual: {


    // -------------------------------------------------------------------------
    // SITUATION INITIALE
    // -------------------------------------------------------------------------

    initial: {

      background:
        "city_road",


      elements: [

        {
          type:
            "car",

          position:
            "driver"
        },


        {
          type:
            "speed_sign",

          value:
            "50",

          position:
            "right"
        }

      ]

    },



    // -------------------------------------------------------------------------
    // CHANGEMENT
    // -------------------------------------------------------------------------

    change: {

      effects: [

        {
          action:
            "set",

          type:
            "speed_sign",

          value:
            "30",

          position:
            "right"
        }

      ]

    }

  },



  // ===========================================================================
  // SCÈNES
  // ===========================================================================

  scenes: [


    // -------------------------------------------------------------------------
    // SCÈNE 1
    // -------------------------------------------------------------------------

    {

      text:
        "Tu circules en ville. Un panneau indique une limitation à 50 km/h et la circulation est fluide.",

      type:
        "narration",

      visual_state:
        "initial"

    },



    // -------------------------------------------------------------------------
    // SCÈNE 2
    // -------------------------------------------------------------------------

    {

      text:
        "ET SI... quelques mètres plus loin, la limitation passait à 30 km/h ?",

      type:
        "narration",

      visual_state:
        "change"

    },



    // -------------------------------------------------------------------------
    // SCÈNE 3
    // -------------------------------------------------------------------------

    {

      text:
        "Que dois-tu faire ?",

      type:
        "choice",

      visual_state:
        "change",


      options: [


        // BONNE RÉPONSE

        {

          label:
            "Je ralentis progressivement pour respecter la limitation à 30 km/h.",

          value:
            "choice_1",

          correct:
            true,

          response:
            "Oui. Tu adaptes progressivement ton allure afin de respecter la nouvelle limitation."

        },



        // MAUVAISE RÉPONSE

        {

          label:
            "Je reste à 50 km/h tant que je ne vois aucun danger.",

          value:
            "choice_2",

          correct:
            false,

          response:
            "Non. La nouvelle limitation doit être respectée dès son entrée en vigueur."

        },



        // MAUVAISE RÉPONSE

        {

          label:
            "J'accélère avant d'arriver au panneau puis je ralentis.",

          value:
            "choice_3",

          correct:
            false,

          response:
            "Non. Accélérer n'est pas adapté. Il faut anticiper et ajuster progressivement son allure."

        }

      ]

    }

  ]

};



// =============================================================================
// 24. ÉLÉMENTS PRINCIPAUX DU DOM
// =============================================================================

const text =
  document.getElementById(
    "text"
  );


const button =
  document.getElementById(
    "next"
  );


const choices =
  document.getElementById(
    "choices"
  );


const scene =
  document.getElementById(
    "scene"
  );


const avatar =
  document.getElementById(
    "avatar"
  );


const road =
  document.querySelector(
    ".road"
  );


const cityscape =
  document.querySelector(
    ".cityscape"
  );



// =============================================================================
// 25. NOM DU JOUEUR DANS LA ZONE "AU VOLANT"
// =============================================================================
//
// Ton HTML contient actuellement :
//
// <span class="name">
//   Léa
// </span>
//
// On remplace automatiquement Léa par le prénom enregistré.
//

const gamePlayerName =
  document.querySelector(
    ".speaker .name"
  );


function updateGamePlayerName() {

  if (!gamePlayerName) {

    return;

  }


  gamePlayerName.textContent =
    playerProfile.name;

}


updateGamePlayerName();



// =============================================================================
// 26. SAUVEGARDE DU SVG FILLE
// =============================================================================
//
// Ton HTML contient déjà ton avatar fille complet.
//
// On sauvegarde son contenu avant de pouvoir le remplacer par le garçon.
//

const girlAvatarMarkup =
  avatar
    ? avatar.innerHTML
    : "";



// =============================================================================
// 27. AVATAR GARÇON
// =============================================================================
//
// Même structure que l'avatar fille :
// - yeux normaux
// - yeux surpris
// - bouche normale
// - bouche surprise
// - bouche heureuse
//
// Cela permet à setAvatarExpression() de fonctionner
// avec les DEUX avatars.
// =============================================================================

const boyAvatarMarkup = `


  <!-- =====================================================
       ÉPAULES
  ====================================================== -->

  <path
    d="
      M18 150
      Q27 126 50 117
      Q60 113 70 113
      Q80 113 90 117
      Q113 126 122 150
      Z
    "
    fill="#222831"
  />



  <!-- =====================================================
       HAUT BLEU
  ====================================================== -->

  <path
    d="
      M45 124
      Q70 135 95 124
      L101 150
      H39
      Z
    "
    fill="#328cc7"
  />



  <!-- =====================================================
       COU
  ====================================================== -->

  <path
    d="
      M62 96

      L62 117

      Q62 123 66 126
      Q70 128 74 126
      Q78 123 78 117

      L78 96

      Z
    "
    fill="#efbd98"
  />



  <!-- =====================================================
       OMBRE DU COU
  ====================================================== -->

  <path
    d="
      M63 100

      Q70 107 77 100

      L77 105

      Q70 110 63 105

      Z
    "
    fill="#dda987"
    opacity="0.30"
  />



  <!-- =====================================================
       VISAGE
  ====================================================== -->

  <path
    d="
      M43 58

      Q43 38 56 30

      Q63 26 70 26

      Q77 26 84 30

      Q97 38 97 58

      L96 75

      Q94 92 84 102

      Q78 108 70 108

      Q62 108 56 102

      Q46 92 44 75

      Z
    "
    fill="#f2c7a5"
  />



  <!-- =====================================================
       CHEVEUX — BASE
  ====================================================== -->

  <path
    d="
      M42 57

      Q39 40 46 29

      Q54 17 69 17

      Q84 16 95 27

      Q103 35 101 52


      Q96 46 92 43

      Q92 55 96 62


      Q91 60 88 54

      Q87 66 91 72


      L96 71


      Q94 51 88 43

      Q79 35 69 35

      Q57 35 49 44

      Q44 49 42 57

      Z
    "
    fill="#3c302a"
  />



  <!-- =====================================================
       CHEVEUX — VOLUME HAUT
  ====================================================== -->

  <path
    d="
      M43 53

      Q41 37 50 27

      Q58 18 71 18

      Q86 18 96 30


      Q89 27 83 28

      Q88 32 91 37


      Q80 32 70 34

      Q60 37 53 43

      Q47 48 43 53

      Z
    "
    fill="#46372f"
  />



  <!-- =====================================================
       MÈCHE
  ====================================================== -->

  <path
    d="
      M68 33
      Q77 27 86 30
    "
    fill="none"
    stroke="#604b40"
    stroke-width="3"
    stroke-linecap="round"
  />



  <!-- =====================================================
       REFLET CHEVEUX
  ====================================================== -->

  <path
    d="
      M52 29
      Q62 21 72 21
    "
    fill="none"
    stroke="#72584b"
    stroke-width="2"
    stroke-linecap="round"
    opacity="0.5"
  />



  <!-- =====================================================
       SOURCILS
  ====================================================== -->

  <path
    d="
      M50 59
      Q57 55 64 58
    "
    fill="none"
    stroke="#352821"
    stroke-width="2.5"
    stroke-linecap="round"
  />


  <path
    d="
      M76 58
      Q83 55 90 59
    "
    fill="none"
    stroke="#352821"
    stroke-width="2.5"
    stroke-linecap="round"
  />



  <!-- =====================================================
       YEUX NORMAUX
  ====================================================== -->

  <g id="eyes-normal">


    <ellipse
      cx="57"
      cy="67"
      rx="4.4"
      ry="5.4"
      fill="#28313a"
    />


    <ellipse
      cx="83"
      cy="67"
      rx="4.4"
      ry="5.4"
      fill="#28313a"
    />


    <circle
      cx="58.3"
      cy="65.6"
      r="1.3"
      fill="#ffffff"
    />


    <circle
      cx="84.3"
      cy="65.6"
      r="1.3"
      fill="#ffffff"
    />


  </g>



  <!-- =====================================================
       YEUX SURPRIS
  ====================================================== -->

  <g
    id="eyes-surprised"
    style="display:none"
  >


    <circle
      cx="57"
      cy="67"
      r="6"
      fill="#ffffff"
    />


    <circle
      cx="83"
      cy="67"
      r="6"
      fill="#ffffff"
    />


    <circle
      cx="57"
      cy="67"
      r="3"
      fill="#28313a"
    />


    <circle
      cx="83"
      cy="67"
      r="3"
      fill="#28313a"
    />


  </g>



  <!-- =====================================================
       NEZ
  ====================================================== -->

  <path
    d="
      M70 70
      Q69 76 68 80
    "
    fill="none"
    stroke="#d5a17f"
    stroke-width="1.7"
    stroke-linecap="round"
  />



  <!-- =====================================================
       BOUCHE NORMALE
  ====================================================== -->

  <path
    id="mouth-normal"
    d="
      M63 89
      Q70 92 77 89
    "
    fill="none"
    stroke="#a65d5d"
    stroke-width="2"
    stroke-linecap="round"
  />



  <!-- =====================================================
       BOUCHE SURPRISE
  ====================================================== -->

  <ellipse
    id="mouth-surprised"
    cx="70"
    cy="90"
    rx="3.5"
    ry="4.5"
    fill="#a65d5d"
    style="display:none"
  />



  <!-- =====================================================
       BOUCHE HEUREUSE
  ====================================================== -->

  <path
    id="mouth-happy"
    d="
      M61 87
      Q70 96 79 87
    "
    fill="none"
    stroke="#a65d5d"
    stroke-width="2.2"
    stroke-linecap="round"
    style="display:none"
  />

`;



// =============================================================================
// 28. CHARGER LE BON SVG DANS LE JEU
// =============================================================================

function loadPlayerAvatarSVG() {

  if (!avatar) {

    return;

  }


  if (
    playerProfile.avatar ===
    "boy"
  ) {

    avatar.innerHTML =
      boyAvatarMarkup;

  }

  else {

    avatar.innerHTML =
      girlAvatarMarkup;

  }


  avatar.dataset.playerAvatar =
    playerProfile.avatar;


  avatar.setAttribute(
    "aria-label",
    `Avatar de ${playerProfile.name}`
  );

}



// =============================================================================
// 29. APPLIQUER LE PROFIL COMPLET AU JEU
// =============================================================================

function applyPlayerProfileToGame() {

  // ---------------------------------------------------------------------------
  // PRÉNOM
  // ---------------------------------------------------------------------------

  updateGamePlayerName();



  // ---------------------------------------------------------------------------
  // AVATAR
  // ---------------------------------------------------------------------------

  loadPlayerAvatarSVG();



  // ---------------------------------------------------------------------------
  // BODY
  // ---------------------------------------------------------------------------

  document.body.dataset.playerName =
    playerProfile.name;


  document.body.dataset.playerAvatar =
    playerProfile.avatar;



  console.log(
    "Profil appliqué au jeu :",
    {
      name:
        playerProfile.name,

      avatar:
        playerProfile.avatar
    }
  );

}



// =============================================================================
// 30. APPLIQUER IMMÉDIATEMENT LE PROFIL
// =============================================================================

applyPlayerProfileToGame();



// =============================================================================
// 31. VARIABLES PRINCIPALES DU JEU
// =============================================================================

let scenario =
  null;


let scenes =
  [];


let step =
  0;


let userChoicesHistory =
  {};



// =============================================================================
// 32. DONNÉES DU JOUEUR À AJOUTER AUX RÉSULTATS
// =============================================================================

function getPlayerDataForResult() {

  return {

    player_name:
      playerProfile.name,

    player_avatar:
      playerProfile.avatar,

    theme:
      document.documentElement.getAttribute(
        "data-theme"
      ) || "dark"

  };

}



// =============================================================================
// 33. SYNCHRONISATION DU PROFIL
// =============================================================================
//
// Si le prénom ou l'avatar change dans un autre onglet,
// le jeu est automatiquement mis à jour.
//

window.addEventListener(
  "storage",
  event => {


    // -------------------------------------------------------------------------
    // PRÉNOM
    // -------------------------------------------------------------------------

    if (
      event.key ===
      STORAGE_KEYS.playerName
    ) {

      playerProfile.name =
        sanitizePlayerName(
          event.newValue ||
          CONFIG.defaultPlayerName
        );


      updateGamePlayerName();


      if (avatar) {

        avatar.setAttribute(
          "aria-label",
          `Avatar de ${playerProfile.name}`
        );

      }

    }



    // -------------------------------------------------------------------------
    // AVATAR
    // -------------------------------------------------------------------------

    if (
      event.key ===
      STORAGE_KEYS.avatar
    ) {

      playerProfile.avatar =
        event.newValue === "boy"
          ? "boy"
          : "girl";


      loadPlayerAvatarSVG();


      // La fonction sera déclarée plus bas dans le fichier.
      // Elle remettra le visage dans son état normal.

      if (
        typeof setAvatarExpression ===
        "function"
      ) {

        setAvatarExpression(
          "normal"
        );

      }

    }

  }
);

// =============================================================================
// PARTIE 3
// CHARGEMENT DU SCÉNARIO + PROGRESSION + AFFICHAGE
// =============================================================================



// =============================================================================
// 34. PROGRESSION DES ÉTAPES
// =============================================================================

function updateStepIndicator() {

  const dots =
    document.querySelectorAll(
      ".step-dot"
    );


  dots.forEach(
    (dot, index) => {

      dot.classList.remove(
        "active",
        "completed"
      );


      // -----------------------------------------------------------------------
      // ÉTAPE ACTUELLE
      // -----------------------------------------------------------------------

      if (
        index === step
      ) {

        dot.classList.add(
          "active"
        );

      }


      // -----------------------------------------------------------------------
      // ÉTAPES TERMINÉES
      // -----------------------------------------------------------------------

      if (
        index < step
      ) {

        dot.classList.add(
          "completed"
        );

      }

    }
  );

}



// =============================================================================
// 35. CHARGER UN SCÉNARIO
// =============================================================================

// =============================================================================
// CHARGER UN SCÉNARIO
// =============================================================================

async function loadScenario() {


  // ===========================================================================
  // NOUVELLE SITUATION = NON TERMINÉE
  // ===========================================================================

  situationCompleted =
    false;


  try {


    // -------------------------------------------------------------------------
    // MESSAGE DE CHARGEMENT
    // -------------------------------------------------------------------------

    if (text) {

      text.textContent =
        `Prépare-toi ${playerProfile.name}, chargement d'une nouvelle situation...`;

    }


    if (choices) {

      choices.innerHTML =
        "";

    }


    if (button) {

      button.style.display =
        "none";


      button.dataset.finished =
        "false";


      button.dataset.retry =
        "false";

    }



    // =========================================================================
    // MODE TEST LOCAL
    // =========================================================================

    if (TEST_MODE) {


      console.log(
        "🧪 Mode test local"
      );


      scenario =
        JSON.parse(
          JSON.stringify(
            TEST_SCENARIO
          )
        );

    }



    // =========================================================================
    // MODE MAKE
    // =========================================================================

    else {


      console.log(
        "🌐 Récupération d'un scénario depuis Make..."
      );


      const response =
        await fetch(
          GENERATE_SCENARIO_URL,
          {

            method:
              "GET",

            cache:
              "no-store"

          }
        );



      if (!response.ok) {

        throw new Error(
          `Erreur Make : ${response.status} ${response.statusText}`
        );

      }



      scenario =
        await response.json();

    }



    // =========================================================================
    // VALIDATION
    // =========================================================================

    if (
      !scenario ||
      !Array.isArray(
        scenario.scenes
      ) ||
      scenario.scenes.length === 0
    ) {

      throw new Error(
        "Le scénario reçu est invalide."
      );

    }



    console.log(
      "Scénario chargé :",
      scenario
    );



    // =========================================================================
    // INITIALISATION
    // =========================================================================

    scenes =
      scenario.scenes;


    step =
      0;


    userChoicesHistory =
      {};



    userChoicesHistory.player = {

      name:
        playerProfile.name,

      avatar:
        playerProfile.avatar

    };



    // =========================================================================
    // RESET VISUEL
    // =========================================================================

    if (
      typeof resetVisual ===
      "function"
    ) {

      resetVisual();

    }



    // =========================================================================
    // VISUEL INITIAL
    // =========================================================================

    if (
      scenario.visual &&
      scenario.visual.initial &&
      typeof applyInitialVisual ===
        "function"
    ) {

      applyInitialVisual(
        scenario.visual.initial
      );

    }



    // =========================================================================
    // AVATAR
    // =========================================================================

    if (
      typeof setAvatarExpression ===
      "function"
    ) {

      setAvatarExpression(
        "normal"
      );

    }



    // =========================================================================
    // AFFICHAGE
    // =========================================================================

    showScene();



    // =========================================================================
    // PREMIÈRE SAUVEGARDE
    // =========================================================================

    if (
      typeof saveGameProgress ===
      "function"
    ) {

      saveGameProgress();

    }

  }



  // ===========================================================================
  // ERREUR
  // ===========================================================================

  catch (error) {


    console.error(
      "Erreur lors du chargement du scénario :",
      error
    );


    if (text) {

      text.textContent =
        TEST_MODE
          ? "Impossible de charger le scénario de test."
          : "Impossible de charger la situation. Vérifie la connexion avec Make.";

    }


    if (choices) {

      choices.innerHTML =
        "";

    }


    if (button) {

      button.style.display =
        "inline-block";


      button.textContent =
        "Réessayer";


      button.dataset.retry =
        "true";

    }

  }

}



// =============================================================================
// 36. AFFICHER LA SCÈNE ACTUELLE
// =============================================================================

function showScene() {


  // ===========================================================================
  // SÉCURITÉ
  // ===========================================================================

  if (
    !Array.isArray(
      scenes
    ) ||
    scenes.length === 0
  ) {

    console.warn(
      "Aucune scène disponible."
    );

    return;

  }



  // ===========================================================================
  // FIN DU SCÉNARIO
  // ===========================================================================

  if (
    step < 0 ||
    step >= scenes.length
  ) {

    if (
      typeof finishScenario ===
      "function"
    ) {

      finishScenario();

    }

    return;

  }



  // ===========================================================================
  // SCÈNE ACTUELLE
  // ===========================================================================

  const currentScene =
    scenes[step];


  console.log(
    `Scène ${step + 1}/${scenes.length} :`,
    currentScene
  );



  // ===========================================================================
  // PROGRESSION
  // ===========================================================================

  updateStepIndicator();



  // ===========================================================================
  // TEXTE
  // ===========================================================================

  if (text) {

    text.textContent =
      currentScene.text ||
      "";

  }



  // ===========================================================================
  // AUDIO
  // ===========================================================================

  if (
    typeof speakText ===
      "function" &&
    typeof audioEnabled !==
      "undefined" &&
    audioEnabled === true
  ) {

    speakText(
      currentScene.text ||
      ""
    );

  }



  // ===========================================================================
  // NETTOYER LES ANCIENS CHOIX
  // ===========================================================================

  if (choices) {

    choices.innerHTML =
      "";

  }



  // ===========================================================================
  // REMETTRE L'AVATAR NORMAL
  // ===========================================================================

  if (
    typeof setAvatarExpression ===
    "function"
  ) {

    setAvatarExpression(
      "normal"
    );

  }



  // ===========================================================================
  // VISUEL INITIAL
  // ===========================================================================

  if (
    currentScene.visual_state ===
      "initial"
  ) {

    if (
      scenario.visual &&
      scenario.visual.initial &&
      typeof applyInitialVisual ===
        "function"
    ) {

      applyInitialVisual(
        scenario.visual.initial
      );

    }

  }



  // ===========================================================================
  // VISUEL "ET SI..."
  // ===========================================================================

  if (
    currentScene.visual_state ===
      "change"
  ) {

    const effects =
      scenario
        ?.visual
        ?.change
        ?.effects;


    if (
      Array.isArray(
        effects
      ) &&
      typeof applyVisualEffects ===
        "function"
    ) {

      applyVisualEffects(
        effects
      );

    }

  }



  // ===========================================================================
  // SCÈNE AVEC VISUAL_CHANGE DIRECT
  // ===========================================================================
  //
  // Cela permet aussi de gérer un JSON de la forme :
  //
  // {
  //   type: "change",
  //   visual_change: {
  //     elements: [...]
  //   }
  // }
  //

  if (
    currentScene.visual_change &&
    Array.isArray(
      currentScene.visual_change.elements
    )
  ) {

    currentScene
      .visual_change
      .elements
      .forEach(
        element => {

          if (
            typeof addVisualElement ===
              "function"
          ) {

            addVisualElement(
              element
            );

          }

        }
      );

  }



  // ===========================================================================
  // QUESTION / CHOIX
  // ===========================================================================

  const sceneOptions =
    Array.isArray(
      currentScene.options
    )
      ? currentScene.options
      : (
          Array.isArray(
            currentScene.choices
          )
            ? currentScene.choices
            : null
        );



  if (
    currentScene.type ===
      "choice" &&
    Array.isArray(
      sceneOptions
    )
  ) {

    if (button) {

      button.style.display =
        "none";

    }



    sceneOptions.forEach(
      (
        option,
        index
      ) => {


        // ---------------------------------------------------------------------
        // COMPATIBILITÉ AVEC DEUX FORMATS JSON
        // ---------------------------------------------------------------------
        //
        // Ancien format :
        //
        // label
        // response
        //
        // Nouveau format :
        //
        // text
        // explanation
        //

        const choiceLabel =
          option.label ||
          option.text ||
          `Choix ${index + 1}`;



        createChoice(
          choiceLabel,
          () => {

            handleActionChoice(
              {

                ...option,


                // normalisation du texte

                label:
                  choiceLabel,


                // normalisation de l'identifiant

                value:
                  option.value ||
                  `choice_${index + 1}`,


                // normalisation de l'explication

                response:
                  option.response ||
                  option.explanation ||
                  "Réponse enregistrée."

              }
            );

          }
        );

      }
    );


    return;

  }



  // ===========================================================================
  // NARRATION
  // ===========================================================================

  if (button) {

    button.style.display =
      "inline-block";


    button.textContent =
      step ===
        scenes.length - 1
          ? "Terminer →"
          : "Continuer →";

  }

}



// =============================================================================
// 37. CRÉER UN BOUTON DE CHOIX
// =============================================================================

function createChoice(
  label,
  callback
) {

  if (!choices) {

    return;

  }



  const choice =
    document.createElement(
      "button"
    );



  // ===========================================================================
  // TYPE
  // ===========================================================================

  choice.type =
    "button";



  // ===========================================================================
  // CLASSE
  // ===========================================================================

  choice.classList.add(
    "choice"
  );



  // ===========================================================================
  // TEXTE
  // ===========================================================================

  choice.textContent =
    label;



  // ===========================================================================
  // ÉVÉNEMENT
  // ===========================================================================

  choice.addEventListener(
    "click",
    () => {


      // -----------------------------------------------------------------------
      // ÉVITER LE DOUBLE CLIC
      // -----------------------------------------------------------------------

      const allChoices =
        choices.querySelectorAll(
          ".choice"
        );


      allChoices.forEach(
        element => {

          element.disabled =
            true;

        }
      );



      // -----------------------------------------------------------------------
      // CALLBACK
      // -----------------------------------------------------------------------

      callback();

    },
    {
      once: true
    }
  );



  // ===========================================================================
  // AJOUT
  // ===========================================================================

  choices.appendChild(
    choice
  );

}



// =============================================================================
// 38. ALLER À LA SCÈNE SUIVANTE
// =============================================================================

function goToNextScene() {

  step++;


  // Sauvegarde automatique
  saveGameProgress();


  if (
    step <
    scenes.length
  ) {

    showScene();

  }

  else {

    if (
      typeof finishScenario ===
        "function"
    ) {

      finishScenario();

    }

  }

}


// =============================================================================
// 39. RECOMMENCER LE SCÉNARIO
// =============================================================================

async function restartScenario() {


  // ===========================================================================
  // RESET ÉTAT
  // ===========================================================================

  step =
    0;


  userChoicesHistory =
    {};


  userChoicesHistory.player = {

    name:
      playerProfile.name,

    avatar:
      playerProfile.avatar

  };



  // ===========================================================================
  // RESET BOUTON
  // ===========================================================================

  if (button) {

    button.dataset.finished =
      "false";


    button.dataset.retry =
      "false";


    button.textContent =
      "Continuer →";

  }



  // ===========================================================================
  // RESET VISUEL
  // ===========================================================================

  if (
    typeof resetVisual ===
    "function"
  ) {

    resetVisual();

  }



  // ===========================================================================
  // RESET AVATAR
  // ===========================================================================

  loadPlayerAvatarSVG();


  if (
    typeof setAvatarExpression ===
      "function"
  ) {

    setAvatarExpression(
      "normal"
    );

  }



  // ===========================================================================
  // RECHARGEMENT
  // ===========================================================================

  await loadScenario();

}

// =============================================================================
// PARTIE 4
// MOTEUR VISUEL — DÉCORS + ÉLÉMENTS ROUTIERS
// =============================================================================



// =============================================================================
// 40. APPLIQUER LE VISUEL INITIAL
// =============================================================================

function applyInitialVisual(
  initial
) {

  if (!initial) {

    return;

  }


  // ===========================================================================
  // BACKGROUND
  // ===========================================================================

  if (
    initial.background
  ) {

    scene.dataset.background =
      initial.background;


    applyBackground(
      initial.background
    );

  }


  // ===========================================================================
  // MÉTÉO
  // ===========================================================================

  if (
    initial.weather
  ) {

    applyWeather(
      initial.weather
    );

  }


  // ===========================================================================
  // ÉTAT DE LA ROUTE
  // ===========================================================================

  if (
    initial.road_condition
  ) {

    applyRoadCondition(
      initial.road_condition
    );

  }


  // ===========================================================================
  // VOITURE PRINCIPALE — NOUVEAU FORMAT
  // ===========================================================================

  if (
    initial.car &&
    initial.car.position
  ) {

    positionMainCar(
      initial.car.position
    );

  }


  // ===========================================================================
  // ÉLÉMENTS
  // ===========================================================================

  if (
    Array.isArray(
      initial.elements
    )
  ) {

    initial.elements.forEach(
      element => {

        addVisualElement(
          element
        );

      }
    );

  }

}



// =============================================================================
// 41. BACKGROUND
// =============================================================================

function applyBackground(
  background
) {

  if (!scene) {

    return;

  }


  // ===========================================================================
  // NETTOYER ROND-POINT
  // ===========================================================================

  if (
    background !==
    "roundabout"
  ) {

    scene
      .querySelectorAll(
        ".roundabout-visual"
      )
      .forEach(
        element => {

          element.remove();

        }
      );

  }


  // ===========================================================================
  // NETTOYER AUTOROUTE
  // ===========================================================================

  if (
    background !==
    "highway"
  ) {

    scene
      .querySelectorAll(
        ".highway-visual"
      )
      .forEach(
        element => {

          element.remove();

        }
      );

  }


  // ===========================================================================
  // SUPPRIMER LES ANCIENNES CLASSES
  // ===========================================================================

  scene.classList.remove(

    "background-city",
    "background-country",
    "background-highway",
    "background-intersection",
    "background-roundabout",
    "background-residential",
    "background-parking",
    "background-tunnel",
    "background-bridge",
    "background-generic"

  );


  // ===========================================================================
  // NOUVEAU DÉCOR
  // ===========================================================================

  switch (
    background
  ) {


    // =========================================================================
    // VILLE
    // =========================================================================

    case "city_road":

      scene.classList.add(
        "background-city"
      );


      if (cityscape) {

        cityscape.style.display =
          "flex";

      }

      break;



    // =========================================================================
    // CAMPAGNE
    // =========================================================================

    case "country_road":

      scene.classList.add(
        "background-country"
      );


      if (cityscape) {

        cityscape.style.display =
          "none";

      }

      break;



    // =========================================================================
    // AUTOROUTE
    // =========================================================================

    case "highway":

      scene.classList.add(
        "background-highway"
      );


      if (cityscape) {

        cityscape.style.display =
          "none";

      }


      if (
        typeof createHighwayVisual ===
        "function"
      ) {

        createHighwayVisual();

      }

      break;



    // =========================================================================
    // INTERSECTION
    // =========================================================================

    case "intersection":

      scene.classList.add(
        "background-intersection"
      );


      if (cityscape) {

        cityscape.style.display =
          "flex";

      }

      break;



    // =========================================================================
    // ROND-POINT
    // =========================================================================

    case "roundabout":

      scene.classList.add(
        "background-roundabout"
      );


      if (cityscape) {

        cityscape.style.display =
          "flex";

      }


      if (
        typeof createRoundaboutVisual ===
        "function"
      ) {

        createRoundaboutVisual();

      }

      break;



    // =========================================================================
    // RÉSIDENTIEL
    // =========================================================================

    case "residential":

      scene.classList.add(
        "background-residential"
      );


      if (cityscape) {

        cityscape.style.display =
          "flex";

      }

      break;



    // =========================================================================
    // PARKING
    // =========================================================================

    case "parking":

      scene.classList.add(
        "background-parking"
      );


      if (cityscape) {

        cityscape.style.display =
          "none";

      }

      break;



    // =========================================================================
    // TUNNEL
    // =========================================================================

    case "tunnel":

      scene.classList.add(
        "background-tunnel"
      );


      if (cityscape) {

        cityscape.style.display =
          "none";

      }

      break;



    // =========================================================================
    // PONT
    // =========================================================================

    case "bridge":

      scene.classList.add(
        "background-bridge"
      );


      if (cityscape) {

        cityscape.style.display =
          "none";

      }

      break;



    // =========================================================================
    // GÉNÉRIQUE
    // =========================================================================

    default:

      scene.classList.add(
        "background-generic"
      );

      break;

  }

}



// =============================================================================
// 42. MÉTÉO
// =============================================================================

function applyWeather(
  weather
) {

  if (!scene) {

    return;

  }


  scene.classList.remove(

    "raining",
    "foggy",
    "snowing",
    "sunny"

  );


  switch (
    weather
  ) {


    case "rain":

    case "rainy":

      scene.classList.add(
        "raining"
      );

      break;



    case "fog":

    case "foggy":

      scene.classList.add(
        "foggy"
      );

      break;



    case "snow":

    case "snowy":

      scene.classList.add(
        "snowing"
      );

      break;



    case "clear":

    case "sun":

    case "sunny":

      scene.classList.add(
        "sunny"
      );

      break;

  }

}



// =============================================================================
// 43. ÉTAT DE LA ROUTE
// =============================================================================

function applyRoadCondition(
  condition
) {

  if (!scene) {

    return;

  }


  scene.classList.remove(

    "road-dry",
    "road-wet",
    "road-icy",
    "road-snow"

  );


  switch (
    condition
  ) {


    case "dry":

      scene.classList.add(
        "road-dry"
      );

      break;



    case "wet":

      scene.classList.add(
        "road-wet"
      );

      break;



    case "icy":

      scene.classList.add(
        "road-icy"
      );

      break;



    case "snow":

    case "snowy":

      scene.classList.add(
        "road-snow"
      );

      break;

  }

}



// =============================================================================
// 44. APPLIQUER LES EFFETS VISUELS
// =============================================================================

function applyVisualEffects(
  effects
) {

  if (
    !Array.isArray(
      effects
    )
  ) {

    return;

  }


  console.log(
    "Changements visuels :",
    effects
  );


  effects.forEach(
    effect => {

      if (
        !effect ||
        !effect.action
      ) {

        return;

      }


      switch (
        effect.action
      ) {


        // ---------------------------------------------------------------------
        // AJOUTER
        // ---------------------------------------------------------------------

        case "add":

          addVisualElement(
            effect
          );

          break;



        // ---------------------------------------------------------------------
        // SUPPRIMER
        // ---------------------------------------------------------------------

        case "remove":

          if (
            typeof removeVisualElement ===
            "function"
          ) {

            removeVisualElement(
              effect
            );

          }

          break;



        // ---------------------------------------------------------------------
        // MODIFIER
        // ---------------------------------------------------------------------

        case "set":

          if (
            typeof setVisualElement ===
            "function"
          ) {

            setVisualElement(
              effect
            );

          }

          break;



        // ---------------------------------------------------------------------
        // BACKGROUND
        // ---------------------------------------------------------------------

        case "background":

          if (
            effect.value
          ) {

            applyBackground(
              effect.value
            );

          }

          break;



        default:

          console.warn(
            "Action visuelle inconnue :",
            effect
          );

      }

    }
  );

}



// =============================================================================
// 45. AJOUTER UN ÉLÉMENT VISUEL
// =============================================================================

function addVisualElement(
  element
) {

  if (
    !element ||
    !element.type
  ) {

    return null;

  }


  console.log(
    "Ajout visuel :",
    element
  );


  switch (
    element.type
  ) {


    // =========================================================================
    // PLUIE
    // =========================================================================

    case "rain":

      scene.classList.add(
        "raining"
      );

      return null;



    // =========================================================================
    // BROUILLARD
    // =========================================================================

    case "fog":

      scene.classList.add(
        "foggy"
      );

      return null;



    // =========================================================================
    // NEIGE
    // =========================================================================

    case "snow":

      scene.classList.add(
        "snowing"
      );

      return null;



    // =========================================================================
    // SOLEIL
    // =========================================================================

    case "sun":

      scene.classList.add(
        "sunny"
      );

      return null;



    // =========================================================================
    // PANNEAU DE VITESSE
    // =========================================================================

    case "speed_sign":

      return createSpeedSign(

        element.value || "",

        element.position ||
        "right"

      );



    // =========================================================================
    // STOP
    // =========================================================================

    case "stop_sign":

      return createSymbolElement(

        "🛑",

        "stop_sign",

        element.position ||
        "right"

      );



    // =========================================================================
    // CÉDEZ LE PASSAGE
    // =========================================================================

    case "yield_sign":

      return createYieldSign(

        element.position ||
        "right"

      );



    // =========================================================================
    // PIÉTON
    // =========================================================================

    case "pedestrian":

      return createPedestrian(

        element.position ||
        "crosswalk"

      );



    // =========================================================================
    // CYCLISTE
    // =========================================================================

    case "cyclist":

      return createSymbolElement(

        "🚴",

        "cyclist",

        element.position ||
        "right"

      );



    // =========================================================================
    // VOITURE PRINCIPALE
    // =========================================================================

    case "car":

      positionMainCar(

        element.position ||
        "driver"

      );

      return document.getElementById(
        "car"
      );



    // =========================================================================
    // AUTRE VOITURE
    // =========================================================================

    case "other_car":

      return createOtherCar(

        element.position ||
        "ahead"

      );



    // =========================================================================
    // CAMION
    // =========================================================================

    case "truck":

      return createSymbolElement(

        "🚚",

        "truck",

        element.position ||
        "front"

      );



    // =========================================================================
    // BUS
    // =========================================================================

    case "bus":

      return createSymbolElement(

        "🚌",

        "bus",

        element.position ||
        "front"

      );



    // =========================================================================
    // MOTO
    // =========================================================================

    case "motorcycle":

      return createSymbolElement(

        "🏍️",

        "motorcycle",

        element.position ||
        "front"

      );



    // =========================================================================
    // FEU TRICOLORE
    // =========================================================================

    case "traffic_light":

      return createTrafficLight(

        element.value ||
        "green",

        element.position ||
        "right"

      );



    // =========================================================================
    // TRAVAUX
    // =========================================================================

    case "roadworks":

      return createSymbolElement(

        "🚧",

        "roadworks",

        element.position ||
        "right"

      );



    // =========================================================================
    // OBSTACLE
    // =========================================================================

    case "obstacle":

      return createSymbolElement(

        "⚠️",

        "obstacle",

        element.position ||
        "front"

      );



    // =========================================================================
    // PASSAGE PIÉTON
    // =========================================================================

    case "crosswalk":

      return createSymbolElement(

        "▰ ▰ ▰",

        "crosswalk",

        element.position ||
        "crosswalk"

      );



    // =========================================================================
    // TYPE INCONNU
    // =========================================================================

    default:

      console.warn(
        "Type visuel non géré :",
        element.type
      );


      return null;

  }

}



// =============================================================================
// 46. POSITION DE LA VOITURE PRINCIPALE
// =============================================================================

function positionMainCar(
  position = "driver"
) {

  const mainCar =
    document.getElementById(
      "car"
    );


  if (!mainCar) {

    return;

  }


  mainCar.style.display =
    "block";


  mainCar.classList.remove(

    "car-front",
    "car-left",
    "car-right",
    "car-driver",
    "car-main_lane"

  );


  switch (
    position
  ) {


    // -------------------------------------------------------------------------
    // GAUCHE
    // -------------------------------------------------------------------------

    case "left":

      mainCar.classList.add(
        "car-left"
      );

      break;



    // -------------------------------------------------------------------------
    // DROITE
    // -------------------------------------------------------------------------

    case "right":

      mainCar.classList.add(
        "car-right"
      );

      break;



    // -------------------------------------------------------------------------
    // DEVANT
    // -------------------------------------------------------------------------

    case "front":

      mainCar.classList.add(
        "car-front"
      );

      break;



    // -------------------------------------------------------------------------
    // VOIE PRINCIPALE AUTOROUTE
    // -------------------------------------------------------------------------

    case "main_lane":

      mainCar.classList.add(
        "car-main_lane"
      );

      break;



    // -------------------------------------------------------------------------
    // CONDUCTEUR
    // -------------------------------------------------------------------------

    case "driver":

    default:

      mainCar.classList.add(
        "car-driver"
      );

      break;

  }

}



// =============================================================================
// 47. CRÉER UN ÉLÉMENT SYMBOLIQUE
// =============================================================================

function createSymbolElement(
  symbol,
  type,
  position = "front"
) {

  if (!scene) {

    return null;

  }


  const selector =
    `.dynamic-element[data-type="${type}"][data-position="${position}"]`;


  const existing =
    scene.querySelector(
      selector
    );


  if (existing) {

    return existing;

  }


  const element =
    document.createElement(
      "div"
    );


  element.classList.add(

    "dynamic-element",

    `visual-${type}`

  );


  element.dataset.type =
    type;


  element.dataset.position =
    position;


  element.textContent =
    symbol;


  applyPosition(
    element,
    position
  );


  scene.appendChild(
    element
  );


  return element;

}



// =============================================================================
// 48. VOITURE SECONDAIRE
// =============================================================================

function createOtherCar(
  position = "ahead"
) {

  if (!scene) {

    return null;

  }


  let car =
    scene.querySelector(
      `.dynamic-element[data-type="other_car"][data-position="${position}"]`
    );


  if (car) {

    return car;

  }


  car =
    document.createElement(
      "div"
    );


  car.classList.add(

    "dynamic-element",
    "visual-other_car"

  );


  car.dataset.type =
    "other_car";


  car.dataset.position =
    position;



  // ===========================================================================
  // COULEUR
  // ===========================================================================

  let carColor =
    "#ef4444";


  // Voiture devant = bleue

  if (
    position === "ahead"
  ) {

    carColor =
      "#3498db";

  }



  // Voiture sur voie principale = bleue

  if (
    position === "main_lane"
  ) {

    carColor =
      "#3498db";

  }



  // Véhicule en sens inverse = rouge

  if (
    position === "oncoming"
  ) {

    carColor =
      "#ef4444";

  }



  car.innerHTML = `

    <svg
      viewBox="0 0 140 70"
      width="100%"
      height="100%"
      aria-hidden="true"
    >

      <!-- =================================================
           CARROSSERIE
      ================================================== -->

      <path
        d="
          M20 43

          L33 24

          Q37 18 47 18

          H94

          Q101 18 107 25

          L120 42

          H128

          Q134 42 134 48

          V54

          H8

          V48

          Q8 43 14 43

          Z
        "
        fill="${carColor}"
      />



      <!-- =================================================
           VITRE AVANT
      ================================================== -->

      <path
        d="
          M43 22
          H66
          V39
          H31
          Z
        "
        fill="#a7dcf4"
      />



      <!-- =================================================
           VITRE ARRIÈRE
      ================================================== -->

      <path
        d="
          M70 22

          H92

          Q98 22 102 28

          L110 39

          H70

          Z
        "
        fill="#a7dcf4"
      />



      <!-- =================================================
           SÉPARATION VITRES
      ================================================== -->

      <rect
        x="66"
        y="21"
        width="4"
        height="20"
        fill="${carColor}"
      />



      <!-- =================================================
           ROUE AVANT
      ================================================== -->

      <circle
        cx="36"
        cy="55"
        r="11"
        fill="#263238"
      />

      <circle
        cx="36"
        cy="55"
        r="5"
        fill="#b0bec5"
      />



      <!-- =================================================
           ROUE ARRIÈRE
      ================================================== -->

      <circle
        cx="106"
        cy="55"
        r="11"
        fill="#263238"
      />

      <circle
        cx="106"
        cy="55"
        r="5"
        fill="#b0bec5"
      />



      <!-- =================================================
           PHARE
      ================================================== -->

      <rect
        x="129"
        y="44"
        width="7"
        height="6"
        rx="1"
        fill="#ffd54f"
      />

    </svg>

  `;



  applyPosition(
    car,
    position
  );


  scene.appendChild(
    car
  );


  return car;

}



// =============================================================================
// 49. POSITIONS DES ÉLÉMENTS
// =============================================================================

function applyPosition(
  element,
  position
) {

  if (!element) {

    return;

  }



  const positionClasses = [

    "position-front",

    "position-left",

    "position-right",

    "position-behind",

    "position-crosswalk",

    "position-roadside",

    "position-intersection",


    // Dépassement

    "position-driver",

    "position-ahead",

    "position-oncoming",


    // Autoroute

    "position-main_lane"

  ];



  element.classList.remove(
    ...positionClasses
  );



  const allowedPositions = [

    "front",

    "left",

    "right",

    "behind",

    "crosswalk",

    "roadside",

    "intersection",


    // Dépassement

    "driver",

    "ahead",

    "oncoming",


    // Autoroute

    "main_lane"

  ];



  const finalPosition =
    allowedPositions.includes(
      position
    )
      ? position
      : "front";



  element.classList.add(
    `position-${finalPosition}`
  );

}



// =============================================================================
// 50. PANNEAU DE VITESSE
// =============================================================================

function createSpeedSign(
  value,
  position = "right"
) {

  if (!scene) {

    return null;

  }


  let sign =
    scene.querySelector(
      `.dynamic-element[data-type="speed_sign"][data-position="${position}"]`
    );


  // ===========================================================================
  // CRÉATION
  // ===========================================================================

  if (!sign) {

    sign =
      document.createElement(
        "div"
      );


    sign.classList.add(

      "dynamic-element",
      "speed-sign"

    );


    sign.dataset.type =
      "speed_sign";


    sign.dataset.position =
      position;


    applyPosition(
      sign,
      position
    );


    scene.appendChild(
      sign
    );

  }



  // ===========================================================================
  // VALEUR
  // ===========================================================================

  sign.textContent =
    value || "?";


  sign.dataset.value =
    value || "";


  return sign;

}



// =============================================================================
// 51. PANNEAU CÉDEZ LE PASSAGE
// =============================================================================

function createYieldSign(
  position = "right"
) {

  if (!scene) {

    return null;

  }


  let sign =
    scene.querySelector(
      `.dynamic-element[data-type="yield_sign"][data-position="${position}"]`
    );


  if (sign) {

    return sign;

  }


  sign =
    document.createElement(
      "div"
    );


  sign.classList.add(

    "dynamic-element",

    "visual-yield_sign",

    "yield-sign"

  );


  sign.dataset.type =
    "yield_sign";


  sign.dataset.position =
    position;



  sign.innerHTML = `

    <div class="yield-sign-board">

      <div class="yield-sign-inner"></div>

    </div>

    <div class="yield-sign-pole"></div>

  `;



  applyPosition(
    sign,
    position
  );


  scene.appendChild(
    sign
  );


  return sign;

}



// =============================================================================
// 52. PIÉTON
// =============================================================================

function createPedestrian(
  position = "crosswalk"
) {

  if (!scene) {

    return null;

  }


  let pedestrian =
    scene.querySelector(
      `.dynamic-element[data-type="pedestrian"][data-position="${position}"]`
    );


  if (pedestrian) {

    return pedestrian;

  }



  pedestrian =
    document.createElement(
      "div"
    );


  pedestrian.classList.add(

    "dynamic-element",

    "visual-pedestrian"

  );


  pedestrian.dataset.type =
    "pedestrian";


  pedestrian.dataset.position =
    position;



  pedestrian.innerHTML = `

    <svg
      viewBox="0 0 70 120"
      width="70"
      height="120"
      aria-hidden="true"
    >

      <!-- OMBRE -->

      <ellipse
        cx="35"
        cy="113"
        rx="18"
        ry="5"
        fill="rgba(0,0,0,0.18)"
      />



      <!-- JAMBES -->

      <path
        d="M29 75 L23 104"
        stroke="#263238"
        stroke-width="8"
        stroke-linecap="round"
      />


      <path
        d="M41 75 L47 104"
        stroke="#263238"
        stroke-width="8"
        stroke-linecap="round"
      />



      <!-- CHAUSSURES -->

      <ellipse
        cx="21"
        cy="106"
        rx="9"
        ry="4"
        fill="#111827"
      />


      <ellipse
        cx="49"
        cy="106"
        rx="9"
        ry="4"
        fill="#111827"
      />



      <!-- CORPS -->

      <path
        d="
          M23 44

          Q35 37 47 44

          L50 76

          Q35 83 20 76

          Z
        "
        fill="#3b82f6"
      />



      <!-- BRAS GAUCHE -->

      <path
        d="M24 50 L13 69"
        stroke="#3b82f6"
        stroke-width="8"
        stroke-linecap="round"
      />


      <circle
        cx="12"
        cy="71"
        r="4"
        fill="#f2c7a5"
      />



      <!-- BRAS DROIT -->

      <path
        d="M46 50 L56 66"
        stroke="#3b82f6"
        stroke-width="8"
        stroke-linecap="round"
      />


      <circle
        cx="57"
        cy="68"
        r="4"
        fill="#f2c7a5"
      />



      <!-- COU -->

      <rect
        x="31"
        y="33"
        width="8"
        height="10"
        rx="3"
        fill="#f2c7a5"
      />



      <!-- TÊTE -->

      <circle
        cx="35"
        cy="25"
        r="15"
        fill="#f2c7a5"
      />



      <!-- CHEVEUX -->

      <path
        d="
          M20 24

          Q21 8 35 8

          Q51 9 50 25

          Q45 18 38 17

          Q29 15 20 24
        "
        fill="#4b2e1e"
      />



      <!-- YEUX -->

      <circle
        cx="30"
        cy="26"
        r="1.8"
        fill="#1f2937"
      />


      <circle
        cx="40"
        cy="26"
        r="1.8"
        fill="#1f2937"
      />



      <!-- SOURIRE -->

      <path
        d="
          M30 35
          Q35 39 40 35
        "
        stroke="#b45353"
        stroke-width="1.8"
        fill="none"
        stroke-linecap="round"
      />

    </svg>

  `;



  applyPosition(
    pedestrian,
    position
  );


  scene.appendChild(
    pedestrian
  );


  return pedestrian;

}



// =============================================================================
// 53. FEU TRICOLORE
// =============================================================================

function createTrafficLight(
  value = "green",
  position = "right"
) {

  if (!scene) {

    return null;

  }


  let light =
    scene.querySelector(
      `.dynamic-element[data-type="traffic_light"][data-position="${position}"]`
    );



  // ===========================================================================
  // CRÉER LE FEU
  // ===========================================================================

  if (!light) {

    light =
      document.createElement(
        "div"
      );


    light.classList.add(

      "dynamic-element",

      "traffic-light"

    );


    light.dataset.type =
      "traffic_light";


    light.dataset.position =
      position;



    light.innerHTML = `

      <span
        class="light red"
      ></span>

      <span
        class="light orange"
      ></span>

      <span
        class="light green"
      ></span>

    `;



    applyPosition(
      light,
      position
    );


    scene.appendChild(
      light
    );

  }



  // ===========================================================================
  // COULEUR
  // ===========================================================================

  setTrafficLightColor(
    light,
    value
  );


  return light;

}



// =============================================================================
// 54. COULEUR DU FEU
// =============================================================================

function setTrafficLightColor(
  light,
  value
) {

  if (!light) {

    return;

  }



  let safeValue =
    String(
      value ||
      "green"
    ).toLowerCase();



  // Compatibilité avec "amber" / "yellow"

  if (
    safeValue === "amber" ||
    safeValue === "yellow"
  ) {

    safeValue =
      "orange";

  }



  // ===========================================================================
  // DÉSACTIVER TOUT
  // ===========================================================================

  const lights =
    light.querySelectorAll(
      ".light"
    );


  lights.forEach(
    item => {

      item.classList.remove(
        "active"
      );

    }
  );



  // ===========================================================================
  // ACTIVER LA BONNE COULEUR
  // ===========================================================================

  const active =
    light.querySelector(
      `.light.${safeValue}`
    );


  if (active) {

    active.classList.add(
      "active"
    );

  }


  light.dataset.value =
    safeValue;

}

// =============================================================================
// PARTIE 5
// AUTOROUTE + ROND-POINT + MODIFICATION / SUPPRESSION + RESET VISUEL
// =============================================================================



// =============================================================================
// 55. CRÉER LE VISUEL AUTOROUTE
// =============================================================================

function createHighwayVisual() {

  if (!scene) {

    return;

  }



  // ===========================================================================
  // ÉVITER LES DOUBLONS
  // ===========================================================================

  const existing =
    scene.querySelector(
      ".highway-visual"
    );


  if (existing) {

    return;

  }



  // ===========================================================================
  // CONTENEUR
  // ===========================================================================

  const highway =
    document.createElement(
      "div"
    );


  highway.classList.add(
    "highway-visual"
  );



  highway.innerHTML = `

    <!-- =================================================
         TERRE-PLEIN / HERBE
    ================================================== -->

    <div class="highway-grass"></div>



    <!-- =================================================
         CHAUSSÉE PRINCIPALE
    ================================================== -->

    <div class="highway-road">


      <!-- ligne séparation voies -->

      <div class="highway-lane-line highway-line-1"></div>


      <!-- ligne séparation insertion -->

      <div class="highway-lane-line highway-line-2"></div>


      <!-- bande d'arrêt / rive -->

      <div class="highway-edge-line"></div>

    </div>



    <!-- =================================================
         VOIE D'INSERTION
    ================================================== -->

    <div class="highway-entry-lane">

      <div class="highway-entry-line"></div>

    </div>



    <!-- =================================================
         GLISSIÈRE
    ================================================== -->

    <div class="highway-barrier">

      <div class="barrier-line"></div>

      <span class="barrier-post post-1"></span>
      <span class="barrier-post post-2"></span>
      <span class="barrier-post post-3"></span>
      <span class="barrier-post post-4"></span>

    </div>

  `;



  // ===========================================================================
  // AJOUT
  // ===========================================================================

  scene.prepend(
    highway
  );

}



// =============================================================================
// 56. CRÉER LE VISUEL ROND-POINT
// =============================================================================

function createRoundaboutVisual() {

  if (!scene) {

    return;

  }



  // ===========================================================================
  // ÉVITER LES DOUBLONS
  // ===========================================================================

  const existing =
    scene.querySelector(
      ".roundabout-visual"
    );


  if (existing) {

    return;

  }



  // ===========================================================================
  // CONTENEUR
  // ===========================================================================

  const roundabout =
    document.createElement(
      "div"
    );


  roundabout.classList.add(
    "roundabout-visual"
  );



  roundabout.innerHTML = `

    <!-- =================================================
         ROUTE DU ROND-POINT
    ================================================== -->

    <div class="roundabout-road">


      <!-- îlot central -->

      <div class="roundabout-center">

        <div class="roundabout-grass"></div>

      </div>



      <!-- marquage extérieur -->

      <div class="roundabout-marking"></div>

    </div>



    <!-- =================================================
         ENTRÉE DU ROND-POINT
    ================================================== -->

    <div class="roundabout-entry">

      <div class="roundabout-entry-line"></div>

    </div>

  `;



  scene.prepend(
    roundabout
  );

}



// =============================================================================
// 57. SUPPRIMER UN ÉLÉMENT VISUEL
// =============================================================================

function removeVisualElement(
  effect
) {

  if (
    !scene ||
    !effect ||
    !effect.type
  ) {

    return;

  }



  const type =
    effect.type;


  const position =
    effect.position;



  // ===========================================================================
  // MÉTÉO
  // ===========================================================================

  if (
    type === "rain"
  ) {

    scene.classList.remove(
      "raining"
    );

    return;

  }


  if (
    type === "fog"
  ) {

    scene.classList.remove(
      "foggy"
    );

    return;

  }


  if (
    type === "snow"
  ) {

    scene.classList.remove(
      "snowing"
    );

    return;

  }



  // ===========================================================================
  // VOITURE PRINCIPALE
  // ===========================================================================

  if (
    type === "car"
  ) {

    const mainCar =
      document.getElementById(
        "car"
      );


    if (mainCar) {

      mainCar.style.display =
        "none";

    }


    return;

  }



  // ===========================================================================
  // AUTOROUTE
  // ===========================================================================

  if (
    type === "highway"
  ) {

    scene
      .querySelectorAll(
        ".highway-visual"
      )
      .forEach(
        element => {

          element.remove();

        }
      );


    return;

  }



  // ===========================================================================
  // ROND-POINT
  // ===========================================================================

  if (
    type === "roundabout"
  ) {

    scene
      .querySelectorAll(
        ".roundabout-visual"
      )
      .forEach(
        element => {

          element.remove();

        }
      );


    return;

  }



  // ===========================================================================
  // ÉLÉMENT DYNAMIQUE
  // ===========================================================================

  let selector =
    `.dynamic-element[data-type="${type}"]`;



  if (position) {

    selector +=
      `[data-position="${position}"]`;

  }



  const elements =
    scene.querySelectorAll(
      selector
    );


  elements.forEach(
    element => {

      element.remove();

    }
  );

}



// =============================================================================
// 58. MODIFIER UN ÉLÉMENT VISUEL
// =============================================================================

function setVisualElement(
  effect
) {

  if (
    !effect ||
    !effect.type
  ) {

    return;

  }



  const type =
    effect.type;


  const position =
    effect.position ||
    "right";


  const value =
    effect.value;



  // ===========================================================================
  // PANNEAU VITESSE
  // ===========================================================================

  if (
    type === "speed_sign"
  ) {

    let sign =
      scene.querySelector(
        `.dynamic-element[data-type="speed_sign"][data-position="${position}"]`
      );


    // Si aucun panneau n'existe,
    // on le crée.

    if (!sign) {

      sign =
        createSpeedSign(
          value,
          position
        );

    }


    else {

      sign.textContent =
        value;


      sign.dataset.value =
        value;

    }


    return;

  }



  // ===========================================================================
  // FEU TRICOLORE
  // ===========================================================================

  if (
    type === "traffic_light"
  ) {

    let light =
      scene.querySelector(
        `.dynamic-element[data-type="traffic_light"][data-position="${position}"]`
      );


    if (!light) {

      light =
        createTrafficLight(
          value,
          position
        );

    }


    else {

      setTrafficLightColor(
        light,
        value
      );

    }


    return;

  }



  // ===========================================================================
  // POSITION VOITURE PRINCIPALE
  // ===========================================================================

  if (
    type === "car"
  ) {

    positionMainCar(
      effect.position ||
      value ||
      "driver"
    );


    return;

  }



  // ===========================================================================
  // AUTRE VOITURE
  // ===========================================================================

  if (
    type === "other_car"
  ) {

    const oldPosition =
      effect.from ||
      effect.previous_position;


    let car =
      null;



    if (oldPosition) {

      car =
        scene.querySelector(
          `.dynamic-element[data-type="other_car"][data-position="${oldPosition}"]`
        );

    }



    if (!car) {

      car =
        scene.querySelector(
          `.dynamic-element[data-type="other_car"][data-position="${position}"]`
        );

    }



    if (car) {

      car.dataset.position =
        position;


      applyPosition(
        car,
        position
      );

    }


    else {

      createOtherCar(
        position
      );

    }


    return;

  }



  // ===========================================================================
  // TYPE GÉNÉRIQUE
  // ===========================================================================

  removeVisualElement(
    {

      type:
        type,

      position:
        position

    }
  );


  addVisualElement(
    effect
  );

}



// =============================================================================
// 59. SUPPRIMER TOUS LES ÉLÉMENTS DYNAMIQUES
// =============================================================================

function clearDynamicElements() {

  if (!scene) {

    return;

  }


  scene
    .querySelectorAll(
      ".dynamic-element"
    )
    .forEach(
      element => {

        element.remove();

      }
    );

}



// =============================================================================
// 60. NETTOYER LES VISUELS SPÉCIAUX
// =============================================================================

function clearSpecialVisuals() {

  if (!scene) {

    return;

  }



  // ===========================================================================
  // AUTOROUTE
  // ===========================================================================

  scene
    .querySelectorAll(
      ".highway-visual"
    )
    .forEach(
      element => {

        element.remove();

      }
    );



  // ===========================================================================
  // ROND-POINT
  // ===========================================================================

  scene
    .querySelectorAll(
      ".roundabout-visual"
    )
    .forEach(
      element => {

        element.remove();

      }
    );

}



// =============================================================================
// 61. RESET DES CLASSES DE BACKGROUND
// =============================================================================

function resetBackgroundClasses() {

  if (!scene) {

    return;

  }


  scene.classList.remove(

    "background-city",

    "background-country",

    "background-highway",

    "background-intersection",

    "background-roundabout",

    "background-residential",

    "background-parking",

    "background-tunnel",

    "background-bridge",

    "background-generic"

  );

}



// =============================================================================
// 62. RESET DE LA MÉTÉO
// =============================================================================

function resetWeather() {

  if (!scene) {

    return;

  }


  scene.classList.remove(

    "raining",

    "foggy",

    "snowing",

    "sunny"

  );

}



// =============================================================================
// 63. RESET DE L'ÉTAT DE ROUTE
// =============================================================================

function resetRoadCondition() {

  if (!scene) {

    return;

  }


  scene.classList.remove(

    "road-dry",

    "road-wet",

    "road-icy",

    "road-snow"

  );

}



// =============================================================================
// 64. RESET POSITION VOITURE PRINCIPALE
// =============================================================================

function resetMainCar() {

  const mainCar =
    document.getElementById(
      "car"
    );


  if (!mainCar) {

    return;

  }


  mainCar.style.display =
    "block";


  mainCar.classList.remove(

    "car-front",

    "car-left",

    "car-right",

    "car-driver",

    "car-main_lane"

  );


  mainCar.classList.add(
    "car-driver"
  );

}



// =============================================================================
// 65. RESET VISUEL COMPLET
// =============================================================================

function resetVisual() {

  if (!scene) {

    return;

  }


  console.log(
    "♻️ Réinitialisation du visuel"
  );



  // ===========================================================================
  // ÉLÉMENTS DYNAMIQUES
  // ===========================================================================

  clearDynamicElements();



  // ===========================================================================
  // DÉCORS SPÉCIAUX
  // ===========================================================================

  clearSpecialVisuals();



  // ===========================================================================
  // CLASSES BACKGROUND
  // ===========================================================================

  resetBackgroundClasses();



  // ===========================================================================
  // MÉTÉO
  // ===========================================================================

  resetWeather();



  // ===========================================================================
  // ROUTE
  // ===========================================================================

  resetRoadCondition();



  // ===========================================================================
  // VOITURE PRINCIPALE
  // ===========================================================================

  resetMainCar();



  // ===========================================================================
  // CITYSCAPE
  // ===========================================================================

  if (cityscape) {

    cityscape.style.display =
      "flex";

  }



  // ===========================================================================
  // BACKGROUND PAR DÉFAUT
  // ===========================================================================

  scene.classList.add(
    "background-city"
  );



  // ===========================================================================
  // AVATAR
  // ===========================================================================

  loadPlayerAvatarSVG();


  if (
    typeof setAvatarExpression ===
    "function"
  ) {

    setAvatarExpression(
      "normal"
    );

  }

}



// =============================================================================
// 66. TROUVER UN ÉLÉMENT VISUEL
// =============================================================================

function findVisualElement(
  type,
  position = null
) {

  if (
    !scene ||
    !type
  ) {

    return null;

  }


  let selector =
    `.dynamic-element[data-type="${type}"]`;


  if (position) {

    selector +=
      `[data-position="${position}"]`;

  }


  return scene.querySelector(
    selector
  );

}



// =============================================================================
// 67. DÉPLACER UN ÉLÉMENT VISUEL
// =============================================================================

function moveVisualElement(
  type,
  oldPosition,
  newPosition
) {

  const element =
    findVisualElement(
      type,
      oldPosition
    );


  if (!element) {

    console.warn(
      "Impossible de déplacer l'élément :",
      type,
      oldPosition
    );


    return null;

  }


  element.dataset.position =
    newPosition;


  applyPosition(
    element,
    newPosition
  );


  return element;

}



// =============================================================================
// 68. AJOUTER PLUSIEURS ÉLÉMENTS
// =============================================================================

function addVisualElements(
  elements
) {

  if (
    !Array.isArray(
      elements
    )
  ) {

    return;

  }


  elements.forEach(
    element => {

      addVisualElement(
        element
      );

    }
  );

}



// =============================================================================
// 69. APPLIQUER UN VISUAL_CHANGE
// =============================================================================
//
// Compatible avec :
//
// visual_change: {
//   background: "...",
//   weather: "...",
//   road_condition: "...",
//   elements: [...]
// }
//
// =============================================================================

function applyVisualChange(
  visualChange
) {

  if (!visualChange) {

    return;

  }



  // ===========================================================================
  // BACKGROUND
  // ===========================================================================

  if (
    visualChange.background
  ) {

    applyBackground(
      visualChange.background
    );

  }



  // ===========================================================================
  // MÉTÉO
  // ===========================================================================

  if (
    visualChange.weather
  ) {

    applyWeather(
      visualChange.weather
    );

  }



  // ===========================================================================
  // ROUTE
  // ===========================================================================

  if (
    visualChange.road_condition
  ) {

    applyRoadCondition(
      visualChange.road_condition
    );

  }



  // ===========================================================================
  // ELEMENTS
  // ===========================================================================

  if (
    Array.isArray(
      visualChange.elements
    )
  ) {

    visualChange
      .elements
      .forEach(
        element => {


          // -------------------------------------------------------------------
          // Si l'élément possède une action
          // -------------------------------------------------------------------

          if (
            element.action === "remove"
          ) {

            removeVisualElement(
              element
            );

            return;

          }



          if (
            element.action === "set"
          ) {

            setVisualElement(
              element
            );

            return;

          }



          // -------------------------------------------------------------------
          // Sinon ajout normal
          // -------------------------------------------------------------------

          addVisualElement(
            element
          );

        }
      );

  }

}



// =============================================================================
// 70. SÉCURITÉ VISUELLE : REMETTRE LA VOITURE AU PREMIER PLAN
// =============================================================================
//
// Certains éléments dynamiques peuvent être ajoutés après la voiture.
// Cette fonction permet de garder une hiérarchie propre.
//

function refreshVisualLayers() {

  if (!scene) {

    return;

  }


  const mainCar =
    document.getElementById(
      "car"
    );


  const avatarElement =
    document.getElementById(
      "avatar"
    );


  if (mainCar) {

    mainCar.style.zIndex =
      "8";

  }


  if (avatarElement) {

    avatarElement.style.zIndex =
      "20";

  }


  scene
    .querySelectorAll(
      ".dynamic-element"
    )
    .forEach(
      element => {

        if (
          element.dataset.type ===
          "speed_sign" ||
          element.dataset.type ===
          "traffic_light" ||
          element.dataset.type ===
          "yield_sign"
        ) {

          element.style.zIndex =
            "12";

        }

        else {

          element.style.zIndex =
            "7";

        }

      }
    );

}



// =============================================================================
// 71. DEBUG VISUEL
// =============================================================================
//
// Très utile pendant tes tests.
// Dans la console tu pourras écrire :
//
// debugVisual()
//
// =============================================================================

function debugVisual() {

  console.group(
    "ET SI ? — Visuel actuel"
  );


  console.log(
    "Background :",
    scene?.dataset.background
  );


  console.log(
    "Classes scène :",
    scene
      ? [
          ...scene.classList
        ]
      : []
  );


  console.log(
    "Éléments dynamiques :",
    scene
      ? [
          ...scene.querySelectorAll(
            ".dynamic-element"
          )
        ].map(
          element => {

            return {

              type:
                element.dataset.type,

              position:
                element.dataset.position,

              value:
                element.dataset.value

            };

          }
        )
      : []
  );


  console.log(
    "Profil :",
    {

      name:
        playerProfile.name,

      avatar:
        playerProfile.avatar

    }
  );


  console.groupEnd();

}

// =============================================================================
// PARTIE 6
// RÉPONSE JOUEUR + MAKE + AVATAR + AUDIO + DÉMARRAGE DU JEU
// =============================================================================



// =============================================================================
// 72. RÉPONSE DU JOUEUR
// =============================================================================

async function handleActionChoice(
  option
) {


  if (!option) {

    return;

  }



  // ===========================================================================
  // EMPÊCHER UNE DEUXIÈME RÉPONSE
  // ===========================================================================

  if (situationCompleted) {

    return;

  }



  // ===========================================================================
  // NETTOYER LES CHOIX
  // ===========================================================================

  if (choices) {

    choices.innerHTML =
      "";

  }



  // ===========================================================================
  // ENREGISTRER LE CHOIX
  // ===========================================================================

  userChoicesHistory.action =
    option.value ||
    "";


  userChoicesHistory.answer =
    option.label ||
    option.text ||
    "";


  userChoicesHistory.correct =
    option.correct === true;



  // ===========================================================================
  // IMPORTANT
  // LA QUESTION FINALE A ÉTÉ REMPLIE
  // ===========================================================================

  situationCompleted =
    true;



  // ===========================================================================
  // TEXTE DU FEEDBACK
  // ===========================================================================

  const responseText =

    option.response ||

    option.explanation ||

    (
      option.correct === true
        ? "Bonne décision."
        : "Cette réponse n'est pas adaptée à la situation."
    );



  if (text) {

    text.textContent =
      responseText;

  }



  // ===========================================================================
  // AUDIO
  // ===========================================================================

  if (
    typeof speakText ===
      "function" &&
    typeof audioEnabled !==
      "undefined" &&
    audioEnabled === true
  ) {

    speakText(
      responseText
    );

  }



  // ===========================================================================
  // EXPRESSION AVATAR
  // ===========================================================================

  if (
    typeof setAvatarExpression ===
      "function"
  ) {

    setAvatarExpression(

      option.correct === true
        ? "happy"
        : "surprised"

    );

  }



  // ===========================================================================
  // DONNÉES ENVOYÉES À MAKE
  // ===========================================================================

  const resultData = {


    event:
      "driver_action",



    // -------------------------------------------------------------------------
    // JOUEUR
    // -------------------------------------------------------------------------

    ...getPlayerDataForResult(),



    // -------------------------------------------------------------------------
    // SCÉNARIO
    // -------------------------------------------------------------------------

    category:
      scenario?.category ||
      "",


    scenario_title:
      scenario?.title ||
      "",



    // -------------------------------------------------------------------------
    // PROGRESSION
    // -------------------------------------------------------------------------

    step:
      step + 1,


    total_steps:
      scenes.length,



    // -------------------------------------------------------------------------
    // RÉPONSE
    // -------------------------------------------------------------------------

    action:
      option.value ||
      "",


    answer:
      option.label ||
      option.text ||
      "",


    correct:
      option.correct === true,


    response:
      responseText,



    // -------------------------------------------------------------------------
    // HISTORIQUE
    // -------------------------------------------------------------------------

    history:
      userChoicesHistory,



    // -------------------------------------------------------------------------
    // SITUATION TERMINÉE
    // -------------------------------------------------------------------------

    situation_completed:
      true,



    // -------------------------------------------------------------------------
    // DATE
    // -------------------------------------------------------------------------

    timestamp:
      new Date()
        .toISOString()

  };



  // ===========================================================================
  // ENVOI MAKE
  // ===========================================================================

  if (!TEST_MODE) {

    await sendResultToMake(
      resultData
    );

  }

  else {

    console.log(
      "🧪 Résultat du joueur :",
      resultData
    );

  }



  // ===========================================================================
  // IMPORTANT
  // SUPPRIMER LA SAUVEGARDE DE REPRISE
  // ===========================================================================

  clearGameProgress();



  console.log(
    "🏁 Situation terminée : aucune reprise ne sera proposée."
  );



  // ===========================================================================
  // BOUTON
  // ===========================================================================

  if (button) {

    button.style.display =
      "inline-block";


    button.textContent =
      "Nouvelle situation →";


    button.dataset.finished =
      "true";

  }

}




// =============================================================================
// 73. ENVOYER LE RÉSULTAT À MAKE
// =============================================================================

async function sendResultToMake(
  data
) {


  // ===========================================================================
  // MODE TEST
  // ===========================================================================

  if (TEST_MODE) {

    console.log(
      "🧪 Enregistrement Make désactivé en mode test."
    );


    return null;

  }



  // ===========================================================================
  // URL MANQUANTE
  // ===========================================================================

  if (!SAVE_RESULT_URL) {

    console.warn(
      "SAVE_RESULT_URL non configurée."
    );


    return null;

  }



  try {


    console.log(
      "📤 Envoi du résultat vers Make :",
      data
    );



    const response =
      await fetch(

        SAVE_RESULT_URL,

        {

          method:
            "POST",


          headers: {

            "Content-Type":
              "application/json"

          },


          body:
            JSON.stringify(
              data
            )

        }

      );



    // =========================================================================
    // ERREUR HTTP
    // =========================================================================

    if (!response.ok) {

      console.warn(
        `Make a répondu avec le statut ${response.status}.`
      );


      return null;

    }



    // =========================================================================
    // TYPE DE RÉPONSE
    // =========================================================================

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";



    // =========================================================================
    // JSON
    // =========================================================================

    if (
      contentType.includes(
        "application/json"
      )
    ) {

      const result =
        await response.json();


      console.log(
        "📥 Réponse Make :",
        result
      );


      return result;

    }



    // =========================================================================
    // TEXTE
    // =========================================================================

    const result =
      await response.text();


    console.log(
      "📥 Réponse Make :",
      result
    );


    return result;

  }



  // ===========================================================================
  // ERREUR RÉSEAU
  // ===========================================================================

  catch (error) {

    console.error(
      "Erreur lors de l'envoi vers Make :",
      error
    );


    return null;

  }

}



// =============================================================================
// 74. EXPRESSIONS DE L'AVATAR
// =============================================================================

function setAvatarExpression(
  expression = "normal"
) {


  // ===========================================================================
  // YEUX
  // ===========================================================================

  const normalEyes =
    document.getElementById(
      "eyes-normal"
    );


  const surprisedEyes =
    document.getElementById(
      "eyes-surprised"
    );



  // ===========================================================================
  // BOUCHES
  // ===========================================================================

  const normalMouth =
    document.getElementById(
      "mouth-normal"
    );


  const surprisedMouth =
    document.getElementById(
      "mouth-surprised"
    );


  const happyMouth =
    document.getElementById(
      "mouth-happy"
    );



  // ===========================================================================
  // SÉCURITÉ
  // ===========================================================================

  if (!normalEyes) {

    return;

  }



  // ===========================================================================
  // RESET
  // ===========================================================================

  normalEyes.style.display =
    "block";


  if (surprisedEyes) {

    surprisedEyes.style.display =
      "none";

  }


  if (normalMouth) {

    normalMouth.style.display =
      "block";

  }


  if (surprisedMouth) {

    surprisedMouth.style.display =
      "none";

  }


  if (happyMouth) {

    happyMouth.style.display =
      "none";

  }



  // ===========================================================================
  // SURPRIS / MAUVAISE RÉPONSE
  // ===========================================================================

  if (
    expression ===
    "surprised"
  ) {


    normalEyes.style.display =
      "none";


    if (surprisedEyes) {

      surprisedEyes.style.display =
        "block";

    }


    if (normalMouth) {

      normalMouth.style.display =
        "none";

    }


    if (surprisedMouth) {

      surprisedMouth.style.display =
        "block";

    }

  }



  // ===========================================================================
  // HEUREUX / BONNE RÉPONSE
  // ===========================================================================

  if (
    expression ===
    "happy"
  ) {


    if (normalMouth) {

      normalMouth.style.display =
        "none";

    }


    if (happyMouth) {

      happyMouth.style.display =
        "block";

    }

  }

}



// =============================================================================
// 75. BOUTON CONTINUER
// =============================================================================

if (button) {

  button.addEventListener(

    "click",

    async () => {


      // =========================================================================
      // RÉESSAYER APRÈS UNE ERREUR
      // =========================================================================

      if (
        button.dataset.retry ===
        "true"
      ) {

        button.dataset.retry =
          "false";


        await loadScenario();


        return;

      }



      // =========================================================================
      // NOUVELLE SITUATION
      // =========================================================================

      if (
        button.dataset.finished ===
        "true"
      ) {


        button.dataset.finished =
          "false";


        button.dataset.retry =
          "false";



        // -----------------------------------------------------------------------
        // Recharger le profil
        // -----------------------------------------------------------------------

        const refreshedProfile =
          getPlayerProfile();


        playerProfile.name =
          refreshedProfile.name;


        playerProfile.avatar =
          refreshedProfile.avatar;



        // -----------------------------------------------------------------------
        // Réappliquer prénom + avatar
        // -----------------------------------------------------------------------

        applyPlayerProfileToGame();



        // -----------------------------------------------------------------------
        // Expression normale
        // -----------------------------------------------------------------------

        setAvatarExpression(
          "normal"
        );



        // -----------------------------------------------------------------------
        // Nouvelle situation
        // -----------------------------------------------------------------------

        await loadScenario();


        return;

      }



      // =========================================================================
      // SCÈNE SUIVANTE
      // =========================================================================

      goToNextScene();

    }

  );

}



// =============================================================================
// 76. FIN DU SCÉNARIO
// =============================================================================

function finishScenario() {


  // ===========================================================================
  // TEXTE
  // ===========================================================================

  const finishText =
    `Situation terminée, ${playerProfile.name}.`;


  if (text) {

    text.textContent =
      finishText;

  }



  // ===========================================================================
  // AUDIO
  // ===========================================================================

  if (
    typeof speakText ===
      "function" &&
    typeof audioEnabled !==
      "undefined" &&
    audioEnabled === true
  ) {

    speakText(
      finishText
    );

  }



  // ===========================================================================
  // CHOIX
  // ===========================================================================

  if (choices) {

    choices.innerHTML =
      "";

  }



  // ===========================================================================
  // BOUTON
  // ===========================================================================

  if (button) {

    button.style.display =
      "inline-block";


    button.textContent =
      "Nouvelle situation →";


    button.dataset.finished =
      "true";

  }



  // ===========================================================================
  // AVATAR
  // ===========================================================================

  setAvatarExpression(
    "happy"
  );

}



// =============================================================================
// 77. AUDIO
// =============================================================================

const audioButton =
  document.querySelector(
    ".audio-btn"
  );


let audioEnabled =
  true;



// =============================================================================
// 78. LIRE LE TEXTE
// =============================================================================

function speakText(
  content
) {


  // ===========================================================================
  // AUDIO COUPÉ
  // ===========================================================================

  if (!audioEnabled) {

    return;

  }



  // ===========================================================================
  // TEXTE VIDE
  // ===========================================================================

  if (
    !content ||
    typeof content !==
      "string"
  ) {

    return;

  }



  // ===========================================================================
  // NAVIGATEUR COMPATIBLE ?
  // ===========================================================================

  if (
    !(
      "speechSynthesis"
      in window
    )
  ) {

    console.warn(
      "Synthèse vocale non prise en charge par ce navigateur."
    );


    return;

  }



  // ===========================================================================
  // STOPPER L'ANCIEN AUDIO
  // ===========================================================================

  window
    .speechSynthesis
    .cancel();



  // ===========================================================================
  // CRÉER LA VOIX
  // ===========================================================================

  const speech =
    new SpeechSynthesisUtterance(
      content
    );



  speech.lang =
    "fr-FR";


  speech.rate =
    0.95;


  speech.pitch =
    1;


  speech.volume =
    1;



  // ===========================================================================
  // CHERCHER UNE VOIX FRANÇAISE
  // ===========================================================================

  const voices =
    window
      .speechSynthesis
      .getVoices();



  const frenchVoice =
    voices.find(
      voice => {

        return (
          voice.lang &&
          voice.lang
            .toLowerCase()
            .startsWith("fr")
        );

      }
    );



  if (frenchVoice) {

    speech.voice =
      frenchVoice;

  }



  // ===========================================================================
  // LECTURE
  // ===========================================================================

  window
    .speechSynthesis
    .speak(
      speech
    );

}



// =============================================================================
// 79. CHARGER LES VOIX DU NAVIGATEUR
// =============================================================================

if (
  "speechSynthesis"
  in window
) {

  window
    .speechSynthesis
    .getVoices();


  window
    .speechSynthesis
    .addEventListener?.(
      "voiceschanged",
      () => {

        window
          .speechSynthesis
          .getVoices();

      }
    );

}



// =============================================================================
// 80. BOUTON AUDIO
// =============================================================================

if (audioButton) {

  audioButton.addEventListener(

    "click",

    () => {


      // =========================================================================
      // INVERSER
      // =========================================================================

      audioEnabled =
        !audioEnabled;



      // =========================================================================
      // AUDIO ACTIVÉ
      // =========================================================================

      if (audioEnabled) {


        audioButton.classList.remove(
          "disabled"
        );


        audioButton.innerHTML = `

          <span class="audio-icon">
            ●
          </span>

          Audio

        `;



        audioButton.setAttribute(
          "aria-pressed",
          "true"
        );



        // -----------------------------------------------------------------------
        // Relire le texte actuel
        // -----------------------------------------------------------------------

        if (
          text &&
          text.textContent
        ) {

          speakText(
            text.textContent
          );

        }

      }



      // =========================================================================
      // AUDIO COUPÉ
      // =========================================================================

      else {


        audioButton.classList.add(
          "disabled"
        );


        audioButton.innerHTML = `

          <span class="audio-icon">
            ○
          </span>

          Audio coupé

        `;



        audioButton.setAttribute(
          "aria-pressed",
          "false"
        );



        if (
          "speechSynthesis"
          in window
        ) {

          window
            .speechSynthesis
            .cancel();

        }

      }

    }

  );

}



// =============================================================================
// 81. ARRÊTER L'AUDIO LORSQU'ON QUITTE LA PAGE
// =============================================================================

window.addEventListener(

  "beforeunload",

  () => {

    if (
      "speechSynthesis"
      in window
    ) {

      window
        .speechSynthesis
        .cancel();

    }

  }

);



// =============================================================================
// 82. VÉRIFICATION DU PROFIL AU DÉMARRAGE
// =============================================================================

function refreshPlayerProfileBeforeStart() {


  const profile =
    getPlayerProfile();



  playerProfile.name =
    profile.name;


  playerProfile.avatar =
    profile.avatar;



  applyPlayerProfileToGame();

}



// =============================================================================
// 83. DÉMARRAGE DU JEU
// =============================================================================

async function startGame() {


  console.log(
    "🚗 Démarrage de ET SI ?"
  );



  // ===========================================================================
  // PROFIL
  // ===========================================================================

  refreshPlayerProfileBeforeStart();



  console.log(
    `👤 Joueur : ${playerProfile.name}`
  );


  console.log(
    `🎭 Avatar : ${playerProfile.avatar}`
  );



  // ===========================================================================
  // EXPRESSION
  // ===========================================================================

  setAvatarExpression(
    "normal"
  );



  // ===========================================================================
  // CHARGEMENT
  // ===========================================================================

  await loadScenario();

}



// =============================================================================
// PARTIE 7
// SAUVEGARDE ET REPRISE DE PROGRESSION
// =============================================================================
//
// RÈGLES :
//
// 1. Une sauvegarde appartient à UN profil.
// 2. Une situation non terminée peut être reprise.
// 3. Une situation terminée n'est jamais reprise.
// 4. Make conserve les résultats.
// 5. localStorage sert uniquement à reprendre une situation interrompue.
// =============================================================================



// =============================================================================
// CLÉ DE SAUVEGARDE PAR PROFIL
// =============================================================================

function getGameProgressKey() {


  const safeName =
    playerProfile.name
      .trim()
      .toLowerCase()
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /[^a-z0-9-]/g,
        ""
      );



  return (

    "etsi-game-progress-" +

    (
      safeName ||
      "player"
    ) +

    "-" +

    playerProfile.avatar

  );

}



// =============================================================================
// DURÉE MAXIMALE D'UNE SAUVEGARDE
// =============================================================================
//
// 7 jours
//

const GAME_SAVE_MAX_AGE =

  7 *
  24 *
  60 *
  60 *
  1000;



// =============================================================================
// SAUVEGARDER
// =============================================================================

function saveGameProgress() {


  // ===========================================================================
  // UNE SITUATION TERMINÉE NE DOIT JAMAIS ÊTRE SAUVEGARDÉE
  // ===========================================================================

  if (situationCompleted) {

    console.log(
      "⛔ Situation terminée : sauvegarde de reprise ignorée."
    );


    return false;

  }



  // ===========================================================================
  // PAS DE SCÉNARIO
  // ===========================================================================

  if (
    !scenario ||
    !Array.isArray(
      scenes
    ) ||
    scenes.length === 0
  ) {

    return false;

  }



  try {


    const progress = {


      // =======================================================================
      // VERSION
      // =======================================================================

      version:
        2,



      // =======================================================================
      // JOUEUR
      // =======================================================================

      player: {

        name:
          playerProfile.name,

        avatar:
          playerProfile.avatar

      },



      // =======================================================================
      // SCÉNARIO
      // =======================================================================

      scenario:
        scenario,



      // =======================================================================
      // ÉTAPE
      // =======================================================================

      step:
        step,



      // =======================================================================
      // HISTORIQUE
      // =======================================================================

      userChoicesHistory:
        userChoicesHistory,



      // =======================================================================
      // THÈME
      // =======================================================================

      theme:
        document
          .documentElement
          .getAttribute(
            "data-theme"
          ) ||
        "dark",



      // =======================================================================
      // TERMINÉ
      // =======================================================================

      completed:
        false,



      // =======================================================================
      // DATE
      // =======================================================================

      savedAt:
        new Date()
          .toISOString()

    };



    localStorage.setItem(

      getGameProgressKey(),

      JSON.stringify(
        progress
      )

    );



    console.log(
      "💾 Progression sauvegardée",
      {

        player:
          playerProfile.name,

        step:
          step + 1,

        total:
          scenes.length

      }
    );



    return true;

  }



  catch (error) {


    console.warn(
      "Impossible de sauvegarder la progression.",
      error
    );


    return false;

  }

}



// =============================================================================
// LIRE LA SAUVEGARDE
// =============================================================================

function getSavedGameProgress() {


  try {


    const key =
      getGameProgressKey();



    const raw =
      localStorage.getItem(
        key
      );



    if (!raw) {

      return null;

    }



    const saved =
      JSON.parse(
        raw
      );



    // =========================================================================
    // FORMAT INVALIDE
    // =========================================================================

    if (
      !saved ||
      !saved.scenario ||
      !Array.isArray(
        saved.scenario.scenes
      )
    ) {

      clearGameProgress();


      return null;

    }



    // =========================================================================
    // MAUVAIS PROFIL
    // =========================================================================

    if (
      !saved.player ||
      saved.player.name !==
        playerProfile.name ||
      saved.player.avatar !==
        playerProfile.avatar
    ) {


      console.log(
        "ℹ️ La sauvegarde appartient à un autre profil."
      );


      return null;

    }



    // =========================================================================
    // SITUATION DÉJÀ TERMINÉE
    // =========================================================================

    if (
      saved.completed ===
      true
    ) {


      clearGameProgress();


      return null;

    }



    // =========================================================================
    // DATE
    // =========================================================================

    if (saved.savedAt) {


      const savedTime =
        new Date(
          saved.savedAt
        ).getTime();



      const age =
        Date.now() -
        savedTime;



      if (
        Number.isFinite(
          age
        ) &&
        age >
          GAME_SAVE_MAX_AGE
      ) {


        console.log(
          "🗑️ Sauvegarde trop ancienne."
        );


        clearGameProgress();


        return null;

      }

    }



    return saved;

  }



  catch (error) {


    console.warn(
      "Impossible de lire la sauvegarde.",
      error
    );


    return null;

  }

}



// =============================================================================
// SUPPRIMER LA SAUVEGARDE DU PROFIL ACTUEL
// =============================================================================

function clearGameProgress() {


  try {


    localStorage.removeItem(
      getGameProgressKey()
    );


    console.log(
      "🗑️ Sauvegarde de reprise supprimée."
    );

  }



  catch (error) {


    console.warn(
      "Impossible de supprimer la sauvegarde.",
      error
    );

  }

}



// =============================================================================
// RESTAURER UNE PARTIE
// =============================================================================

function restoreGameProgress(
  saved
) {


  if (!saved) {

    return false;

  }



  // ===========================================================================
  // LA PARTIE REPRISE EST FORCÉMENT EN COURS
  // ===========================================================================

  situationCompleted =
    false;



  // ===========================================================================
  // SCÉNARIO
  // ===========================================================================

  scenario =
    JSON.parse(
      JSON.stringify(
        saved.scenario
      )
    );


  scenes =
    scenario.scenes;



  // ===========================================================================
  // ÉTAPE
  // ===========================================================================

  const savedStep =
    Number(
      saved.step
    );



  if (
    Number.isInteger(
      savedStep
    ) &&
    savedStep >= 0 &&
    savedStep <
      scenes.length
  ) {

    step =
      savedStep;

  }

  else {

    step =
      0;

  }



  // ===========================================================================
  // HISTORIQUE
  // ===========================================================================

  userChoicesHistory =

    saved.userChoicesHistory &&
    typeof saved.userChoicesHistory ===
      "object"

      ? saved.userChoicesHistory

      : {};



  // ===========================================================================
  // PROFIL ACTUEL
  // ===========================================================================

  const currentProfile =
    getPlayerProfile();



  playerProfile.name =
    currentProfile.name;


  playerProfile.avatar =
    currentProfile.avatar;



  applyPlayerProfileToGame();



  // ===========================================================================
  // VISUEL
  // ===========================================================================

  rebuildVisualToCurrentStep();



  // ===========================================================================
  // BOUTON
  // ===========================================================================

  if (button) {


    button.dataset.finished =
      "false";


    button.dataset.retry =
      "false";

  }



  // ===========================================================================
  // AFFICHAGE
  // ===========================================================================

  showScene();



  console.log(
    `✅ Situation reprise à l'étape ${step + 1}/${scenes.length}`
  );



  return true;

}



// =============================================================================
// RECONSTRUIRE LE VISUEL
// =============================================================================

function rebuildVisualToCurrentStep() {


  resetVisual();



  // ===========================================================================
  // INITIAL
  // ===========================================================================

  if (
    scenario?.visual?.initial
  ) {

    applyInitialVisual(
      scenario.visual.initial
    );

  }



  // ===========================================================================
  // REJOUER LES CHANGEMENTS
  // ===========================================================================

  for (
    let index = 0;
    index <= step;
    index++
  ) {


    const sceneData =
      scenes[index];



    if (!sceneData) {

      continue;

    }



    // -------------------------------------------------------------------------
    // VISUAL STATE
    // -------------------------------------------------------------------------

    if (
      sceneData.visual_state ===
      "change"
    ) {


      const effects =
        scenario
          ?.visual
          ?.change
          ?.effects;



      if (
        Array.isArray(
          effects
        )
      ) {

        applyVisualEffects(
          effects
        );

      }

    }



    // -------------------------------------------------------------------------
    // VISUAL CHANGE
    // -------------------------------------------------------------------------

    if (
      sceneData.visual_change
    ) {

      applyVisualChange(
        sceneData.visual_change
      );

    }

  }



  refreshVisualLayers();

}



// =============================================================================
// MODALE DE REPRISE
// =============================================================================

function askToResumeGame(
  saved
) {


  return new Promise(
    resolve => {


      const modal =
        document.getElementById(
          "resume-modal"
        );


      const continueButton =
        document.getElementById(
          "resume-continue"
        );


      const newButton =
        document.getElementById(
          "resume-new"
        );


      const playerName =
        document.getElementById(
          "resume-player-name"
        );


      const scenarioTitle =
        document.getElementById(
          "resume-scenario-title"
        );


      const stepElement =
        document.getElementById(
          "resume-step"
        );


      const totalElement =
        document.getElementById(
          "resume-total"
        );



      // =========================================================================
      // PAS DE MODALE
      // =========================================================================

      if (
        !modal ||
        !continueButton ||
        !newButton
      ) {


        resolve(
          false
        );


        return;

      }



      // =========================================================================
      // CONTENU
      // =========================================================================

      if (playerName) {

        playerName.textContent =
          playerProfile.name;

      }


      if (scenarioTitle) {

        scenarioTitle.textContent =
          saved?.scenario?.title ||
          "Situation en cours";

      }


      if (stepElement) {

        stepElement.textContent =
          Number(
            saved.step
          ) + 1;

      }


      if (totalElement) {

        totalElement.textContent =
          saved
            ?.scenario
            ?.scenes
            ?.length ||
          "?";

      }



      // =========================================================================
      // OUVRIR
      // =========================================================================

      modal.classList.add(
        "open"
      );


      modal.setAttribute(
        "aria-hidden",
        "false"
      );



      // =========================================================================
      // FERMER
      // =========================================================================

      function closeModal() {


        modal.classList.remove(
          "open"
        );


        modal.setAttribute(
          "aria-hidden",
          "true"
        );

      }



      // =========================================================================
      // REPRENDRE
      // =========================================================================

      continueButton.onclick =
        () => {


          closeModal();


          resolve(
            true
          );

        };



      // =========================================================================
      // NOUVELLE SITUATION
      // =========================================================================

      newButton.onclick =
        () => {


          closeModal();


          resolve(
            false
          );

        };

    }
  );

}



// =============================================================================
// NOUVELLE PARTIE
// =============================================================================

async function startNewGame() {


  // ===========================================================================
  // ANCIENNE SAUVEGARDE
  // ===========================================================================

  clearGameProgress();



  // ===========================================================================
  // ÉTAT
  // ===========================================================================

  situationCompleted =
    false;



  // ===========================================================================
  // PROFIL
  // ===========================================================================

  refreshPlayerProfileBeforeStart();



  // ===========================================================================
  // AVATAR
  // ===========================================================================

  setAvatarExpression(
    "normal"
  );



  // ===========================================================================
  // CHARGER
  // ===========================================================================

  await loadScenario();

}



// =============================================================================
// DÉMARRAGE AVEC REPRISE
// =============================================================================

async function startGameWithResume() {


  console.log(
    "🚗 Démarrage avec gestion de progression"
  );



  // ===========================================================================
  // PROFIL
  // ===========================================================================

  refreshPlayerProfileBeforeStart();



  // ===========================================================================
  // SAUVEGARDE DU PROFIL ACTUEL
  // ===========================================================================

  const saved =
    getSavedGameProgress();



  // ===========================================================================
  // AUCUNE SAUVEGARDE
  // ===========================================================================

  if (!saved) {


    await startNewGame();


    return;

  }



  // ===========================================================================
  // PROPOSER DE REPRENDRE
  // ===========================================================================

  const resume =
    await askToResumeGame(
      saved
    );



  // ===========================================================================
  // REPRENDRE
  // ===========================================================================

  if (resume) {


    restoreGameProgress(
      saved
    );


    return;

  }



  // ===========================================================================
  // NOUVELLE SITUATION
  // ===========================================================================

  await startNewGame();

}



// =============================================================================
// QUITTER LA PAGE
// =============================================================================

window.addEventListener(
  "beforeunload",
  () => {


    // =========================================================================
    // UNIQUEMENT SI LA SITUATION N'EST PAS FINIE
    // =========================================================================

    if (
      !situationCompleted
    ) {

      saveGameProgress();

    }

  }
);



// =============================================================================
// MOBILE / ONGLET EN ARRIÈRE-PLAN
// =============================================================================

document.addEventListener(
  "visibilitychange",
  () => {


    if (
      document.visibilityState ===
        "hidden" &&
      !situationCompleted
    ) {

      saveGameProgress();

    }

  }
);



// =============================================================================
// BOUTON EXIT
// =============================================================================

const exitGameButton =
  document.querySelector(

    `
      #exit-game,
      .exit-game,
      [data-exit-game]
    `

  );



if (exitGameButton) {


  exitGameButton.addEventListener(
    "click",
    () => {


      // =========================================================================
      // SITUATION EN COURS
      // =========================================================================

      if (
        !situationCompleted
      ) {

        saveGameProgress();

      }



      // =========================================================================
      // TERMINÉE
      // =========================================================================

      else {

        clearGameProgress();

      }

    }
  );

}



// =============================================================================
// AUTOSAVE
// =============================================================================

const progressAutoSaveInterval =
  setInterval(
    () => {


      if (
        !situationCompleted &&
        scenario &&
        Array.isArray(
          scenes
        ) &&
        scenes.length > 0
      ) {

        saveGameProgress();

      }

    },

    15000

  );



// =============================================================================
// STOP AUTOSAVE
// =============================================================================

window.addEventListener(
  "beforeunload",
  () => {


    clearInterval(
      progressAutoSaveInterval
    );

  }
);



// =============================================================================
// DEBUG
// =============================================================================

function debugSave() {


  console.group(
    "ET SI ? — Sauvegarde"
  );


  console.log(
    "Profil actuel :",
    playerProfile
  );


  console.log(
    "Clé :",
    getGameProgressKey()
  );


  console.log(
    "Situation terminée :",
    situationCompleted
  );


  console.log(
    "Progression :",
    getSavedGameProgress()
  );


  console.log(
    "Étape :",
    step
  );


  console.groupEnd();

}



// =============================================================================
// DÉMARRAGE FINAL
// =============================================================================
//
// ATTENTION :
// Il ne doit plus y avoir de startGame(); dans la partie 6.
//

startGameWithResume();



// =============================================================================
// FIN PARTIE 7
// =============================================================================