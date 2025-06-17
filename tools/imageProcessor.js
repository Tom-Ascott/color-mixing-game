/* ==============================================
   IMAGE PROCESSOR - BASIC FILE LOADING
   ============================================== */

// Global variables to store our canvases and image data
let originalCanvas, resizedCanvas;
let originalCtx, resizedCtx;
let loadedImage = null;

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("Image processor loaded!");

  // Get canvas elements and contexts
  originalCanvas = document.getElementById("originalCanvas");
  resizedCanvas = document.getElementById("resizedCanvas");
  originalCtx = originalCanvas.getContext("2d");
  resizedCtx = resizedCanvas.getContext("2d");

  // Set up file input listener
  document
    .getElementById("imageInput")
    .addEventListener("change", loadImageFile);

  console.log("Image processor ready!");
});

/**
 * Load and display an image file in the original canvas
 */
function loadImageFile(event) {
  const file = event.target.files[0];

  if (!file) {
    console.log("No file selected");
    return;
  }

  console.log("Loading file:", file.name);

  // Create a FileReader to read the image
  const reader = new FileReader();

  reader.onload = function (e) {
    // Create an Image object
    const img = new Image();

    img.onload = function () {
      console.log("Image loaded:", img.width, "x", img.height);

      // Store the loaded image
      loadedImage = img;

      // Clear the canvas
      originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);

      // Draw the image to fit the canvas (300x300)
      originalCtx.drawImage(img, 0, 0, 300, 300);

      console.log("Image displayed in original canvas");
    };

    // Set the image source to the file data
    img.src = e.target.result;
  };

  // Read the file as data URL
  reader.readAsDataURL(file);
}

// Placeholder functions for other steps (will implement later)
function resizeImage() {
  console.log("Resize function - coming soon!");
}

/**
 * Extract all pixel colors and quantize to game colors
 */
function processColors() {
  if (!loadedImage) {
    alert("Please resize an image first!");
    return;
  }

  console.log("Extracting pixel colors...");

  // Create a temporary 50x50 canvas to get exact pixel data
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 50;
  tempCanvas.height = 50;
  const tempCtx = tempCanvas.getContext("2d");

  // Draw the image at exactly 50x50 pixels
  tempCtx.drawImage(loadedImage, 0, 0, 50, 50);

  // Get all pixel data (50x50 = 2,500 pixels)
  const imageData = tempCtx.getImageData(0, 0, 50, 50);
  const pixels = imageData.data; // RGBA array: [r,g,b,a, r,g,b,a, ...]

  console.log("Extracted", pixels.length / 4, "pixels");

  // Convert to RGB objects and collect all colors
  const allColors = [];
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    // Skip alpha (pixels[i + 3])

    allColors.push({ r, g, b });
  }

  console.log("Sample colors:", allColors.slice(0, 5));

  // Simple color quantization - find the 4 most different colors
  const dominantColors = findDominantColors(allColors, 4);

  console.log("Dominant colors found:", dominantColors);

  // Display the color palette
  displayColorPalette(dominantColors);
}

/**
 * Find the most dominant/different colors using simple clustering
 */
function findDominantColors(colors, numColors) {
  console.log(
    "Finding",
    numColors,
    "dominant colors from",
    colors.length,
    "pixels..."
  );

  // Start with 4 very different seed colors
  const seeds = [
    { r: 0, g: 0, b: 0 }, // Black
    { r: 255, g: 255, b: 255 }, // White
    { r: 128, g: 64, b: 0 }, // Brown
    { r: 0, g: 100, b: 200 }, // Blue
  ];

  // For each seed, collect all colors closest to it
  const clusters = seeds.map((seed) => ({
    center: seed,
    colors: [],
    totalR: 0,
    totalG: 0,
    totalB: 0,
    count: 0,
  }));

  // Assign each pixel to closest cluster
  colors.forEach((color) => {
    let closestCluster = 0;
    let closestDistance = Infinity;

    clusters.forEach((cluster, index) => {
      const distance = colorDistance(color, cluster.center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCluster = index;
      }
    });

    // Add to closest cluster
    const cluster = clusters[closestCluster];
    cluster.colors.push(color);
    cluster.totalR += color.r;
    cluster.totalG += color.g;
    cluster.totalB += color.b;
    cluster.count++;
  });

  // Calculate average color for each cluster
  const dominantColors = clusters.map((cluster, index) => {
    if (cluster.count === 0) return { r: 128, g: 128, b: 128 }; // Gray fallback

    return {
      r: Math.round(cluster.totalR / cluster.count),
      g: Math.round(cluster.totalG / cluster.count),
      b: Math.round(cluster.totalB / cluster.count),
      pixelCount: cluster.count,
    };
  });

  console.log(
    "Cluster sizes:",
    dominantColors.map((c) => c.pixelCount)
  );

  return dominantColors;
}

