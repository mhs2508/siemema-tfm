const allCorporations = {
    standard: [
        "Beginner Corporation #1", "Beginner Corporation #2", "Beginner Corporation #3", "Beginner Corporation #4", "Beginner Corporation #5",
        "Credicor", "Ecoline", "Helion", "Interplanetary Cinematics", "Inventrix", "Mining Guild", "Phobolog", "Tharsis Republic", "ThorGate", "United Nations Mars Initiative"
    ],
    corporateEra: ["Saturn Systems", "Terractor"],
    prelude: ["Cheung Shing Mars", "Point Luna", "Robinson Industries", "Valley Trust", "Vitor"],
    venusNext: ["Aphrodite", "Celestic", "Manutech", "Morning Star Inc.", "Viron"],
    promoPack: ["Arcadian Communities", "Recyclon", "Splice"],
    bigBox: ["AstroDrill", "Pharmacy Union"],
    collectorPromos: ["Factorum", "Mons Insurance", "Philares"],
    colonies: ["Aridor", "Arklight", "Polyphemos", "Poseidon", "Stormcraft Inc."],
    turmoil: ["Lakefront Resorts", "Phristar", "Septem Tribus", "Terralabs Research", "Utopia Invest"]
};

const milestoneData = {
    Tharsis: ["Terraformer", "Mayor", "Gardener", "Builder", "Planner"],
    Hellas: ["Diversifier", "Tactician", "Polar Explorer", "Energizer", "Rim Settler"],
    Elysium: ["Generalist", "Specialist", "Ecologist", "Tycoon", "Legend"],
};

const venusMilestone = "Hoverlord";

const awardData = {
    Tharsis: ["Landlord", "Banker", "Scientist", "Thermalist", "Miner"],
    Hellas: ["Cultivator", "Magnate", "Space Baron", "Excentric", "Contractor"],
    Elysium: ["Celebrity", "Industrialist", "Desert Settler", "Estate Dealer", "Benefactor"],
};
const venusAward = "Venuphile";

let selectedExpansions = [];
document.querySelectorAll(".expansions input[type='checkbox']").forEach(checkbox => {
    if (checkbox.checked) {
        let expansionKey = checkbox.id.replace("-", ""); // Anpassung für IDs
        selectedExpansions.push(expansionKey);
    }
});

let availableCorporations = [...allCorporations.standard];
selectedExpansions.forEach(expansion => {
    if (allCorporations[expansion]) {
        availableCorporations = availableCorporations.concat(allCorporations[expansion]);
    }
});

document.querySelectorAll(".corporation-select").forEach(select => {
    const currentSelection = select.value;
    select.innerHTML = "<option value=''>Choose Corporation</option>" + 
        availableCorporations
            .map(corp => `<option value="${corp}" ${corp === currentSelection ? 'selected' : ''}>${corp}</option>`)
            .join('');
});

document.querySelectorAll(".expansions input[type='checkbox']").forEach(checkbox => {
checkbox.addEventListener("change", updateCorporationOptions);
});

// Aktualisiert die Milestone-Dropdowns basierend auf dem Board & vorhandenen Auswahl
function updateMilestoneDropdowns() {
    const board = document.getElementById("board-select").value;
    const venusNextEnabled = document.getElementById("venusNext").checked;
    
    if (!milestoneData[board]) return;
    
    let availableMilestones = [...milestoneData[board]];
    if (venusNextEnabled) availableMilestones.push(venusMilestone);
    
    const selectedMilestones = Array.from(document.querySelectorAll(".milestone-select"))
        .map(select => select.value)
        .filter(value => value !== "");
    
    document.querySelectorAll(".milestone-select").forEach(select => {
        const currentValue = select.value;
        select.innerHTML = `<option value="">Choose Milestone</option>` +
            availableMilestones
                .filter(milestone => !selectedMilestones.includes(milestone) || milestone === currentValue)
                .map(milestone => `<option value="${milestone}" ${milestone === currentValue ? 'selected' : ''}>${milestone}</option>`)
                .join('');
    });
}

