(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", event => {
    if (reduceMotion || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname && destination.hash) return;

    event.preventDefault();
    document.body.classList.add("is-page-leaving");
    window.setTimeout(() => {
      window.location.href = destination.href;
    }, 150);
  });

  function setupNavIndicators() {
    document
      .querySelectorAll(".main-nav, .series-nav, .progress-nav, .game-nav")
      .forEach(nav => {
        const active = nav.querySelector("a.is-active");
        if (!active || nav.querySelector(".nav-active-indicator")) return;

        const indicator = document.createElement("span");
        indicator.className = "nav-active-indicator";
        indicator.setAttribute("aria-hidden", "true");
        nav.appendChild(indicator);

        const positionIndicator = () => {
          indicator.style.width = `${active.offsetWidth}px`;
          indicator.style.height = `${active.offsetHeight}px`;
          indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
        };

        requestAnimationFrame(() => {
          positionIndicator();
          nav.classList.add("has-active-indicator");
        });

        window.addEventListener("resize", positionIndicator, { passive: true });
      });
  }

  const revealSelector = [
    ".feature-card",
    ".how-card",
    ".series-choice",
    ".contact-card",
    ".account-panel",
    ".global-summary > article",
    ".badges-section",
    ".badge-card",
    ".series-card",
    ".mistake-card",
    ".home-contact"
  ].join(",");

  let revealIndex = 0;
  const revealObserver = !reduceMotion && "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -30px" })
    : null;

  function registerRevealItems(root = document) {
    const items = [];
    if (root instanceof Element && root.matches(revealSelector)) items.push(root);
    root.querySelectorAll?.(revealSelector).forEach(item => items.push(item));

    items.forEach(item => {
      if (item.dataset.uiRevealReady === "true") return;
      item.dataset.uiRevealReady = "true";
      item.style.setProperty("--reveal-order", String(revealIndex % 6));
      revealIndex += 1;

      if (revealObserver) {
        item.classList.add("ui-reveal-item");
        revealObserver.observe(item);
      }
      else {
        item.classList.add("is-revealed");
      }
    });
  }

  let celebrated = false;

  function celebratePerfectScore(root = document) {
    if (reduceMotion || celebrated) return;

    const perfectRing = root.querySelector?.(
      '.session-result-ring[style*="100"]'
    );

    if (!perfectRing) return;
    celebrated = true;

    const layer = document.createElement("div");
    layer.className = "ui-confetti-layer";
    layer.setAttribute("aria-hidden", "true");
    const colors = ["#f4cf2c", "#20b9b1", "#42cf7c", "#ffffff"];

    for (let index = 0; index < 22; index += 1) {
      const piece = document.createElement("i");
      piece.className = "ui-confetti";
      piece.style.setProperty("--confetti-left", `${4 + Math.random() * 92}%`);
      piece.style.setProperty("--confetti-color", colors[index % colors.length]);
      piece.style.setProperty("--confetti-duration", `${1.7 + Math.random() * 1.1}s`);
      piece.style.setProperty("--confetti-delay", `${Math.random() * 0.35}s`);
      piece.style.setProperty("--confetti-drift", `${-70 + Math.random() * 140}px`);
      layer.appendChild(piece);
    }

    document.body.appendChild(layer);
    window.setTimeout(() => layer.remove(), 3300);
  }

  setupNavIndicators();
  registerRevealItems();
  celebratePerfectScore();

  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        registerRevealItems(node);
        celebratePerfectScore(node);
      });
    });
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
})();