/**
 * Calculate distance between two colors
 */
function colorDistance(color1, color2) {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Display the extracted color palette
 */
function displayColorPalette(colors) {
  const paletteDiv = document.getElementById("colorPalette");

  let html =
    '<h4>Extracted Color Palette:</h4><div style="display: flex; gap: 10px; margin: 10px 0;">';

  colors.forEach((color, index) => {
    html += `
            <div style="text-align: center;">
                <div style="width: 60px; height: 60px; background-color: rgb(${
                  color.r
                },${color.g},${color.b}); 
                           border: 2px solid #ddd; border-radius: 8px; margin: 0 auto 5px auto;"></div>
                <small>Color ${index + 1}<br>${color.pixelCount} pixels</small>
            </div>
        `;
  });

  html += "</div>";
  paletteDiv.innerHTML = html;

  console.log("Color palette displayed");
}

/**
 * Generate the complete game data structure with dynamic painting name
 */
function generateGameData() {
  if (!loadedImage) {
    alert("Please process colors first!");
    return;
  }

  console.log("Generating game data...");

  // GET PAINTING NAME FROM INPUT FIELD
  const paintingNameInput = document
    .getElementById("paintingName")
    .value.trim();
  const paintingName = paintingNameInput || "Untitled Painting";

  // Generate a safe JavaScript variable name from the painting name
  const paintingId = paintingName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, ""); // Remove spaces

  console.log("Using painting name:", paintingName);
  console.log("Generated painting ID:", paintingId);

  // Create temporary 50x50 canvas to get exact pixel mapping
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 50;
  tempCanvas.height = 50;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(loadedImage, 0, 0, 50, 50);

  // Get pixel data again
  const imageData = tempCtx.getImageData(0, 0, 50, 50);
  const pixels = imageData.data;

  // Get the dominant colors we found earlier
  const dominantColors = findDominantColors(getAllColorsFromPixels(pixels), 4);

  // Create color groups with pixel coordinates
  const colorGroups = [];

  for (let colorIndex = 0; colorIndex < 4; colorIndex++) {
    const targetColor = dominantColors[colorIndex];
    const pixelCoordinates = [];

    // Find all pixels that belong to this color
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        const pixelIndex = (y * 50 + x) * 4;
        const pixelColor = {
          r: pixels[pixelIndex],
          g: pixels[pixelIndex + 1],
          b: pixels[pixelIndex + 2],
        };

        // Find closest dominant color
        let closestColorIndex = 0;
        let closestDistance = Infinity;

        dominantColors.forEach((domColor, index) => {
          const distance = colorDistance(pixelColor, domColor);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestColorIndex = index;
          }
        });

        // If this pixel belongs to current color group
        if (closestColorIndex === colorIndex) {
          pixelCoordinates.push([x, y]);
        }
      }
    }

    // Create color group with fancy names and mixing recipes
    const colorNames = [
      "Shadow Depths", // Dark background
      "Porcelain Glow", // Light skin
      "Amber Velvet", // Brown clothing
      "Midnight Turban", // Blue turban
    ];

    colorGroups.push({
      id: colorIndex + 1,
      name: colorNames[colorIndex],
      targetRGB: {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
      },
      pixels: pixelCoordinates,
      stages: [
        {
          colors: generateMixingRecipe(targetColor),
        },
      ],
    });

    console.log(
      `Color ${colorIndex + 1}: ${colorNames[colorIndex]} - ${
        pixelCoordinates.length
      } pixels`
    );
  }

  // FIXED: Generate the complete painting data structure with DYNAMIC naming
  const paintingData = {
    [paintingId]: {
      // ← DYNAMIC KEY from input
      id: paintingId, // ← DYNAMIC ID
      name: paintingName, // ← DYNAMIC NAME from input field
      dimensions: { width: 50, height: 50 },
      colorGroups: colorGroups,
    },
  };

  // Display the generated data with proper naming
  displayGeneratedData(paintingData, paintingName);
}

/**
 * Convert pixel array back to color objects
 */
