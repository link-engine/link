import * as builder from "../generators.js";

function create(context) {
    let scene = builder.createScene();
    let root = builder.generateEmpty();
    let lights = builder.generateLights();

    scene.root = root;
    root.add(lights);
    root.add(builder.generateParticle());
    scene.add(root);

    root.add(builder.generateGoToMenu());
    root.add(builder.generateRestartRace(context));
    root.add(builder.generateWhoWon(context));

    assignController(root, "results");
    let camera = builder.generateCamera("perspective", {
        near: 0.1, far: 1500, angle: 75,
        position: [0, 20, 30], target: [0, 0, 0]
    })
    scene.cameras.push(camera);
    scene.initialCamera = camera;

    builder.addEnv(scene, "username", "string", context.username);
    builder.addEnv(scene, "winner", "number", context.winner);
    builder.addEnv(scene, "activeCar", "string", context.activeCar);
    builder.addEnv(scene, "opponentCar", "string", context.opponentCar);
    builder.addEnv(scene, "level", "string", context.level);


    return scene.toString();
}

export { create };

function assignController(node, script) {

    node.controller = `../projects/racingGame/scripts/${script}.js`;

}