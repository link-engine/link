export function onStart({ object, eventMap, input, ENGINE }) {

}



export function onUpdate({ object, eventQueue, ENGINE, clock }) {

   let material = ENGINE.getMaterial("pulse");
   material.uniforms.time.value = clock.getElapsedTime() * 2;
   material.needsUpdate = true;
   

}