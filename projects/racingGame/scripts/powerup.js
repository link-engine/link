export function onStart({ object, eventMap, input, textRenderer, scene }) {

}

export function onUpdate({ object, input, aliasTable, clock, ENGINE}) {

    object.position.y = Math.sin(clock.getElapsedTime() * 10) + 5;
    object.rotation.y += 0.06;


}


export function onCollide({object, eventQueue, ENGINE}) {

    eventQueue.push("changeState-picking");
    eventQueue.push("onPause")
    ENGINE.removeObject(object);
    

}