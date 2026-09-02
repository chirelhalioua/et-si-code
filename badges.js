(function () {
  "use strict";

  const SEEN_BADGES_KEY =
    "etsi-seen-badges";

  const definitions = [
    {
      id: "first-trip",
      name: "Premier trajet",
      icon: "🚗",
      description: "Terminer une première tentative",
      isUnlocked: history => history.length >= 1
    },
    {
      id: "good-driver",
      name: "Bon conducteur",
      icon: "⭐",
      description: "Obtenir au moins 8/10",
      isUnlocked: history =>
        history.some(result => result.percentage >= 80)
    },
    {
      id: "perfect-score",
      name: "Sans-faute",
      icon: "🏆",
      description: "Obtenir 10/10",
      isUnlocked: history =>
        history.some(
          result =>
            result.total > 0 &&
            result.score === result.total
        )
    },
    {
      id: "persistent",
      name: "Persévérant",
      icon: "🛣️",
      description: "Terminer 5 tentatives",
      isUnlocked: history => history.length >= 5
    },
    {
      id: "improving",
      name: "En progrès",
      icon: "📈",
      description: "Améliorer son meilleur score",
      isUnlocked: history => {
        let previousBest = -1;

        return history.some(result => {
          const improved =
            previousBest >= 0 &&
            result.percentage > previousBest;

          previousBest =
            Math.max(
              previousBest,
              result.percentage
            );

          return improved;
        });
      }
    },
    {
      id: "mistakes-cleared",
      name: "Erreurs corrigées",
      icon: "✅",
      description: "Corriger toutes ses erreurs",
      isUnlocked: (history, mistakes) =>
        history.some(result => result.score < result.total) &&
        mistakes.length === 0
    }
  ];

  function evaluate(history = [], mistakes = []) {
    return definitions.map(badge => ({
      ...badge,
      unlocked:
        badge.isUnlocked(history, mistakes)
    }));
  }

  function loadSeenBadges() {
    try {
      const seen = JSON.parse(
        localStorage.getItem(SEEN_BADGES_KEY) || "[]"
      );

      return Array.isArray(seen) ? seen : [];
    }
    catch (error) {
      return [];
    }
  }

  function getNewlyUnlocked(history, mistakes) {
    const seen = loadSeenBadges();

    return evaluate(history, mistakes).filter(
      badge =>
        badge.unlocked &&
        !seen.includes(badge.id)
    );
  }

  function markAsSeen(badges) {
    try {
      const seen = loadSeenBadges();

      localStorage.setItem(
        SEEN_BADGES_KEY,
        JSON.stringify(
          [...new Set([
            ...seen,
            ...badges.map(badge => badge.id)
          ])]
        )
      );
    }
    catch (error) {
      console.warn("Badges non mémorisés :", error);
    }
  }

  window.ETSIBadges = {
    evaluate,
    getNewlyUnlocked,
    markAsSeen
  };
})();