function updateAwardDropdowns() {
    const board = document.getElementById("board-select").value;
    // Wenn kein Board ausgewählt ist, setze die Award-Dropdowns auf den Standardtext
    if (!board) {
        document.querySelectorAll(".award-select").forEach(select => {
            select.innerHTML = "<option value=''>Choose Award</option>";
        });
        updateAwardSlidersState(); // Slider deaktivieren
        return;
    }
    const venusNextEnabled = document.getElementById("venusNext").checked;
    
    if (!board || !awardData[board]) return;

    let availableAwards = [...awardData[board]];
    if (venusNextEnabled) availableAwards.push(venusAward);

    const selectedAwards = Array.from(document.querySelectorAll(".award-select"))
        .map(select => select.value)
        .filter(value => value !== "");

    document.querySelectorAll(".award-select").forEach(select => {
        const currentValue = select.value;
        select.innerHTML = `<option value="">Choose Award</option>` +
            availableAwards
                .filter(award => !selectedAwards.includes(award) || award === currentValue)
                .map(award => `<option value="${award}" ${award === currentValue ? 'selected' : ''}>${award}</option>`)
                .join('');
    });

    updateAwardSlidersState();
}

function updateAwardSlidersState() {
    document.querySelectorAll(".award-slider").forEach(slider => {
        const awardIndex = slider.getAttribute("data-award");
        const correspondingSelect = document.querySelector(`.award-select[data-award-index="${awardIndex}"]`);
        slider.disabled = !correspondingSelect.value;
    });
}

function updateMilestoneCheckboxes(milestoneIndex) {
    document.querySelectorAll(`.milestone-checkbox[data-milestone="${milestoneIndex}"]`).forEach(checkbox => {
        checkbox.disabled = false;
    });
}

// Stellt sicher, dass nur ein Spieler pro Milestone die Checkbox aktivieren kann
function validateMilestoneSelection(milestoneIndex) {
    document.querySelectorAll(`.milestone-checkbox[data-milestone="${milestoneIndex}"]`).forEach(checkbox => {
        if (checkbox.checked) {
            let player = checkbox.getAttribute("data-player"); // Richtigen Player auslesen
            document.querySelectorAll(`.milestone-checkbox[data-milestone="${milestoneIndex}"]`).forEach(otherCheckbox => {
                if (otherCheckbox.getAttribute("data-player") !== player) {
                    otherCheckbox.checked = false;
                }
            });
        }
    });
    updateMilestonePoints();
}

// Event Listener fuer Milestone-Checkboxen, um zu verhindern, dass mehrere Spieler denselben Milestone aktivieren
document.addEventListener("change", function (event) {
    if (event.target.classList.contains("milestone-checkbox")) {
        validateMilestoneSelection(event.target.dataset.milestone, event.target.dataset.player);
    }
});

// Venus Next Checkbox setzt Milestone-Liste neu auf
document.getElementById("venusNext").addEventListener("change", updateMilestoneDropdowns);

// Checkboxen fuer Milestones deaktivieren, solange "Choose Milestone" gewaehlt ist
function updateMilestoneDropdownState() {
    const board = document.getElementById("board-select").value;
    if (!milestoneData[board]) return;
    
    const milestone1 = document.querySelector(".milestone-select[data-milestone-index='1']");
    const milestone2 = document.querySelector(".milestone-select[data-milestone-index='2']");
    const milestone3 = document.querySelector(".milestone-select[data-milestone-index='3']");
    
    // Milestone 2 ist nur waehlbar, wenn Milestone 1 gesetzt wurde
    milestone2.disabled = milestone1.value === "";
    
    // Milestone 3 ist nur waehlbar, wenn Milestone 2 gesetzt wurde
    milestone3.disabled = milestone2.value === "";

    // Verfuegbare Optionen basierend auf dem gewaehlten Board und Venus Next
    let availableMilestones = [...milestoneData[board]];
    if (document.getElementById("venusNext").checked) {
        availableMilestones.push(venusMilestone);
    }
    
    // Entferne bereits gewaehlte Milestones aus den Dropdowns
    const selectedMilestones = [milestone1.value, milestone2.value].filter(val => val !== "");
    document.querySelectorAll(".milestone-select").forEach(select => {
        const currentValue = select.value;
        const filteredMilestones = availableMilestones.filter(milestone => 
            !selectedMilestones.includes(milestone) || milestone === currentValue
        );
        select.innerHTML = `<option value="">Choose Milestone</option>` +
            filteredMilestones.map(milestone => `<option value="${milestone}" ${milestone === currentValue ? 'selected' : ''}>${milestone}</option>`).join('');
    });
}

