window.addEventListener("DOMContentLoaded", () => {
  // --- Main generator ---
  document.querySelector("#generate-button")
    .addEventListener("click", handleButtonClick);

  // --- Clear All output ---
  document.querySelector("#clear-all-button")
    .addEventListener("click", clearAll);

  // --- Reroll Milestones & Awards ---
  document.querySelector("#reroll-ma-button")
    .addEventListener("click", () => {
      generateRandomMA();
      renderMA();
    });

  // --- Clear only M&A ---
  document.querySelector("#clear-ma-button")
    .addEventListener("click", () => {
      selectedMilestones = [];
      selectedAwards = [];
      renderMA();
    });

  // Do NOT generate M&A automatically on load
  renderMA();   // shows empty until user clicks "Reroll M&A"
});


/* ------------------------------ Utilities ------------------------------ */

const getRandomNumber = (size) => Math.floor(Math.random() * size);
const getRandomBoolean = () => Math.random() < 0.5;

/* ------------------------------ Clear All ------------------------------ */

const clearAll = () => {
  // Game output
  document.querySelector("#selected-game-board").innerText = "";
  document.querySelector("#selected-game-modes").innerText = "";
  document.querySelector("#selected-game-extensions").innerText = "";
  document.querySelector("#selected-game-variants").innerText = "";

  // M&A
  selectedMilestones = [];
  selectedAwards = [];
  renderMA();
};

/* ------------------------------ MILESTONES & AWARDS LIST ------------------------------ */

const MILESTONES = {
  "Architect": "3 City tags",
  "Briber": "Pay 12 M€ extra when claiming",
  "Builder": "7 building tags",
  "Coastguard": "3 tiles adjacent to ocean",
  "Diversifier": "8 different tags",
  "Ecologist": "4 bio tags",
  "Energizer": "6 energy production",
  "Engineer": "10 combined energy + heat production",
  "Farmer": "5 animal + microbe resources",
  "Forester": "3 plant production",
  "Fundraiser": "12 M€ production",
  "Gardener": "3 greeneries",
  "Generalist": "1 production of each resource",
  "Geologist": "3 volcanic area tiles",
  "Hydrologist": "Placed 4 oceans",
  "Landshaper": "1 city, 1 greenery, 1 special",
  "Legend": "4 event cards",
  "Lobbyist": "7 delegates in parties",
  "Mayor": "3 cities",
  "Merchant": "2 of each resource",
  "Metallurgist": "6 steel + titanium production",
  "Philantropist": "5 cards with non-negative VP",
  "Pioneer": "4 colonies",
  "Planetologist": "2 Earth, 2 Venus, 2 Jovian tags",
  "Planner": "16 cards in hand",
  "Producer": "Total production ≥ 16",
  "Researcher": "4 science tags",
  "Rim settler": "3 Jovian tags",
  "Spacefarer": "4 space tags",
  "Sponsor": "3 cards costing 20+",
  "Tactician": "4 cards with requirements",
  "Terraformer": "29 TR",
  "Terran": "5 Earth tags",
  "Thawer": "Raised temperature 5 times",
  "Trader": "3 resource types on cards"
};

const AWARDS = {
  "Administrator": "Most cards with no tags",
  "Banker": "Highest M€ production",
  "Benefactor": "Highest TR",
  "Biologist": "Most bio tags",
  "Botanist": "Highest plant production",
  "Celebrity": "Most 20+ cost cards",
  "Collector": "Most resource types",
  "Constructor": "Most colonies + cities",
  "Contractor": "Most building tags",
  "Cultivator": "Most greeneries",
  "Electrician": "Most power tags",
  "Estate Dealer": "Most tiles next to ocean",
  "Excentric": "Most resources on cards",
  "Forecaster": "Most cards with requirements",
  "Founder": "Most tiles adjacent to special tiles",
  "Highlander": "Most tiles not next to ocean",
  "Incorporator": "Most cards costing 10 or less",
  "Industrialist": "Most steel + energy resources",
  "Investor": "Most Earth tags",
  "Landlord": "Most tiles",
  "Landscaper": "Largest connected tile group",
  "Magnate": "Most green cards",
  "Manufacturer": "Highest steel + heat production",
  "Metropolist": "Most cities",
  "Miner": "Most steel + titanium resources",
  "Mogul": "Highest total production (non-M€)",
  "Politician": "Most leaders + influence",
  "Promoter": "Most event pile cards",
  "Scientist": "Most science tags",
  "Space Baron": "Most space tags",
  "Suburbian": "Most tiles along edges",
  "Thermalist": "Most heat resources",
  "Traveller": "Most Jovian + Earth tags",
  "Visionary": "Most cards in hand",
  "Zoologist": "Most animal + microbe resources"
};

