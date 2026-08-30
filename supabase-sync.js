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

    return {
      user,
      history
    };
  }

  window.ETSISync = {
    client,
    getUser,
    syncHistory,
    uploadAttempt,
    clearLocalAccountHistory() {
      localStorage.removeItem(HISTORY_KEY);
      localStorage.removeItem(HISTORY_OWNER_KEY);
    }
  };
})();
