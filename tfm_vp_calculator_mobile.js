const corporations = [
    // Standard Edition
    "Beginner Corporation #1",
    "Beginner Corporation #2",
    "Beginner Corporation #3",
    "Beginner Corporation #4",
    "Beginner Corporation #5",
    "Credicor",
    "Ecoline",
    "Helion",
    "Interplanetary Cinematics",
    "Inventrix",
    "Mining Guild",
    "Phobolog",
    "Tharsis Republic",
    "ThorGate",
    "United Nations Mars Initiative",
    // Corporate Era
    "Saturn Systems",
    "Terractor",
    // Prelude
    "Cheung Shing Mars",
    "Point Luna",
    "Robinson Industries",
    "Valley Trust",
    "Vitor",
    // Venus Next
    "Aphrodite",
    "Celestic",
    "Manutech",
    "Morning Star Inc.",
    "Viron",
    // Original Promo Pack
    "Arcadian Communities",
    "Recyclon",
    "Splice",
    // Big Box Promo Pack
    "AstroDrill",
    "Pharmacy Union",
    // Other Promos
    "Factorum",
    "Mons Insurance",
    "Philares",
    // Colonies
    "Aridor",
    "Arklight",
    "Polyphemos",
    "Poseidon",
    "Stormcraft Inc.",
    // Turmoil
    "Lakefront Resorts",
    "Phristar",
    "Septem Tribus",
    "Terralabs Research",
    "Utopia Invest"
];
function populateCorporations() {
    const selects = document.querySelectorAll(".corporation-select");
    selects.forEach(select => {
        select.innerHTML = corporations.map(corp => `<option value="${corp}">${corp}</option>`).join('');
    });
}

function enforceNonNegative(input) {
    if (parseInt(input.value) < 0 || isNaN(input.value)) {
        input.value = 0;
    }
}

function updateSum() {
    for (let i = 1; i <= 5; i++) {
        let total = 0;
        document.querySelectorAll(`.player${i}`).forEach(input => {
            total += parseInt(input.value) || 0;
        });

        let sumCell = document.getElementById(`sum${i}`);
        if (sumCell) {
            sumCell.textContent = total;
        }
    }
}

function resetTable() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        if (input.closest("tr").querySelector("td").textContent.includes("Terraform Rating")) {
            input.value = 20;
        } else {
            input.value = 0;
        }
    });

    document.querySelectorAll("thead th[contenteditable='true']").forEach((th, index) => {
        th.textContent = `Player ${index + 1}`;
    });

    populateCorporations();
    document.querySelectorAll(".corporation-select").forEach(select => {
        select.selectedIndex = 0;
    });

    updateSum();
}

function updatePlayerCount() {
    const selectedPlayers = parseInt(document.querySelector('input[name="player-count"]:checked').value);
    const columns = document.querySelectorAll("thead th");
    const rows = document.querySelectorAll("tbody tr");

    for (let i = 1; i <= 5; i++) {
        const showColumn = i <= selectedPlayers;
        columns[i].style.display = showColumn ? "" : "none";
        rows.forEach(row => {
            row.children[i].style.display = showColumn ? "" : "none";
        });
    }

    updateSum();
}

function toggleMode() {
    const isChecked = document.getElementById("modeToggle").checked;

    if (isChecked) {
        window.location.href = "tfm_vp_calculator_mobile.html"; // Mobile-Version aufrufen
    } else {
        window.location.href = "tfm_vp_calculator.html"; // Desktop-Version aufrufen
    }
}

// Beim Laden der Seite prüfen, ob wir in der mobilen Version sind, und den Switch setzen
document.addEventListener("DOMContentLoaded", function() {
    const toggleSwitch = document.getElementById("modeToggle");

    if (window.location.pathname.includes("tfm_vp_calculator_mobile.html")) {
        toggleSwitch.checked = true; // Mobile-Modus aktiv
    } else {
        toggleSwitch.checked = false; // Desktop-Modus aktiv
    }
});

document.addEventListener("DOMContentLoaded", () => {
    populateCorporations();
    document.querySelectorAll('input[name="player-count"]').forEach(radio => {
        radio.addEventListener("change", updatePlayerCount);
    });
});