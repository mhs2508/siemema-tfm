document.addEventListener("DOMContentLoaded", function () {
  // Reset-Button
  const resetButton = document.querySelector("button[type='reset']");
  resetButton.addEventListener("click", function (event) {
    event.preventDefault();
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      } else if (input.type === "number") {
        input.value = input.defaultValue || 0;
      } else {
        input.value = "";
      }
    });

    // Waffen-Dropdowns auf Default setzen
    ["weapon_1_type", "weapon_2_type", "weapon_3_type"].forEach((typeFieldName) => {
      const select = document.querySelector(`[name="${typeFieldName}"]`);
      if (select) select.value = "";
    });

    // Reset editable FoE labels to default
    const customFoE1 = document.querySelector('.editable-label[data-placeholder="Custom FoE #1"]');
    const customFoE2 = document.querySelector('.editable-label[data-placeholder="Custom FoE #2"]');
    if (customFoE1) customFoE1.innerText = "Custom FoE #1";
    if (customFoE2) customFoE2.innerText = "Custom FoE #2";
    
    updateAbilitySum();
    updateFoESum();
    updateCombatFields();
  });

  // Export Button
  const exportButton = document.getElementById("exportBtn");
  exportButton.addEventListener("click", function () {
    const inputs = document.querySelectorAll("input[name], textarea[name]");
    const data = {};

    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        data[input.name] = input.checked;
      } else {
        data[input.name] = input.value;
      }
    });

    // Waffen exportieren
    ["weapon_1", "weapon_2", "weapon_3"].forEach((weapon) => {
      const nameInput = document.querySelector(`[name="${weapon}_name"]`);
      const typeInput = document.querySelector(`[name="${weapon}_type"]`);
      const damageInput = document.querySelector(`[name="${weapon}_damage"]`);
    
      if (nameInput) data[`${weapon}_name`] = nameInput.value;
      if (typeInput) data[`${weapon}_type`] = typeInput.value;
      if (damageInput) data[`${weapon}_damage`] = damageInput.value;
    });

    // Manuelle Ergänzung für die editierbaren FoE-Labels
    const customFoE1 = document.querySelector('.editable-label[data-placeholder="Custom FoE #1"]');
    const customFoE2 = document.querySelector('.editable-label[data-placeholder="Custom FoE #2"]');
    if (customFoE1) data.label_custom_foe_1 = customFoE1.innerText.trim();
    if (customFoE2) data.label_custom_foe_2 = customFoE2.innerText.trim();

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    let filename = "character_data";
    const nameInput = document.querySelector('input[name="name"]');
    if (nameInput && nameInput.value.trim() !== "") {
      const sanitized = nameInput.value.trim().replace(/\s+/g, "_");
      filename += `_${sanitized}`;
    }
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // Import Button
  const importButton = document.getElementById("importBtn");
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";

  importButton.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = JSON.parse(e.target.result);
      for (let key in data) {
        const elements = document.querySelectorAll(`[name="${key}"]`);
        elements.forEach((input) => {
          if (input.type === "checkbox") {
            input.checked = data[key];
          } else {
            input.value = data[key];
          }
        });
      }

      // Manuelle Ergänzung für die editierbaren FoE-Labels
      const customFoE1 = document.querySelector('.editable-label[data-placeholder="Custom FoE #1"]');
      const customFoE2 = document.querySelector('.editable-label[data-placeholder="Custom FoE #2"]');
      if (customFoE1 && data.label_custom_foe_1) customFoE1.innerText = data.label_custom_foe_1;
      if (customFoE2 && data.label_custom_foe_2) customFoE2.innerText = data.label_custom_foe_2;

      updateAbilitySum();
      updateFoESum();
      updateCombatFields();
    };
    reader.readAsText(file);
  });

  // Update Ability Points Sum
  function updateAbilitySum() {
    const abilityFields = [
      "ability_scholarship",
      "ability_analysis",
      "ability_interaction",
      "ability_tech",
      "ability_body",
      "ability_combat"
    ];
    let sum = 0;
    abilityFields.forEach((name) => {
      const el = document.querySelector(`[name="${name}"]`);
      sum += parseInt(el.value) || 0;
    });
    const header = document.querySelector("#abilities-header");
    header.textContent = `Abilities (${sum})`;
  }

  // Update Fields of Expertise Sum
  function updateFoESum() {
    const foeFields = document.querySelectorAll("input[name^='value_']");
    let sum = 0;
    foeFields.forEach((el) => {
      sum += parseInt(el.value) || 0;
    });
    const header = document.querySelector("#foe-header");
    header.textContent = `Engineering: Fields of Expertise (${sum})`;
  }

  // Update Combat auto-calculation
  function updateCombatFields() {
    const body = parseInt(document.querySelector('[name="ability_body"]').value) || 0;
    const combat = parseInt(document.querySelector('[name="ability_combat"]').value) || 0;
    document.querySelector('[name="combat_initiative_attack"]').value = body + combat;
    document.querySelector('[name="combat_initiative_normal"]').value = body * 2;
    document.querySelector('[name="combat_ocr"]').value = body + combat;
  }

  // Hook listeners to update dynamically
  document.querySelectorAll("input[name^='ability_']").forEach((el) => {
    el.addEventListener("input", () => {
      updateAbilitySum();
      updateCombatFields();
    });
  });
  document.querySelectorAll("input[name^='value_']").forEach((el) => {
    el.addEventListener("input", updateFoESum);
  });

  // Initial calculation
  updateAbilitySum();
  updateFoESum();
  updateCombatFields();
});

// Sprachumschalter
const translations = {
  en: {
    "character-header": "Character",
    "abilities-header": "Abilities",
    "foe-header": "Engineering: Fields of Expertise",
    "combat-header": "Combat",
    "vitality-header": "Vitality",
    "incapitation-header": "Incapitation",
    "weapons-header": "Weapons",
    "weapon-name-header": "Weapon",
    "weapon-type-header": "Type",
    "weapon-damage-header": "Damage",
    "choose-type": "Choose type",
    "option-ranged": "Ranged",
    "option-close": "Close Combat",
    "option-explosives": "Explosives"
  },
  de: {
    "character-header": "Charakter",
    "abilities-header": "Fähigkeiten",
    "foe-header": "Ingenieurwesen: Fachgebiete",
    "combat-header": "Kampf",
    "vitality-header": "Vitalität",
    "incapitation-header": "Kampfunfähigkeit",
    "weapons-header": "Waffen",
    "weapon-name-header": "Waffe",
    "weapon-type-header": "Typ",
    "weapon-damage-header": "Schaden",
    "choose-type": "Typ wählen",
    "option-ranged": "Fernkampf",
    "option-close": "Nahkampf",
    "option-explosives": "Sprengstoff"
  }
};

function setLanguage(lang) {
  const langData = translations[lang];
  for (const id in langData) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = langData[id];
    }
  }

  // Waffen-Dropdowns updaten
  document.querySelectorAll('select[name$="_type"]').forEach((select) => {
    if (select.options.length >= 4) {
      select.options[0].text = langData["choose-type"];
      select.options[1].text = langData["option-ranged"];
      select.options[2].text = langData["option-close"];
      select.options[3].text = langData["option-explosives"];
    }
  });
}

const languageSwitch = document.getElementById("languageSwitch");
if (languageSwitch) {
  languageSwitch.addEventListener("change", function () {
    if (this.checked) {
      setLanguage("de");
    } else {
      setLanguage("en");
    }
  });
}
