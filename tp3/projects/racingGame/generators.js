import * as yafx from "../../../yafx/yafx.js";
import { Vector3 } from "three";



function assignController(node, script) {

    node.controller = `../projects/racingGame/scripts/${script}.js`;

}

let grassTexture = new yafx.Texture("../projects/racingGame/textures/grass.jpg");
let grassMaterial = new yafx.Material({ color: [1, 1, 1, 1] });
grassMaterial.texture = grassTexture;
grassMaterial.bumpTexture = new yafx.Texture("../projects/racingGame/textures/grass_map.png");
grassMaterial.bumpScale = 0.2


let yellowShader = new yafx.Shader({
    vert: "../projects/racingGame/shaders/pulse.vert",
    frag: "../projects/racingGame/shaders/pulse.frag"
})

yellowShader.id = "yellowPulse"
yellowShader.children = [
    { name: "time", type: 'f', value: 1.0 },
    { name: "color", type: "vec3", value: [1, 1, 0] },
    { name: "scale", type: "f", value: 1.0 }
]

export function generateInputText() {
    const content = "Input Your Name: ";
    const text = new yafx.Text({ content: content, fontSize: 3, width: 5, fit: "max" });
    text.position.y = 40;
    text.position.x = -30;
    assignController(text, "inputText");
    text.id = "playerName";
    return text;
}
let brownShader = new yafx.Shader({
    vert: "../projects/racingGame/shaders/pulse.vert",
    frag: "../projects/racingGame/shaders/pulse.frag"
})

brownShader.id = "brownPulse"
brownShader.children = [
    { name: "time", type: 'f', value: 1.0 },
    { name: "color", type: "vec3", value: [0.5, 0.25, 0] },
    { name: "scale", type: "f", value: 1.0 }
]

export function createScene() {

    return new yafx.Scene();

}

export function generateRestartRace(context) {
    const button = new yafx.Text({ content: "Restart Race", fontSize: 1, width: 20, fit: "no-fit" });
    button.id = "restart-race";
    button.position.set(-15, 0, 0);
    return button;
}
export function generateWhoWon(context) {
    const node = new yafx.Node();
    let button;
    if (context.winner) {
        button = new yafx.Text({ content: `You Won! Congratulations ${context.username}`, fontSize: 1, width: 20, fit: "no-fit" });
    } else {
        button = new yafx.Text({ content: "Sadly AI is the Winner", fontSize: 1, width: 20, fit: "no-fit" });
    }
    node.add(button);
    button.position.set(-10, 3, 0);
    const time = new yafx.Text({ content: `Total Time: ${parseFloat(context.time).toFixed(2)}s`, fontSize: 1, width: 20, fit: "max" });
    time.position.set(-10, 0, 0);
    node.add(time);
    node.position.set(-10, 10, 0);
    return node;
}
export function generateGoToMenu() {
    const button = new yafx.Text({ content: "Go To Menu", fontSize: 1, width: 20, fit: "max" });
    button.id = "go-to-menu";
    button.position.set(10, 0, 0);
    return button;
}

export function generateParticle() {
    return new yafx.Particle({
        start: [1, 1, 1],
        finish: [-1, 10, -2],
        velocity: 2,
        loop: yafx.Particle.LOOP.TIMES(10),
    });
}

export function addEnv(scene, key, type, value) {

    let env = new yafx.Env(key, { type: type, value: value })

    scene.envs.push(env);
}

export function generateTestSphere() {

    let sphere = new yafx.Model3D("../projects/racingGame/models/banana.glb", 0)
    sphere.material = shader;
    return sphere

}

export function generateBananaHud() {

    let bananaHud = new yafx.HUD("bananaHUD");
    let model = new yafx.Model3D("../projects/racingGame/models/banana.glb", 0)
    bananaHud.alias = "bananaHud"
    bananaHud.material = yellowShader;
    model.position.set(0, 0, 0);
    bananaHud.add(model)
    return bananaHud;


}


export function generateRaceHUD(name, level) {
    const hud = new yafx.HUD("normalHUD")
    const o = new yafx.Rectangle(10, 10);
    assignController(o, "minimap");

    o.position.set(20, 5, -25);
    const x = -28
    const playerName = new yafx.Text({ content: `Player: ${name}`, fontSize: 1, width: 20, fit: "no-fit" });
    playerName.position.set(x, 13, -25);

    const levelText = new yafx.Text({ content: `Level : ${level}`, fontSize: 1, width: 15, fit: "no-fit" });
    levelText.position.set(x, 14, -25);

    const lapInfo = new yafx.Node();
    lapInfo.id = "lap-info-text-container";
    lapInfo.add(new yafx.Text({ content: `Lap 1/3`, fontSize: 1, width: 20, fit: "no-fit" }));
    lapInfo.position.set(x, 15, -25);

    const velocity = new yafx.Node();
    velocity.id = "velocity-text-container";
    velocity.add(new yafx.Text({ content: `Velocity: 0`, fontSize: 1, width: 20, fit: "no-fit" }));
    velocity.position.set(x, 16, -25);

    const timeElapsed = new yafx.Node();
    timeElapsed.id = "time-elapsed-text-container";
    timeElapsed.add(new yafx.Text({ content: `Time Elapsed: 0`, fontSize: 1, width: 20, fit: "no-fit" }));
    timeElapsed.position.set(x, 17, -25);


    hud.add(o);
    hud.add(lapInfo);
    hud.add(timeElapsed);
    hud.add(velocity);
    hud.add(levelText);
    hud.add(playerName);

    return hud;

}

