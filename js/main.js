/* ==============================================
   COLOR MIXING GAME - MAIN GAME LOGIC WITH GALLERY
   ============================================== */

/**
 * Convert compressed pixel data back to coordinate arrays
 * @param {Array} pixelArray - Array of 2,500 color indices
 * @param {number} numColors - Number of color groups
 * @returns {Array} Array of pixel coordinate arrays for each color
 */
function decodePixelData(pixelArray, numColors) {
  console.log(
    `Decoding ${pixelArray.length} pixels into ${numColors} colors...`
  );

  // Create empty arrays for each color
  const colorPixels = [];
  for (let i = 0; i < numColors; i++) {
    colorPixels[i] = [];
  }

  // Go through each pixel and add to appropriate color array
  pixelArray.forEach((colorIndex, pixelIndex) => {
    if (colorIndex > 0 && colorIndex <= numColors) {
      const x = pixelIndex % 50;
      const y = Math.floor(pixelIndex / 50);
      colorPixels[colorIndex - 1].push([x, y]);
    }
  });

  // Log resultss
  colorPixels.forEach((pixels, index) => {
    console.log(`Color ${index + 1}: ${pixels.length} pixels`);
  });

  return colorPixels;
}

// Game state - completely data-driven
let gameState = {
  // Gallery navigation
  currentScreen: "home", // home, gallery, wing, game
  currentWing: null,
  currentPainting: null,

  // Current painting and progress
  currentPaintingData: null, // Will load from PAINTINGS data
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
  console.log("Gallery game loaded successfully!");
  setupGalleryGame();
});

/* ==============================================
   GALLERY NAVIGATION SYSTEM
   ============================================== */

/**
 * Initialize the gallery interface and event listeners
 */
function setupGalleryGame() {
  console.log("Setting up gallery game...");

  // Initialize painting canvas
  paintingCanvas = new PaintingCanvas("painting-canvas");

  // Set up gallery navigation event listeners
  const enterGalleryBtn = document.getElementById("enter-gallery-btn");
  const backToGalleryBtn = document.getElementById("back-to-gallery");

  if (enterGalleryBtn) enterGalleryBtn.addEventListener("click", showGallery);
  if (backToGalleryBtn) backToGalleryBtn.addEventListener("click", showGallery);

  // Set up existing game event listeners
  const startMixingBtn = document.getElementById("start-mixing-from-target");
  const submitBtn = document.getElementById("submit-color-btn");
  const slider = document.getElementById("mix-slider");

  if (startMixingBtn)
    startMixingBtn.addEventListener("click", startMixingFromTarget);
  if (submitBtn) submitBtn.addEventListener("click", submitColor);
  if (slider) slider.addEventListener("input", updateSlider);

  // Start with home screen
  showScreen("home");
  console.log("Gallery game setup complete!");
}

/**
 * Show a specific screen and hide others
 * @param {string} screenId - Screen to show: home, gallery, wing, game
 */
function showScreen(screenId) {
  console.log(`Showing screen: ${screenId}`);

  // Hide all screens
  const screens = [
    "home-screen",
    "gallery-screen",
    "wing-screen",
    "game-screen",
  ];
  screens.forEach((screen) => {
    const element = document.getElementById(screen);
    if (element) element.classList.add("hidden");
  });

  // Show requested screen
  const targetScreen = document.getElementById(`${screenId}-screen`);
  if (targetScreen) {
    targetScreen.classList.remove("hidden");
    gameState.currentScreen = screenId;
  }
}

/**
 * Show the gallery with all wings
 */
function showGallery() {
  console.log("Entering gallery...");
  showScreen("gallery");
  renderWings();
}

/**
 * Show a specific wing with its paintings
 * @param {string} wingId - Wing to display
 */
function showWing(wingId) {
  console.log(`Entering wing: ${wingId}`);

  const wing = getWing(wingId);
  if (!wing) {
    console.error(`Wing ${wingId} not found`);
    return;
  }

  gameState.currentWing = wingId;
  showScreen("wing");

  // Update wing header
  document.getElementById("wing-title").textContent = wing.name;
  document.getElementById("wing-description").textContent = wing.description;

  // Render paintings in this wing
  renderWingPaintings(wingId);
}

/**
 * Select a painting and start the game
 * @param {string} paintingId - Painting to play
 * @param {string} difficulty - Difficulty level: easy, normal, hard
 */
function selectPainting(paintingId, difficulty = "normal") {
  console.log(`Selecting painting: ${paintingId}, difficulty: ${difficulty}`);

  const paintingInfo = getPainting(paintingId);
  if (!paintingInfo) {
    console.error(`Painting ${paintingId} not found`);
    return;
  }

  // Check if painting data exists
  const paintingData = getPaintingGameData(paintingId);
  if (!paintingData) {
    alert(`${paintingInfo.name} is not ready to play yet. Check back soon!`);
    return;
  }

  // Store current painting selection
  gameState.currentPainting = paintingId;

  // Initialize game with the selected painting
  const success = initializeGame(paintingData);
  if (success) {
    showScreen("game");
  }
}

