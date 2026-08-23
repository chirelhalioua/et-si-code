// =============================================================
// ET SI ? — SCRIPT.JS
// PAGE JEU — VERSION CORRIGÉE PNG
// =============================================================



// =============================================================
// 1. CONFIGURATION
// =============================================================

const CONFIG = {

  situationsFile:
    "./situations.json",

  defaultPlayerName:
    "Conducteur",

  defaultAvatar:
    "girl",

  defaultTheme:
    "dark"

};



// =============================================================
// 2. LOCAL STORAGE
// =============================================================

const STORAGE_KEYS = {

  playerName:
    "etsi-player-name",

  avatar:
    "etsi-avatar",

  theme:
    "etsi-theme",

  gameProgress:
    "etsi-game-progress"

};



// =============================================================
// 3. ÉLÉMENTS HTML
// =============================================================

const text =
  document.getElementById(
    "text"
  );


const choices =
  document.getElementById(
    "choices"
  );


const actionButton =
  document.getElementById(
    "next"
  );


const sceneImage =
  document.getElementById(
    "scene-image"
  );



/*
 * IMPORTANT :
 *
 * Ton ancien script cherchait :
 *
 * #lesson-chip
 *
 * mais ton nouveau jeu.html utilise :
 *
 * #category-chip
 *
 * On garde les deux pour que ça reste compatible.
 */

const categoryChip =
  document.getElementById(
    "category-chip"
  )

  ||

  document.getElementById(
    "lesson-chip"
  );



const counter =
  document.getElementById(
    "situation-counter"
  );


const stepLabel =
  document.getElementById(
    "game-step-label"
  );


const progressSteps =
  [
    ...document.querySelectorAll(
      ".progress-step"
    )
  ];


const themeButton =
  document.getElementById(
    "theme-toggle"
  );


const audioButton =
  document.querySelector(
    ".audio-button"
  )

  ||

  document.querySelector(
    ".audio-btn"
  );


const girlAvatar =
  document.getElementById(
    "game-avatar-girl"
  );


const boyAvatar =
  document.getElementById(
    "game-avatar-boy"
  );



// =============================================================
// 4. MODALE QUITTER
// =============================================================

const exitButton =
  document.getElementById(
    "exit-game"
  );


const exitModal =
  document.getElementById(
    "exit-confirm-modal"
  );


const exitNoButton =
  document.getElementById(
    "exit-no"
  );


const exitYesButton =
  document.getElementById(
    "exit-yes"
  );


const exitBackdrop =
  exitModal
    ?.querySelector(
      "[data-exit-close]"
    );

// =============================================================
// MODALE REPRENDRE LA SITUATION
// =============================================================

const resumeModal =
  document.getElementById(
    "resume-modal"
  );

const resumePlayerName =
  document.getElementById(
    "resume-player-name"
  );

const resumeScenarioTitle =
  document.getElementById(
    "resume-scenario-title"
  );

const resumeStep =
  document.getElementById(
    "resume-step"
  );

const resumeTotal =
  document.getElementById(
    "resume-total"
  );

const resumeContinueButton =
  document.getElementById(
    "resume-continue"
  );

const resumeNewButton =
  document.getElementById(
    "resume-new"
  );

// =============================================================
// 5. ÉTAT DU JEU
// =============================================================

let situations =
  [];


let currentSituation =
  null;


let currentSituationIndex =
  -1;


let lastSituationIndex =
  -1;


let currentStep =
  0;


let selectedOption =
  null;


let selectedButton =
  null;


let correctionDisplayed =
  false;


let audioEnabled =
  true;



// =============================================================
// 6. UTILITAIRE LOCAL STORAGE
// =============================================================

function readStorage(
  key,
  fallback = null
) {

  try {

    const value =
      localStorage.getItem(
        key
      );


    return value !== null
      ? value
      : fallback;

  }

  catch (error) {

    console.warn(
      "LocalStorage indisponible :",
      error
    );


    return fallback;

  }

}



// =============================================================
// 7. PRÉNOM DU JOUEUR
// =============================================================

function getPlayerName() {

  const name =
    readStorage(
      STORAGE_KEYS.playerName,
      ""
    );


  if (
    typeof name === "string" &&
    name.trim().length >= 2
  ) {

    return name
      .trim()
      .slice(
        0,
        20
      );

  }


  return CONFIG.defaultPlayerName;

}



