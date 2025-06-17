/* ==============================================
   COLOR MIXING GAME - MAIN GAME LOGIC
   ============================================== */

// Game state - completely data-driven
let gameState = {
  // Current painting and progress
  currentPainting: null, // Will load from PAINTINGS data
  currentColorGroupIndex: 0, // Which color we're working on (0-5)
  currentStage: 1, // Which stage of current color (1, 2, etc.)

  // UI state
  sliderValue: 5, // Slider position (0-10)

  // Game progress
  completedColors: [], // Array of completed color results
  totalScore: 0, // Running total across all colors

  // Current mixing state (gets reset each color/stage)
  currentMix: {
    color1: null, // Will be set from painting data
    color2: null, // Will be set from painting data
    target: null, // Will be set from painting data
    previousStageResult: null, // For multi-stage mixing
  },
};

// Wait for page to load, then set up the game
document.addEventListener("DOMContentLoaded", function () {
  console.log("Game loaded successfully!");
  setupGame();
});

/* ==============================================
   GAME CONTROLLER - MANAGES PAINTING FLOW
   ============================================== */

/**
 * Initialize a new game with specified painting
 * @param {string} paintingId - ID of painting to load
 */
function initializeGame(paintingId = "girlWithPearl") {
  console.log(`Initializing game with painting: ${paintingId}`);

  // Load painting data
  gameState.currentPainting = PAINTINGS[paintingId];

  if (!gameState.currentPainting) {
    console.error(`Painting ${paintingId} not found!`);
    return false;
  }

  // Reset game state
  gameState.currentColorGroupIndex = 0;
  gameState.currentStage = 1;
  gameState.completedColors = [];
  gameState.totalScore = 0;

  // Load first color
  loadCurrentColor();

  return true;
}

/**
 * Load the current color group and stage into gameState.currentMix
 */
function loadCurrentColor() {
  const painting = gameState.currentPainting;
  const colorGroup = painting.colorGroups[gameState.currentColorGroupIndex];
  const stage = colorGroup.stages[gameState.currentStage - 1];

  if (!colorGroup || !stage) {
    console.error("Invalid color group or stage");
    return false;
  }

  // Set up current mix based on stage
  if (gameState.currentStage === 1) {
    // First stage - use colors from data
    gameState.currentMix.color1 = stage.colors[0];
    gameState.currentMix.color2 = stage.colors[1];
    gameState.currentMix.previousStageResult = null;
  } else {
    // Later stage - first color is previous result
    gameState.currentMix.color1 = gameState.currentMix.previousStageResult;
    gameState.currentMix.color2 = stage.colors[1]; // Second color from data
  }

  // Target is always the final target for this color group
  gameState.currentMix.target = colorGroup.targetRGB;

  console.log(
    `Loaded color: ${colorGroup.name}, stage ${gameState.currentStage}/${colorGroup.stages.length}`
  );

  // Update UI
  updateGameUI();

  return true;
}

/**
 * Update all UI elements based on current game state
 */
function updateGameUI() {
  const painting = gameState.currentPainting;
  const colorGroup = painting.colorGroups[gameState.currentColorGroupIndex];

  // Update round info
  const totalColors = painting.colorGroups.length;
  document.getElementById("round-info").textContent = `Round ${
    gameState.currentColorGroupIndex + 1
  } of ${totalColors}`;

  // Update color name
  document.getElementById("color-name").textContent = colorGroup.name;

  // Update stage info (show only if multi-stage)
  const stageInfo = document.getElementById("stage-info");
  if (colorGroup.stages.length > 1) {
    stageInfo.textContent = `Stage ${gameState.currentStage} of ${colorGroup.stages.length}`;
    stageInfo.classList.remove("hidden");
  } else {
    stageInfo.classList.add("hidden");
  }

  // Update color swatches
  updateColorDisplay();

  // Show target color directly
  const targetPreview = document.getElementById("target-color-preview");
  if (targetPreview) {
    const target = gameState.currentMix.target;
    targetPreview.style.backgroundColor = `rgb(${target.r}, ${target.g}, ${target.b})`;
  }
}

/**
 * Initialize the game interface and event listeners
 */
function setupGame() {
  // Set up all event listeners
  const startGameBtn = document.getElementById("start-game-btn");
  const startMixingBtn = document.getElementById("start-mixing-from-target");
  const submitBtn = document.getElementById("submit-color-btn");
  const slider = document.getElementById("mix-slider");

  if (startGameBtn) startGameBtn.addEventListener("click", startGame);
  if (startMixingBtn)
    startMixingBtn.addEventListener("click", startMixingFromTarget);
  if (startMixingBtn) startMixingBtn.addEventListener("click", startMixing);
  if (submitBtn) submitBtn.addEventListener("click", submitColor);
  if (slider) slider.addEventListener("input", updateSlider);

  // Initialize the game data
  const success = initializeGame("girlWithPearl");

  if (success) {
    console.log("Game setup complete!");
  } else {
    console.error("Failed to initialize game!");
  }
}

/* ==============================================
   MODERN MESSAGE SYSTEM
   ============================================== */

/**
 * Show a game message with modern overlay (replaces alert boxes)
 * @param {string} title - Message title
 * @param {string} text - Message content
 * @param {function} callback - Function to run when user continues
 */
