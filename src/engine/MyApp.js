
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'
import { SceneManager } from './projects/racingGame/sceneManager.js';
import { MyFileReader } from '../../parser/MyFileReader.js';

import * as raceScene from './scenes/race.js';
import * as menuScene from './scenes/menu.js';
import * as testScene from './scenes/test.js';
import * as resultsScene from './scenes/results.js';



/**
 * This class contains the application object
 */
class MyApp {
    /**
     * the constructor
     */
    constructor() {
        this.stats = null

        this.scenes       = new Map();
        this.currentScene = 'race';
        this.app          = app;
        this.scenes.set("race", raceScene);
        this.scenes.set("menu", menuScene);
        this.scenes.set("test", testScene);
        this.scenes.set("results", resultsScene);
        
        this.project = null
        this.clock     = new THREE.Clock();
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 100
        this.collisionQueue = null;

        this.usePhysics = false;
        this.paused = false;
        this.loading = false;
        this.narrowDistance = null;
        this.shadowsOn = true;
        this.physics = null
        this.rapier = null

        this.pointer   = new THREE.Vector2()
        this.eventMap = new Map();
        this.eventQueue = [];
        this.clickIntersects = []

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
        this.contents = new MyContents()

    }


    /**
     * initializes the application
     */
    init() {

        // Create an empty scene

        
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

    loadScenesFromProject(project) {

        // complete here 
    }

    async changeScene(sceneName, context) {


        const yafxScenes = "./projects/";
        const project    = "racingGame";
        const yafxOutput = yafxScenes + `${project}/scenes/${sceneName}.xml`;
        
        const scene = this.scenes.get(sceneName)

        await fetch(yafxOutput, {
            method: "PUT",
            body: scene.create(context),
        });

        
        this.app.resetScene();
        let reader = new MyFileReader();
        let xmlData;
        
        await fetch(yafxOutput).then((response) => {
            return response.text();
        }).then((data) => {
            xmlData = data;
        });
        
        
        let parser = new window.DOMParser();
        reader.xmlDoc = parser.parseFromString(xmlData, "text/xml");
        this.contents.reset();
        await reader.readXML();
        await this.contents.onSceneLoaded(reader.data)
        this.contents.loadModels();

        this.startScene()
        this.init()

        return contents;

    }


    addCamera(camera, cameraName) {

        this.cameras[cameraName] = camera
        this.contents.scene.add(camera)
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
            this.contents.scene.add(newCamera)
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

        for (var key in this.contents.scene.children) {

            var child = this.contents.scene.children[key];
            if (child instanceof THREE.Group) {

                var intersects = this.raycaster.intersectObjects(this.contents.scene.children);
                this.generateClicks(intersects);
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
     *  imported content from the MyContents class starts here
     */

    setPhysicsOn() {
        this.usePhysics = true;
        this.collisionQueue = new this.rapier.EventQueue(true);
        this.collisionQueue.drainCollisionEvents((handle1, handle2, started) => {
            this.eventQueue.push("aa");
        });
    }

    generateClicks(content) {
        let visited = new Set();

        for (const intersect of content) {
            let targetNode = intersect.object;
            while (targetNode.parent) {
                if (this.contents.nodes.has(targetNode.id) && visited.has(targetNode.id) == false) {
                    console.log("onClick-" + this.content.nodes.get(targetNode.id));
                    this.eventQueue.push("onClick-" + this.content.nodes.get(targetNode.id));
                    visited.add(targetNode.id);

                }
                targetNode = targetNode.parent;
            }
        }

        this.clickIntersects = content;

    }

    removeAllChildren(object) {
        for (const child of object.children) {
            this.removeAllChildren(child);
        }

        for (let [key, value] of this.objects.entries()) {
            if (value === object) {
                this.objects.delete(key);
                this.controllers.delete(value);
                break;
            }
        }

    }


    removeObject(object) {
        if (object.parent)
            object.parent.remove(object);
        else this.contents.scene.remove(object);
        this.removeAllChildren(object);
    }



    getObject(id) {
        return this.objects.get(id);
    }

    pushEvent(event) {
        this.eventQueue.push(event);
    }

    registerListener(event, listener) {

        if (!this.eventMap.has(event)) {
            this.eventMap.set(event, []);
        }
        this.eventMap.get(event).push(listener);
    }

    removeListener(event, listener) {
        if (this.eventMap.has(event)) {
            const listeners = this.eventMap.get(event);
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    
    changeHUD(hud) {

        const camera = this.activeCameraName;
        this.cameraHuds.set(camera, this.huds.get(hud));

    }

    changeCamera(camera) {
        this.setActiveCamera(camera);
    }

    changeScene(scene) {


        let root = this.objects.get(this.rootId);
        let rootController = this.controllers.get(root);
        this.changeScene(scene, rootController.exports);
        this.loading = true;

    }
    
    getParams() {

        if (this.params === null || this.params === undefined) {
            this.params = {
                object: null,
                otherObject: null,
                mixer: null,
                input: this.keys,
                aliasTable: this.contents.alias,
                eventQueue: this.eventQueue,
                eventMap: this.eventMap,
                camera: this.activeCamera,
                clock: this.clock,
                updateDelta: this.clock.getDelta(),
                renderer: this.renderer,
                scene: this.contents.scene,
                textRenderer: this.contents.fonts.get("default"),
                ENGINE: {
                    pushEvent:    this.pushEvent.bind(this),
                    registerListener: this.registerListener.bind(this),
                    removeListener:   this.removeListener.bind(this),
                    removeObject:     this.removeObject.bind(this),
                    addCamera:        this.addCamera.bind(this),
                    changeScene:      this.changeScene.bind(this),
                    changeHUD:        this.changeHUD.bind(this),
                    changeCamera:     this.changeCamera.bind(this),
                    getObject:        this.getObject.bind(this),

                    newText: (renderer, text) => {return new MyTextSquare(renderer, text)},
                    getEnv: (id) =>              { return this.envs.get(id) },
                    getClickIntersects: () =>    { return this.clickIntersects },
                    getMaterial: (id) =>         { return this.materials.get(id) },
                    getNode: (id) =>             { return this.nodes.get(id) },
                    setObject: (id, object) =>   { this.objects.set(id, object) },
                }
            };
        }

        return this.params;
    }

    startObjects() {

        if (!this.contents.modelsLoaded)
            return;

        let params = this.getParams();

        for (const [object, controller] of this.contents.controllers.entries()) {

            params.object = object;
            params.mixer = this.mixers.get(object.id);
            controller.onStart(params);
        }

        this.modelsStarted = true;

    }
    startScene() {

        this.createScene();
        this.startObjects();
        this.setCameras(this.contents.cameras, this.contents.activeCameraId)

    }


    triggerEvents() {

        for (const event of this.eventQueue) {
            let eventName = "";

            if (typeof event == "string") {

                eventName = event;
            }
            else {
                eventName = event.name;
            }
            const listeners = this.eventMap.get(eventName);

            if (listeners) {
                for (const listener of listeners) {
                    listener(event);
                }
            }
        }

        this.eventQueue = [];
        this.clickIntersects = [];

    }

    updateCamera() {

        const controls = this.controls;
        const camera = this.activeCamera;
        const cameraId = this.activeCameraName;
        const controller = this.contents.cameraControllers.get(cameraId);
        const hud = this.contents.cameraHuds.get(cameraId);


        if (controller)
            controller.onUpdate({ camera: camera, controls: controls, hud: hud});

    }

    updateObjects() {

        let params = this.getParams()

        for (const [object, controller] of this.controllers.entries()) {

            params.object = object;
            params.mixer = this.mixers.get(object.id);
            params.textRenderer = this.fonts.get("default");
            controller.onUpdate(params);
        }
    }

    updateParticles() {

        const aliveParticles = [];
        for (const particle of this.particles) {
            if (!particle.isDone()) {
                particle.update(this.app.clock);
                aliveParticles.push(particle);
            }
            else {
                const mesh = particle.mesh;
                mesh.parent.remove(mesh);
            }
        }
        this.particles = aliveParticles;
    }

    runUpdatables() {

        for (const updatable of this.updatables) {
            updatable.run();
        }

    }

    handleCollisions() {
        if (this.usePhysics)
            this.physics.step(this.collisionQueue);
        else this.checkCollisions();
    }

    update() {
        this.params = null;
        if (!this.modelsStarted) {
            this.startObjects();
            return;
        }

        if (this.paused || this.loading) return;

        this.runUpdatables();
        this.handleCollisions();
        this.triggerEvents();
        this.updateParticles();
        this.updateCamera();
        this.updateObjects();

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

        this.renderer.render(this.contents.scene, this.activeCamera);
  

        // subsequent async calls to the render loop
        requestAnimationFrame(this.render.bind(this));

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}


export { MyApp };