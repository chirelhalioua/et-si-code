// =============================================================================
// ET SI ?
// LANDING PAGE
// =============================================================================


document.addEventListener(
  "DOMContentLoaded",
  () => {


    // =========================================================================
    // THEME
    // =========================================================================

    const themeToggle =
      document.getElementById(
        "theme-toggle"
      );


    function getSavedTheme() {

      try {

        const savedTheme =
          localStorage.getItem(
            "etsi-theme"
          );


        if (
          savedTheme === "light" ||
          savedTheme === "dark"
        ) {

          return savedTheme;

        }

      }

      catch (error) {

        console.warn(
          "Impossible de lire le thème.",
          error
        );

      }


      if (
        window.matchMedia &&
        window.matchMedia(
          "(prefers-color-scheme: light)"
        ).matches
      ) {

        return "light";

      }


      return "dark";

    }



    function applyTheme(
      theme
    ) {

      const safeTheme =
        theme === "light"
          ? "light"
          : "dark";


      document.documentElement.setAttribute(
        "data-theme",
        safeTheme
      );


      try {

        localStorage.setItem(
          "etsi-theme",
          safeTheme
        );

      }

      catch (error) {

        console.warn(
          "Impossible d'enregistrer le thème.",
          error
        );

      }

    }



    applyTheme(
      getSavedTheme()
    );



    if (themeToggle) {

      themeToggle.addEventListener(
        "click",
        () => {

          const current =
            document.documentElement.getAttribute(
              "data-theme"
            );


          applyTheme(
            current === "dark"
              ? "light"
              : "dark"
          );

        }
      );

    }



    // =========================================================================
    // ELEMENTS AVATAR PAGE
    // =========================================================================

    const avatarButtons =
      document.querySelectorAll(
        ".avatar-option"
      );


    const previewGirl =
      document.getElementById(
        "preview-avatar-girl"
      );


    const previewBoy =
      document.getElementById(
        "preview-avatar-boy"
      );



    function updatePreviewAvatar(
      avatar
    ) {

      if (previewGirl) {

        previewGirl.style.display =
          avatar === "girl"
            ? "block"
            : "none";

      }


      if (previewBoy) {

        previewBoy.style.display =
          avatar === "boy"
            ? "block"
            : "none";

      }


      avatarButtons.forEach(
        button => {

          button.classList.toggle(
            "selected",
            button.dataset.avatar === avatar
          );

        }
      );

    }



    let pageSelectedAvatar =
      "girl";


    try {

      const savedAvatar =
        localStorage.getItem(
          "etsi-avatar"
        );


      if (
        savedAvatar === "girl" ||
        savedAvatar === "boy"
      ) {

        pageSelectedAvatar =
          savedAvatar;

      }

    }

    catch (error) {

      pageSelectedAvatar =
        "girl";

    }


    updatePreviewAvatar(
      pageSelectedAvatar
    );



    avatarButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            pageSelectedAvatar =
              button.dataset.avatar;


            updatePreviewAvatar(
              pageSelectedAvatar
            );


            try {

              localStorage.setItem(
                "etsi-avatar",
                pageSelectedAvatar
              );

            }

            catch (error) {

              console.warn(
                "Impossible d'enregistrer l'avatar.",
                error
              );

            }

          }
        );

      }
    );



    // =========================================================================
    // PROFIL
    // =========================================================================

    const playButtons =
      document.querySelectorAll(
        ".js-play"
      );


    const profileModal =
      document.getElementById(
        "profile-modal"
      );


    const profileClose =
      document.getElementById(
        "profile-close"
      );


    const profileStart =
      document.getElementById(
        "profile-start"
      );


    const playerNameInput =
      document.getElementById(
        "player-name"
      );


    const profileError =
      document.getElementById(
        "profile-error"
      );


    const profileAvatarButtons =
      document.querySelectorAll(
        "[data-profile-avatar]"
      );


    let selectedProfileAvatar =
      pageSelectedAvatar;



    // =========================================================================
    // CHARGER PROFIL
    // =========================================================================

    try {

      const savedName =
        localStorage.getItem(
          "etsi-player-name"
        );


      const savedAvatar =
        localStorage.getItem(
          "etsi-avatar"
        );


      if (
        savedName &&
        playerNameInput
      ) {

        playerNameInput.value =
          savedName;

      }


      if (
        savedAvatar === "girl" ||
        savedAvatar === "boy"
      ) {

        selectedProfileAvatar =
          savedAvatar;

      }

    }

    catch (error) {

      console.warn(
        "Impossible de récupérer le profil.",
        error
      );

    }



    // =========================================================================
    // CHOIX AVATAR PROFIL
    // =========================================================================

    function updateProfileAvatar() {

      profileAvatarButtons.forEach(
        button => {

          button.classList.toggle(
            "selected",
            button.dataset.profileAvatar ===
              selectedProfileAvatar
          );

        }
      );

    }


    updateProfileAvatar();



    profileAvatarButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            selectedProfileAvatar =
              button.dataset.profileAvatar;


            updateProfileAvatar();

          }
        );

      }
    );



    // =========================================================================
    // OUVRIR MODALE
    // =========================================================================

    function openProfileModal() {

      if (!profileModal) {

        return;

      }


      selectedProfileAvatar =
        pageSelectedAvatar;


      updateProfileAvatar();


      profileModal.classList.add(
        "open"
      );


      profileModal.setAttribute(
        "aria-hidden",
        "false"
      );


      document.body.classList.add(
        "profile-open"
      );


      if (profileError) {

        profileError.textContent =
          "";

      }


      setTimeout(
        () => {

          if (playerNameInput) {

            playerNameInput.focus();

          }

        },
        150
      );

    }



    // =========================================================================
    // FERMER MODALE
    // =========================================================================

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
        "profile-open"
      );

    }



    // =========================================================================
    // BOUTONS JOUER
    // =========================================================================

    playButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          event => {

            event.preventDefault();

            openProfileModal();

          }
        );

      }
    );



    // =========================================================================
    // FERMETURE
    // =========================================================================

    if (profileClose) {

      profileClose.addEventListener(
        "click",
        closeProfileModal
      );

    }



    const profileBackdrop =
      profileModal
        ?.querySelector(
          ".profile-backdrop"
        );


    if (profileBackdrop) {

      profileBackdrop.addEventListener(
        "click",
        closeProfileModal
      );

    }



    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          profileModal?.classList.contains(
            "open"
          )
        ) {

          closeProfileModal();

        }

      }
    );



    // =========================================================================
    // LANCER JEU
    // =========================================================================

    if (profileStart) {

      profileStart.addEventListener(
        "click",
        () => {

          if (!playerNameInput) {

            return;

          }


          const playerName =
            playerNameInput.value
              .trim()
              .replace(
                /\s+/g,
                " "
              );


          if (
            playerName.length < 2
          ) {

            if (profileError) {

              profileError.textContent =
                "Entre ton prénom pour continuer.";

            }


            playerNameInput.focus();

            return;

          }


          if (profileError) {

            profileError.textContent =
              "";

          }


          try {

            localStorage.setItem(
              "etsi-player-name",
              playerName
            );


            localStorage.setItem(
              "etsi-avatar",
              selectedProfileAvatar
            );

          }

          catch (error) {

            console.warn(
              "Impossible d'enregistrer le profil.",
              error
            );

          }


          window.location.href =
            "jeu.html";

        }
      );

    }



    // =========================================================================
    // ENTREE DANS INPUT
    // =========================================================================

    if (playerNameInput) {

      playerNameInput.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter"
          ) {

            event.preventDefault();

            profileStart?.click();

          }

        }
      );

    }



    // =========================================================================
    // SCROLL SECTIONS
    // =========================================================================

    const sections =
      document.querySelectorAll(
        ".section"
      );


    if (
      "IntersectionObserver"
      in window
    ) {

      sections.forEach(
        section => {

          section.style.opacity =
            "0";

          section.style.transform =
            "translateY(18px)";

          section.style.transition =
            "opacity 0.65s ease, transform 0.65s ease";

        }
      );


      const observer =
        new IntersectionObserver(

          entries => {

            entries.forEach(
              entry => {

                if (
                  entry.isIntersecting
                ) {

                  entry.target.style.opacity =
                    "1";

                  entry.target.style.transform =
                    "translateY(0)";


                  observer.unobserve(
                    entry.target
                  );

                }

              }
            );

          },

          {

            threshold:
              0.06,

            rootMargin:
              "70px 0px -20px 0px"

          }

        );


      sections.forEach(
        section => {

          observer.observe(
            section
          );

        }
      );

    }



    // =========================================================================
    // HEADER SCROLL
    // =========================================================================

    const header =
      document.querySelector(
        ".site-header"
      );


    function updateHeader() {

      if (!header) {

        return;

      }


      header.classList.toggle(
        "scrolled",
        window.scrollY > 15
      );

    }


    updateHeader();


    window.addEventListener(
      "scroll",
      updateHeader,
      {
        passive: true
      }
    );



    // =========================================================================
    // PETIT PARALLAX HERO
    // =========================================================================

    const heroStage =
      document.querySelector(
        ".hero-stage"
      );


    if (heroStage) {

      window.addEventListener(
        "mousemove",
        event => {

          if (
            window.innerWidth <
            1050
          ) {

            heroStage.style.transform =
              "";

            return;

          }


          const x =
            (
              event.clientX /
              window.innerWidth
              -
              0.5
            );


          const y =
            (
              event.clientY /
              window.innerHeight
              -
              0.5
            );


          heroStage.style.transform =
            `translate(${x * 4}px, ${y * 4}px)`;

        }
      );


      document.addEventListener(
        "mouseleave",
        () => {

          heroStage.style.transform =
            "";

        }
      );

    }



    // =========================================================================
    // LIENS INTERNES
    // =========================================================================

    const internalLinks =
      document.querySelectorAll(
        'a[href^="#"]'
      );


    internalLinks.forEach(
      link => {

        link.addEventListener(
          "click",
          event => {

            const href =
              link.getAttribute(
                "href"
              );


            if (
              !href ||
              href === "#"
            ) {

              return;

            }


            const target =
              document.querySelector(
                href
              );


            if (!target) {

              return;

            }


            event.preventDefault();


            target.scrollIntoView(
              {

                behavior:
                  "smooth",

                block:
                  "start"

              }
            );

          }
        );

      }
    );


    console.log(
      "ET SI ? — Landing page prête."
    );

  }
);