// =============================================================
// 8. AVATAR
// =============================================================

function getAvatar() {

  const avatar =
    readStorage(
      STORAGE_KEYS.avatar,
      CONFIG.defaultAvatar
    );


  return avatar === "boy"
    ? "boy"
    : "girl";

}



// =============================================================
// 9. AFFICHER LE JOUEUR
// =============================================================

function renderPlayer() {

  const playerName =
    getPlayerName();


  document
    .querySelectorAll(
      `
        [data-player-name],
        #player-name-display,
        .player-name
      `
    )
    .forEach(
      element => {

        element.textContent =
          playerName;

      }
    );


  const avatar =
    getAvatar();


  if (girlAvatar) {

    girlAvatar.style.display =
      avatar === "girl"
        ? "grid"
        : "none";

  }


  if (boyAvatar) {

    boyAvatar.style.display =
      avatar === "boy"
        ? "grid"
        : "none";

  }

}



// =============================================================
// 10. RÉCUPÉRER LE THÈME
// =============================================================

function getTheme() {

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


  /*
   * Si aucun thème n'est enregistré,
   * on regarde le thème du système.
   */

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



// =============================================================
// 11. APPLIQUER LE THÈME
// =============================================================

function applyTheme(
  theme,
  save = true
) {

  const safeTheme =
    theme === "light"
      ? "light"
      : "dark";


  document
    .documentElement
    .setAttribute(
      "data-theme",
      safeTheme
    );


  if (!save) {

    return;

  }


  try {

    localStorage.setItem(
      STORAGE_KEYS.theme,
      safeTheme
    );

  }

  catch (error) {

    console.warn(
      "Impossible de sauvegarder le thème.",
      error
    );

  }

}



// =============================================================
// 12. CHANGER LE THÈME
// =============================================================

function toggleTheme() {

  const currentTheme =
    document
      .documentElement
      .getAttribute(
        "data-theme"
      );


  const newTheme =
    currentTheme === "light"
      ? "dark"
      : "light";


  applyTheme(
    newTheme
  );

}



// =============================================================
// 13. AUDIO
// =============================================================

function speak(
  message
) {

  if (
    !audioEnabled ||
    !message ||
    !(
      "speechSynthesis"
      in window
    )
  ) {

    return;

  }


  window
    .speechSynthesis
    .cancel();


  const utterance =
    new SpeechSynthesisUtterance(
      message
    );


  utterance.lang =
    "fr-FR";


  utterance.rate =
    0.95;


  const voices =
    window
      .speechSynthesis
      .getVoices();


  const frenchVoice =

    voices.find(
      voice =>
        voice.lang
          ?.toLowerCase()
          .startsWith(
            "fr-fr"
          )
    )

    ||

    voices.find(
      voice =>
        voice.lang
          ?.toLowerCase()
          .startsWith(
            "fr"
          )
    );


  if (frenchVoice) {

    utterance.voice =
      frenchVoice;

  }


  window
    .speechSynthesis
    .speak(
      utterance
    );

}



// =============================================================
// 14. ACTIVER / DÉSACTIVER L'AUDIO
// =============================================================

function toggleAudio() {

  audioEnabled =
    !audioEnabled;


  if (!audioButton) {

    return;

  }


  audioButton
    .classList
    .toggle(
      "disabled",
      !audioEnabled
    );


  audioButton
    .setAttribute(
      "aria-pressed",
      String(
        audioEnabled
      )
    );


  /*
   * AUDIO ACTIVÉ
   */

  if (audioEnabled) {

    audioButton.innerHTML = `

      <span
        class="audio-icon"
        aria-hidden="true"
      >
        ●
      </span>

      Audio

    `;


    if (
      text &&
      text.textContent
    ) {

      speak(
        text.textContent
      );

    }

  }


  /*
   * AUDIO COUPÉ
   */

  else {

    audioButton.innerHTML = `

      <span
        class="audio-icon"
        aria-hidden="true"
      >
        ○
      </span>

      Audio coupé

    `;


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



// =============================================================
// 15. CHARGER situations.json
// =============================================================

async function loadSituations() {

  console.log(
    "🚗 Chargement de situations.json..."
  );


  const response =
    await fetch(
      CONFIG.situationsFile,
      {
        cache:
          "no-store"
      }
    );


  if (!response.ok) {

    throw new Error(
      `Impossible de charger situations.json — HTTP ${response.status}`
    );

  }


  const data =
    await response.json();


  if (
    !Array.isArray(
      data
    )
  ) {

    throw new Error(
      "situations.json doit contenir un tableau."
    );

  }


  if (
    data.length === 0
  ) {

    throw new Error(
      "situations.json est vide."
    );

  }


  situations =
    data;


  console.log(
    `✅ ${situations.length} situations chargées.`
  );

}



// =============================================================
// 16. CHOISIR UNE SITUATION ALÉATOIRE
// =============================================================

function getRandomSituationIndex() {

  if (
    situations.length <= 1
  ) {

    return 0;

  }


  let index;


  do {

    index =
      Math.floor(
        Math.random() *
        situations.length
      );

  }

  while (
    index ===
    lastSituationIndex
  );


  lastSituationIndex =
    index;


  return index;

}



// =============================================================
// 17. NORMALISER LE CHEMIN D'UNE IMAGE
// =============================================================

function normalizeImagePath(
  source
) {

  if (!source) {

    return "";

  }


  let path =
    String(
      source
    )
      .trim();


  /*
   * Windows peut parfois donner :
   *
   * assets\scenes\image.png
   *
   * alors que le navigateur attend :
   *
   * assets/scenes/image.png
   */

  path =
    path.replace(
      /\\/g,
      "/"
    );


  /*
   * ANCIENNES IMAGES WEBP
   * ---------------------
   *
   * Toutes tes nouvelles images
   * sont maintenant en PNG.
   */

  path =
    path.replace(
      /\.webp(\?.*)?$/i,
      ".png$1"
    );


  /*
   * Supprimer un "./" devant.
   */

  path =
    path.replace(
      /^\.\//,
      ""
    );


  /*
   * Si le JSON contient simplement :
   *
   * situation_01_initial.png
   *
   * alors on ajoute automatiquement :
   *
   * assets/scenes/
   */

  if (
    !path.includes("/") &&
    !path.startsWith(
      "http://"
    ) &&
    !path.startsWith(
      "https://"
    ) &&
    !path.startsWith(
      "data:"
    )
  ) {

    path =
      `assets/scenes/${path}`;

  }


  /*
   * Si le JSON contient :
   *
   * scenes/situation_01_initial.png
   */

  if (
    path.startsWith(
      "scenes/"
    )
  ) {

    path =
      `assets/${path}`;

  }


  /*
   * Évite le slash initial :
   *
   * /assets/scenes/...
   *
   * et utilise un chemin relatif.
   */

  if (
    path.startsWith(
      "/assets/"
    )
  ) {

    path =
      path.substring(
        1
      );

  }


  return path;

}



// =============================================================
// 18. RÉCUPÉRER L'IMAGE D'UNE SITUATION
// =============================================================

function getSituationImage(
  visualState
) {

  if (!currentSituation) {

    return "";

  }


  const key =
    visualState === "change"
      ? "change"
      : "initial";


  /*
   * FORMAT ATTENDU :
   *
   * visual:
   * {
   *   initial:
   *   {
   *     image:
   *       "assets/scenes/situation_01_initial.png"
   *   },
   *
   *   change:
   *   {
   *     image:
   *       "assets/scenes/situation_01_change.png"
   *   }
   * }
   */

  let source =
    currentSituation
      ?.visual
      ?.[key]
      ?.image;


  /*
   * Compatibilité supplémentaire :
   *
   * si jamais une situation utilise :
   *
   * image_initial
   * image_change
   */

  if (!source) {

    source =
      key === "change"

        ? currentSituation
            ?.image_change

        : currentSituation
            ?.image_initial;

  }


  return normalizeImagePath(
    source
  );

}



// =============================================================
// 19. AFFICHER L'IMAGE
// =============================================================

function updateImage(
  visualState
) {

  if (
    !currentSituation ||
    !sceneImage
  ) {

    return;

  }


  const key =
    visualState === "change"
      ? "change"
      : "initial";


  const source =
    getSituationImage(
      key
    );


  /*
   * AUCUNE IMAGE
   */

  if (!source) {

    console.error(
      "❌ Image manquante :",
      {
        situation:
          currentSituation.title,

        état:
          key,

        visual:
          currentSituation.visual
      }
    );


    return;

  }


  console.log(
    "🖼 Tentative de chargement :",
    source
  );


  /*
   * Petite transition.
   */

  sceneImage
    .classList
    .add(
      "image-loading"
    );


  /*
   * PRÉCHARGEMENT
   */

  const image =
    new Image();


  image.onload =
    () => {

      sceneImage.src =
        source;


      sceneImage.alt =
        `${
          currentSituation.title ||
          "Situation de conduite"
        } — ${
          key === "change"
            ? "ET SI"
            : "initial"
        }`;


      sceneImage
        .classList
        .remove(
          "image-loading"
        );


      console.log(
        "✅ Image affichée :",
        source
      );

    };


  image.onerror =
    () => {

      sceneImage
        .classList
        .remove(
          "image-loading"
        );


      console.error(
        "❌ IMAGE INTROUVABLE :",
        source
      );


      console.error(
        "Vérifie que le fichier existe réellement ici :",
        source
      );

    };


  image.src =
    source;

}



// =============================================================
// 20. AFFICHER LE THÈME DE LA SITUATION
// =============================================================

function updateCategory() {

  if (!categoryChip) {

    return;

  }


  const category =

    currentSituation
      ?.category

    ||

    currentSituation
      ?.course_title

    ||

    currentSituation
      ?.notion

    ||

    "Situation interactive";


  categoryChip.textContent =
    category;


  categoryChip.title =
    category;

}



// =============================================================
// 21. PROGRESSION
// =============================================================

function updateProgress() {

  const totalSteps =

    Array.isArray(
      currentSituation
        ?.scenes
    )

      ? currentSituation
          .scenes
          .length

      : 3;


  const visibleStep =
    currentStep + 1;


  /*
   * TEXTE :
   *
   * Étape 1 sur 3
   */

  if (stepLabel) {

    stepLabel.textContent =
      `Étape ${visibleStep} sur ${totalSteps}`;

  }


  /*
   * PETITES BARRES
   */

  progressSteps.forEach(
    (
      item,
      index
    ) => {

      item
        .classList
        .remove(
          "active",
          "completed"
        );


      if (
        index === currentStep
      ) {

        item
          .classList
          .add(
            "active"
          );

      }


      else if (
        index < currentStep
      ) {

        item
          .classList
          .add(
            "completed"
          );

      }

    }
  );

}

// =============================================================
// SAUVEGARDE DE LA PARTIE
// =============================================================

function saveGameProgress() {

  if (
    !currentSituation ||
    currentSituationIndex < 0
  ) {
    return;
  }


  const progress = {

    situationIndex:
      currentSituationIndex,

    step:
      currentStep,

    playerName:
      getPlayerName(),

    savedAt:
      Date.now()

  };


  try {

    localStorage.setItem(
      STORAGE_KEYS.gameProgress,
      JSON.stringify(progress)
    );

    console.log(
      "💾 Progression sauvegardée :",
      progress
    );

  }

  catch (error) {

    console.error(
      "Impossible de sauvegarder la partie :",
      error
    );

  }

}



// =============================================================
// RÉCUPÉRER UNE PARTIE SAUVEGARDÉE
// =============================================================

function getSavedGameProgress() {

  try {

    const raw =
      localStorage.getItem(
        STORAGE_KEYS.gameProgress
      );


    if (!raw) {
      return null;
    }


    const saved =
      JSON.parse(raw);


    if (
      typeof saved.situationIndex !== "number" ||
      typeof saved.step !== "number"
    ) {
      return null;
    }


    if (
      saved.situationIndex < 0 ||
      saved.situationIndex >= situations.length
    ) {
      return null;
    }


    return saved;

  }

  catch (error) {

    console.error(
      "Sauvegarde invalide :",
      error
    );

    return null;

  }

}



// =============================================================
// SUPPRIMER LA SAUVEGARDE
// =============================================================

function clearGameProgress() {

  try {

    localStorage.removeItem(
      STORAGE_KEYS.gameProgress
    );

  }

  catch (error) {

    console.error(
      "Impossible de supprimer la sauvegarde.",
      error
    );

  }

}



// =============================================================
// OUVRIR LA MODALE DE REPRISE
// =============================================================

function openResumeModal(
  saved
) {

  return new Promise(
    resolve => {

      if (
        !resumeModal ||
        !resumeContinueButton ||
        !resumeNewButton
      ) {

        resolve(false);
        return;

      }


      const savedSituation =
        situations[
          saved.situationIndex
        ];


      if (resumePlayerName) {

        resumePlayerName.textContent =
          getPlayerName();

      }


      if (resumeScenarioTitle) {

        resumeScenarioTitle.textContent =
          savedSituation?.title ||
          "Situation en cours";

      }


      if (resumeStep) {

        resumeStep.textContent =
          saved.step + 1;

      }


      if (resumeTotal) {

        resumeTotal.textContent =
          savedSituation?.scenes?.length ||
          3;

      }


      resumeModal.classList.add(
        "open"
      );

      resumeModal.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "modal-open"
      );


      function closeResumeModal() {

        resumeModal.classList.remove(
          "open"
        );

        resumeModal.setAttribute(
          "aria-hidden",
          "true"
        );

        document.body.classList.remove(
          "modal-open"
        );

      }


      resumeContinueButton.onclick =
        () => {

          closeResumeModal();

          resolve(true);

        };


      resumeNewButton.onclick =
        () => {

          closeResumeModal();

          resolve(false);

        };

    }
  );

}



// =============================================================
// RESTAURER LA PARTIE
// =============================================================

function restoreGameProgress(
  saved
) {

  currentSituationIndex =
    saved.situationIndex;


  currentSituation =
    situations[
      currentSituationIndex
    ];


  const maxStep =
    Math.max(
      0,
      (
        currentSituation?.scenes?.length ||
        1
      ) - 1
    );


  currentStep =
    Math.min(
      saved.step,
      maxStep
    );


  lastSituationIndex =
    currentSituationIndex;


  selectedOption =
    null;


  selectedButton =
    null;


  correctionDisplayed =
    false;


  updateCategory();

  renderStep();


  console.log(
    "▶️ Partie reprise :",
    currentSituation.title,
    "étape",
    currentStep + 1
  );

}



// =============================================================
// DÉMARRER AVEC OU SANS REPRISE
// =============================================================

async function startGameWithResume() {

  const saved =
    getSavedGameProgress();


  if (!saved) {

    startNewSituation();

    return;

  }


  const wantsResume =
    await openResumeModal(
      saved
    );


  /*
   * REPRENDRE
   */

  if (wantsResume) {

    restoreGameProgress(
      saved
    );

    return;

  }


  /*
   * NOUVELLE SITUATION
   */

  clearGameProgress();

  startNewSituation();

}

// =============================================================
// 22. DÉMARRER UNE NOUVELLE SITUATION
// =============================================================

function startNewSituation() {

  if (
    situations.length === 0
  ) {

    console.error(
      "Aucune situation disponible."
    );


    return;

  }


  currentSituationIndex =
    getRandomSituationIndex();


  currentSituation =
    situations[
      currentSituationIndex
    ];


  currentStep =
    0;


  correctionDisplayed =
    false;


  selectedOption =
    null;


  selectedButton =
    null;


  console.group(
    "🚗 Nouvelle situation"
  );


  console.log(
    "Index :",
    currentSituationIndex
  );


  console.log(
    "Titre :",
    currentSituation.title
  );


  console.log(
    "Catégorie :",
    currentSituation.category
  );


  console.log(
    "Visuel :",
    currentSituation.visual
  );


  console.groupEnd();


  /*
   * COMPTEUR
   */

  if (counter) {

    counter.textContent =
      `Situation ${
        currentSituationIndex + 1
      } / ${
        situations.length
      }`;

  }


  updateCategory();


  renderStep();

}



// =============================================================
// 23. AFFICHER UNE ÉTAPE
// =============================================================

function renderStep() {

  if (!currentSituation) {

    return;

  }


  const allScenes =
    currentSituation
      ?.scenes;


  if (
    !Array.isArray(
      allScenes
    ) ||
    allScenes.length === 0
  ) {

    console.error(
      "❌ Aucune scène dans :",
      currentSituation
    );


    if (text) {

      text.textContent =
        "Cette situation ne contient aucune étape.";

    }


    return;

  }


  /*
   * Si on dépasse la dernière étape,
   * on démarre une nouvelle situation.
   */

  if (
    currentStep >=
    allScenes.length
  ) {

    startNewSituation();


    return;

  }


  const scene =
    allScenes[
      currentStep
    ];


  console.log(
    `Étape ${currentStep + 1} :`,
    scene
  );


  /*
   * PROGRESSION
   */

  updateProgress();


  /*
   * CATÉGORIE
   */

  updateCategory();


  /*
   * IMAGE
   */

  let visualState =
    scene.visual_state;


  /*
   * Si visual_state n'existe pas,
   * on déduit automatiquement :
   *
   * étape 1 = initial
   * étapes suivantes = change
   */

  if (
    visualState !== "initial" &&
    visualState !== "change"
  ) {

    visualState =
      currentStep === 0
        ? "initial"
        : "change";

  }


  updateImage(
    visualState
  );

  saveGameProgress();

  /*
   * TEXTE
   */

  if (text) {

    text.textContent =
      scene.text ||
      "";

  }


  /*
   * AUDIO
   */

  if (
    audioEnabled &&
    scene.text
  ) {

    speak(
      scene.text
    );

  }


  /*
   * NETTOYAGE CHOIX
   */

  if (choices) {

    choices.innerHTML =
      "";

  }


  selectedOption =
    null;


  selectedButton =
    null;


  correctionDisplayed =
    false;


  /*
   * QUESTION AVEC CHOIX
   */

  if (
    scene.type === "choice"
  ) {

    const sceneOptions =

      Array.isArray(
        scene.options
      )

        ? scene.options

        : [];


    sceneOptions.forEach(
      (
        option,
        index
      ) => {

        createChoice(
          option,
          index
        );

      }
    );


    setActionButton(
      "Valider ma réponse",
      "validate"
    );


    if (actionButton) {

      actionButton.disabled =
        true;

    }


    return;

  }


  /*
   * ÉTAPE DE NARRATION
   */

  setActionButton(
    "Continuer",
    "continue"
  );


  if (actionButton) {

    actionButton.disabled =
      false;

  }

}



// =============================================================
// 24. CRÉER UNE RÉPONSE
// =============================================================

function createChoice(
  option,
  index
) {

  if (!choices) {

    return;

  }


  const letters = [
    "A",
    "B",
    "C",
    "D"
  ];


  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";


  button.className =
    "choice";


  button.dataset.correct =
    String(
      option.correct === true
    );


  /*
   * LETTRE
   */

  const letter =
    document.createElement(
      "span"
    );


  letter.className =
    "choice-letter";


  letter.textContent =
    letters[index]

    ||

    String(
      index + 1
    );


  /*
   * TEXTE
   */

  const label =
    document.createElement(
      "span"
    );


  label.className =
    "choice-label";


  label.textContent =

    option.label

    ||

    option.text

    ||

    `Réponse ${index + 1}`;


  button.append(
    letter,
    label
  );


  /*
   * CLIC
   */

  button.addEventListener(
    "click",
    () => {

      /*
       * La réponse a déjà été corrigée.
       */

      if (
        correctionDisplayed
      ) {

        return;

      }


      /*
       * Retire l'ancienne sélection.
       */

      document
        .querySelectorAll(
          ".choice"
        )
        .forEach(
          item => {

            item
              .classList
              .remove(
                "selected"
              );

          }
        );


      /*
       * Nouvelle sélection.
       */

      button
        .classList
        .add(
          "selected"
        );


      selectedOption =
        option;


      selectedButton =
        button;


      if (actionButton) {

        actionButton.disabled =
          false;

      }

    }
  );


  choices.appendChild(
    button
  );

}



// =============================================================
// 25. TEXTE DU BOUTON PRINCIPAL
// =============================================================

function setActionButton(
  label,
  mode
) {

  if (!actionButton) {

    return;

  }


  actionButton.dataset.mode =
    mode;


  /*
   * Ton ancien script cherchait uniquement :
   *
   * .main-action-label
   *
   * alors que ton HTML peut simplement avoir :
   *
   * <span>Continuer</span>
   */

  const labelNode =

    actionButton
      .querySelector(
        ".main-action-label"
      )

    ||

    actionButton
      .querySelector(
        "span:first-child"
      );


  if (labelNode) {

    labelNode.textContent =
      label;

  }


  /*
   * Si aucun span n'existe.
   */

  else {

    actionButton.textContent =
      label;

  }

}



// =============================================================
// 26. TEXTE DE CORRECTION
// =============================================================

function getCorrectionText(
  option
) {

  const correct =
    option.correct === true;


  let response =
    String(

      option.response

      ||

      option.explanation

      ||

      ""

    )
      .trim();


  /*
   * Si le texte contient déjà :
   *
   * Bonne réponse.
   * ou
   * Mauvaise réponse.
   *
   * on évite de le répéter.
   */

  if (

    /^bonne réponse[.!:\s]/i
      .test(
        response
      )

    ||

    /^mauvaise réponse[.!:\s]/i
      .test(
        response
      )

  ) {

    return response;

  }


  const prefix =

    correct

      ? "Bonne réponse."

      : "Mauvaise réponse.";


  return response

    ? `${prefix} ${response}`

    : prefix;

}



// =============================================================
// 27. VALIDER UNE RÉPONSE
// =============================================================

function validateAnswer() {

  if (
    !selectedOption ||
    !selectedButton
  ) {

    return;

  }


  correctionDisplayed =
    true;


  const allButtons =
    document.querySelectorAll(
      ".choice"
    );


  /*
   * Désactiver les réponses.
   */

  allButtons.forEach(
    button => {

      button.disabled =
        true;


      button
        .classList
        .remove(
          "selected"
        );

    }
  );


  /*
   * BONNE RÉPONSE
   */

  if (
    selectedOption.correct === true
  ) {

    selectedButton
      .classList
      .add(
        "correct"
      );

  }


  /*
   * MAUVAISE RÉPONSE
   */

  else {

    selectedButton
      .classList
      .add(
        "incorrect"
      );


    /*
     * Montrer également
     * quelle était la bonne réponse.
     */

    allButtons.forEach(
      button => {

        if (
          button.dataset.correct ===
          "true"
        ) {

          button
            .classList
            .add(
              "correct"
            );

        }

      }
    );

  }


  /*
   * EXPLICATION
   */

  const correction =
    getCorrectionText(
      selectedOption
    );


  if (text) {

    text.textContent =
      correction;

  }


  /*
   * AUDIO CORRECTION
   */

  if (audioEnabled) {

    speak(
      correction
    );

  }


  /*
   * NOUVELLE SITUATION
   */

  setActionButton(
    "Nouvelle situation",
    "new"
  );


  if (actionButton) {

    actionButton.disabled =
      false;

  }

}



// =============================================================
// 28. CLIC BOUTON PRINCIPAL
// =============================================================

function handleMainAction() {

  if (!actionButton) {

    return;

  }


  const mode =
    actionButton.dataset.mode;


  /*
   * CONTINUER
   */

  if (
    mode === "continue"
  ) {

    currentStep++;


    renderStep();


    return;

  }


  /*
   * VALIDER
   */

  if (
    mode === "validate"
  ) {

    validateAnswer();


    return;

  }


  /*
   * NOUVELLE SITUATION
   */

  if (
    mode === "new"
  ) {

    startNewSituation();

  }

}



// =============================================================
// 29. OUVRIR LA FENÊTRE QUITTER
// =============================================================

function openExitModal() {

  /*
   * Si la modale n'existe pas
   * dans le HTML, on utilise confirm().
   */

  if (!exitModal) {

    const leave =
      window.confirm(
        "Quitter le jeu ?"
      );


    if (leave) {

      window.location.href =
        "https://et-si-code-one.vercel.app/";

    }


    return;

  }


  exitModal
    .classList
    .add(
      "open"
    );


  exitModal
    .setAttribute(
      "aria-hidden",
      "false"
    );


  document
    .body
    .classList
    .add(
      "modal-open"
    );


  exitNoButton
    ?.focus();

}



// =============================================================
// 30. FERMER LA FENÊTRE QUITTER
// =============================================================

function closeExitModal() {

  if (!exitModal) {

    return;

  }


  exitModal
    .classList
    .remove(
      "open"
    );


  exitModal
    .setAttribute(
      "aria-hidden",
      "true"
    );


  document
    .body
    .classList
    .remove(
      "modal-open"
    );


  exitButton
    ?.focus();

}



// =============================================================
// 31. CONFIRMER QUITTER
// =============================================================

function confirmExit() {

  /*
   * Couper l'audio.
   */

  saveGameProgress();

  if (
    "speechSynthesis"
    in window
  ) {

    window
      .speechSynthesis
      .cancel();

  }


  /*
   * Retour page accueil.
   */

  window.location.href =
    "https://et-si-code-one.vercel.app/";

}



// =============================================================
// 32. BOUTON THÈME
// =============================================================

themeButton
  ?.addEventListener(
    "click",
    toggleTheme
  );



// =============================================================
// 33. BOUTON AUDIO
// =============================================================

audioButton
  ?.addEventListener(
    "click",
    toggleAudio
  );



// =============================================================
// 34. BOUTON PRINCIPAL
// =============================================================

actionButton
  ?.addEventListener(
    "click",
    handleMainAction
  );



// =============================================================
// 35. BOUTON QUITTER
// =============================================================

exitButton
  ?.addEventListener(
    "click",
    event => {

      event.preventDefault();


      openExitModal();

    }
  );



// =============================================================
// 36. QUITTER — NON
// =============================================================

exitNoButton
  ?.addEventListener(
    "click",
    closeExitModal
  );



// =============================================================
// 37. QUITTER — OUI
// =============================================================

exitYesButton
  ?.addEventListener(
    "click",
    confirmExit
  );



// =============================================================
// 38. CLIQUER SUR LE FOND DE LA MODALE
// =============================================================

exitBackdrop
  ?.addEventListener(
    "click",
    closeExitModal
  );



// =============================================================
// 39. TOUCHE ÉCHAP
// =============================================================

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      exitModal
        ?.classList
        .contains(
          "open"
        )
    ) {

      closeExitModal();

    }

  }
);