/*
// Befuellt die Dropdown-Menues fuer die Corporation-Auswahl mit den verfuegbaren Corporations
function populateCorporations() {
    const selects = document.querySelectorAll(".corporation-select");
    selects.forEach(select => {
        select.innerHTML = "<option value=''>Choose Corporation</option>" + 
            corporations.map(corp => `<option value="${corp}">${corp}</option>`).join('');
    });
}
*/

function enforceNonNegative(input) {
    if (parseInt(input.value) < 0 || isNaN(input.value)) {
        input.value = 0; // Setzt den Wert auf 0, wenn negativ oder ungueltig
    }
}

function updateSum() {
    let scores = [];
    for (let i = 1; i <= 5; i++) {
        let total = 0;
        document.querySelectorAll(`.player${i}, .player${i}-milestone, .player${i}-award`).forEach(input => {
            total += parseInt(input.value) || 0;
        });
        let sumCell = document.getElementById(`sum${i}`);
        if (sumCell) {
            sumCell.textContent = total;
        }
        scores.push({ player: i, score: total, money: parseInt(document.getElementById(`money${i}`).value) || 0 });
    }
    updateRank(scores);
}

function updateRank(scores) {
    // Zunächst nach Punkten sortieren, bei Gleichstand nach Geld
    scores.sort((a, b) => b.score - a.score || b.money - a.money);
    
    let rank = 1;
    let prevScore = null;
    let prevMoney = null;
    let ties = [];

    scores.forEach((playerData, index) => {
        let { player, score, money } = playerData;
        let rankCell = document.getElementById(`rank${player}`);

        if (score === prevScore) {
            if (prevMoney === money) {
                ties.push(player);
            } else {
                rank = index + 1;
            }
        } else {
            rank = index + 1;
        }

        rankCell.textContent = rank;
        prevScore = score;
        prevMoney = money;
    });

    // Überprüfen, welche Spieler Geld eingeben dürfen (nur bei Gleichstand)
    let tiedScores = scores.reduce((acc, player) => {
        acc[player.score] = (acc[player.score] || 0) + 1;
        return acc;
    }, {});

    for (let i = 1; i <= 5; i++) {
        let moneyField = document.getElementById(`money${i}`);
        if (tiedScores[scores.find(p => p.player === i).score] > 1) {
            moneyField.disabled = false;
        } else {
            moneyField.disabled = true;
            moneyField.value = 0; // Reset, falls nicht mehr nötig
        }
    }
}

// Event Listener für Änderungen an Punkten & Geldfeldern
document.querySelectorAll('input[type=number]').forEach(input => {
    input.addEventListener('input', updateSum);
});

function updateCorporationOptions() {
    let selectedExpansions = [];
    document.querySelectorAll(".expansions input[type='checkbox']:checked").forEach(checkbox => {
        selectedExpansions.push(checkbox.id);
    });

    let availableCorporations = [...allCorporations.standard];
    selectedExpansions.forEach(expansion => {
        if (allCorporations[expansion]) {
            availableCorporations = availableCorporations.concat(allCorporations[expansion]);
        }
    });

    // Erfassen bereits gewählter Konzerne
    let selectedCorporations = new Set(
        Array.from(document.querySelectorAll(".corporation-select")).map(select => select.value)
    );

    document.querySelectorAll(".corporation-select").forEach(select => {
        const currentSelection = select.value;
        
        let corporationOptions = `<option value=''>Choose Corporation</option>
            <optgroup label="Standard">
                ${allCorporations.standard
                    .filter(corp => !selectedCorporations.has(corp) || corp === currentSelection)
                    .map(corp => `<option value="${corp}" ${corp === currentSelection ? 'selected' : ''}>${corp}</option>`)
                    .join('')}
            </optgroup>`;

        selectedExpansions.forEach(expansion => {
            if (allCorporations[expansion]) {
                corporationOptions += `
                <optgroup label="${expansion.charAt(0).toUpperCase() + expansion.slice(1)}">
                    ${allCorporations[expansion]
                        .filter(corp => !selectedCorporations.has(corp) || corp === currentSelection)
                        .map(corp => `<option value="${corp}" ${corp === currentSelection ? 'selected' : ''}>${corp}</option>`)
                        .join('')}
                </optgroup>`;
            }
        });

        select.innerHTML = corporationOptions;
    });
}


