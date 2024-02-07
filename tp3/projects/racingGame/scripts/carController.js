import { MyTextSquare } from "../../../MyText.js";

let state = {
    speed: 0,
    steering: 0,
    lastUpdate: 0,
    logObject: null,
    logLastUpdated: 0,
    log: null,
    stun: false,
    ghosting: false,
    ghostDelta: 0,
    stunDelta: 0,
    strong: false,
    strongDelta: 0,

    agile: false,
    agileDelta: 0,

    pause: false,

    textInputMesh: null,
}


export function onStart({ object, eventMap, input, textRenderer, scene }) {

    state = {
        speed: 0,
        steering: 0,
        lastUpdate: 0,
        logObject: null,
        logLastUpdated: 0,
        log: null,
        stun: false,
        ghosting: false,
        ghostDelta: 0,
        stunDelta: 0,
        strong: false,
        strongDelta: 0,

        agile: false,
        agileDelta: 0,

        pause: false,

        textInputMesh: null,
    }

    if (!eventMap.has("onSpeed")) eventMap.set("onSpeed", []);
    if (!eventMap.has("onPause")) eventMap.set("onPause", []);
    if (!eventMap.has("onResume")) eventMap.set("onResume", []);
    if (!eventMap.has("onOutside")) eventMap.set("onOutside", []);

    if (input["w"] === undefined) input["w"] = false;
    if (input["s"] === undefined) input["s"] = false;
    if (input["a"] === undefined) input["a"] = false;
    if (input["d"] === undefined) input["d"] = false;

    eventMap.get("onSpeed").push(() => onSpeed(object));
    eventMap.get("onPause").push(() => onPause());
    eventMap.get("onResume").push(() => onResume());
    eventMap.get("onOutside").push(() => onOutside());

    state.speed = 0;
    state.steering = 0;
    state.lastUpdate = 0;
    state.log = (time) => {
        if ((time - state.logLastUpdated) < 0.25) {
            return;
        }
        state.logLastUpdated = time;
        if (state.logObject) {
            MyTextSquare.dispose(state.logObject);
            scene.remove(state.logObject);
        }
        const t = new MyTextSquare(textRenderer, `Car Speed: ${state.speed}`)
        t.fit = "max";
        state.logObject = t.render();
        state.logObject.position.y = 10;
        scene.add(state.logObject);
    }
}

export function onUpdate({ object, input, aliasTable, clock, ENGINE, textRenderer }) {

    if (state.pause) return
    if (state.stun) {
        if (clock.getElapsedTime() - state.stunDelta > 1) {
            state.stun = false;
            state.ghostDelta = clock.getElapsedTime();
            state.ghosting = true;
        }

        return;
    }

    updateTextVelocity(ENGINE.getObject("velocity-text-container"), state.speed, textRenderer);

    if (state.agile && clock.getElapsedTime() - state.agileDelta > 10) state.agile = false;
    if (state.strong && clock.getElapsedTime() - state.strongDelta > 10) state.strong = false;



    state.log(clock.getElapsedTime());
    let lastUpdate = state.lastUpdate;
    const tick = clock.getElapsedTime();
    let delta = tick - lastUpdate;
    state.log(tick);
    state.lastUpdate = tick;

    if (input["s"]) state.speed -= 10 * delta;
    if (input["w"]) state.speed += 10 * delta;

    if (state.speed < - 1) state.speed = -1;
    if (state.speed > 1) state.speed = 1;

    calculatePosition(object, state.speed, delta, input["w"] || input["s"]);

    for (const child of object.children) {
        let alias = aliasTable.get(child.id);
        switch (alias) {
            case "frontWheel": updateFrontWheel(child, delta, input); break;
            case "backWheel": updateBackWheel(child, delta, input); break;
            default:
                break;


        }
    }

}
function updateTextVelocity(container, velocity, textRenderer) {
    if (state.textInputMesh !== null) {
        container.remove(state.textInputMesh);
        MyTextSquare.dispose(state.textInputMesh);
    } else {
        container.remove(container.children[0]);
    }
    const textToRender = "Velocity : " + (velocity * 120).toFixed(2);
    const textInput = new MyTextSquare(textRenderer, textToRender);
    textInput.fontSize = 1;
    textInput.fit = "max";
    state.textInputMesh = textInput.render();
    container.add(state.textInputMesh);
}
function onOutside() {

    console.log(state.strong)
    if (!state.strong && (state.speed >= 0.2 || state.speed <= -0.2)) {
        let factor = (state.speed >= 0) ? 1 : -1;
        state.speed = 0.2 * factor;
    }
}

function stun(delta) {

    state.stun = true;
    state.stunDelta = delta;

}

function agility(delta) {

    state.agile = true;
    state.agileDelta = delta;

}

function strength(delta) {

    state.strong = true;
    state.strongDelta = delta;

}

export function onCollide({ object, otherObject, clock, aliasTable }) {

    if (state.stun) return;
    if (state.ghosting) {
        if (clock.getElapsedTime() - state.ghostDelta > 1) {
            state.ghosting = false;
        }
        return;
    }


    let alias = aliasTable.get(otherObject.id);

    if (alias === "crate") {

        state.speed = 0;
        stun(clock.getElapsedTime())
    }
    if (alias === "oppCar") {

        state.speed = 0;
    }

    if (alias === "agility") agility(clock.getElapsedTime())
    if (alias === "strength") strength(clock.getElapsedTime())



}

export function onPause() {

    state.pause = true;

}

export function onResume() {

    state.pause = false;

}


export function onSpeed(object) {

    console.log("VROOM");
}

function updateFrontWheel(child, delta, input) {

    rotateWheel(child, state.speed, 10 * delta, input, true);
    state.steering = child.rotation.y;


}
function updateBackWheel(child, delta, input) {

    rotateWheel(child, state.speed, 10 * delta, input);


}


function calculatePosition(object, speed, delta, input) {

    let factor = 1;

    if (!input) {
        if (state.speed > 0) state.speed -= 1 * delta;
        if (state.speed < 0) state.speed += 1 * delta;
    }

    if (state.agile)
        factor = 2;

    if (input && (state.steering > 10 * delta || state.steering < -10 * delta)) object.rotation.y += state.steering * 0.06;

    object.position.set(object.position.x + Math.sin(object.rotation.y) * state.speed * factor, object.position.y, object.position.z + Math.cos(object.rotation.y) * state.speed * factor);
}



function rotateWheel(child, velocity, angle, input, updateDirection = false) {

    child.rotation.order = 'YXZ'
    child.rotation.x += velocity;
    let factor = (state.speed >= 0) ? 1 : -1;

    if (updateDirection) {

        if (input["a"]) child.rotation.y += angle * factor;
        else if (input["d"]) child.rotation.y -= angle * factor;
        else {
            if (child.rotation.y > 0) child.rotation.y -= angle;
            if (child.rotation.y < 0) child.rotation.y += angle;

        }
    }

    if (child.rotation.y < -0.6) child.rotation.y = -0.6;
    if (child.rotation.y > 0.6) child.rotation.y = 0.6;

}
