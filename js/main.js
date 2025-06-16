/* ==============================================
   COLOR MIXING GAME - MAIN GAME LOGIC
   ============================================== */

// Test our color math functions
console.log("Testing color mixing...");

// Test mixing red + yellow = orange
const red = { r: 255, g: 0, b: 0 };
const yellow = { r: 255, g: 255, b: 0 };
const orange = mixColors(red, yellow, 0.5);
console.log("Red + Yellow =", orange);

// Test color distance
const distance = calculateColorDistance(red, yellow);
const score = distanceToScore(distance);
console.log("Distance between red and yellow:", distance);
console.log("Score:", score);