// Board-Wechsel setzt alle Werte zurueck
function resetTable() {
    console.log("Resetting table...");

    // Alle Zahlenfelder zuruecksetzen
    document.querySelectorAll('input[type="number"]').forEach(input => {
        if (input.closest("tr").querySelector("td").textContent.includes("Terraform Rating")) {
            input.value = 20;
        } else {
            input.value = 0;
        }
    });

    // Spieler-Namen zuruecksetzen
    document.querySelectorAll("thead th[contenteditable='true']").forEach((th, index) => {
        th.textContent = `Player ${index + 1}`;
    });

    // Corporation-Auswahl zuruecksetzen
    document.querySelectorAll(".corporation-select").forEach(select => {
        let standardCorporations = allCorporations.standard.map(corp => 
            `<option value="${corp}">${corp}</option>`).join('');
        select.innerHTML = "<option value=''>Choose Corporation</option>" + standardCorporations;
    });

    // Meilenstein-Checkboxen zuruecksetzen
    document.querySelectorAll(".milestone-checkbox").forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = true; // Alle Checkboxen deaktivieren
    });

    // Meilenstein-Punkte zuruecksetzen
    document.querySelectorAll(".milestone-points").forEach(input => {
        input.value = 0;
    });

    // Milestone-Dropdowns zuruecksetzen
    document.querySelectorAll(".milestone-select").forEach(select => {
        select.innerHTML = "<option value=''>Choose Milestone</option>";
    });

    // Award-Slider zuruecksetzen (inklusive Farbe)
    document.querySelectorAll(".award-slider").forEach(slider => {
        slider.value = 0; // Standardwert
        slider.classList.remove("green", "yellow"); // Farbklassen entfernen
        slider.style.backgroundColor = "#777"; // Standard-Grau
        slider.title = "0 Punkte"; // Tooltip zuruecksetzen
    });

    // Award-Punkte zuruecksetzen
    document.querySelectorAll(".award-points").forEach(input => {
        input.value = 0;
    });

    // Award-Dropdowns zurücksetzen
    document.querySelectorAll(".award-select").forEach(select => {
        select.innerHTML = "<option value=''>Choose Award</option>";
    })

    // Alle Checkboxen fuer Game Parameters zuruecksetzen
    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => checkbox.checked = false);

    // Milestone-Dropdowns aktualisieren
    updateMilestoneDropdowns();

    // Award-Dropdowns aktualisieren
    updateAwardDropdowns();

    // Gesamtsumme aktualisieren
    updateSum();

    console.log("Reset complete.");
}

