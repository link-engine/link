import * as THREE from "three";
class MyTriangleStrip extends THREE.BufferGeometry {
    constructor(points) {
        super();
        const convertedPoints = MyTriangleStrip.pointsFromStrip(points);
        const vertices = MyTriangleStrip.buildVertices(convertedPoints);
        this.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.computeVertexNormals();

    }
    static pointsFromStrip(points) {
        const allVertex = [];
        let flip = true;
        for (let i = 2; i < points.length; i++) {

            const a = [...points[i - 2]];
            const b = [...points[i - 1]];
            const c = [...points[i]];
            if (flip) {
                allVertex.push(b, a, c)

            }
            else {
                allVertex.push(a, b, c);
            }
            flip = !flip;
        }

        return allVertex;
    }
    static buildVertices(points) {
        const iterable = (function* () {
            for (const e of points)
                yield* e;
        })();
        return new Float32Array(iterable);
    }
    static ring(sides, stacks, inRadius, outRadius) {
        const radiusDelta = (outRadius - inRadius) / stacks;
        const angleDelta = 2 * Math.PI / sides;
        let currentAngle = Math.PI / 2;
        let currentRadius = inRadius;
        const points = [];

        for (let s = 0; s < stacks; s++) {

            for (let i = 0; i < sides + 1; i++) {
                const nextX = (currentRadius + radiusDelta) * Math.cos(currentAngle);
                const nextY = (currentRadius + radiusDelta) * Math.sin(currentAngle);
                points.push([nextX, nextY, 0]);
                const x = currentRadius * Math.cos(currentAngle);
                const y = currentRadius * Math.sin(currentAngle);
                points.push([x, y, 0]);
                currentAngle += angleDelta;
            }

            currentRadius += radiusDelta;
        }
        return new MyTriangleStrip(points);
    }
}

export { MyTriangleStrip };