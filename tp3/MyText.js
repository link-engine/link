import * as THREE from "three";
class MyTextSquare {

    constructor(textRenderer, text) {
        this.text = text;
        this.textRenderer = textRenderer;

        this.lines = this.text.split("\n");
        this.fontSize = 1;
        this.width = "";
        this.fit = null;
        this.height = null;
        this.material = new THREE.MeshBasicMaterial({ color: "white" });
    }
    static dispose(myTextSquare) {
        for (const object of myTextSquare.children) {
            object.geometry.dispose();
            object.material.map.dispose();
            object.material.dispose();
        }
    }
    renderCharacter(char) {
        const planeGeometry = new THREE.PlaneGeometry(this.fontSize, this.fontSize);
        const material = this.material.clone();
        material.map = this.textRenderer.renderCharacter(char).clone();
        return new THREE.Mesh(planeGeometry, material);

    }
    render() {
        let x = 0;
        let y = 0;
        const textMesh = new THREE.Group();

        const height = this.height === null ? this.lines.length : Math.min(this.lines.length, this.height);

        let width = this.width;
        if (this.fit === "max") {
            width = this.lines.map(line => line.length).reduce((acc, curr) => acc < curr ? curr : acc, -1);
        }

        for (let i = 0; i < height; i++) {
            x = 0;
            for (const c of this.lines[i]) {
                if (this.fit === "no-fit" && (x / this.fontSize) >= width) {
                    y -= this.fontSize;
                    x = 0;
                }
                const char = this.renderCharacter(c);
                char.position.set(x, y, 0);
                textMesh.add(char);
                x += this.fontSize;
            }
            while ((x / this.fontSize) < width && this.fit === "pad") {
                const padding = this.renderCharacter(" ");
                padding.position.set(x, y, 0);
                textMesh.add(padding);
                x += this.fontSize;
            }
            y -= this.fontSize;
        }
        return textMesh;
    }
}

export { MyTextSquare };