/* ==============================================
   PAINTING METADATA - Without pixel coordinates
   Pixel data stored separately in pixelData.js
   ============================================== */

const PAINTINGS = {
  girlwithapearlearring: {
    id: "girlwithapearlearring",
    name: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    difficulty: "normal",
    dimensions: {
      width: 50,
      height: 50,
    },
    colorGroups: [
      {
        id: 1,
        name: "Shadow Depths",
        targetRGB: {
          r: 61,
          g: 50,
          b: 35,
        },
        // NO PIXELS ARRAY HERE!
        stages: [
          {
            colors: [
              {
                r: 0,
                g: 0,
                b: 0,
                name: "Black",
              },
              {
                r: 105,
                g: 105,
                b: 105,
                name: "Dim Gray",
              },
            ],
          },
          {
            colors: [
              "previous",
              {
                r: 64,
                g: 64,
                b: 64,
                name: "Dark Gray",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Porcelain Glow",
        targetRGB: {
          r: 196,
          g: 168,
          b: 133,
        },
        stages: [
          {
            colors: [
              {
                r: 255,
                g: 165,
                b: 0,
                name: "Orange",
              },
              {
                r: 139,
                g: 69,
                b: 19,
                name: "Saddle Brown",
              },
            ],
          },
          {
            colors: [
              "previous",
              {
                r: 245,
                g: 245,
                b: 220,
                name: "Beige",
              },
            ],
          },
        ],
      },
      {
        id: 3,
        name: "Amber Velvet",
        targetRGB: {
          r: 64,
          g: 68,
          b: 59,
        },
        stages: [
          {
            colors: [
              {
                r: 0,
                g: 0,
                b: 0,
                name: "Black",
              },
              {
                r: 105,
                g: 105,
                b: 105,
                name: "Dim Gray",
              },
            ],
          },
          {
            colors: [
              "previous",
              {
                r: 64,
                g: 64,
                b: 64,
                name: "Dark Gray",
              },
            ],
          },
        ],
      },
      {
        id: 4,
        name: "Midnight Turban",
        targetRGB: {
          r: 148,
          g: 167,
          b: 179,
        },
        stages: [
          {
            colors: [
              {
                r: 0,
                g: 0,
                b: 255,
                name: "Pure Blue",
              },
              {
                r: 0,
                g: 0,
                b: 150,
                name: "Deep Blue",
              },
            ],
          },
          {
            colors: [
              "previous",
              {
                r: 245,
                g: 245,
                b: 220,
                name: "Beige",
              },
            ],
          },
        ],
      },
      {
        id: 5,
        name: "Pearl Shimmer",
        targetRGB: {
          r: 58,
          g: 75,
          b: 88,
        },
        stages: [
          {
            colors: [
              {
                r: 0,
                g: 0,
                b: 255,
                name: "Pure Blue",
              },
              {
                r: 0,
                g: 0,
                b: 150,
                name: "Deep Blue",
              },
            ],
          },
          {
            colors: [
              "previous",
              {
                r: 64,
                g: 64,
                b: 64,
                name: "Dark Gray",
              },
            ],
          },
        ],
      },
      {
        id: 6,
        name: "Golden Highlight",
        targetRGB: {
          r: 128,
          g: 128,
          b: 128,
        },
        stages: [
          {
            colors: [
              {
                r: 0,
                g: 0,
                b: 0,
                name: "Black",
              },
              {
                r: 105,
                g: 105,
                b: 105,
                name: "Dim Gray",
              },
            ],
          },
          {
            colors: [
              "previous",
              {
                r: 64,
                g: 64,
                b: 64,
                name: "Dark Gray",
              },
            ],
          },
        ],
      }, // <-- This closes color group 6
    ], // <-- This closes the colorGroups array
  }, // <-- This closes the girlwithapearlearring object
}; // <-- This closes the PAINTINGS object

window.PAINTINGS = PAINTINGS;
