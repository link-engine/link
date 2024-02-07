

let state = {
    ready: true,
}

let elapsed = 0;

export function onStart({ object, eventMap, input, textRenderer, scene }) {

    state = {
        ready: true,
    }
    
    let elapsed = 0;

}

export function onUpdate({ object, input, updateDelta, aliasTable, ENGINE }) {

    if (!state.ready)  {
        elapsed += updateDelta;
        console.log(elapsed)
        if (elapsed > 5) {
            ENGINE.changeHUD("normalHUD");
            state.ready = true;
        }

        return;
    }

}


export function onCollide({object, other, updateDelta, ENGINE}) {

    if (!state.ready) return;
    elapsed = 0;
    ENGINE.removeObject(object);
    ENGINE.changeHUD("bananaHUD");
    state.ready = false;


}