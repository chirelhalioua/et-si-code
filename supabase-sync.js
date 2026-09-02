(function () {
  "use strict";

  const SUPABASE_URL =
    "https://ygddurgcovknksrjwmhh.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_taY9vzhunmL1bYx4-u1odw_yTrnSn7x";

  const HISTORY_KEY =
    "etsi-game-history";

  const HISTORY_OWNER_KEY =
    "etsi-game-history-owner";

  const MISTAKES_KEY =
    "etsi-game-mistakes";

  const PENDING_MISTAKE_REMOVALS_KEY =
    "etsi-pending-mistake-removals";

  const DEFAULT_SERIES_ID =
    "serie-generale-1";

  const DEFAULT_SERIES_TITLE =
    "Série 1 — Situations générales";

  if (!window.supabase?.createClient) {
    console.warn("Supabase n’a pas pu être chargé.");
    return;
  }

  const client =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

  function normalizeAttempt(attempt) {
    if (
      !attempt ||
      typeof attempt.sessionId !== "string" ||
      !Number.isInteger(attempt.score) ||
      !Number.isInteger(attempt.total) ||
      attempt.total <= 0
    ) {
      return null;
    }

    return {
      sessionId: attempt.sessionId,
      seriesId:
        typeof attempt.seriesId === "string"
          ? attempt.seriesId
          : DEFAULT_SERIES_ID,
      seriesTitle:
        typeof attempt.seriesTitle === "string"
          ? attempt.seriesTitle
          : DEFAULT_SERIES_TITLE,
      score: attempt.score,
      total: attempt.total,
      percentage:
        Number.isFinite(attempt.percentage)
          ? attempt.percentage
          : Math.round(
              (attempt.score / attempt.total) * 100
            ),
      completedAt:
        typeof attempt.completedAt === "string"
          ? attempt.completedAt
          : new Date().toISOString()
    };
  }

  function loadLocalHistory() {
    try {
      const raw =
        localStorage.getItem(HISTORY_KEY);

      const history =
        raw ? JSON.parse(raw) : [];

      return Array.isArray(history)
        ? history
            .map(normalizeAttempt)
            .filter(Boolean)
        : [];
    }
    catch (error) {
      console.warn("Historique local indisponible :", error);
      return [];
    }
  }

  function saveLocalHistory(history) {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history.slice(-500))
      );
    }
    catch (error) {
      console.warn("Historique local non enregistré :", error);
    }
  }

  function toDatabaseAttempt(attempt, userId) {
    return {
      user_id: userId,
      session_id: attempt.sessionId,
      series_id: attempt.seriesId,
      series_title: attempt.seriesTitle,
      score: attempt.score,
      total: attempt.total,
      percentage: attempt.percentage,
      completed_at: attempt.completedAt
    };
  }

  function fromDatabaseAttempt(attempt) {
    return normalizeAttempt({
      sessionId: attempt.session_id,
      seriesId: attempt.series_id,
      seriesTitle: attempt.series_title,
      score: attempt.score,
      total: attempt.total,
      percentage: attempt.percentage,
      completedAt: attempt.completed_at
    });
  }

  function normalizeMistake(mistake) {
    if (
      !mistake ||
      !Number.isInteger(mistake.situationIndex) ||
      mistake.situationIndex < 0
    ) {
      return null;
    }

    return {
      seriesId:
        typeof mistake.seriesId === "string"
          ? mistake.seriesId
          : DEFAULT_SERIES_ID,
      situationIndex: mistake.situationIndex,
      title: String(mistake.title || "Situation"),
      question: String(mistake.question || "Question non disponible"),
      selectedAnswer: String(mistake.selectedAnswer || "Réponse non disponible"),
      correctAnswer: String(mistake.correctAnswer || "Réponse non disponible"),
      correct: false,
      correction: String(mistake.correction || ""),
      updatedAt:
        typeof mistake.updatedAt === "string"
          ? mistake.updatedAt
          : new Date().toISOString()
    };
  }

  function loadLocalMistakes() {
    try {
      const mistakes = JSON.parse(
        localStorage.getItem(MISTAKES_KEY) || "[]"
      );

      return Array.isArray(mistakes)
        ? mistakes.map(normalizeMistake).filter(Boolean)
        : [];
    }
    catch (error) {
      console.warn("Erreurs locales indisponibles :", error);
      return [];
    }
  }

  function saveLocalMistakes(mistakes) {
    localStorage.setItem(
      MISTAKES_KEY,
      JSON.stringify(
        [...new Map(
          mistakes.map(item => [
            `${item.seriesId}:${item.situationIndex}`,
            item
          ])
        ).values()]
      )
    );
  }

  function toDatabaseMistake(mistake, userId) {
    return {
      user_id: userId,
      series_id: mistake.seriesId,
      situation_index: mistake.situationIndex,
      title: mistake.title,
      question: mistake.question,
      selected_answer: mistake.selectedAnswer,
      correct_answer: mistake.correctAnswer,
      correction: mistake.correction,
      updated_at: mistake.updatedAt
    };
  }

  function fromDatabaseMistake(mistake) {
    return normalizeMistake({
      seriesId: mistake.series_id,
      situationIndex: mistake.situation_index,
      title: mistake.title,
      question: mistake.question,
      selectedAnswer: mistake.selected_answer,
      correctAnswer: mistake.correct_answer,
      correction: mistake.correction,
      updatedAt: mistake.updated_at
    });
  }

  async function getUser() {
    const { data, error } =
      await client.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session?.user || null;
  }

  async function uploadAttempt(attempt) {
    const normalized =
      normalizeAttempt(attempt);

    if (!normalized) {
      return false;
    }

    const user =
      await getUser();

    if (!user) {
      return false;
    }

    localStorage.setItem(
      HISTORY_OWNER_KEY,
      user.id
    );

    const { error } =
      await client
        .from("game_attempts")
        .upsert(
          toDatabaseAttempt(normalized, user.id),
          {
            onConflict: "user_id,session_id"
          }
        );

    if (error) {
      throw error;
    }

    return true;
  }

  async function uploadMistake(mistake) {
    const normalized = normalizeMistake(mistake);
    const user = await getUser();

    if (!normalized || !user) {
      return false;
    }

    const { error } = await client
      .from("game_mistakes")
      .upsert(
        toDatabaseMistake(normalized, user.id),
        { onConflict: "user_id,series_id,situation_index" }
      );

    if (error) {
      throw error;
    }

    return true;
  }

  function loadPendingMistakeRemovals() {
    const pending = JSON.parse(
      localStorage.getItem(PENDING_MISTAKE_REMOVALS_KEY) || "[]"
    );

    return Array.isArray(pending)
      ? pending.map(item =>
          Number.isInteger(item)
            ? { seriesId: DEFAULT_SERIES_ID, situationIndex: item }
            : item
        ).filter(item =>
          item &&
          typeof item.seriesId === "string" &&
          Number.isInteger(item.situationIndex)
        )
      : [];
  }

  function queueMistakeRemoval(seriesId, situationIndex) {
    const pending = loadPendingMistakeRemovals();

    const removals = new Map(
      [...pending, { seriesId, situationIndex }].map(item => [
        `${item.seriesId}:${item.situationIndex}`,
        item
      ])
    );

    localStorage.setItem(
      PENDING_MISTAKE_REMOVALS_KEY,
      JSON.stringify([...removals.values()])
    );
  }

  async function removeMistake(seriesId, situationIndex) {
    queueMistakeRemoval(seriesId, situationIndex);

    const user = await getUser();

    if (!user) {
      return false;
    }

    const { error } = await client
      .from("game_mistakes")
      .delete()
      .eq("user_id", user.id)
      .eq("series_id", seriesId)
      .eq("situation_index", situationIndex);

    if (error) {
      throw error;
    }

    const pending = loadPendingMistakeRemovals();

    localStorage.setItem(
      PENDING_MISTAKE_REMOVALS_KEY,
      JSON.stringify(
        pending.filter(item =>
          !(
            item.seriesId === seriesId &&
            item.situationIndex === situationIndex
          )
        )
      )
    );

    return true;
  }

  async function syncMistakes(user) {
    const localMistakes = loadLocalMistakes();
    const pendingRemovals = loadPendingMistakeRemovals();

    if (pendingRemovals.length > 0) {
      for (const removal of pendingRemovals) {
        const { error } = await client
          .from("game_mistakes")
          .delete()
          .eq("user_id", user.id)
          .eq("series_id", removal.seriesId)
          .eq("situation_index", removal.situationIndex);

        if (error) {
          throw error;
        }
      }

      localStorage.removeItem(PENDING_MISTAKE_REMOVALS_KEY);
    }

    const activeLocalMistakes = localMistakes.filter(
      mistake => !pendingRemovals.some(removal =>
        removal.seriesId === mistake.seriesId &&
        removal.situationIndex === mistake.situationIndex
      )
    );

    if (activeLocalMistakes.length > 0) {
      const { error } = await client
        .from("game_mistakes")
        .upsert(
          activeLocalMistakes.map(
            mistake => toDatabaseMistake(mistake, user.id)
          ),
          { onConflict: "user_id,series_id,situation_index" }
        );

      if (error) {
        throw error;
      }
    }

    const { data, error } = await client
      .from("game_mistakes")
      .select("series_id,situation_index,title,question,selected_answer,correct_answer,correction,updated_at")
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    const merged = new Map();

    [...activeLocalMistakes, ...(data || []).map(fromDatabaseMistake)]
      .filter(Boolean)
      .forEach(mistake => {
        const key =
          `${mistake.seriesId}:${mistake.situationIndex}`;

        const previous = merged.get(key);

        if (
          !previous ||
          new Date(mistake.updatedAt) >= new Date(previous.updatedAt)
        ) {
          merged.set(key, mistake);
        }
      });

    const mistakes = [...merged.values()];
    saveLocalMistakes(mistakes);
    return mistakes;
  }

  async function syncHistory() {
    const user =
      await getUser();

    const savedOwner =
      localStorage.getItem(
        HISTORY_OWNER_KEY
      );

    const localHistory =
      savedOwner &&
      savedOwner !== user?.id
        ? []
        : loadLocalHistory();

    if (!user) {
      return {
        user: null,
        history: localHistory
      };
    }

    if (localHistory.length > 0) {
      const { error: uploadError } =
        await client
          .from("game_attempts")
          .upsert(
            localHistory.map(
              attempt =>
                toDatabaseAttempt(
                  attempt,
                  user.id
                )
            ),
            {
              onConflict: "user_id,session_id"
            }
          );

      if (uploadError) {
        throw uploadError;
      }
    }

    const { data, error: downloadError } =
      await client
        .from("game_attempts")
        .select(
          "session_id,series_id,series_title,score,total,percentage,completed_at"
        )
        .eq("user_id", user.id)
        .order("completed_at", {
          ascending: true
        });

    if (downloadError) {
      throw downloadError;
    }

    const merged =
      new Map();

    localHistory.forEach(
      attempt =>
        merged.set(
          attempt.sessionId,
          attempt
        )
    );

    (data || [])
      .map(fromDatabaseAttempt)
      .filter(Boolean)
      .forEach(
        attempt =>
          merged.set(
            attempt.sessionId,
            attempt
          )
      );

    const history =
      [...merged.values()]
        .sort(
          (a, b) =>
            new Date(a.completedAt) -
            new Date(b.completedAt)
        );

    saveLocalHistory(history);

    localStorage.setItem(
      HISTORY_OWNER_KEY,
      user.id
    );

    const mistakes =
      await syncMistakes(user);

    return {
      user,
      history,
      mistakes
    };
  }

  window.ETSISync = {
    client,
    getUser,
    syncHistory,
    uploadAttempt,
    uploadMistake,
    removeMistake,
    clearLocalAccountHistory() {
      localStorage.removeItem(HISTORY_KEY);
      localStorage.removeItem(HISTORY_OWNER_KEY);
      localStorage.removeItem(MISTAKES_KEY);
      localStorage.removeItem(PENDING_MISTAKE_REMOVALS_KEY);
    }
  };
})();