export function generateHelloWorld() {
    const content = "Hello World\nthis\nis\nYafx!";
    const t = new yafx.Text({ content: content, fontSize: 10, width: 5, fit: "max" });
    return t;
}

export function generateEmpty() {
    return new yafx.Node()
}

export function generateParkingLot() {

    let parkingLot = new yafx.Node("parkingLot");
    let model = new yafx.Model3D("../projects/racingGame/models/parking_lot.glb", 0)
    model.alias = "parkingLot"
    model.position.set(0, 0.3, 0);
    parkingLot.add(model)
    model.scale.set(3, 1, 3);
    return parkingLot;
}

export function generateCar(id, color) {


    let car = new yafx.Node(id);
    let frame = new yafx.Model3D(`../projects/racingGame/models/car_frame_${color}.glb`, 0)
    let backLeftWheel = new yafx.Model3D("../projects/racingGame/models/car_wheel.glb", 0)
    let backRightWheel = new yafx.Model3D("../projects/racingGame/models/car_wheel.glb", 0)
    let frontLeftWheel = new yafx.Model3D("../projects/racingGame/models/car_wheel.glb", 0)
    let frontRightWheel = new yafx.Model3D("../projects/racingGame/models/car_wheel.glb", 0)

    frame.alias = "frame"
    frontLeftWheel.alias = "frontWheel"
    frontRightWheel.alias = "frontWheel"
    backLeftWheel.alias = "backWheel"
    backRightWheel.alias = "backWheel"

    frame.position.set(0, 0, 0);

    frontLeftWheel.position.set(-2, -0.6, 3.8);
    frontRightWheel.position.set(2, -0.6, 3.8);
    backLeftWheel.position.set(-2, -0.6, -3);
    backRightWheel.position.set(2, -0.60, -3);

    let body = new yafx.Body()
    car.body = body;
    car.add(frame, frontLeftWheel, frontRightWheel, backLeftWheel, backRightWheel);


    return car;
}

export function generatePlane() {
    let plane = new yafx.Node("plane");
    let terrain = new yafx.Rectangle(2600, 2600);
    plane.add(terrain);
    plane.rotation.set(-90, 0, 0);
    plane.material = grassMaterial;
    return plane;

}

export function generatePowerup(type = "agility") {

    let powerup = new yafx.Node();
    let model = new yafx.Model3D(`../projects/racingGame/models/${type}_up.glb`, 0)
    powerup.alias = type
    model.position.set(0, 0, 0);

    powerup.add(model);

    return powerup;


}

export function generateCrate() {

    let box = new yafx.Node();
    let model = new yafx.Model3D("../projects/racingGame/models/crate.glb", 0)
    box.alias = "crate"
    box.material = brownShader;
    model.position.set(0, 0, 0);
    box.add(model)
    return box;

}


export function generateBox(x, y, width, height, depth) {

    let box = new yafx.Box(width * 12, height, depth * 12);
    box.position.set(x, 1, y);
    return box;

}


export function generateBananaObstacle() {

    let bananaObstacle = new yafx.Node();
    let model = new yafx.Model3D("../projects/racingGame/models/banana.glb", 0)
    bananaObstacle.alias = "bananaObstacle"
    bananaObstacle.material = yellowShader;
    model.position.set(0, 0, 0);
    bananaObstacle.add(model)
    return bananaObstacle;

}
export function generateDifficultyPicker() {
    const node = new yafx.Node();
    const levels = ["Easy", "Medium", "Hard"];

    const header = new yafx.Text({ content: "Choose Difficulty", fontSize: 4, width: 5, fit: "max" });
    header.position.set(-35, 20, 0);
    node.add(header);

    let start = -32;
    for (const level of levels) {
        const t = new yafx.Text({ content: level, fontSize: 3, width: 5, fit: "max" });
        t.id = "level-" + level;
        t.position.x = start;
        t.position.y = 15;
        start += 25;
        node.add(t);
    }
    return node;
}

export function generateHUD() {
    let hud = new yafx.HUD();
    let rectangle = new yafx.Node();
    rectangle.add(new yafx.Rectangle())
    rectangle.add(new yafx.Sphere())
    hud.add(rectangle);

    rectangle.position.set(0, -10, -25);
    return hud;
}

export function generateCamera(type, params, name = "Normal Camera") {

    let camera;

    if (type == "perspective") camera = new yafx.PerspectiveCamera(params, name);
    else if (type == "orthographic") camera = new yafx.OrthographicCamera(params, name);

    return camera
}

export function generateLights() {
    let lights = new yafx.Node();
    const params = {
        enabled: true,
        castshadow: true,
        color: [1, 0.87, 0.54, 1],
        distance: 1000,
        intensity: 0.5,
        decay: 0,
        target: new Vector3(-200, 0, 0),
    }


    let spotlight1 = new yafx.PointLight(params);
    let spotlight2 = new yafx.PointLight(params);

    spotlight2.castshadow = false;
    spotlight2.distance = 100;

    spotlight1.position.set(-100, 125, 0);
    spotlight2.position.set(-150, 50, 0);


    lights.add(spotlight1, spotlight2);
    return lights

}