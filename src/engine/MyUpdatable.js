/*
const person = new MyUpdatable({ name: "Lara", age: 20, eyes: { color: "green", contacts: true } });
person.addListener("age", () => {
    const delta = person.o.age - person.lo.age;
    const abs = Math.abs(delta);
    if (delta > 0)
        console.log(`${person.o.name} got ${abs} years older`);
    else
        console.log(`${person.o.name} got ${abs} years younger`);
});
person.addListener("eyes.color", () => console.log(`${person.o.name} has ${person.o.eyes.color} eyes`));
person.o.age += 2;
person.o.eyes.color = "blue";
person.run();
>> Lara got 2 years older
>> Lara has blue eyes
*/
import * as THREE from "three";
class MyUpdatable {
    constructor(object) {
        // The object we are tracking
        this.o = object;
        // The last version of the object
        this.update();
        // A mapping from a property of the object to a list of call back functions
        this.map = {};
        // A general list of call back functions that will be triggered if a change is detected
        this.generalListeners = [];
    }
    // Returns a list of properties whose value changed ["property1","property2"]
    // If the object has nested objects a dot seperated string will be returned ["nested.property","property1"]
    changed() {
        return this.changedRec(this.o, this.lo);
    }

    // Update the Last Object, if this is called after a change, no change will be detected in run() therefore we can skip changes we don't care to react to at specific times
    update() {
        // this was changed from structured clone 
        this.lo = {};
        for (const key in this.o) {
            if (this.o[key] instanceof THREE.Object3D) {
                this.lo[key] = this.o[key];
            }
            else {
                this.lo[key] = structuredClone(this.o[key]);
            }


        }
    }
    // Recursive function to count for nested objects whose properties might change
    changedRec(object, lastObject) {
        const changed = [];
        for (const key in object) {
            if (object[key] instanceof THREE.Object3D) {
                if (object[key].uuid != lastObject[key]?.uuid) {
                    changed.push(key);
                }
            }
            else if (typeof (object[key]) == "object") {
                const deepChanged = this.changedRec(object[key], lastObject[key]);
                for (const deepKey of deepChanged) {
                    changed.push(key + "." + deepKey);
                }
                if (deepChanged.length > 0) {
                    // For detecting changes in the whole object
                    changed.push(key);
                }
            }
            else if (object[key] !== lastObject[key]) {
                changed.push(key);
            }
        }
        return changed;
    }

    addGeneralListener(callBack) {
        this.generalListeners.push(callBack);
    }
    // property can be a string or a list of strings in the form of "property" or "nested.property"
    addListener(property, callBack) {
        const safePush = (map, key, toPush) => {
            if (map[key] == undefined) {
                map[key] = [];
            }
            map[key].push(toPush);
        }
        if (Array.isArray(property)) {
            for (const p of property) {
                safePush(this.map, p, callBack);
            }
        }
        else {
            safePush(this.map, property, callBack);
        }
    }
    // Sees what properties have changed (events), triggers the associated callBacks (listeners), updates the last object to account for changes
    run() {
        const events = this.changed();
        if (events.length == 0) {
            return;
        }
        for (const event of events) {
            const callBacks = this.map[event];
            if (callBacks && callBacks.length > 0) {
                for (const callBack of callBacks) {
                    callBack();
                }

            }
        }
        for (const callBack of this.generalListeners) {
            callBack();
        }
        this.update();
    }
}

export { MyUpdatable };