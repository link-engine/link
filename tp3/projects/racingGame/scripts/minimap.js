import { MyTextSquare } from "../../../MyText.js";
import * as THREE from "three";
let state = {
    minimapCamera: null,
    minimapRenderTarget: null,
    collisionRenderTarget: null,
    minimapQuad: null,
    width: 20 * 20 * 5,
    height: 20 * 20 * 5,

    minimapWidth: 20 * 20,
    minimapHeight: 20 * 20,
    initedCollisionTexture: false,
    canvas: null,
    imageData: null,
    canvasContext: null,
    textInputMesh: null,
}

function createMinimapRenderTarget() {
    const params = {
        format: THREE.DepthFormat,
        type: THREE.UnsignedShortType
    };

    const format = parseFloat(params.format);
    const type = parseFloat(params.type);

    const target = new THREE.WebGLRenderTarget(state.minimapWidth, state.minimapHeight);
    target.texture.minFilter = THREE.NearestFilter;
    target.texture.magFilter = THREE.NearestFilter;
    target.stencilBuffer = (format === THREE.DepthStencilFormat) ? true : false;
    target.depthTexture = new THREE.DepthTexture();
    target.depthTexture.format = format;
    target.depthTexture.type = type;

    return target;

}

export function onStart({ object, scene, ENGINE }) {

    state = {
        minimapCamera: null,
        minimapRenderTarget: null,
        collisionRenderTarget: null,
        minimapQuad: null,
        width: 20 * 20 * 5,
        height: 20 * 20 * 5,
    
        minimapWidth: 20 * 20,
        minimapHeight: 20 * 20,
        initedCollisionTexture: false,
        canvas: null,
        imageData: null,
        canvasContext: null,
        textInputMesh: null,
    }
    
    const cameraWidth = 500;
    state.minimapCamera = new THREE.OrthographicCamera(-cameraWidth, cameraWidth, cameraWidth, -cameraWidth - 50, 0.1, 2000);

    ENGINE.addCamera(state.minimapCamera, "minimapCamera");

    state.minimapCamera.position.y = 200;
    state.minimapCamera.lookAt(0, -500, 0);

    scene.add(state.minimapCamera);

    state.minimapRenderTarget = createMinimapRenderTarget();
    state.collisionRenderTarget = new THREE.WebGLRenderTarget(state.width, state.height);

    state.minimapQuad = object.children[0];
    state.minimapQuad.material = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
        `,
        fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tDepth;
        uniform sampler2D tDiffuse;
        void main() {
            float depth = texture2D(tDepth, vUv.xy).r;
            vec3  color = texture2D(tDiffuse,vUv).rgb;
            // Adjust the darkness based on the depth value
            float darkness = 1.0 - depth*4.0;

            gl_FragColor = vec4(color.r*darkness, color.g*darkness, color.b*darkness, 1.0);
        }
        `,
        uniforms: {
            cameraNear: { value: state.minimapCamera.near },
            cameraFar: { value: state.minimapCamera.far },
            tDiffuse: { value: null },
            tDepth: { value: null }
        }
    });
    //state.minimapQuad.material = new THREE.MeshBasicMaterial({ map: state.minimapRenderTarget.depthTexture });
    state.minimapQuad.material.needsUpdate = true;
}

export function onUpdate({ renderer = null, scene, ENGINE, clock, textRenderer }) {
    updateMinimap(renderer, scene);
    updateCheckCarIsInRoad(renderer, ENGINE.getObject("car"), ENGINE);
    //debugFindConversion(renderer, ENGINE.getObject("track"), ENGINE.getObject("car"), ENGINE);
}

function worldToTextureCoordinates(x, z) {
    const pointsInWorld = [[0, 0], [-100, 300]];
    const offSetInTexture = [[200 * 5, 209.5 * 5], [160 * 5, 95 * 5]];
    const world = [x, z];
    const final = [0, 0];
    for (let i = 0; i < 2; i++) {
        const deltaWorld = pointsInWorld[0][i] - pointsInWorld[1][i];
        const deltaTexture = offSetInTexture[0][i] - offSetInTexture[1][i];
        final[i] = offSetInTexture[0][i] + world[i] * deltaTexture / deltaWorld;
    }
    return final;

}
function updateMinimap(renderer, scene) {

    renderer.setRenderTarget(state.minimapRenderTarget);
    renderer.render(scene, state.minimapCamera);
    renderer.setRenderTarget(null);

    const uniforms = state.minimapQuad.material.uniforms;
    uniforms.tDiffuse.value = state.minimapRenderTarget.texture;
    uniforms.tDepth.value = state.minimapRenderTarget.depthTexture;

}
function updateCheckCarIsInRoad(renderer, car, ENGINE) {

    if (!state.initedCollisionTexture) {
        initCollisionTexture(ENGINE.getObject("track"), renderer);
    }
    else {
        if (!checkIfCarIsInRoad(car)) {
            ENGINE.pushEvent("onOutside");
        }
    }
}
function checkIfCarIsInRoad(car) {
    const square = 1;
    const [x, z] = worldToTextureCoordinates(car.position.x, car.position.z);
    const pixels = state.context.getImageData(x - square / 2, z - square / 2, square, square);
    for (const pixel of pixels.data) {
        if (pixel !== 255) {
            return true;
        }
    }
    return false;
}

