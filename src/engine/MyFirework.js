import * as THREE from 'three'

class MyFirework {

    constructor(parent) {
        this.parent = parent;
        this.done = false
        this.dest = []

        this.vertices = null
        this.colors = null
        this.geometry = null
        this.points = null

        this.material = new THREE.PointsMaterial({
            size: 0.3,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })

        this.height = 40
        this.speed = 60

        this.launch()

    }

    /**
     * compute particle launch
     */

    launch() {
        let color = new THREE.Color()
        color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.5)
        let colors = [color.r, color.g, color.b]
        this.mainColor = colors;
        let x = THREE.MathUtils.randFloat(-5, 5)
        let y = THREE.MathUtils.randFloat(this.height * 0.9, this.height * 1.1)
        let z = THREE.MathUtils.randFloat(-5, 5)
        this.dest.push(x, y, z)
        let vertices = [0, 0, 0]

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        this.points = new THREE.Points(this.geometry, this.material)
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.parent.add(this.points)
    }

    /**
     * compute explosion
     * @param {*} vector 
     */
    explode(origin, n, rangeBegin, rangeEnd) {

        //console.log("Exploding!")
        this.parent.remove(this.points);
        this.points.geometry.dispose();
        this.colors = [];
        const vertices = [];
        for (let p = 0; p < n; p++) {
            let x = origin[0] + THREE.MathUtils.randFloat(-5, 5);
            let y = origin[1] + THREE.MathUtils.randFloat(-5, 5);
            let z = origin[2] + THREE.MathUtils.randFloat(-5, 5);
            this.dest.push(x, y, z);
            vertices.push(...origin);
            this.colors.push(...this.mainColor);
        }
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));
        this.points = new THREE.Points(this.geometry, this.material)
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.parent.add(this.points);
    }

    /**
     * cleanup
     */
    reset() {
        this.parent.remove(this.points)
        this.dest = []
        this.vertices = null
        this.colors = null
        this.geometry = null
        this.points = null
    }

    /**
     * update firework
     * @returns 
     */
    update() {

        // do only if objects exist
        if (this.points && this.geometry) {
            let verticesAtribute = this.geometry.getAttribute('position')
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            // lerp particle positions 
            let j = 0
            for (let i = 0; i < vertices.length; i += 3) {
                vertices[i] += (this.dest[i] - vertices[i]) / this.speed
                vertices[i + 1] += (this.dest[i + 1] - vertices[i + 1]) / this.speed
                vertices[i + 2] += (this.dest[i + 2] - vertices[i + 2]) / this.speed
            }
            verticesAtribute.needsUpdate = true

            // only one particle?
            if (count === 1) {
                //is YY coordinate higher close to destination YY? 
                const distanceCanStartExploding = this.dest[1] * 0.60;
                const fromExploding = distanceCanStartExploding - vertices[1];
                /*                 
                if (Math.ceil(vertices[1]) > (this.dest[1] * 0.90)) {
                                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                                    this.explode(vertices, 80, this.height * 0.05, this.height * 0.8)
                                    return
                                } */
                if (fromExploding <= 0 && Math.random() < 0.05) {

                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(vertices, 80, this.height * 0.05, this.height * 0.8)
                    return
                }
            }

            // are there a lot of particles (aka already exploded)?
            if (count > 1) {
                // fade out exploded particles 
                this.material.opacity -= 0.015
                this.material.needsUpdate = true
            }

            // remove, reset and stop animating 
            if (this.material.opacity <= 0) {
                this.reset()
                this.done = true
                return
            }
        }
    }
}

export { MyFirework }