function getAllColorsFromPixels(pixels) {
  const colors = [];
  for (let i = 0; i < pixels.length; i += 4) {
    colors.push({
      r: pixels[i],
      g: pixels[i + 1],
      b: pixels[i + 2],
    });
  }
  return colors;
}

/**
 * Generate a simple mixing recipe for a target color
 */
function generateMixingRecipe(targetColor) {
  // Simple recipe generation - we can make this more sophisticated later
  if (targetColor.r > 150 && targetColor.g > 150 && targetColor.b > 150) {
    // Light color - mix white with something
    return [
      { r: 255, g: 255, b: 255, name: "White" },
      { r: 200, g: 180, b: 140, name: "Cream" },
    ];
  } else if (targetColor.b > targetColor.r && targetColor.b > targetColor.g) {
    // Blue-ish
    return [
      { r: 0, g: 0, b: 255, name: "Blue" },
      { r: 0, g: 0, b: 0, name: "Black" },
    ];
  } else if (targetColor.r > 100 && targetColor.g > 80) {
    // Brown-ish
    return [
      { r: 139, g: 69, b: 19, name: "Brown" },
      { r: 255, g: 255, b: 0, name: "Yellow" },
    ];
  } else {
    // Dark color
    return [
      { r: 0, g: 0, b: 0, name: "Black" },
      { r: 100, g: 100, b: 100, name: "Gray" },
    ];
  }
}

/**
 * Display the final generated game data in correct JavaScript format
 * @param {Object} paintingData - The generated painting data object
 * @param {string} paintingName - The name of the painting for header
 */
function displayGeneratedData(paintingData, paintingName) {
  const output = document.getElementById("output");

  // Convert to proper JavaScript file format with DYNAMIC painting name
  const jsFileContent = `/* ==============================================
   REAL PAINTING DATA - ${paintingName.toUpperCase()}
   Generated from actual painting image
   ============================================== */

const PAINTINGS = ${JSON.stringify(paintingData, null, 2)};

// Export for use in other files  
window.PAINTINGS = PAINTINGS;`;

  output.innerHTML = `
        <h4>Complete paintingData.js File:</h4>
        <p><strong>Painting:</strong> ${paintingName}</p>
        <p>Copy this entire content to replace your paintingData.js file:</p>
        <textarea style="width: 100%; height: 400px; font-family: monospace;" readonly>${jsFileContent}</textarea>
        <button onclick="copyToClipboard()" style="margin-top: 10px;">Copy Complete File</button>
    `;

  console.log(`Generated complete data file for: ${paintingName}`);
}

// Convert to proper JavaScript file format
const jsFileContent = `/* ==============================================
   REAL PAINTING DATA - GIRL WITH A PEARL EARRING
   Generated from actual painting image
   ============================================== */

const PAINTINGS = ${JSON.stringify(paintingData, null, 2)};

// Export for use in other files  
window.PAINTINGS = PAINTINGS;`;

output.innerHTML = `
        <h4>Complete paintingData.js File:</h4>
        <p>Copy this entire content to replace your paintingData.js file:</p>
        <textarea style="width: 100%; height: 400px; font-family: monospace;" readonly>${jsFileContent}</textarea>
        <button onclick="copyToClipboard()" style="margin-top: 10px;">Copy Complete File</button>
    `;

/**
 * Copy generated data to clipboard
 */
function copyToClipboard() {
  const textarea = document.querySelector("#output textarea");
  textarea.select();
  document.execCommand("copy");
  alert("Game data copied to clipboard!");
}
/**
 * Resize the loaded image to exactly 50x50 pixels (displayed larger for visibility)
 */
function resizeImage() {
  if (!loadedImage) {
    alert("Please load an image first!");
    return;
  }

  console.log("Resizing entire image to 50x50 grid...");
  console.log(
    "Original image size:",
    loadedImage.width,
    "x",
    loadedImage.height
  );

  // Clear the resized canvas
  resizedCtx.clearRect(0, 0, resizedCanvas.width, resizedCanvas.height);

  // Draw the ENTIRE image scaled to fit 250x250 canvas (representing 50x50 grid)
  // Each "pixel" in our 50x50 grid will be 5x5 canvas pixels (250÷50=5)
  resizedCtx.drawImage(
    loadedImage, // Source image
    0,
    0, // Source position (start of image)
    loadedImage.width, // Source width (entire image)
    loadedImage.height, // Source height (entire image)
    0,
    0, // Destination position
    250,
    250 // Destination size (scales entire image to 250x250)
  );

  console.log("Entire image scaled to 50x50 grid (displayed at 250x250)");
}
