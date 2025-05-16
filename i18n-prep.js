const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");

const inputFile = process.argv[2] || "tfm_rpg_character.html";
const outputHTML = process.argv[3] || "translated_" + inputFile;
const outputJSON = process.argv[4] || "locales/tfm_rpg_character_en.json";

const html = fs.readFileSync(inputFile, "utf8");
const $ = cheerio.load(html);

const translations = {};

function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[\s\n]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function addTranslation(el, attr, prefix, useHTML = false) {
  const $el = $(el);
  let content = useHTML ? $el.html() : $el.text();
  content = content.trim();
  if (!content) return;

  const key = prefix + "_" + slugify(content);
  if (useHTML) {
    $el.attr("data-i18n-html", key);
  } else {
    $el.attr(attr, key);
  }

  if (!translations[key]) {
    translations[key] = content;
  }
}

// Add data-i18n to labels, headers
$("label, h1, h2, h3, th, button").each((_, el) => {
  if (!$(el).attr("data-i18n")) {
    addTranslation(el, "data-i18n", el.tagName.toLowerCase());
  }
});

// Add data-i18n-placeholder to placeholders
$("input[placeholder], textarea[placeholder]").each((_, el) => {
  const $el = $(el);
  const text = $el.attr("placeholder");
  const key = "placeholder_" + slugify(text);
  $el.attr("data-i18n-placeholder", key);
  if (!translations[key]) {
    translations[key] = text;
  }
});

// Add data-i18n-html to paragraphs with <b>, <br>, etc.
$("p").each((_, el) => {
  const $el = $(el);
  if ($el.html().includes("<")) {
    addTranslation(el, "data-i18n-html", "html", true);
  } else {
    addTranslation(el, "data-i18n", "p");
  }
});

// Add data-i18n-editable for contenteditable fields
$("[contenteditable='true']").each((_, el) => {
  const $el = $(el);
  const text = $el.text().trim();
  const key = "editable_" + slugify(text);
  $el.attr("data-i18n-editable", key);
  if (!translations[key]) {
    translations[key] = text;
  }
});

// Save updated HTML
fs.writeFileSync(outputHTML, $.html(), "utf8");
console.log("✔️  HTML updated:", outputHTML);

// Save JSON with extracted keys
fs.mkdirSync(path.dirname(outputJSON), { recursive: true });
fs.writeFileSync(outputJSON, JSON.stringify(translations, null, 2), "utf8");
console.log("✔️  Translations saved to:", outputJSON);
