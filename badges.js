(function () {
  "use strict";

  const SEEN_BADGES_KEY =
    "etsi-seen-badges";

  const globalDefinitions = [
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
    return globalDefinitions.map(badge => ({
      ...badge,
      scope: "global",
      unlocked:
        badge.isUnlocked(history, mistakes)
    }));
  }

  function evaluateSeries(history = []) {
    const series = new Map();

    history.forEach(result => {
      const seriesId =
        typeof result.seriesId === "string"
          ? result.seriesId
          : "serie-generale-1";

      if (!series.has(seriesId)) {
        series.set(seriesId, {
          id: seriesId,
          title:
            typeof result.seriesTitle === "string"
              ? result.seriesTitle
              : "Série"
        });
      }
    });

    return [...series.values()].map(item => {
      const shortTitle = item.title.replace(
        /^Série\s*\d*\s*[—–-]?\s*/i,
        ""
      ) || item.title;

      return {
        id: `series-perfect-${item.id}`,
        name: `Maîtrise : ${shortTitle}`,
        icon: "🏁",
        description: "Obtenir 10/10 dans cette série",
        scope: "series",
        seriesId: item.id,
        unlocked: history.some(
          result =>
            result.seriesId === item.id &&
            result.score === 10 &&
            result.total === 10
        )
      };
    });
  }

  function evaluateAll(history = [], mistakes = []) {
    return [
      ...evaluate(history, mistakes),
      ...evaluateSeries(history)
    ];
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

    return evaluateAll(history, mistakes).filter(
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
    evaluateSeries,
    evaluateAll,
    getNewlyUnlocked,
    markAsSeen
  };
})();
