export class PaletteGenerator {
  constructor(colors) {
    this.colors = colors;
    this.currentPalette = [];
  }

  // Generate a random palette
  generateRandomPalette(size = 5) {
    const shuffled = [...this.colors].sort(() => 0.5 - Math.random());
    this.currentPalette = shuffled.slice(0, size);
    return this.currentPalette;
  }

  // Generate analogous palette (colors that are next to each other on color wheel)
  generateAnalogousPalette(baseIndex = null, size = 5) {
    if (baseIndex === null) {
      baseIndex = Math.floor(Math.random() * this.colors.length);
    }

    const palette = [];
    const range = Math.floor(size / 2);

    for (let i = -range; i <= range; i++) {
      const index = (baseIndex + i + this.colors.length) % this.colors.length;
      palette.push(this.colors[index]);
    }

    this.currentPalette = palette;
    return this.currentPalette;
  }

  // Generate monochromatic palette (variations of the same hue)
  generateMonochromaticPalette(baseIndex = null, size = 5) {
    if (baseIndex === null) {
      baseIndex = Math.floor(Math.random() * this.colors.length);
    }

    const baseColor = this.colors[baseIndex];
    const palette = [baseColor];

    // Generate variations by adjusting lightness
    for (let i = 1; i < size; i++) {
      const variation = this.getLightnessVariation(baseColor, i);
      palette.push(variation);
    }

    this.currentPalette = palette;
    return this.currentPalette;
  }

  // Helper to create lightness variations
  getLightnessVariation(color, variationIndex) {
    // Create a variation based on the base color
    const [r, g, b] = color.rgb;
    const factor = 0.8 - (variationIndex * 0.15);

    const newR = Math.min(255, Math.max(0, Math.floor(r * factor)));
    const newG = Math.min(255, Math.max(0, Math.floor(g * factor)));
    const newB = Math.min(255, Math.max(0, Math.floor(b * factor)));

    return {
      ...color,
      rgb: [newR, newG, newB],
      hex: `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    };
  }

  // Generate complementary palette
  generateComplementaryPalette(baseIndex = null) {
    if (baseIndex === null) {
      baseIndex = Math.floor(Math.random() * this.colors.length);
    }

    const baseColor = this.colors[baseIndex];
    const complementary = this.findComplementaryColor(baseColor);

    this.currentPalette = [baseColor, complementary];
    return this.currentPalette;
  }

  // Find complementary color
  findComplementaryColor(color) {
    const [r, g, b] = color.rgb;
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;

    const compHex = `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;

    return {
      ...color,
      name: `${color.name} Complement`,
      rgb: [compR, compG, compB],
      hex: compHex
    };
  }

  // Generate triadic palette
  generateTriadicPalette(baseIndex = null) {
    if (baseIndex === null) {
      baseIndex = Math.floor(Math.random() * this.colors.length);
    }

    const baseColor = this.colors[baseIndex];
    const color1 = this.colors[(baseIndex + Math.floor(this.colors.length / 3)) % this.colors.length];
    const color2 = this.colors[(baseIndex + 2 * Math.floor(this.colors.length / 3)) % this.colors.length];

    this.currentPalette = [baseColor, color1, color2];
    return this.currentPalette;
  }

  // Generate palette based on combinations from your data
  generateCombinationPalette(baseIndex = null) {
    if (baseIndex === null) {
      baseIndex = Math.floor(Math.random() * this.colors.length);
    }

    const baseColor = this.colors[baseIndex];
    const combinationIndices = baseColor.combinations || [];

    const palette = [baseColor];
    combinationIndices.forEach(index => {
      if (this.colors[index]) {
        palette.push(this.colors[index]);
      }
    });

    this.currentPalette = palette;
    return this.currentPalette;
  }

  // Get current palette
  getCurrentPalette() {
    return this.currentPalette;
  }

  // Get all colors
  getAllColors() {
    return this.colors;
  }
}
