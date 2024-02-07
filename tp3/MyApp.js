
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'
import { SceneManager } from './projects/racingGame/SceneManager.js';

/**
 * This class contains the application object
 */
class MyApp {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        this.clock     = new THREE.Clock();
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 100

        this.pointer   = new THREE.Vector2()

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents = new MyContents(this)
        this.sceneManager = new SceneManager(this);

    }

    resetScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);
    }

    /**
     * initializes the application
     */
    init() {

        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);
        
        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.initKeyboardControls();

        window.addEventListener(
            "click",
            this.onPointerClick.bind(this),
            false
        );

        // Configure renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild(this.renderer.domElement);

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false);    

    }

    changeScene(sceneName, context) {

        this.sceneManager.loadScene(sceneName, this.contents, context)

    }


    addCamera(camera, cameraName) {
        this.cameras[cameraName] = camera
        this.scene.add(camera)
    }
    setCameras(cameras, activeCameraId) {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera(75, aspect, 0.1, 1500)
        //perspective1.position.set(10, 10, 3)


        for (var key in cameras) {
            let camera = cameras[key]
            let newCamera = null;

            if (camera.type == "perspective")
                newCamera = new THREE.PerspectiveCamera(camera.angle, aspect, camera.near, camera.far)
            else if (camera.type == "orthogonal")
                newCamera = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far)
            this.cameras[key] = newCamera
            newCamera.position.set(camera.location[0], camera.location[1], camera.location[2])
            newCamera.lookAt(new THREE.Vector3(camera.target[0], camera.target[1], camera.target[2]))
            this.scene.add(newCamera)
        }

        this.setActiveCamera(activeCameraId)
        perspective1.position.set(-200, 0, 15);
        this.cameras['Perspective'] = perspective1
        this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);

    }


    initKeyboardControls() {
        this.keys = {};
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        window.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }


    onPointerClick(event) {
        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.activeCamera);

        for (var key in this.scene.children) {

            var child = this.scene.children[key];
            if (child instanceof THREE.Group) {

                var intersects = this.raycaster.intersectObjects(this.scene.children);
                this.contents.generateClicks(intersects);
                break;
            }
        }
    }
    onKeyDown(event) {
        this.keys[event.key] = true;
    }


    onKeyUp(event) {
        this.keys[event.key] = false;
    }

    updateCameraFromKeyboard() {
        // TODO get this to work with camera controls
        const deltaTime = this.clock.getDelta();
        const moveSpeed = 10;
        const lookSpeed = 5;
        const moveFactor = deltaTime * moveSpeed;
        const lookFactor = deltaTime * lookSpeed;


        if (this.keys["ArrowLeft"]) {
            this.activeCamera.rotation.y += lookFactor;

        }
        if (this.keys["ArrowRight"]) {
            this.activeCamera.rotation.y -= lookFactor;
        }
        if (this.keys["ArrowDown"]) {
            this.activeCamera.rotation.x -= lookFactor;

        }
        if (this.keys["ArrowUp"]) {
            this.activeCamera.rotation.x += lookFactor;

        }
        const lookingAt = new THREE.Vector3(0, 0, -1).applyQuaternion(this.activeCamera.quaternion);
        const forward = lookingAt.clone().multiplyScalar(moveFactor);
        const side = lookingAt.clone().cross(this.activeCamera.up).multiplyScalar(moveFactor);
        const position = new THREE.Vector3(...this.activeCamera.position);

        if (this.keys['w']) {
            position.add(forward);
        }
        if (this.keys['s']) {
            position.add(forward.negate());
        }
        if (this.keys['a']) {
            const toAdd = side.negate();
            position.add(toAdd);
        }
        if (this.keys['d']) {
            const toAdd = side;
            position.add(toAdd);
        }
        this.activeCamera.position.set(...position);
    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
        this.raycaster.far = this.activeCamera.far
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {


        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName

            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()


             if (this.controls === null) {
                 // Orbit controls allow the camera to orbit around a target.
                 this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
                 this.controls.enableZoom = true;
                 this.controls.update();
             }
             else {
                 this.controls.object = this.activeCamera
             }
        }
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }


    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {
        this.gui = gui
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render() {
        this.stats.begin()
        this.updateCameraIfRequired()
        //this.updateCameraFromKeyboard();

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update()
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene

        this.renderer.render(this.scene, this.activeCamera);
  

        // subsequent async calls to the render loop
        requestAnimationFrame(this.render.bind(this));

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}


export { MyApp };