function showGameMessage(title, text, callback) {
  // Set message content
  document.getElementById("message-title").textContent = title;
  document.getElementById("message-text").textContent = text;

  // Show overlay
  const overlay = document.getElementById("message-overlay");
  overlay.classList.remove("hidden");

  // Handle continue button
  const continueBtn = document.getElementById("message-continue");
  const newContinueBtn = continueBtn.cloneNode(true); // Remove old listeners
  continueBtn.parentNode.replaceChild(newContinueBtn, continueBtn);

  newContinueBtn.addEventListener("click", function () {
    hideGameMessage();
    if (callback) callback();
  });

  // Handle keyboard shortcuts (Enter/Space)
  function handleKeyPress(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      hideGameMessage();
      document.removeEventListener("keydown", handleKeyPress);
      if (callback) callback();
    }
  }

  document.addEventListener("keydown", handleKeyPress);

  // Focus the continue button for accessibility
  newContinueBtn.focus();
}

/**
 * Hide the game message overlay
 */
function hideGameMessage() {
  document.getElementById("message-overlay").classList.add("hidden");
}

/**
 * Start the game - hide welcome, show game screen
 */
function startGame() {
  console.log("Starting game...");

  // Hide welcome screen
  document.getElementById("welcome-screen").classList.add("hidden");

  // Show game screen
  document.getElementById("game-screen").classList.remove("hidden");
}

/**
 * Start mixing directly from target display (replaces modal flow)
 */
function startMixingFromTarget() {
  console.log("Starting mixing from target display...");

  // Hide the target section
  document.getElementById("target-section").classList.add("hidden");

  // Show the mixing section
  document.getElementById("mixing-section").classList.remove("hidden");
}

/**
 * Hide target modal and show mixing interface
 */
function startMixing() {
  console.log("Starting mixing interface...");

  // Hide the target modal
  const modal = document.getElementById("target-modal");
  modal.classList.add("hidden");
  modal.style.display = "none";

  // Show the mixing section
  document.getElementById("mixing-section").classList.remove("hidden");
}

/**
 * Update slider percentage display
 */
function updateSlider() {
  const slider = document.getElementById("mix-slider");
  const percentage = document.getElementById("percentage");

  if (slider && percentage) {
    gameState.sliderValue = parseInt(slider.value);
    const percent = gameState.sliderValue * 10;
    percentage.textContent = percent + "%";
  }
}

/**
 * Update the color swatch displays and names
 */
function updateColorDisplay() {
  const color1Display = document.getElementById("color1");
  const color2Display = document.getElementById("color2");

  if (color1Display && color2Display) {
    const c1 = gameState.currentMix.color1;
    const c2 = gameState.currentMix.color2;

    color1Display.style.backgroundColor = `rgb(${c1.r}, ${c1.g}, ${c1.b})`;
    color2Display.style.backgroundColor = `rgb(${c2.r}, ${c2.g}, ${c2.b})`;

    // Update color names from data
    const colorGroup =
      gameState.currentPainting.colorGroups[gameState.currentColorGroupIndex];
    const stage = colorGroup.stages[gameState.currentStage - 1];
    const color1Name = document.getElementById("color1-name");
    const color2Name = document.getElementById("color2-name");

    if (gameState.currentStage === 1) {
      // First stage - use names from painting data
      color1Name.textContent = stage.colors[0].name;
      color2Name.textContent = stage.colors[1].name;
    } else {
      // Later stages - first color is previous mix
      color1Name.textContent = "Previous Mix";
      color2Name.textContent = stage.colors[1].name;
    }
  }
}

/**
 * Submit the mixed color and calculate score
 */
/**
 * Submit the mixed color and calculate score
 */
function submitColor() {
  console.log("Submitting color...");

  // Calculate mixed color based on slider position
  const ratio = gameState.sliderValue / 10; // Convert 0-10 to 0-1
  const mixed = mixColors(
    gameState.currentMix.color1,
    gameState.currentMix.color2,
    ratio
  );

  const colorGroup =
    gameState.currentPainting.colorGroups[gameState.currentColorGroupIndex];

  // Check if this color has more stages
  if (gameState.currentStage < colorGroup.stages.length) {
    // Multi-stage: Store result and move to next stage
    console.log(
      `Stage ${gameState.currentStage} complete. Moving to stage ${
        gameState.currentStage + 1
      }`
    );

    // Store the mixed result for next stage
    gameState.currentMix.previousStageResult = mixed;

    // Move to next stage
    gameState.currentStage++;

    // Load next stage
    loadCurrentColor();

    // Show stage completion message
    showGameMessage(
      `Stage ${gameState.currentStage - 1} Complete!`,
      `Great mix! Now starting Stage ${gameState.currentStage}...`,
      function () {
        console.log("Stage message dismissed");
      }
    );
  } else {
    // Final stage: Calculate score against target
    const distance = calculateColorDistance(mixed, gameState.currentMix.target);
    const score = distanceToScore(distance);

    // Update score display
    gameState.currentScore = score;
    document.getElementById("current-score").textContent = score;

    console.log("Final mixed color:", mixed);
    console.log("Target color:", gameState.currentMix.target);
    console.log("Final score:", score);

    // Show final results

    showGameMessage(
      `Color Complete!`,
      `You scored ${score} points!\nGreat color mixing!`,
      function () {
        console.log("Color completion message dismissed");
      }
    );

    // Store completed color and score
    gameState.completedColors.push({
      colorName: colorGroup.name,
      score: score,
      finalColor: mixed,
    });
    gameState.totalScore += score;

    // Move to next color
    gameState.currentColorGroupIndex++;
    gameState.currentStage = 1; // Reset stage for next color

    // Check if game is complete
    if (
      gameState.currentColorGroupIndex >=
      gameState.currentPainting.colorGroups.length
    ) {
      // Game complete!
      alert(`Game Complete! Total Score: ${gameState.totalScore}`);
      // TODO: Show completion screen later
    } else {
      // Load next color
      loadCurrentColor();

      // Hide mixing interface, show target button again
      document.getElementById("mixing-section").classList.add("hidden");
      document.getElementById("target-section").classList.remove("hidden");
    }
  }
}
