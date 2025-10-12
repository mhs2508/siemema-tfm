window.addEventListener("DOMContentLoaded", () => {
  let button = document.querySelector("#generate-button");
  button.addEventListener("click", handleButtonClick);

  activeRestrictionForExtensions();
});

const getRandomNumber = (size) => {
  return Math.floor(Math.random() * size);
};

const getRandomBoolean = () => {
  return Math.random() < 0.5;
};

const handleButtonClick = () => {
  const availableGameBoards = getAllSelectedBoards();
  const availableGameModes = getAllSelectedGameModes();
  const availableGameExtensions = getAllSelectedGameExtensions();
  const availableGameVariants = getAllSelectedGameVariants();

  const randomBoard = availableGameBoards.at(
    getRandomNumber(availableGameBoards.length)
  );
  const randomGameModes = availableGameModes.filter(() => getRandomBoolean());
  let randomGameExtensions = availableGameExtensions.filter(() =>
    getRandomBoolean()
  );
  const randomGameVariants = availableGameVariants.filter(() => getRandomBoolean());

  console.log("Random Extensions:" + randomGameExtensions);

  randomGameExtensions = randomGameExtensions.filter((extension) => {
    if (extension === "Turmoil") {
      return (
        randomGameExtensions.find((item) => item === "Venus-Next") &&
        randomGameExtensions.find((item) => item === "Colonies")
      );
    }
    if (extension === "Colonies") {
      return randomGameExtensions.find((item) => item === "Venus-Next");
    }
    return true;
  });

  document.querySelector("#selected-game-board").innerText = randomBoard;
  document.querySelector(
    "#selected-game-modes"
  ).innerText = randomGameModes.length ? randomGameModes.join(",") : "None";
  document.querySelector(
    "#selected-game-extensions"
  ).innerText = randomGameExtensions.length
    ? randomGameExtensions.join(",")
    : "None";

  document.querySelector("#selected-game-variants").innerText = randomGameVariants.length
    ? randomGameVariants.join(",")
    : "None";
};

const getAllSelectedBoards = () => {
  const boardsDiv = document.querySelector("#play-boards");
  const boards = [
    { id: "Tharsis", selected: false },
    { id: "Hellas", selected: false },
    { id: "Elysium", selected: false },
    { id: "Utopia", selected: false },
    { id: "Cimmeria", selected: false },
    { id: "Vastitas", selected: false },
    { id: "Amazonis", selected: false }
  ];

  for (let board of boards) {
    const input = boardsDiv.querySelector(`#${board.id}`);
    board.selected = input.checked;
  }

  return boards.filter((item) => item.selected).map((item) => item.id);
};

const getAllSelectedGameModes = () => {
  const modesDiv = document.querySelector("#play-modes");
  const modes = [
    { id: "Draft-Modus", selected: false },
    { id: "Solar-Phase", selected: false },
    { id: "Highlight-Draft", selected: false }
  ];

  for (let mode of modes) {
    const input = modesDiv.querySelector(`#${mode.id}`);
    mode.selected = input.checked;
  }

  return modes.filter((item) => item.selected).map((item) => item.id);
};

const getAllSelectedGameExtensions = () => {
  const extensionsDiv = document.querySelector("#play-extensions");
  const extensions = [
    { id: "Prelude", selected: false },
    { id: "Venus-Next", selected: false },
    { id: "Colonies", selected: false },
    { id: "Turmoil", selected: false },
    { id: "Promos", selected: false },
    { id: "Promos-Big-Box", selected: false }
  ];

  for (let extension of extensions) {
    const input = extensionsDiv.querySelector(`#${extension.id}`);
    extension.selected = input.checked;
  }

  return extensions.filter((item) => item.selected).map((item) => item.id);
};

// >>> NEU: Custom Game Variants
const getAllSelectedGameVariants = () => {
  const variantsDiv = document.querySelector("#play-variants");
  const variants = [
    { id: "Mergers", selected: false }
    // weitere Custom Variants hier hinzufügen
  ];

  for (let variant of variants) {
    const input = variantsDiv.querySelector(`#${variant.id}`);
    variant.selected = input.checked;
  }

  return variants.filter((item) => item.selected).map((item) => item.id);
};
// >>> ENDE NEU: Custom Game Variants

const activeRestrictionForExtensions = () => {
  const venusNextInput = document.querySelector("#Venus-Next");
  const coloniesInput = document.querySelector("#Colonies");
  const turmoilInput = document.querySelector("#Turmoil");
  venusNextInput.addEventListener("change", () => {
    if (!venusNextInput.checked) {
      coloniesInput.checked = false;
      turmoilInput.checked = false;
    }
    coloniesInput.disabled = !venusNextInput.checked;
    turmoilInput.disabled = !venusNextInput.checked;
  });

  coloniesInput.addEventListener("change", () => {
    if (!coloniesInput.checked) {
      turmoilInput.checked = false;
    }
    turmoilInput.disabled = !coloniesInput.checked;
  });
};
