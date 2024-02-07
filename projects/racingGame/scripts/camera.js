

import * as THREE from 'three';


let state = {
    activeHud: null,
}

export function onUpdate({ camera, controls, hud = null, object = null, renderer }) {


    if (hud != state.activeHud) {
        camera.remove(state.activeHud)
        state.activeHud = hud;
        camera.add(hud);

    }

    if (object != null) {

        controls.target.set(object.position.x, object.position.y, object.position.z);
        let offset = new THREE.Vector3(0, 10, -25);
        if (object.quaternion instanceof THREE.Quaternion) {

            offset.applyQuaternion(object.quaternion);
            offset.add(object.position);
            camera.position.lerp(offset, 0.5);

        }
    }
}