import * as THREE from "three";
class MyTextRenderer {
    constructor(spriteSheetPath, fontSize, lines, cols, first) {
        this.spriteSheet = new THREE.TextureLoader().load(spriteSheetPath);

        this.fontSize = fontSize;
        this.scale = 16;
        this.lines = lines;
        this.cols = cols;
        this.spriteSheet.repeat.set(1 / this.scale, 1 / this.scale);
        this.first = typeof first == "string" ? first.charCodeAt(0) : first;
    }
    renderCharacter(character) {
        const code = character.charCodeAt(0);
        const offset = (code - this.first);

        const x = offset % (this.cols);
        const y = Math.floor(offset / (this.lines));


        const finalX = x / (this.lines);
        const finalY = y / (this.cols);

        const startX = 0;
        const startY = 1.0 - (1 / (this.scale) * 1.1);

        this.spriteSheet.offset.x = startX + finalX;
        this.spriteSheet.offset.y = startY - finalY;


        return this.spriteSheet;
    }
    renderText(text) {
        return new MyTextRendererIterator(this, text);
    }
}

class MyTextRendererIterator {
    constructor(textRenderer, text) {
        this.text = text;
        this.textRenderer = textRenderer;
    }
    [Symbol.iterator]() {
        const text = this.text;
        let index = 0;
        return {
            next: () => {
                const done = index >= text.length;
                let value = undefined;
                if (!done) {
                    const character = text[index];
                    value = this.textRenderer.renderCharacter(character);
                    index = index + 1;
                }
                return {
                    done: done,
                    value: value,
                }
            }
        }
    }
}

export { MyTextRenderer, MyTextRendererIterator };