
let exports = {
    activeCar: null,
    opponentCar: null,
    playerName: null,
    level: null,
}

let state = {
    paused: false,
}

export function onStart({ object, eventMap, input }) {


    exports = {
        activeCar: null,
        opponentCar: null,
        playerName: null,
        level: null,
    }

    state = {
        paused: false,
    }

    if (!eventMap.has("onClick-orangeCarTeam")) eventMap.set("onClick-orangeCarTeam", []);
    if (!eventMap.has("onClick-greenCarTeam")) eventMap.set("onClick-greenCarTeam", []);
    if (!eventMap.has("onClick-orangeCarOpp")) eventMap.set("onClick-orangeCarOpp", []);
    if (!eventMap.has("onClick-greenCarOpp")) eventMap.set("onClick-greenCarOpp", []);
    if (!eventMap.has("inputText-playerName")) eventMap.set("inputText-playerName", []);
    const levels = ["Easy", "Medium", "Hard"];
    for (const level of levels) {
        const eventName = "onClick-level-" + level;
        if (!eventMap.has(eventName)) eventMap.set(eventName, []);
        eventMap.get(eventName).push(() => onLevelPick(level));

    }


    eventMap.get("onClick-orangeCarTeam").push(() => onClickOrangeCarTeam(object));
    eventMap.get("onClick-greenCarTeam").push(() => onClickGreenCarTeam(object));
    eventMap.get("onClick-orangeCarOpp").push(() => onClickOrangeCarOpp(object));
    eventMap.get("onClick-greenCarOpp").push(() => onClickGreenCarOpp(object));

    eventMap.get("inputText-playerName").push((e) => onPlayerInputText(e));
}

export function onUpdate({ object, eventQueue, ENGINE }) {

    if (state.paused) return;
    if (exports.activeCar !== null && exports.opponentCar !== null && exports.playerName !== null && exports.level !== null) {
        ENGINE.changeScene("race")
        state.paused = true;

    }

}
function onLevelPick(level) {
    console.log("User Chose level " + level);
    exports.level = level;
}

function onPlayerInputText(e) {
    exports.playerName = e.value;
}

export function onClickOrangeCarTeam(object) {


    exports.activeCar = "orange"
}

export function onClickGreenCarTeam(object) {

    exports.activeCar = "green"

}


export function onClickOrangeCarOpp(object) {


    exports.opponentCar = "orange"
}

export function onClickGreenCarOpp(object) {

    exports.opponentCar = "green"
}


export { exports }