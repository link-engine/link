
export function onStart({ object, eventMap, input, textRenderer, scene }) {

}

export function onUpdate({ object, input, aliasTable }) {


}


export function onCollide({ object, otherObject, eventQueue, sceneObjects, ENGINE }) {

    let id = ENGINE.getNode(object.id)
    let objectId = ENGINE.getNode(otherObject.id)
    if (objectId == "car")
        eventQueue.push("collide-" + id)
}