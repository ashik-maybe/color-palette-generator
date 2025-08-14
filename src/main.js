import colorsData from './assets/colors.json';
import './style.css';

class SanzoWadaDictionary {
    constructor() {
        this.colors = colorsData;
        this.currentPalette = [];
        this.savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.generateRandomPalette(5);
        this.renderPalette();
    }

    bindEvents() {
        // Control elements
        const generateBtn = document.getElementById('generate-btn');
        const modeSelect = document.getElementById('mode-select');
        const paletteSize = document.getElementById('palette-size');
        const sizeValue = document.getElementById('size-value');
        const exportBtn = document.getElementById('export-btn');
        const copyBtn = document.getElementById('copy-btn');
        const saveBtn = document.getElementById('save-btn');

        // Info panel elements
        const infoToggle = document.getElementById('info-toggle');
        const closeInfo = document.getElementById('close-info');
        const infoPanel = document.getElementById('info-panel');

        // Event listeners
        generateBtn.addEventListener('click', () => this.generateNewPalette());
        modeSelect.addEventListener('change', () => this.generateNewPalette());
        paletteSize.addEventListener('input', (e) => {
            sizeValue.textContent = e.target.value;
            this.generateNewPalette();
        });
        exportBtn.addEventListener('click', () => this.exportPalette());
        copyBtn.addEventListener('click', () => this.copyPaletteToCSS());
        saveBtn.addEventListener('click', () => this.savePalette());
        infoToggle.addEventListener('click', () => this.toggleInfoPanel());
        closeInfo.addEventListener('click', () => this.toggleInfoPanel());

        // Close info panel when clicking outside
        document.addEventListener('click', (e) => {
            if (infoPanel.classList.contains('active') &&
                !infoPanel.contains(e.target) &&
                e.target !== infoToggle) {
                this.toggleInfoPanel();
            }
        });
    }

    toggleInfoPanel() {
        const infoPanel = document.getElementById('info-panel');
        infoPanel.classList.toggle('active');
    }

    generateNewPalette() {
        const mode = document.getElementById('mode-select').value;
        const size = parseInt(document.getElementById('palette-size').value);

        switch(mode) {
            case 'random':
                this.generateRandomPalette(size);
                break;
            case 'traditional':
                this.generateTraditionalPalette();
                break;
            case 'analogous':
                this.generateAnalogousPalette(size);
                break;
            case 'complementary':
                this.generateComplementaryPalette();
                break;
            case 'triadic':
                this.generateTriadicPalette();
                break;
            case 'tetradic':
                this.generateTetradicPalette();
                break;
            case 'monochromatic':
                this.generateMonochromaticPalette(size);
                break;
        }

        this.renderPalette();
    }

    generateRandomPalette(size) {
        const shuffled = [...this.colors].sort(() => 0.5 - Math.random());
        this.currentPalette = shuffled.slice(0, size);
    }

    generateTraditionalPalette() {
        const baseIndex = Math.floor(Math.random() * this.colors.length);
        const baseColor = this.colors[baseIndex];
        const combinations = baseColor.combinations || [];

        this.currentPalette = [baseColor];

        const availableCombinations = combinations
            .map(index => this.colors[index])
            .filter(color => color !== undefined)
            .slice(0, 4);

        this.currentPalette = [baseColor, ...availableCombinations];
    }

    generateAnalogousPalette(size) {
        const baseIndex = Math.floor(Math.random() * this.colors.length);
        const palette = [this.colors[baseIndex]];

        for (let i = 1; i < size; i++) {
            const nextIndex = (baseIndex + i) % this.colors.length;
            palette.push(this.colors[nextIndex]);
        }

        this.currentPalette = palette;
    }

    generateComplementaryPalette() {
        const baseIndex = Math.floor(Math.random() * this.colors.length);
        const baseColor = this.colors[baseIndex];
        const complementary = this.findComplementaryColor(baseColor);
        this.currentPalette = [baseColor, complementary];
    }

    generateTriadicPalette() {
        const baseIndex = Math.floor(Math.random() * this.colors.length);
        const baseColor = this.colors[baseIndex];

        const secondIndex = (baseIndex + Math.floor(this.colors.length / 3)) % this.colors.length;
        const thirdIndex = (baseIndex + 2 * Math.floor(this.colors.length / 3)) % this.colors.length;

        this.currentPalette = [
            baseColor,
            this.colors[secondIndex],
            this.colors[thirdIndex]
        ];
    }

    generateTetradicPalette() {
        const baseIndex = Math.floor(Math.random() * this.colors.length);
        const baseColor = this.colors[baseIndex];

        const secondIndex = (baseIndex + Math.floor(this.colors.length / 4)) % this.colors.length;
        const thirdIndex = (baseIndex + 2 * Math.floor(this.colors.length / 4)) % this.colors.length;
        const fourthIndex = (baseIndex + 3 * Math.floor(this.colors.length / 4)) % this.colors.length;

        this.currentPalette = [
            baseColor,
            this.colors[secondIndex],
            this.colors[thirdIndex],
            this.colors[fourthIndex]
        ];
    }

