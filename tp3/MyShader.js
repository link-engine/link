import * as THREE from 'three';

/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class MyShader {

	constructor({vertexShader, fragmentShader, uniforms}) {
        
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: uniforms,
        })

        this.uniformValues = uniforms
		
    }

    updateUniformsValue(key, value) {
        if (this.uniformValues[key]=== null || this.uniformValues[key] === undefined) {
            console.error("shader does not have uniform " + key)
            return;
        }
        this.uniformValues[key].value = value
        if (this.material !== null) {
            this.material.uniforms[key].value = value
        }
    }

    hasUniform(key) {
        return this.uniformValues[key] !== undefined
    }
}
export {MyShader}