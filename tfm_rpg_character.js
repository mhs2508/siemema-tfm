document.addEventListener("DOMContentLoaded", function () {
    const resetButton = document.querySelector("button[type='reset']");
    resetButton.addEventListener("click", function (event) {
      event.preventDefault(); // Standardverhalten verhindern
  
      // Alle Eingaben und Textareas auf leer setzen
      const inputs = document.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        if (input.type === "checkbox" || input.type === "radio") {
          input.checked = false;
        } else {
          input.value = "";
        }
      });
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    // Reset-Button (falls noch nicht drin)
    const resetButton = document.querySelector("button[type='reset']");
    resetButton.addEventListener("click", function (event) {
      event.preventDefault();
      const inputs = document.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        if (input.type === "checkbox" || input.type === "radio") {
          input.checked = false;
        } else {
          input.value = "";
        }
      });
    });
  
    // Export Button
    const exportButton = document.getElementById("exportBtn");
    exportButton.addEventListener("click", function () {
      const inputs = document.querySelectorAll("input, textarea");
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
          const input = document.querySelector(`[name="${key}"]`);
          if (input) {
            if (input.type === "checkbox") {
              input.checked = data[key];
            } else {
              input.value = data[key];
            }
          }
        }
      };
      reader.readAsText(file);
    });
  });
  