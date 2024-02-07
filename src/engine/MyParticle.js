import * as THREE from "three";

class MyLoop {

    decrement() { }
    isDone() { }
}
class MyLoopForever {
    constructor() { }
    decrement() { }
    isDone() {
        return false;
    }
}
class MyLoopTimes {
    constructor(times) {
        this.times = times;
    }
    isDone() {
        return this.times <= 0;
    }
    decrement() {
        this.times = this.times - 1;
    }
}
class MyParticle {
    constructor({ start, finish, velocity, color, loop }) {
        this.start = start;
        this.finish = finish;
        this.velocity = 40;
        this.color = color;
        this.loop = MyParticle.loopFromString(loop);
        this.material = new THREE.PointsMaterial({
            size: 0.4,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })
        this.mesh = null;
        this.init();
    }
    static loopFromString(loop) {
        if (loop === "forever") {
            return new MyLoopForever();
        }
        let times;
        if (loop === "once") {
            times = 1;
        }
        else {
            times = parseInt(loop);
        }
        return new MyLoopTimes(times);
    }
    initAttributes() {
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.start), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.color), 3));
        this.geometry.getAttribute('position').needsUpdate = true;
        this.geometry.getAttribute('color').needsUpdate = true;

    }
    init() {
        this.geometry = new THREE.BufferGeometry()
        this.initAttributes();
        this.mesh = new THREE.Points(this.geometry, this.material)
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

    }
    isDone() {
        return this.loop.isDone();
    }
    update() {
        if (this.isDone()) {
            return;
        }
        if (!(this.mesh && this.geometry)) {
            return;
        }

        let verticesAtribute = this.geometry.getAttribute('position')
        let vertices = verticesAtribute.array
        vertices[0] += (this.finish[0] - vertices[0]) / this.velocity
        vertices[1] += (this.finish[1] - vertices[1]) / this.velocity
        vertices[2] += (this.finish[2] - vertices[2]) / this.velocity
        verticesAtribute.needsUpdate = true
        if (this.finishedCycle(vertices)) {
            this.loop.decrement();
            this.initAttributes();
        }
    }
    finishedCycle(vertices) {
        let finished = true;
        for (let i = 0; i < 3; i++) {
            finished = finished && vertices[i] >= this.finish[i] * 0.99;
        }
        return finished;
    }
}

export { MyParticle };