/* ==============================================
   COLOR MIXING GAME - COLOR MATHEMATICS
   ============================================== */

/**
 * Converts RGB color to HSL color space
 * HSL is better for mixing because it separates hue from brightness
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {Object} HSL color {h: 0-360, s: 0-1, l: 0-1}
 */
function rgbToHsl(r, g, b) {
  // Convert RGB values to 0-1 range
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the min and max values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  // Calculate lightness (average of max and min)
  const l = (max + min) / 2;

  let h = 0; // Hue
  let s = 0; // Saturation

  // If there's no difference, it's a shade of gray
  if (diff !== 0) {
    // Calculate saturation
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    // Calculate hue based on which color is dominant
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6; // Convert to 0-1 range
  }

  return {
    h: h * 360, // Convert to degrees (0-360)
    s: s, // Keep as 0-1
    l: l, // Keep as 0-1
  };
}

/**
 * Converts HSL color back to RGB color space
 * @param {number} h - Hue (0-360 degrees)
 * @param {number} s - Saturation (0-1)
 * @param {number} l - Lightness (0-1)
 * @returns {Object} RGB color {r: 0-255, g: 0-255, b: 0-255}
 */
function hslToRgb(h, s, l) {
  h /= 360; // Convert degrees to 0-1 range

  // If no saturation, it's a shade of gray
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  // Helper function for calculating RGB components
  function hueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = hueToRgb(p, q, h + 1 / 3);
  const g = hueToRgb(p, q, h);
  const b = hueToRgb(p, q, h - 1 / 3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Mixes two colors using HSL color space for natural-looking results
 * @param {Object} color1 - First color {r, g, b}
 * @param {Object} color2 - Second color {r, g, b}
 * @param {number} ratio - Mix ratio (0 = all color1, 1 = all color2)
 * @returns {Object} Mixed color {r, g, b}
 */
function mixColors(color1, color2, ratio) {
  console.log("Mixing colors:", color1, color2, "ratio:", ratio);

  // Convert both colors to HSL
  const hsl1 = rgbToHsl(color1.r, color1.g, color1.b);
  const hsl2 = rgbToHsl(color2.r, color2.g, color2.b);

  // Mix in HSL space (handles hue wrapping better than RGB)
  const mixedHsl = {
    h: hsl1.h + (hsl2.h - hsl1.h) * ratio,
    s: hsl1.s + (hsl2.s - hsl1.s) * ratio,
    l: hsl1.l + (hsl2.l - hsl1.l) * ratio,
  };

  // Convert back to RGB
  const result = hslToRgb(mixedHsl.h, mixedHsl.s, mixedHsl.l);
  console.log("Mixed result:", result);

  return result;
}

/**
 * Calculate the visual difference between two colors using Delta E CIE76
 * Lower values = more similar colors
 * @param {Object} color1 - First color {r, g, b}
 * @param {Object} color2 - Second color {r, g, b}
 * @returns {number} Color difference (0 = identical, 100+ = very different)
 */
function calculateColorDistance(color1, color2) {
  // Simple RGB distance for now - we can upgrade later if needed
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;

  // Euclidean distance in RGB space
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Convert color distance to a 0-100 score
 * @param {number} distance - Color distance from calculateColorDistance
 * @returns {number} Score from 0-100 (100 = perfect match)
 */
function distanceToScore(distance) {
  // Maximum possible RGB distance is about 441 (from black to white)
  const maxDistance = 441;
  const score = Math.max(0, 100 - (distance / maxDistance) * 100);
  return Math.round(score);
}