function initCollisionTexture(track, renderer) {

    const parent = track.parent;
    const toRender = new THREE.Object3D();

    const whitePlane = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), new THREE.MeshBasicMaterial({ color: "white" }));
    whitePlane.rotation.x -= Math.PI / 2;
    whitePlane.position.y = -1;

    toRender.add(whitePlane);
    toRender.add(track);

    renderer.setRenderTarget(state.collisionRenderTarget);
    renderer.render(toRender, state.minimapCamera);
    renderer.setRenderTarget(null);

    toRender.remove(whitePlane);
    toRender.remove(track);
    parent.add(track);
    state.initedCollisionTexture = renderRoadToCanvas(renderer, state.collisionRenderTarget);
}

function renderRoadToCanvas(renderer, renderTarget) {

    const buffer = new Uint8Array(state.width * state.height * 4);
    renderer.readRenderTargetPixels(renderTarget, 0, 0, state.width, state.height, buffer)
    let canvas = document.querySelector('#blyat');
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "blyat";
        canvas.width = state.width;
        canvas.height = state.height;
        state.canvas = canvas;
    }

    state.context = canvas.getContext('2d');
    state.imageData = state.context.createImageData(state.width, state.height);
    state.imageData.data.set(buffer);
    state.context.putImageData(state.imageData, 0, 0);
    return true;

}

/*

These following functions are to be used whenever a different road track is added so that
the `worldToTextureCoordinates` function can be remade accordingly to the new track
*/

/*
Renders the road to a canvas element that is added to the page, and in every frame 
it draws a square in the car's world position so that a the user can figure out a mapping
from worldPosition to textureCoordinate.

This is easily done with the help of 2 points
1. Define two points in the world
1. Align the square (car position) with those two points

And you have a relation from those two  points in the world to the texture coordinates

Then you can change the `worldToTextureCoordinates` function to map coordinates accordingly

*/
function debugFindConversion(renderer, track, car, ENGINE) {

    if (!state.initedCollisionTexture) {
        const canvasNotInDom = state.canvas === null;
        renderRoadWithTwoLinesToCanvas(track, renderer);
        if (canvasNotInDom) {
            document.body.appendChild(state.canvas);
        }
    }
    else {
        //Draw The Map
        state.context.putImageData(state.imageData, 0, 0);

        // Check For If The Car is In The Track
        if (!checkIfCarIsInRoad(car)) {

            ENGINE.pushEvent("onOutside");
            console.log("Pushed onCollide");
        }
        // Draw The Car in The Canvas
        renderCarPositionToCanvas(car);

    }
    renderer.setRenderTarget(null);
}

// Draws a square in the canvas using the car's position  mapped to coordinates texture
function renderCarPositionToCanvas(car) {

    state.context.fillStyle = "#000000";

    const width = 5;
    const final = worldToTextureCoordinates(car.position.x, car.position.z);

    state.context.fillRect(final[0] - width / 2, final[1] - width / 2, width, width);
}
// Renders the road into the canvas with two intersecting lines so that it has
// a visual point of reference to figure out its coordinates
function renderRoadWithTwoLinesToCanvas(track, renderer) {

    const toRender = new THREE.Object3D();
    const parent = track.parent;
    toRender.add(track);
    const [l1, l2] = addTwoLines(new THREE.Vector3(-100, 1, 300));
    toRender.add(l1, l2);

    const [l3, l4] = addTwoLines(new THREE.Vector3(0, 0, 0));
    toRender.add(l3, l4);

    const whitePlane = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), new THREE.MeshBasicMaterial({ color: "white" }));
    whitePlane.rotation.x -= Math.PI / 2;
    whitePlane.position.y = -1;

    toRender.add(whitePlane);
    renderer.setRenderTarget(state.collisionRenderTarget);
    renderer.render(toRender, state.minimapCamera);
    toRender.remove(whitePlane);
    toRender.remove(track);

    parent.add(track);

    state.initedCollisionTexture = renderRoadToCanvas(renderer, state.collisionRenderTarget);

}
// Given an intersection point, draws two lines parallel to the x and z axis.
function addTwoLines(intersectionPoint) {

    const lineMaterial = new THREE.LineBasicMaterial({ color: "black", linewidth: 1 });
    const createLine = (p0, p1) => {
        const bufferGeometry = new THREE.BufferGeometry().setFromPoints([p0, p1]);
        return new THREE.Line(bufferGeometry, lineMaterial);
    }
    const x = intersectionPoint.x;
    const y = intersectionPoint.y;
    const z = intersectionPoint.z;
    const l1 = createLine(
        new THREE.Vector3(x, y, -500),
        new THREE.Vector3(x, y, 500),
    );

    const l2 = createLine(
        new THREE.Vector3(-500, y, z),
        new THREE.Vector3(500, y, z),
    );
    return [l1, l2];
}
