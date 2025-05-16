// language.js – universeller Sprachumschalter
let currentLang = "en";
let translations = {};

async function setLanguage(lang, filePath = null) {
  currentLang = lang;

  // Standard-Dateipfad, wenn keiner angegeben wurde
  const defaultPath = `locales/${document.body.dataset.translationFile || "en"}.json`;
  const path = filePath || defaultPath.replace("en", lang);

  try {
    const response = await fetch(path);
    translations = await response.json();
    applyTranslations();
  } catch (error) {
    console.error(`Translation file not found or invalid at ${path}`, error);
  }
}

function applyTranslations() {
  // <div data-i18n="key"> → Text ersetzen
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });

  // <input data-i18n-placeholder="key"> → Placeholder ersetzen
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[key]) {
      el.placeholder = translations[key];
    }
  });

  // <div data-i18n-html="key"> → InnerHTML ersetzen (für <b>, <br> etc.)
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (translations[key]) {
      el.innerHTML = translations[key];
    }
  });

  // <span class="editable-label" data-i18n-editable="custom_foe_1">
  document.querySelectorAll("[data-i18n-editable]").forEach((el) => {
    const key = el.getAttribute("data-i18n-editable");
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });

  // Optional: Buttons mit IDs
  const buttons = {
    exportBtn: "button_export",
    importBtn: "button_import",
    printBtn: "button_print"
  };
  for (const id in buttons) {
    const el = document.getElementById(id);
    if (el && translations[buttons[id]]) {
      el.textContent = translations[buttons[id]];
    }
  }

  const resetBtn = document.querySelector('button[type="reset"]');
  if (resetBtn && translations["button_reset"]) {
    resetBtn.textContent = translations["button_reset"];
  }

  // Footer-Links (z. B. 2 Links)
  const footerLinks = document.querySelectorAll(".footer-links a");
  if (footerLinks.length >= 2) {
    if (translations["footer_back"]) footerLinks[0].textContent = translations["footer_back"];
    if (translations["footer_bug"]) footerLinks[1].textContent = translations["footer_bug"];
  }

  // Waffen-Dropdown
  document.querySelectorAll('select[name$="_type"]').forEach((select) => {
    if (select.options.length >= 4) {
      if (translations["choose-type"]) select.options[0].text = translations["choose-type"];
      if (translations["option-ranged"]) select.options[1].text = translations["option-ranged"];
      if (translations["option-close"]) select.options[2].text = translations["option-close"];
      if (translations["option-explosives"]) select.options[3].text = translations["option-explosives"];
    }
  });
}

// Sprache beim Umschalten neu setzen
document.addEventListener("DOMContentLoaded", () => {
  const switchEl = document.getElementById("languageSwitch");
  if (switchEl) {
    switchEl.addEventListener("change", () => {
      const lang = switchEl.checked ? "de" : "en";
      setLanguage(lang);
    });
  }

  // Sprache initial laden (standardmäßig Englisch)
  const initialLang = switchEl && switchEl.checked ? "de" : "en";
  setLanguage(initialLang);
});
