import { MyTextSquare } from "../../../MyText.js";

let state = {
    text: "",
    completed: false,
    textInput: null,
    textInputMesh: null,
    flip: false,
    flipTime: 0,
}

let characters = [];

export function onStart({ input }) {


    state = {
        text: "",
        completed: false,
        textInput: null,
        textInputMesh: null,
        flip: false,
        flipTime: 0,
    }

    characters = [];
    characters = [];
    for (let i = 32; i < 127; i++) {
        const symbol = String.fromCharCode(i);
        if (input[symbol] === undefined) {
            input[symbol] = false;
        }
        characters.push(symbol)
    }
}

export function onUpdate({ object, input, textRenderer, ENGINE, clock }) {

    if (state.completed) {
        return;
    }
    const original = state.text;
    for (const c of characters) {
        if (input[c]) {
            input[c] = false;
            state.text = state.text + c;
        }
    }
    if (input["Backspace"] && state.text.length > 0) {
        state.text = state.text.slice(0, state.text.length - 1);
        input["Backspace"] = false;
    }
    if (input["Enter"] && state.text.length > 0) {
        state.completed = true;
        const event = {
            name: "inputText-" + ENGINE.getNode(object.id),
            value: state.text,
        }
        console.log(event);
        ENGINE.pushEvent(event);
    }
    const tick = clock.getElapsedTime();

    if (original !== state.text || shouldFlip(tick) || state.textInputMesh === null || state.completed) {
        updateText(object, textRenderer, tick);
    }
}

function shouldFlip(tick) {
    return (tick - state.flipTime) > 0.75;
}
function updateText(object, textRenderer, tick) {
    if (state.textInput !== null && state.textInputMesh !== null) {
        object.remove(state.textInputMesh);
        MyTextSquare.dispose(state.textInputMesh);
    }
    if (shouldFlip(tick)) {
        state.flip = !state.flip;
        state.flipTime = tick;
    }
    let textToRender = "Input Your Name:" + state.text;
    if (!state.completed) {
        if (state.flip) {
            textToRender = textToRender + "|";
        }
        else {
            textToRender = textToRender + " ";
        }
    }
    state.textInput = new MyTextSquare(textRenderer, textToRender);
    state.textInput.fontSize = 3;
    state.textInput.fit = "max";
    state.textInputMesh = state.textInput.render();
    object.add(state.textInputMesh);
}