/* ==============================================
   PAINTING DATA - GIRL WITH A PEARL EARRING
   ============================================== */

const PAINTINGS = {
  girlWithPearl: {
    id: "girl_pearl_earring",
    name: "Girl with a Pearl Earring",
    dimensions: { width: 50, height: 50 },

    // Color groups that make up the painting
    colorGroups: [
      {
        id: 1,
        name: "Venetian Sunset", // Skin tone
        targetRGB: { r: 255, g: 179, b: 120 }, // Peachy skin color
        stages: [
          {
            colors: [
              { r: 255, g: 0, b: 0 }, // Red base
              { r: 255, g: 255, b: 0 }, // Yellow
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Midnight Turban", // Turban blue
        targetRGB: { r: 52, g: 89, b: 149 }, // Deep blue
        stages: [
          {
            colors: [
              { r: 0, g: 0, b: 255 }, // Blue base
              { r: 0, g: 0, b: 0 }, // Black to darken
            ],
          },
        ],
      },
      {
        id: 3,
        name: "Pearl's Gleam", // The famous pearl
        targetRGB: { r: 245, g: 245, b: 220 }, // Off-white pearl
        stages: [
          {
            colors: [
              { r: 255, g: 255, b: 255 }, // White base
              { r: 255, g: 255, b: 0 }, // Tiny bit of yellow warmth
            ],
          },
        ],
      },
      {
        id: 4,
        name: "Dusty Rose Shadow", // A complex skin shadow color
        targetRGB: { r: 180, g: 120, b: 140 }, // Dusty purple-pink
        stages: [
          {
            colors: [
              { r: 255, g: 0, b: 0 }, // Red base
              { r: 255, g: 255, b: 255 }, // White to make pink
            ],
          },
          {
            colors: [
              null, // null = use previous stage result
              { r: 100, g: 50, b: 150 }, // Purple to add shadow
            ],
          },
        ],
      },
      // We can add the other colors later
      // We can add the other 3 colors later
    ],
  },
};

// Export for use in other files
window.PAINTINGS = PAINTINGS;
