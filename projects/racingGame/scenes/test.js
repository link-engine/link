import * as builder from "../generators.js";


function create(context) {

    let scene = builder.createScene();
    

    let root = builder.generateEmpty();
    scene.root = root;
    scene.add(root);
    scene.cameras.push(camera);
    scene.initialCamera = camera;

    return scene.toString();
}

export { create };