/* ==============================================
   GALLERY RENDERING FUNCTIONS
   ============================================== */

/**
 * Render all wings in the gallery
 */
function renderWings() {
  const wingsGrid = document.getElementById("wings-grid");
  if (!wingsGrid) return;

  const wings = getWingsSorted();

  wingsGrid.innerHTML = wings
    .map(
      (wing) => `
    <div class="wing-card" onclick="showWing('${wing.id}')">
      <h3>${wing.name}</h3>
      <p>${wing.description}</p>
      <div class="painting-count">${wing.paintings.length} masterpieces</div>
    </div>
  `
    )
    .join("");

  console.log(`Rendered ${wings.length} wings`);
}

/**
 * Render paintings in a specific wing
 * @param {string} wingId - Wing to render paintings for
 */
function renderWingPaintings(wingId) {
  const paintingsGrid = document.getElementById("paintings-grid");
  if (!paintingsGrid) return;

  const paintings = getWingPaintings(wingId);

  paintingsGrid.innerHTML = paintings
    .map((painting) => renderPaintingCard(painting, wingId))
    .join("");

  console.log(`Rendered ${paintings.length} paintings for wing ${wingId}`);
}

/**
 * Render a single painting card
 * @param {Object} painting - Painting data
 * @param {string} wingId - Wing this painting belongs to
 * @returns {string} HTML for painting card
 */