    generateMonochromaticPalette(size) {
        const baseIndex = Math.floor(Math.random() * this.colors.length);
        const baseColor = this.colors[baseIndex];
        const palette = [baseColor];

        for (let i = 1; i < size; i++) {
            const factor = 1 - (i * 0.15);
            const [r, g, b] = baseColor.rgb;

            const newR = Math.min(255, Math.max(0, Math.floor(r * factor)));
            const newG = Math.min(255, Math.max(0, Math.floor(g * factor)));
            const newB = Math.min(255, Math.max(0, Math.floor(b * factor)));

            const newHex = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;

            palette.push({
                ...baseColor,
                name: `${baseColor.name} Shade ${i}`,
                rgb: [newR, newG, newB],
                hex: newHex
            });
        }

        this.currentPalette = palette;
    }

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

    renderPalette() {
        const container = document.getElementById('palette-container');
        container.innerHTML = '';

        this.currentPalette.forEach((color) => {
            const colorCard = document.createElement('div');
            colorCard.className = 'color-sample';
            colorCard.innerHTML = this.createColorCardHTML(color);
            container.appendChild(colorCard);
        });

        // Bind events
        this.bindColorCardEvents();
    }

    createColorCardHTML(color) {
        const [r, g, b] = color.rgb;
        const [c, m, y, k] = color.cmyk || [0, 0, 0, 0];
        const [l, a, bVal] = color.lab || [0, 0, 0];

        // Generate Japanese name if available
        const japaneseName = this.getJapaneseName(color.name);

        return `
            <div class="color-swatch" style="background-color: ${color.hex}">
            </div>
            <div class="color-info">
                <h3 class="color-name">${color.name}</h3>
                ${japaneseName ? `<div class="color-japanese">${japaneseName}</div>` : ''}

                <div class="color-details">
                    <div class="color-detail">
                        <span>HEX:</span>
                        <span>${color.hex}</span>
                    </div>
                    <div class="color-detail">
                        <span>RGB:</span>
                        <span>${r}, ${g}, ${b}</span>
                    </div>
                    <div class="color-detail">
                        <span>CMYK:</span>
                        <span>${c}, ${m}, ${y}, ${k}</span>
                    </div>
                </div>

                <div class="color-actions">
                    <button class="action-btn copy-btn" data-hex="${color.hex}" data-name="${color.name}">
                        <i class="fa fa-copy"></i> Copy
                    </button>
                    <button class="action-btn info-btn" data-name="${color.name}">
                        <i class="fa fa-info-circle"></i> Info
                    </button>
                </div>
            </div>
        `;
    }

    getJapaneseName(englishName) {
        const nameMap = {
            "Hermosa Pink": "ヘルモサピンク",
            "Corinthian Pink": "コリントピンク",
            "Cameo Pink": "カメオピンク"
        };

        return nameMap[englishName] || "";
    }

    bindColorCardEvents() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hex = e.target.closest('.copy-btn').dataset.hex;
                this.copyToClipboard(hex, e.target);
            });
        });

        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.closest('.info-btn').dataset.name;
                this.showColorInfo(name);
            });
        });
    }

    copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fa fa-check"></i> Copied';
            setTimeout(() => {
                button.innerHTML = originalHTML;
            }, 1500);
        });
    }

    showColorInfo(colorName) {
        // In a real app, this would show detailed information about the color
        console.log(`Showing info for: ${colorName}`);
    }

    exportPalette() {
        const dataStr = JSON.stringify(this.currentPalette, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sanzo-wada-palette.json';
        link.click();
        URL.revokeObjectURL(url);

        // Visual feedback
        const exportBtn = document.getElementById('export-btn');
        const originalHTML = exportBtn.innerHTML;
        exportBtn.innerHTML = '<i class="fa fa-check"></i> Exported';
        setTimeout(() => {
            exportBtn.innerHTML = originalHTML;
        }, 1500);
    }

    copyPaletteToCSS() {
        const cssVariables = this.currentPalette.map((color, index) =>
            `--color-${index + 1}: ${color.hex}; /* ${color.name} */`
        ).join('\n');

        navigator.clipboard.writeText(cssVariables).then(() => {
            const copyBtn = document.getElementById('copy-btn');
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa fa-check"></i> CSS Copied';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 1500);
        });
    }

    savePalette() {
        const paletteData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            colors: this.currentPalette
        };

        this.savedPalettes.push(paletteData);
        localStorage.setItem('savedPalettes', JSON.stringify(this.savedPalettes));

        // Visual feedback
        const saveBtn = document.getElementById('save-btn');
        const originalHTML = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fa fa-check"></i> Saved';
        setTimeout(() => {
            saveBtn.innerHTML = originalHTML;
        }, 1500);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SanzoWadaDictionary();
});
