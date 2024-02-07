import * as THREE from "three";

class MyTriangleFace extends THREE.BufferGeometry {
    constructor(center, points) {
        super();
        // Each vertex needs to appear once per triangle
        const allVertex = [];
        for (let i = 0; i < points.length - 1; i++) {
            allVertex.push(...center);
            allVertex.push(...points[i]);
            allVertex.push(...points[i + 1]);
        }
        const vertices = new Float32Array([...allVertex]);
        const indices = [];
        for (let i = 0; i < allVertex.length; i += 3) {
            indices.push(i, i + 1, i + 2);
        }
        console.log(indices)

        this.setIndex(indices);
        this.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.computeVertexNormals();

    }
    
    static polygon(sides, radius) {
        const delta = 2 * Math.PI / sides;
        const points = [];
        // So it starts aligned with y axis
        let currentAngle = Math.PI / 2;
        for (let i = 0; i < sides; i++) {
            const x = radius * Math.cos(currentAngle);
            const y = radius * Math.sin(currentAngle);
            points.push([x, y, 0]);
            currentAngle += delta;
        }
        points.push(points[0], points[1], points[2]);
        return new MyTriangleFace([0, 0, 0], points);
    }

}

export { MyTriangleFace };