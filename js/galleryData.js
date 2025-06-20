/* ==============================================
   GALLERY DATA - MASTER CONFIGURATION
   Single source of truth for all wings and paintings
   ============================================== */

const GALLERY_DATA = {
  wings: {
    renaissance: {
      id: "renaissance",
      name: "Renaissance Masters",
      description: "Masterpieces from the golden age of art",
      order: 1,
      paintings: [
        {
          id: "girl_pearl",
          name: "Girl with a Pearl Earring",
          artist: "Johannes Vermeer",
          year: "1665",
          order: 1,
          status: "available", // available = can play, locked = need to unlock
          hasData: true, // indicates we have actual painting data
        },
        {
          id: "birth_venus",
          name: "Birth of Venus",
          artist: "Sandro Botticelli",
          year: "1485",
          order: 2,
          status: "locked",
          hasData: false, // placeholder for future
        },
        {
          id: "creation_adam",
          name: "Creation of Adam",
          artist: "Michelangelo",
          year: "1512",
          order: 3,
          status: "locked",
          hasData: false, // placeholder for future
        },
      ],
    },
    impressionist: {
      id: "impressionist",
      name: "Impressionist Movement",
      description: "Light, color, and fleeting moments",
      order: 2,
      paintings: [
        {
          id: "starry_night",
          name: "Starry Night",
          artist: "Vincent van Gogh",
          year: "1889",
          order: 1,
          status: "locked", // Locked until Renaissance wing completed
          hasData: false,
        },
        {
          id: "water_lilies",
          name: "Water Lilies",
          artist: "Claude Monet",
          year: "1919",
          order: 2,
          status: "locked",
          hasData: false,
        },
        {
          id: "cafe_terrace",
          name: "Café Terrace at Night",
          artist: "Vincent van Gogh",
          year: "1888",
          order: 3,
          status: "locked",
          hasData: false,
        },
      ],
    },
  },
};

/**
 * Utility functions for gallery data
 */

/**
 * Get all wings sorted by order
 * @returns {Array} Array of wing objects sorted by order
 */
function getWingsSorted() {
  return Object.values(GALLERY_DATA.wings).sort((a, b) => a.order - b.order);
}

/**
 * Get specific wing data
 * @param {string} wingId - Wing identifier
 * @returns {Object|null} Wing data or null if not found
 */
function getWing(wingId) {
  return GALLERY_DATA.wings[wingId] || null;
}

/**
 * Get paintings in a wing sorted by order
 * @param {string} wingId - Wing identifier
 * @returns {Array} Array of painting objects sorted by order
 */
function getWingPaintings(wingId) {
  const wing = getWing(wingId);
  if (!wing) return [];
  return wing.paintings.sort((a, b) => a.order - b.order);
}

/**
 * Get specific painting data
 * @param {string} paintingId - Painting identifier
 * @returns {Object|null} Painting data with wing info, or null if not found
 */
function getPainting(paintingId) {
  for (const wing of Object.values(GALLERY_DATA.wings)) {
    const painting = wing.paintings.find((p) => p.id === paintingId);
    if (painting) {
      return {
        ...painting,
        wingId: wing.id,
        wingName: wing.name,
      };
    }
  }
  return null;
}

/**
 * Check if a painting has actual game data available
 * @param {string} paintingId - Painting identifier
 * @returns {boolean} True if painting data exists in PAINTINGS
 */
function hasPaintingData(paintingId) {
  // Map gallery IDs to PAINTINGS data IDs
  const paintingDataMap = {
    girl_pearl: "girlwithapearlearring",
    // Add more mappings as we create more paintings
  };

  const dataId = paintingDataMap[paintingId];
  return dataId && window.PAINTINGS && window.PAINTINGS[dataId];
}

/**
 * Get the actual painting data for gameplay
 * @param {string} paintingId - Gallery painting ID
 * @returns {Object|null} Painting data for game or null if not available
 */
function getPaintingGameData(paintingId) {
  const paintingDataMap = {
    girl_pearl: "girlwithapearlearring",
  };

  const dataId = paintingDataMap[paintingId];
  if (dataId && window.PAINTINGS && window.PAINTINGS[dataId]) {
    return window.PAINTINGS[dataId];
  }
  return null;
}

// Export for use in other files
window.GALLERY_DATA = GALLERY_DATA;
window.getWingsSorted = getWingsSorted;
window.getWing = getWing;
window.getWingPaintings = getWingPaintings;
window.getPainting = getPainting;
window.hasPaintingData = hasPaintingData;
window.getPaintingGameData = getPaintingGameData;
