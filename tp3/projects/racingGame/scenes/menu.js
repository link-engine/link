import * as builder from "../generators.js";


function create(context) {

    let scene = builder.createScene();
    let root = builder.generateEmpty();
    let lights = builder.generateLights();

    let orangeCarTeam = builder.generateCar("orangeCarTeam", "orange");
    let greenCarTeam = builder.generateCar("greenCarTeam", "green");

    let orangeCarOpp = builder.generateCar("orangeCarOpp", "orange");
    let greenCarOpp = builder.generateCar("greenCarOpp", "green");

    let parkingLot1 = builder.generateParkingLot();
    let parkingLot2 = builder.generateParkingLot();



    parkingLot1.id = "parkingLot1";
    parkingLot2.id = "parkingLot2";

    parkingLot1.add(orangeCarTeam, greenCarTeam);
    orangeCarTeam.position.set(-5, 2, 0);
    greenCarTeam.position.set(5, 2, 0);

    let inputText = builder.generateInputText();
    root.add(inputText);

    parkingLot2.add(orangeCarOpp, greenCarOpp);
    orangeCarOpp.position.set(-5, 2, 0);
    greenCarOpp.position.set(5, 2, 0);

    let parkingLot = builder.generateEmpty();
    parkingLot.add(parkingLot1);
    parkingLot.add(parkingLot2);
    parkingLot2.position.set(-20, 0, 0);
    parkingLot1.position.set(20, 0, 0);

    root.add(builder.generateDifficultyPicker());

    root.add(builder.generatePlane())
    scene.root = root;
    root.add(lights);
    root.add(parkingLot);
    root.add(builder.generateParticle());
    scene.add(root);

    assignController(root, "menu");
    let camera = builder.generateCamera("perspective", {
        near: 0.1, far: 1500, angle: 75,
        position: [0, 20, 70], target: [0, 0, 0]
    })
    scene.cameras.push(camera);
    scene.initialCamera = camera;


    return scene.toString();
}

export { create };

function assignController(node, script) {

    node.controller = `../projects/racingGame/scripts/${script}.js`;

}