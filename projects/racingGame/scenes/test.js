import * as builder from "../generators.js";


function create(context) {

    let scene = builder.createScene();
    

    let root = builder.generateEmpty();
    scene.root = root;
    scene.add(root);
    let lights = builder.generateLights();
    root.add(lights);
    root.add(builder.generateCar("car", "green"));
    let camera = builder.generateCamera("perspective", {
        near: 0.1, far: 1500, angle: 75,
        position: [0, 20, 70], target: [0, 0, 0]
    })


    scene.cameras.push(camera);
    scene.initialCamera = camera;

    return scene.toString();
}

export { create };