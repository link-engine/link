import * as THREE from "three";
import { MyTriangleStrip } from "../../../src/engine/MyTriangleStrip.js";
class MyTrack extends THREE.Object3D {
    constructor(controlPoints, width, material, samplingRate) {
        super();
        this.width = width || 5;
        this.samplingRate = samplingRate || 20;
        this.controlPoints = [];
        this.controlPointsVec3 = [];
        this.roadMaterial = material || new THREE.MeshBasicMaterial({ color: "cyan" });
        for (let i = 0; i < controlPoints.length; i += 2) {
            const [x, y, z] = [controlPoints[i], 0, controlPoints[i + 1]];
            this.controlPoints.push([x, y, z]);
            this.controlPointsVec3.push(new THREE.Vector3(x, y, z));
        }

        this.tangentLines = [];
        this.perpendicularLines = [];
        this.perpendicularPoints = [];

        this.controlPointsMesh = null;
        this.trackCenterLine = null;
        this.perpendicularLines = null;

        this.build();

        this.buildPerpendicularLines();
        this.perpendicularLines.visible = false;
        this.buildTrackCenterLine();
        this.trackCenterLine.visible = false;
    }

    toggleObject(on, toToggle) {
        let visibility = on;
        if (visibility === undefined) {
            visibility = !toToggle.visible;
        }
        toToggle.visible = visibility
    }

    toggleTrackCenterLine(on) {
        this.toggleObject(on, this.trackCenterLine);
    }
    toggleControlPoints(on) {
        this.toggleObject(on, this.controlPointsMesh);
    }
    togglePerpendicularLines(on) {
        this.toggleObject(on, this.perpendicularLines);
    }


    buildControlPoints() {
        if (this.controlPointsMesh) {
            this.remove(this.controlPointsMesh);
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        this.controlPointsMesh = new THREE.Points(geometry, this.pointsMaterial);
        this.add(this.controlPointsMesh);
    }
    buildTrackCenterLine() {
        if (this.trackCenterLine) {
            this.remove(this.trackCenterLine);
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        const lineMesh = new THREE.Line(geometry, this.lineMaterial);
        this.trackCenterLine = lineMesh;
        this.add(this.trackCenterLine);
    }
    buildPerpendicularLines() {
        if (this.perpendicularLines) {
            this.remove(this.perpendicularLines);
        }
        this.perpendicularLines = new THREE.Group();
        this.lineMaterial = new THREE.LineBasicMaterial({ color: "red", linewidth: 3 });
        for (let i = 0; i < this.perpendicularPoints.length; i += 2) {
            const p0 = this.perpendicularPoints[i];
            const p1 = this.perpendicularPoints[i + 1];
            const geometry = new THREE.BufferGeometry().setFromPoints([p0, p1]);
            const lineMesh = new THREE.Line(geometry, this.lineMaterial);
            this.perpendicularLines.add(lineMesh);
        }
        this.add(this.perpendicularLines);
    }

    build() {
        const catmull = new THREE.CatmullRomCurve3(this.controlPointsVec3, true);
        this.points = [];
        this.tangents = [];
        for (let i = 0; i < this.samplingRate; i++) {
            const p = catmull.getPointAt(i / this.samplingRate);
            const t = catmull.getTangentAt(i / this.samplingRate);

            this.points.push(p);
            this.tangents.push(t);
        }

        const innerTriangleStripPoints = [];
        const outterTriangleStripPoints = [];
        for (let i = 0; i < this.points.length; i++) {
            const p0 = this.points[i];
            const p1 = p0.clone();
            p1.add(this.tangents[i]);

            const cross = new THREE.Vector3();
            cross.crossVectors(this.tangents[i], new THREE.Vector3(0, 1, 0));
            const crossScaled = cross.multiplyScalar(this.width / 2);
            const p2 = p0.clone();
            p2.add(crossScaled);

            const p3 = p0.clone();
            p3.addScaledVector(crossScaled, -1);

            this.perpendicularPoints.push(p2, p3);

            innerTriangleStripPoints.push(p2, p0);
            outterTriangleStripPoints.push(p0, p3);


        }
        const flatten = (arrayOfVectors) => {
            const array = [];
            for (const vector of arrayOfVectors) {
                array.push([vector.x, vector.y, vector.z]);
            }
            return array;
        }

        const sides = [innerTriangleStripPoints, outterTriangleStripPoints];
        const sideMeshes = [];

        for (const arrayOfVectors of sides) {
            const array = flatten(arrayOfVectors);

            let triangleStrip = MyTriangleStrip.pointsFromStrip(array);
            triangleStrip = MyTriangleStrip.buildVertices(triangleStrip);
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(triangleStrip, 3));

            const mesh = new THREE.Mesh(geometry, this.roadMaterial);
            sideMeshes.push(mesh);
        }

        this.add(...sideMeshes);


    }

}
export { MyTrack };