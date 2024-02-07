import { MyFirework } from "../../../MyFirework.js";
import * as THREE from "three";
let exports = {
    activeCar: null,
    opponentCar: null,
    playerName: null,
    level: null,
}

let state = {
    winner: false,
    username: "",
    fireworks: []
}

export function onStart({ object, eventMap, input, ENGINE, scene }) {
    exports = {
        activeCar: ENGINE.getEnv("activeCar"),
        opponentCar: ENGINE.getEnv("opponentCar"),
        playerName: ENGINE.getEnv("username"),
        level: ENGINE.getEnv("level"),
    }

    state = {
        winner: false,
        username: "",
        fireworks: [],
    }

    console.log("Results on Start");

    let eventName = "onClick-go-to-menu";
    if (!eventMap.has(eventName)) eventMap.set(eventName, []);
    eventMap.get(eventName).push(() => changeToMenu(ENGINE));

    eventName = "onClick-restart-race";
    if (!eventMap.has(eventName)) eventMap.set(eventName, []);
    eventMap.get(eventName).push(() => ENGINE.changeScene("race"));
    state.winner = ENGINE.getEnv("winner") === "true";
    state.playerName = ENGINE.getEnv("username");

    if (state.container == null) {
        state.container = new THREE.Group();
        object.add(state.container);
    }
}

function updateFireWorks() {
    // add new fireworks every 5% of the calls
    if (Math.random() < 0.05) {
        state.fireworks.push(new MyFirework(state.container));
    }

    // for each fireworks 
    for (let i = 0; i < state.fireworks.length; i++) {
        // is firework finished?
        if (state.fireworks[i].done) {
            // remove firework 
            state.fireworks.splice(i, 1)
            continue
        }
        state.fireworks[i].update()
    }

}
function changeToMenu(ENGINE) {
    console.log("changeToMenu");
    //exports.winner = ENGINE.getEnv("username");
    ENGINE.changeScene("menu");
}

export function onUpdate({ object, eventQueue, ENGINE }) {
    if (state.winner) {
        updateFireWorks();
    }
}

export { exports }