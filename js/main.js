/* ==============================================
   COLOR MIXING GAME - MAIN GAME LOGIC
   ============================================== */

// Game state - tracks where we are in the game
let gameState = {
  currentColors: {
    color1: { r: 255, g: 0, b: 0 }, // Red
    color2: { r: 255, g: 255, b: 0 }, // Yellow
    target: { r: 255, g: 128, b: 0 }, // Orange target
  },
  sliderValue: 5, // Middle position (50%)
  currentScore: 0,
};

// Wait for page to load, then set up the game
document.addEventListener("DOMContentLoaded", function () {
  console.log("Game loaded successfully!");
  setupGame();
});

/**
 * Initialize the game interface and event listeners
 */
function setupGame() {
  // Get all button elements
  const startGameBtn = document.getElementById("start-game-btn");
  const viewTargetBtn = document.getElementById("view-target-btn");
  const startMixingBtn = document.getElementById("start-mixing-btn");
  const submitBtn = document.getElementById("submit-color-btn");
  const slider = document.getElementById("mix-slider");

  // Set up all event listeners
  if (startGameBtn) startGameBtn.addEventListener("click", startGame);
  if (viewTargetBtn) viewTargetBtn.addEventListener("click", showTargetColor);
  if (startMixingBtn) startMixingBtn.addEventListener("click", startMixing);
  if (submitBtn) submitBtn.addEventListener("click", submitColor);
  if (slider) slider.addEventListener("input", updateSlider);

  // Initialize display
  updateColorDisplay();
  updateSlider();

  console.log("Game setup complete!");
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
 * Show the target color in full-screen modal
 */
function showTargetColor() {
  console.log("Showing target color...");

  const modal = document.getElementById("target-modal");
  const targetDisplay = document.getElementById("target-color-display");

  // Set the target color background
  const target = gameState.currentColors.target;
  targetDisplay.style.backgroundColor = `rgb(${target.r}, ${target.g}, ${target.b})`;

  // Show modal by removing hidden class and setting display
  modal.classList.remove("hidden");
  modal.style.display = "flex";
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
 * Update the color swatch displays
 */
function updateColorDisplay() {
  const color1Display = document.getElementById("color1");
  const color2Display = document.getElementById("color2");

  if (color1Display && color2Display) {
    const c1 = gameState.currentColors.color1;
    const c2 = gameState.currentColors.color2;

    color1Display.style.backgroundColor = `rgb(${c1.r}, ${c1.g}, ${c1.b})`;
    color2Display.style.backgroundColor = `rgb(${c2.r}, ${c2.g}, ${c2.b})`;
  }
}

/**
 * Submit the mixed color and calculate score
 */
function submitColor() {
  console.log("Submitting color...");

  // Calculate mixed color based on slider position
  const ratio = gameState.sliderValue / 10; // Convert 0-10 to 0-1
  const mixed = mixColors(
    gameState.currentColors.color1,
    gameState.currentColors.color2,
    ratio
  );

  // Calculate how close we got to the target
  const distance = calculateColorDistance(
    mixed,
    gameState.currentColors.target
  );
  const score = distanceToScore(distance);

  // Update score display
  gameState.currentScore = score;
  document.getElementById("current-score").textContent = score;

  console.log("Mixed color:", mixed);
  console.log("Target color:", gameState.currentColors.target);
  console.log("Score:", score);

  // Show results
  alert(
    `You scored ${score} points! Mixed color: rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`
  );
}