/* ------------------------------ Random M&A ------------------------------ */

let selectedMilestones = [];
let selectedAwards = [];

const pickRandom = (obj, count) => {
  const keys = Object.keys(obj);
  const out = [];
  while (out.length < count) {
    const k = keys[getRandomNumber(keys.length)];
    if (!out.includes(k)) out.push(k);
  }
  return out;
};

const generateRandomMA = () => {
  const six = document.querySelector("#six-ma").checked;
  const count = six ? 6 : 5;

  selectedMilestones = pickRandom(MILESTONES, count);
  selectedAwards = pickRandom(AWARDS, count);
};

const renderMA = () => {
  document.querySelector("#selected-milestones").innerHTML =
    selectedMilestones.length
      ? selectedMilestones
          .map(name => `<span title="${MILESTONES[name]}">${name}</span>`)
          .join(", ")
      : "<i>None</i>";

  document.querySelector("#selected-awards").innerHTML =
    selectedAwards.length
      ? selectedAwards
          .map(name => `<span title="${AWARDS[name]}">${name}</span>`)
          .join(", ")
      : "<i>None</i>";
};

/* ------------------------------ Game Generator ------------------------------ */

const handleButtonClick = () => {
  const availableBoards = getAllSelectedBoards();
  const availableModes = getAllSelectedGameModes();
  const availableExt = getAllSelectedGameExtensions();
  const availableVariants = getAllSelectedGameVariants();

  const randomBoard = availableBoards.at(getRandomNumber(availableBoards.length));
  const randomModes = availableModes.filter(() => getRandomBoolean());
  let randomExt = availableExt.filter(() => getRandomBoolean());
  const randomVariants = availableVariants.filter(() => getRandomBoolean());

  // No restrictions anymore
  randomExt = randomExt;

  document.querySelector("#selected-game-board").innerText = randomBoard;
  document.querySelector("#selected-game-modes").innerText =
    randomModes.length ? randomModes.join(", ") : "None";
  document.querySelector("#selected-game-extensions").innerText =
    randomExt.length ? randomExt.join(", ") : "None";
  document.querySelector("#selected-game-variants").innerText =
    randomVariants.length ? randomVariants.join(", ") : "None";
};

/* ------------------------------ Selection Helpers ------------------------------ */

const getAllSelectedBoards = () => {
  const ids = ["Tharsis", "Hellas", "Elysium", "Utopia", "Cimmeria", "Vastitas", "Amazonis"];
  return ids.filter(id => document.querySelector(`#${id}`).checked);
};

const getAllSelectedGameModes = () => {
  const ids = ["Draft-Modus", "Solar-Phase", "Highlight-Draft"];
  return ids.filter(id => document.querySelector(`#${id}`).checked);
};

const getAllSelectedGameExtensions = () => {
  const ids = ["Prelude", "Venus-Next", "Colonies", "Turmoil", "Promos", "Promos-Big-Box"];
  return ids.filter(id => document.querySelector(`#${id}`).checked);
};

const getAllSelectedGameVariants = () => {
  const ids = ["Mergers", "Random-MA"];
  return ids.filter(id => document.querySelector(`#${id}`).checked);
};