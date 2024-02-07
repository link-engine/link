import * as THREE from "three";
import { MyTriangleStrip } from "./MyTriangleStrip.js";

class MyPolygon extends THREE.BufferGeometry {
    constructor(slices, stacks, radius, colorCenter, colorPerifery) {
        super();
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
        this.colorCenter = colorCenter;
        this.colorPerifery = colorPerifery;

        const radiusDelta = radius / stacks;
        const angleDelta = 2 * Math.PI / slices;
        let currentAngle = Math.PI / 2;
        let currentRadius = 0;
        let vertices = new Float32Array();
        let colors = new Float32Array();

        const interPolate = (r, angle) => {
            // do something with angle
            const res = colorCenter.clone();
            res.lerp(colorPerifery, r / (stacks));
            return res;
        }
        let normals = [];
        for (let s = 0; s < stacks; s++) {
            const stack = [];
            const stackColors = [];
            const stackNormals = [];
            for (let i = 0; i < slices + 1; i++) {
                const x = currentRadius * Math.cos(currentAngle);
                const y = currentRadius * Math.sin(currentAngle);
                const nextX = (currentRadius + radiusDelta) * Math.cos(currentAngle);
                const nextY = (currentRadius + radiusDelta) * Math.sin(currentAngle);
                stack.push([x, y, 0]);
                stackNormals.push([0, 0, 1]);
                stackNormals.push([0, 0, 1]);
                stackColors.push(interPolate(s, currentAngle));
                stackColors.push(interPolate(s + 1, currentAngle));
                stack.push([nextX, nextY, 0]);
                currentAngle += angleDelta;
            }
            vertices = [...vertices, ...MyTriangleStrip.pointsFromStrip(stack)];
            colors = [...colors, ...MyTriangleStrip.pointsFromStrip(stackColors)];
            normals = [...normals, ...MyTriangleStrip.pointsFromStrip(stackNormals)];
            currentRadius += radiusDelta;
        }
        const indices = [];
        for (let i = 0; i < vertices.length; i += 3) {
            indices.push(i, i + 1, i + 2);
            indices.push(i + 1, i, i + 2);
        }
        this.setIndex(indices);
        const allVertex = this.flatten(vertices);
        const allColorVertex = this.flatten(colors);
        const allNormal = this.flatten(normals);
        this.setAttribute('normal', new THREE.BufferAttribute(allNormal, 3));
        this.setAttribute('position', new THREE.BufferAttribute(allVertex, 3));
        this.computeBoundingBox();

        this.setAttribute('color', new THREE.Float32BufferAttribute(allColorVertex, 3));

    }
    flatten(points) {
        let allVertex = new Float32Array();
        for (const point of points) {
            allVertex = new Float32Array([...allVertex, ...point]);
        }
        return allVertex;
    }
}

export { MyPolygon };