function updatePlayerCount() {
    const selectedPlayers = parseInt(document.querySelector('input[name="player-count"]:checked').value);
    console.log(`Updating player count: ${selectedPlayers} players`);

    const table = document.querySelector("table");
    table.classList.remove("players-1", "players-2", "players-3", "players-4", "players-5");
    table.classList.add(`players-${selectedPlayers}`);

    // === KOPFZEILE anpassen ===
    document.querySelectorAll("thead th[contenteditable='true']").forEach((th, index) => {
        if (index < selectedPlayers) {
            th.style.display = "table-cell";
            th.style.opacity = "1";
            th.style.pointerEvents = "auto";
            th.textContent = `Player ${index + 1}`;
        } else {
            th.style.display = "table-cell";
            th.style.opacity = "0";
            th.style.pointerEvents = "none";
        }
    });

    // === TABELLENKÖRPER anpassen ===
    table.querySelectorAll("tbody tr").forEach(row => {
        row.querySelectorAll("td").forEach((cell, index) => {
            if (index === 0) {
                // Erste Spalte (Kategorie) immer sichtbar
                cell.style.display = "table-cell";
                cell.style.opacity = "1";
                cell.style.pointerEvents = "auto";
                return;
            }

            if (index <= selectedPlayers) {
                cell.style.display = "table-cell";
                cell.style.opacity = "1";
                cell.style.pointerEvents = "auto";
            } else {
                cell.style.display = "table-cell";
                cell.style.opacity = "0";
                cell.style.pointerEvents = "none";
            }
        });
    });

    // Optional, aber hilft für Zentrierung im Container
    table.style.marginLeft = "auto";
    table.style.marginRight = "auto";
    
    // Corporations aktualisieren
    updateCorporationOptions();
    document.querySelectorAll(".corporation-select").forEach((select, index) => {
        select.style.display = index < selectedPlayers ? "" : "none";
        select.selectedIndex = 0;
    });

    // Milestone-Checkboxen anpassen
    document.querySelectorAll(".milestone-checkbox").forEach((checkbox, index) => {
        let playerIndex = parseInt(checkbox.getAttribute("data-player"));
        checkbox.style.display = playerIndex <= selectedPlayers ? "" : "none";
        checkbox.checked = false;
    });

    // Award-Slider zuruecksetzen & anpassen
    document.querySelectorAll(".award-slider").forEach((slider, index) => {
        let playerIndex = parseInt(slider.getAttribute("data-player"));
        slider.style.display = playerIndex <= selectedPlayers ? "" : "none";
        slider.value = 0;
        slider.classList.remove("green", "yellow");
        slider.style.backgroundColor = "#777";
    });

    // Award-Punkte-Zellen
    document.querySelectorAll(".award-points").forEach((input, index) => {
        let playerIndex = index + 1;
        input.style.display = playerIndex <= selectedPlayers ? "" : "none";
        input.value = 0;
    });

    // "Award Points"-Zeile bleibt sichtbar
    document.querySelectorAll("tr").forEach(row => {
        if (row.querySelector(".award-points")) {
            row.style.display = "";
        }
    });

    updateSum();
    console.log("Player count update complete.");
}

function updateMilestones() {
    const checkboxes = document.querySelectorAll(".milestone");
    let totalMilestones = document.querySelectorAll(".milestone:checked").length;

    // Wenn 3 Meilensteine vergeben sind, sperre alle nicht aktivierten Checkboxen
    checkboxes.forEach(checkbox => {
        if (totalMilestones >= 3 && !checkbox.checked) {
            checkbox.disabled = true;
        } else {
            checkbox.disabled = false;
        }
    });

    // Punkte fuer jeden Spieler berechnen (5 Punkte pro aktivierter Checkbox)
    let playerPoints = {};
    for (let i = 1; i <= 5; i++) {
        playerPoints[i] = document.querySelectorAll(`.milestone[data-player="${i}"]:checked`).length * 5;
    }

    // Punktwerte in die Tabelle eintragen
    for (let i = 1; i <= 5; i++) {
        const inputField = document.querySelector(`.player${i}.milestone-points`);
        if (inputField) {
            inputField.value = playerPoints[i];
        }
    }

    updateSum(); // Summen aktualisieren
}

function updateAwardSliders() {
    let playerPoints = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    document.querySelectorAll(".award-slider").forEach(slider => {
        let player = slider.getAttribute("data-player");
        let awardValue = parseInt(slider.value);
        let maxValue = parseInt(slider.max);

        // Entferne alte Farbklassen
        slider.classList.remove("green", "yellow");

        // Punkteberechnung und Farbzuweisung
        if (maxValue === 1) {
            playerPoints[player] += awardValue === 1 ? 5 : 0;
            if (awardValue === 1) slider.classList.add("green");
        } else {
            if (awardValue === 2) {
                playerPoints[player] += 5;
                slider.classList.add("green");
            } else if (awardValue === 1) {
                playerPoints[player] += 2;
                slider.classList.add("yellow");
            }
        }

        // Tooltip fuer Hover-Effekt aktualisieren
        slider.title = awardValue === 2 || (maxValue === 1 && awardValue === 1) ? "5 Punkte" :
                       awardValue === 1 ? "2 Punkte" : "0 Punkte";
    });

    // Punktwerte in die Tabelle eintragen
    for (let i = 1; i <= 5; i++) {
        const inputField = document.querySelector(`.player${i}.award-points`);
        if (inputField) {
            inputField.value = playerPoints[i];
        }
    }

    updateSum();
}

