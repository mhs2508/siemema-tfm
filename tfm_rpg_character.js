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
