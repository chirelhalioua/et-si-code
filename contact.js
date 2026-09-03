(function () {
  "use strict";

  const SUPABASE_URL = "https://ygddurgcovknksrjwmhh.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_taY9vzhunmL1bYx4-u1odw_yTrnSn7x";

  const form = document.getElementById("contact-form");
  const submitButton = document.getElementById("contact-submit");
  const status = document.getElementById("contact-status");
  const themeToggle = document.getElementById("contact-theme-toggle");

  function showStatus(message, type = "") {
    status.textContent = message;
    status.className = `contact-status${type ? ` is-${type}` : ""}`;
  }

  themeToggle?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("etsi-theme", next);
    themeToggle.querySelector("span").textContent = next === "light" ? "☀" : "☾";
  });

  if (themeToggle) {
    themeToggle.querySelector("span").textContent =
      document.documentElement.dataset.theme === "light" ? "☀" : "☾";
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    showStatus("");

    if (!form.checkValidity()) {
      form.reportValidity();
      showStatus("Merci de compléter correctement tous les champs.", "error");
      return;
    }

    if (!window.supabase?.createClient) {
      showStatus("Le service est momentanément indisponible.", "error");
      return;
    }

    const values = new FormData(form);
    const payload = {
      name: String(values.get("name") || "").trim(),
      email: String(values.get("email") || "").trim(),
      message: String(values.get("message") || "").trim(),
      website: String(values.get("website") || "").trim()
    };

    submitButton.disabled = true;
    submitButton.textContent = "Envoi…";
    showStatus("Envoi du message en cours…");

    try {
      const client = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
      );

      const { data, error } = await client.functions.invoke(
        "send-contact-email",
        { body: payload }
      );

      if (error || !data?.success) {
        throw error || new Error(data?.error || "Échec de l’envoi");
      }

      form.reset();
      showStatus("Ton message a bien été envoyé. Merci !", "success");
    }
    catch (error) {
      console.error("Envoi du formulaire impossible :", error);
      showStatus("Le message n’a pas pu être envoyé. Réessaie dans un instant.", "error");
    }
    finally {
      submitButton.disabled = false;
      submitButton.textContent = "Envoyer le message";
    }
  });
})();