function toggleMode() {
    const isChecked = document.getElementById("modeToggle").checked;

    if (isChecked) {
        window.location.href = "tfm_vp_calculator_mobile.html"; // Legacy / Mobile-Version aufrufen
    } else {
        window.location.href = "tfm_vp_calculator.html"; // Desktop-Version aufrufen
    }
}

function saveGameData() {
    const selectedPlayers = parseInt(document.querySelector('input[name="player-count"]:checked')?.value) || 0;
    const board = document.getElementById("board-select")?.value || "Unknown Board";
    const gameModes = Array.from(document.querySelectorAll(".game-modes input:checked")).map(checkbox => checkbox.id);
    const expansions = Array.from(document.querySelectorAll(".expansions input:checked")).map(checkbox => checkbox.id);
    const date = new Date().toISOString();

    let players = [];
    for (let i = 1; i <= selectedPlayers; i++) {
        let playerInputs = document.querySelectorAll(`.player${i}`);

        let player = {
            name: document.querySelector(`th:nth-child(${i + 1})`)?.textContent || `Player ${i}`,
            corporation: document.querySelectorAll(".corporation-select")[i - 1]?.value || "None",
            terraformRating: parseInt(playerInputs[0]?.value) || 0, // Terraform Rating ist das erste Input-Feld
            victoryPoints: parseInt(playerInputs[1]?.value) || 0, // Victory Points ist das zweite Input-Feld
            greeneries: parseInt(playerInputs[2]?.value) || 0, // Greeneries ist das dritte Input-Feld
            cities: parseInt(playerInputs[3]?.value) || 0, // Cities ist das vierte Input-Feld
            milestones: parseInt(document.querySelector(`.player${i}.milestone-points`)?.value) || 0,
            awardPoints: parseInt(document.querySelector(`.player${i}.award-points`)?.value) || 0,
            totalScore: parseInt(document.getElementById(`sum${i}`)?.textContent) || 0
        };
        players.push(player);
    }

    const gameData = {
        timestamp: date,
        board: board,
        gameModes: gameModes,
        expansions: expansions,
        players: players
    };

    const jsonString = JSON.stringify(gameData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `game_data_${date.replace(/[:.]/g, "-")}.json`;
    link.click();
}

function initializePage() {
    console.log("🔄 Initializing Terraforming Mars VP Calculator...");
    updateCorporationOptions();
    updateMilestoneDropdowns();
    updateAwardDropdowns();
    updateAwardSlidersState();

    document.getElementById("board-select").addEventListener("change", function () {
        updateMilestoneDropdowns();
        updateAwardDropdowns();
    });

    document.getElementById("venusNext").addEventListener("change", function () {
        updateMilestoneDropdowns();
        updateAwardDropdowns();
    });

    document.querySelectorAll(".corporation-select").forEach(select => {
        select.addEventListener("change", updateCorporationOptions);
    });

    document.querySelectorAll('input[name="player-count"]').forEach(radio => {
        radio.addEventListener("change", updatePlayerCount);
    });

    document.querySelectorAll(".milestone-select").forEach(select => {
        select.addEventListener("change", updateMilestoneDropdowns);
    });

    document.querySelectorAll(".award-select").forEach(select => {
        select.addEventListener("change", updateAwardDropdowns);
    });

    document.querySelectorAll(".award-slider").forEach(slider => {
        slider.addEventListener("input", updateAwardSliders);
    });

    console.log("✅ Initialization complete.");
}

document.addEventListener("DOMContentLoaded", function () {
    initializePage();
    updateCorporationOptions();

    document.querySelectorAll(".expansions input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            updateCorporationOptions();
        });
    });
});