function renderPaintingCard(painting, wingId) {
  const isAvailable = painting.status === "available";
  const isLocked = painting.status === "locked";
  const hasGameData = hasPaintingData(painting.id);

  const statusText = isAvailable ? "Available to Play" : "Locked";
  const statusClass = isAvailable ? "status-available" : "status-locked";

  return `
    <div class="painting-card ${painting.status}" 
         ${isAvailable ? `onclick="selectPainting('${painting.id}')"` : ""}>
      
      <div class="painting-image">
        <div class="placeholder-icon">🎨</div>
        ${isLocked ? '<div class="lock-overlay">🔒</div>' : ""}
      </div>
      
      <div class="painting-info">
        <h4>${painting.name}</h4>
        <div class="painting-meta">
          ${painting.artist} • ${painting.year}
        </div>
        
        <div class="painting-status">
          <span class="${statusClass}">${statusText}</span>
          ${
            !hasGameData
              ? '<span style="color: #ff9800;">• Coming Soon</span>'
              : ""
          }
        </div>
        
        <div class="difficulty-indicators">
          <span class="difficulty-badge ${
            isAvailable ? "difficulty-easy" : "difficulty-locked"
          }">
            Easy
          </span>
          <span class="difficulty-badge difficulty-locked">Normal</span>
          <span class="difficulty-badge difficulty-locked">Hard</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Load painting data from compressed format if available
 * @param {string} paintingId - ID of painting to load
 * @returns {Object} Painting data with pixels arrays
 */
function loadPaintingData(paintingId) {
  console.log(`Loading painting: ${paintingId}`);

  // Check if compressed data exists
  if (typeof PIXEL_DATA !== "undefined" && PIXEL_DATA[paintingId]) {
    console.log("Using compressed data format");

    // Get original painting (without pixels)
    const painting = PAINTINGS[paintingId];

    // Decode compressed pixels
    const compressedData = PIXEL_DATA[paintingId];
    const decodedPixels = decodePixelData(
      compressedData.pixels,
      painting.colorGroups.length
    );

    // Create new painting object with decoded pixels
    const paintingWithPixels = {
      ...painting,
      colorGroups: painting.colorGroups.map((group, index) => ({
        ...group,
        pixels: decodedPixels[index],
      })),
    };

    return paintingWithPixels;
  } else {
    console.log("Using original data format");
    return PAINTINGS[paintingId];
  }
}

/**
 * Initialize a new game with specified painting data
 * @param {Object} paintingData - Painting data from PAINTINGS
 */
function initializeGame(paintingData) {
  console.log(`Initializing game with painting: ${paintingData.name}`);

  // Store painting data
  gameState.currentPaintingData = loadPaintingData(paintingData.id);
  // Reset game state
  gameState.currentColorGroupIndex = 0;
  gameState.currentStage = 1;
  gameState.completedColors = [];
  gameState.totalScore = 0;

  // Clear and prepare canvas
  if (paintingCanvas) {
    paintingCanvas.clear();
  }

  // Reset UI elements for new game
  document.getElementById("score-section").classList.add("hidden");
  document.getElementById("painting-section").classList.add("hidden");
  document.getElementById("game-header").classList.remove("hidden");
  document.getElementById("target-section").classList.remove("hidden");
  document.getElementById("mixing-section").classList.add("hidden");

  // Re-enable submit button
  const submitBtn = document.getElementById("submit-color-btn");
  if (submitBtn) submitBtn.disabled = false;

  // Load first color
  loadCurrentColor();

  return true;
}

/**
 * Load the current color group and stage into gameState.currentMix
 */
function loadCurrentColor() {
  const painting = gameState.currentPaintingData;
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
    gameState.currentMix.color2 = stage.colors[1];
  }

  // Target is always the final target for this color group
  gameState.currentMix.target = colorGroup.targetRGB;

  console.log(
    "Loaded color:",
    colorGroup.name,
    "stage",
    gameState.currentStage
  );

  // Update UI
  updateGameUI();

  return true;
}

/**
 * Update all UI elements based on current game state
 */
function updateGameUI() {
  const painting = gameState.currentPaintingData;
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
  // Initialize painting canvas
  paintingCanvas = new PaintingCanvas("painting-canvas");
  paintingCanvas.testDraw(); // This will show 4 colored pixels in corners
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
  const success = initializeGame();

  if (success) {
    console.log("Game setup complete!");
  } else {
    console.error("Failed to initialize game!");
  }
  // TEMPORARY: Test compressed data loading
  if (window.location.search.includes("compressed=true")) {
    console.log("🧪 COMPRESSED DATA TEST MODE ACTIVE");
    testCompressedData();
  }
}

/**
 * Test function to verify compressed data works correctly
 */
function testCompressedData() {
  console.log("Testing compressed data...");

  // Check if compressed data is loaded
  if (typeof PIXEL_DATA === "undefined") {
    console.error("PIXEL_DATA not found! Did you include pixelData.js?");
    return;
  }

  const compressedPainting = PIXEL_DATA.girlwithapearlearring;
  console.log("Compressed data found:", compressedPainting);

  // Decode the pixel data
  const decodedPixels = decodePixelData(compressedPainting.pixels, 6);

  // Compare with original
  const originalPainting = PAINTINGS.girlwithapearlearring;
  console.log("\n=== COMPARISON ===");

  originalPainting.colorGroups.forEach((group, index) => {
    const originalCount = group.pixels.length;
    const decodedCount = decodedPixels[index].length;
    const match = originalCount === decodedCount ? "✅" : "❌";

    console.log(
      `${match} Color ${
        index + 1
      }: Original=${originalCount}, Decoded=${decodedCount}`
    );
  });
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
  document.body.style.overflow = "auto";

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
      gameState.currentPaintingData.colorGroups[
        gameState.currentColorGroupIndex
      ];
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
    gameState.currentPaintingData.colorGroups[gameState.currentColorGroupIndex];

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

    // NEW: Reveal pixels on canvas for completed color
    revealColorOnCanvas(gameState.currentColorGroupIndex, mixed);

    // Show score and painting sections after first color completion
    if (gameState.completedColors.length === 1) {
      document.getElementById("score-section").classList.remove("hidden");
      document.getElementById("painting-section").classList.remove("hidden");
    }

    // Move to next color
    gameState.currentColorGroupIndex++;
    gameState.currentStage = 1; // Reset stage for next color

    // Check if game is complete
    if (
      gameState.currentColorGroupIndex >=
      gameState.currentPaintingData.colorGroups.length
    ) {
      document.getElementById("painting-section-title").textContent =
        "Your Masterpiece!";

      // Game complete!
      showGameMessage(
        "Game Complete!",
        `Amazing work! Final Score: ${gameState.totalScore}`,
        function () {
          console.log("Game completion message dismissed");
        }
      );

      // ENHANCED: Hide ALL game interface elements after completion
      document.getElementById("mixing-section").classList.add("hidden");
      document.getElementById("target-section").classList.add("hidden");
      document.getElementById("game-header").classList.add("hidden"); // Hide round info

      // Show only the final painting and score
      document.getElementById("score-section").classList.remove("hidden");
      document.getElementById("painting-section").classList.remove("hidden");

      // Update score to show TOTAL instead of last round
      document.getElementById("current-score").textContent =
        gameState.totalScore;

      // Prevent any further interaction
      document.getElementById("submit-color-btn").disabled = true;

      console.log("Game completed - UI cleaned up");
      return; // Exit function early to prevent further processing
    } else {
      // Load next color
      loadCurrentColor();

      // Hide mixing interface, show target button again
      document.getElementById("mixing-section").classList.add("hidden");
      document.getElementById("target-section").classList.remove("hidden");
    }
  }
}

/**
 * Reveal pixels on canvas when a color is completed
 */
function revealColorOnCanvas(colorGroupIndex, finalColor) {
  const colorGroup = gameState.currentPaintingData.colorGroups[colorGroupIndex];

  console.log(
    `Revealing ${colorGroup.pixels.length} pixels for ${colorGroup.name}`
  );

  // Draw each pixel for this color group
  colorGroup.pixels.forEach(([x, y]) => {
    paintingCanvas.drawPixel(x, y, finalColor);
  });

  console.log("Pixels revealed on canvas");
}