// =============================================================
// 40. SYNCHRONISATION ENTRE ONGLETS
// =============================================================

window.addEventListener(
  "storage",
  event => {

    /*
     * THÈME
     */

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


    /*
     * PRÉNOM
     */

    if (
      event.key ===
      STORAGE_KEYS.playerName
    ) {

      renderPlayer();

    }


    /*
     * AVATAR
     */

    if (
      event.key ===
      STORAGE_KEYS.avatar
    ) {

      renderPlayer();

    }

  }
);



// =============================================================
// 41. DEBUG ERREUR IMAGE
// =============================================================

sceneImage
  ?.addEventListener(
    "error",
    () => {

      console.error(
        "❌ Le navigateur n'a pas trouvé cette image :",
        sceneImage.src
      );

    }
  );



// =============================================================
// 42. CHARGEMENT IMAGE RÉUSSI
// =============================================================

sceneImage
  ?.addEventListener(
    "load",
    () => {

      console.log(
        "✅ Image visible dans la scène :",
        sceneImage.src
      );

    }
  );



// =============================================================
// 43. ARRÊTER L'AUDIO EN QUITTANT
// =============================================================

window.addEventListener(
  "beforeunload",
  () => {

    saveGameProgress();


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



// =============================================================
// 44. INITIALISATION
// =============================================================

async function init() {

  try {

    console.log(
      "🚗 Démarrage de ET SI ?"
    );


    applyTheme(
      getTheme()
    );


    renderPlayer();


    if (text) {

      text.textContent =
        `Prépare-toi ${
          getPlayerName()
        }, chargement...`;

    }


    await loadSituations();


    /*
     * IMPORTANT :
     * vérifie d'abord s'il existe
     * une situation commencée.
     */

    await startGameWithResume();

  }


  catch (
    error
  ) {

    console.error(
      "❌ Erreur ET SI ? :",
      error
    );


    if (text) {

      text.textContent =
        "Impossible de charger les situations. Vérifie situations.json et les chemins des images PNG.";

    }


    if (actionButton) {

      actionButton.disabled =
        true;

    }

  }

}


// =============================================================
// 45. LANCEMENT
// =============================================================

init();



// =============================================================
// FIN SCRIPT.JS
// =============================================================
