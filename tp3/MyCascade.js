class MyCascade {
    constructor({ activeMaterial = null, castShadow = false, receiveShadow = false } = {}) {
        this.activeMaterial = activeMaterial;
        this.distance = 0;
        this.castShadow    = castShadow;
        this.receiveShadow = receiveShadow;
    }

    setActiveMaterial(activeMaterial) {
        this.activeMaterial = activeMaterial;
    }

    getActiveMaterial() {
        return this.activeMaterial;
    }

    getCastsShadow() {
        return this.castShadow;
    }

    getReceivesShadow() {
        return this.receiveShadow;
    }


    generateChild(node) {
        const child = this.copy();
        if (node.materialIds) {
            for (const material of node.materialIds) {
                if (typeof (material) == "string") {
                    child.activeMaterial = material;
                    child.distance = 0;
                }
            }
        }

        return child;
    }

    updateShadows(receiveShadow, castShadow) {

        if (castShadow !== undefined) {
            this.castShadow    = this.castShadow    || castShadow;
        }
        if (receiveShadow !== undefined) {
            this.receiveShadow = this.receiveShadow || receiveShadow;

        }
    }

    copy() {
        const copy = new MyCascade();
        copy.activeMaterial = this.activeMaterial;
        copy.castShadow = this.castShadow;
        copy.receiveShadow = this.receiveShadow;
        copy.distance = this.distance;
        return copy;
    }
    descend() {
        let res = this.copy();
        res.distance++;
        return res;
    }
}


export { MyCascade };