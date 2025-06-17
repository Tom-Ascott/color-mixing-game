/* ==============================================
   COLOR MIXING GAME - CANVAS PAINTING SYSTEM
   ============================================== */

/**
 * Canvas controller for displaying the painting
 */
class PaintingCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Canvas is 300x300 pixels, but painting data is 50x50
    this.canvasSize = 300;
    this.gridSize = 50;
    this.pixelSize = this.canvasSize / this.gridSize; // 6 pixels per grid cell

    // Track which colors have been revealed
    this.revealedColors = [];

    console.log("Canvas initialized:", this.canvasSize, "x", this.canvasSize);
    console.log("Grid size:", this.gridSize, "x", this.gridSize);
    console.log("Each pixel renders as:", this.pixelSize, "x", this.pixelSize);
  }

  /**
   * Clear the entire canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
    this.revealedColors = [];
    console.log("Canvas cleared");
  }

  /**
   * Draw a single pixel at grid coordinates
   * @param {number} x - Grid X coordinate (0-49)
   * @param {number} y - Grid Y coordinate (0-49)
   * @param {Object} color - RGB color {r, g, b}
   */
  drawPixel(x, y, color) {
    // Convert grid coordinates to canvas coordinates
    const canvasX = x * this.pixelSize;
    const canvasY = y * this.pixelSize;

    // Set the fill color
    this.ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

    // Draw the pixel as a small rectangle
    this.ctx.fillRect(canvasX, canvasY, this.pixelSize, this.pixelSize);
  }

  /**
   * Test function - draw some sample pixels
   */
  testDraw() {
    console.log("Testing canvas drawing...");

    // Draw a red pixel at top-left
    this.drawPixel(0, 0, { r: 255, g: 0, b: 0 });

    // Draw a blue pixel at top-right
    this.drawPixel(49, 0, { r: 0, g: 0, b: 255 });

    // Draw a green pixel at bottom-left
    this.drawPixel(0, 49, { r: 0, g: 255, b: 0 });

    // Draw a yellow pixel at bottom-right
    this.drawPixel(49, 49, { r: 255, g: 255, b: 0 });

    console.log("Test pixels drawn");
  }
}

// Global canvas instance
let paintingCanvas = null;
