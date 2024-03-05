import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyCascade } from './MyCascade.js';
import { MyTriangle } from './MyTriangle.js';
import { MyPolygon } from './MyPolygon.js';
import { MyUpdatable } from './MyUpdatable.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyTextSquare } from './MyText.js';
import { MyParticle } from './MyParticle.js';
import { MyTextRenderer } from './MyTextRenderer.js';


/**
 *  This class contains the contents of out application
 */
class MyContents {

    constructor() {

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);

        this.modelsLoaded = false;
        this.modelsStarted = false;
        this.axis = null
        this.envs = new Map()
        this.numObjectsLoaded = 0;
        this.alias = new Map();
        this.layers = new Map();
        this.objects = new Map();
        this.nodes = new Map();
        this.textures = new Map();
        this.materials = new Map();
        this.cameras = []
        this.huds = new Map();
        this.lights = new Map();
        this.mixers = new Map();
        this.models = new Map();
        this.particles = [];

        this.fonts = new Map();
        this.fonts.set("default", new MyTextRenderer("fonts/default.png", 70, 10, 10, 32));

        this.loader = new GLTFLoader();

        this.objectProperties = new Map();
        this.cameraControllers = new Map();
        this.cameraHuds = new Map();
        this.controllers = new Map();
        this.fillingTypes = ["normal", "wireframe"];
        this.fillingTracker = new MyUpdatable({ filling: "normal" });

        const onFillingChange = () => {
            const wireFrame = this.fillingTracker.o.filling == "wireframe";
            this.scene.traverse((obj) => {
                if (obj.material) {
                    obj.material.wireframe = wireFrame;
                }
            });
        }
        this.fillingTracker.addGeneralListener(onFillingChange);

        this.selectedLightTracker = new MyUpdatable({ selected: null, properties: null });
        const onSelectedLightChange = () => {
            const o = this.selectedLightTracker.o;
            const selected = o.selected;
            if (!selected) {
                return;
            }
            const light = this.lights.get(selected);
            o.properties = {
                visible: light.visible,
                castShadow: light.castShadow,
                far: light.shadow.camera.far,
                isDirectional: light instanceof THREE.DirectionalLight,
                bias: light.shadow.bias
            }
            if (o.properties.isDirectional) {
                o.properties.left = light.shadow.camera.left;
                o.properties.right = light.shadow.camera.right;
                o.properties.top = light.shadow.camera.top;
                o.properties.bottom = light.shadow.camera.bottom;

            }
            else {
                o.properties.mapWidth = light.shadow.mapSize.width;
                o.properties.mapHeight = light.shadow.mapSize.height;
            }
            this.selectedLightTracker.update();

        }

        this.selectedLightTracker.addListener("selected", onSelectedLightChange);

        const onSelectedLightPropertyChange = () => {
            const o = this.selectedLightTracker.o;
            const selected = o.selected;
            if (!selected || !o.properties) {
                return;
            }
            const light = this.lights.get(selected);
            light.visible = o.properties.visible;
            light.castShadow = o.properties.castShadow;
            light.shadow.camera.far = o.properties.far;
            light.shadow.bias = o.properties.bias;
            if (o.properties.isDirectional) {
                console.log("Changed property of directional light");
            }
            else {
                console.log("Changed property of light");
                if (light.shadow.map) {
                    light.shadow.map.dispose();
                    light.shadow.map = null;
                }
                light.shadow.mapSize.width = o.properties.mapWidth;
                light.shadow.mapSize.height = o.properties.mapHeight;
            }

        }
        this.selectedLightTracker.addListener("properties", onSelectedLightPropertyChange);

        this.editor = new MyUpdatable({
            moveToParent: false, moveToChild: false, selectedChild: null,
            node: null,
            visible: false,
            selectedChildBox: null,
            filling: null,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0, y: 0, z: 0 },
            shadows: {
                castShadows: true,
                receiveShadows: true,
            }
        });
        const removeNode = (node) => {
            node.parent.remove(node);
        }
        this.editor.addListener("selectedChild", () => {
            const o = this.editor.o;
            if (o.selectedChildBox) {
                removeNode(o.selectedChildBox)
                o.selectedChildBox = null;
            }
            if (o.selectedChild == null || o.selectedChild == undefined) {
                return;
            }
            const child = o.node.children[o.selectedChild];
            o.selectedChildBox = this.addBoundingBox(child, 0x00FF00);
        })
        const setEditorDefaults = (editor) => {
            editor.moveToChild = false;
            editor.moveToParent = false;
            editor.selectedChild = null;
        }
        const setCurrentSelectedNode = () => {
            const o = this.editor.o;
            console.log("Detected Node Change!");
            if (o.node == null || o.node == undefined) {
                return;
            }
            if (o.nodeBox) {
                removeNode(o.nodeBox);
                o.nodeBox = null;
            }
            if (o.selectedChildBox) {
                removeNode(o.selectedChildBox);
                o.selectedChildBox = null;
            }
            o.nodeBox = this.addBoundingBox(o.node, 0xFF0000);
            setEditorDefaults(o);
        };

        const moveToChild = () => {
            const o = this.editor.o;
            if (!o.moveToChild || o.selectedChild == null) {
                return;
            }
            o.node = o.node.children[o.selectedChild];
            setCurrentSelectedNode();
        }
        const moveToParent = () => {
            const o = this.editor.o;
            if (!o.moveToParent || o.node == null || o.node.parent == null) {
                return;
            }
            o.node = o.node.parent;
            setCurrentSelectedNode();
        }
        const changeNodeFilling = () => {
            const o = this.editor.o;
            if (!o.node) {
                return;
            }
            o.node.traverse((obj) => {
                if (obj.material) {
                    obj.material = obj.material.clone();
                    obj.material.wireframe = o.filling == "wireframe";
                    obj.needsUpdate = true;
                }
            })

        }
        const setNodePosition = () => {
            const o = this.editor.o;
            if (!o.node) {
                return;
            }
            o.node.position.set(o.position.x, o.position.y, o.position.z);
        }
        const setNodeRotation = () => {
            const o = this.editor.o;
            if (!o.node) {
                return;
            }
            o.node.rotation.set(o.rotation.x, o.rotation.y, o.rotation.z);
        }

        const setNodeScale = () => {
            const o = this.editor.o;
            if (!o.node) {
                return;
            }
            o.node.scale.set(o.scale.x, o.scale.y, o.scale.z);
        }
        const setCastShadows = () => {
            const o = this.editor.o;
            o.node.traverse((obj) => {
                if (obj) {
                    obj.castShadow = o.shadows.castShadows;
                }
            });
        }
        const setReceiveShadows = () => {
            const o = this.editor.o;
            if (!o.node) {
                return;
            }
            o.node.traverse((obj) => {
                if (obj) {
                    obj.receiveShadow = o.shadows.receiveShadows;
                }
            });
        }
        const setVisible = () => {
            const o = this.editor.o;
            if (!o.node) {
                return;
            }
            o.node.visible = o.visible;
        }
        this.editor.addListener("node", setCurrentSelectedNode);
        this.editor.addListener("visible", setVisible);
        this.editor.addListener("moveToChild", moveToChild);
        this.editor.addListener("moveToParent", moveToParent);
        this.editor.addListener("filling", changeNodeFilling);
        this.editor.addListener("position", setNodePosition);
        this.editor.addListener("rotation", setNodeRotation);
        this.editor.addListener("scale", setNodeScale);
        this.editor.addListener("shadows.castShadows", setCastShadows);
        this.editor.addListener("shadows.receiveShadows", setReceiveShadows);

        this.updatables = [this.fillingTracker, this.editor, this.selectedLightTracker];
    }


    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.scene.add(this.axis)
        }
    }

    reset() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);
        this.axis = null;
        this.numObjectsLoaded = 0;
        this.modelsLoaded = false;
        this.modelsStarted = false;
        this.paused = false
        this.loading = false
        this.eventMap.clear();
        this.alias.clear();
        this.layers.clear();
        this.objects.clear();
        this.textures.clear();
        this.materials.clear();
        this.cameras = []
        this.lights.clear();
        this.mixers.clear();
        this.models.clear();
        this.controllers.clear();
        this.eventQueue = [];
        this.objectProperties.clear();
        this.updatables = [this.fillingTracker, this.editor, this.selectedLightTracker];
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    async onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.reset()
        await this.createSceneData(data);
    }

    propagateMaterial(object, material) {
        for (const child of object.children) {

            if (child instanceof THREE.Mesh) {

                child.material = material;
                if (child.geometry instanceof THREE.BufferGeometry) {
                    continue;
                }
                child.geometry.mergeVertices();

                //assignUVs(child.geometry);

                child.material = material;
                child.verticesNeedUpdate = true;
                child.normalsNeedUpdate = true;
                child.uvsNeedUpdate = true;

                child.material.shading = THREE.SmoothShading;
                child.geometry.computeVertexNormals();

            }
            this.propagateMaterial(child, material);
        }
    }

    markObjetLoaded() {

        this.numObjectsLoaded++;
        if (this.numObjectsLoaded == this.models.size) {
            this.modelsLoaded = true;
        }
    }


    loadModels() {
        for (const model of this.models.entries()) {
            const [object, path] = model;
            const onLoad = function (gltf) {

                object.add(gltf.scene);
                if (object.material) {
                    object.material.needsUpdate = true;
                    this.propagateMaterial(object, object.material);
                }


                this.markObjetLoaded();
            }
            this.loader.load(path, onLoad.bind(this), undefined, function (error) {

                return null

            });

        }

        if (this.models.size == 0) {
            this.modelsLoaded = true;
        }
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
        else this.scene.remove(object);
        this.removeAllChildren(object);
    }

    addCamera(camera, cameraName) {

        this.cameras.set(cameraName, camera);
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

    createScene() {

        const rootObject = this.objects.get(this.rootId);
        this.editor.o.node = rootObject;
        this.scene.add(rootObject);

    }

    generateClicks(content) {
        let visited = new Set();

        for (const intersect of content) {
            let targetNode = intersect.object;
            while (targetNode.parent) {
                if (this.nodes.has(targetNode.id) && visited.has(targetNode.id) == false) {
                    console.log("onClick-" + this.nodes.get(targetNode.id));
                    this.eventQueue.push("onClick-" + this.nodes.get(targetNode.id));
                    visited.add(targetNode.id);

                }
                targetNode = targetNode.parent;
            }
        }

        this.clickIntersects = content;

    }

    addBoundingBox(object, color) {
        const boundingBox = new THREE.BoxHelper(object, color);
        this.scene.add(boundingBox);
        return boundingBox;
    }
    convertValue(value, type) {

        if (type == "f") {
            return parseFloat(value);
        }
        if (type == "vec3") {
            const components = value.split(" ").map(parseFloat);

            // Create a THREE.Vector3 using the components
            const vector3 = new THREE.Vector3(components[0], components[1], components[2]);
            return vector3;
        }

        if (type == "sampler2d") {
            return new THREE.TextureLoader().load(value)

        }
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    async createShader(shader) {

        const key = shader.id
        let vertexShader, fragmentShader;

        await fetch(shader.vertref).then((response) => {
            return response.text();
        }).then((data) => {
            vertexShader = data;
        });

        await fetch(shader.fragref).then((response) => {
            return response.text();
        }).then((data) => {
            fragmentShader = data;
        });

        let uniformsObject = {}
        for (const uniform of shader.uniforms) {
            uniformsObject[uniform.name] = { value: this.convertValue(uniform.value, uniform.type), type: uniform.type }
        }

        const mat = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniformsObject });
        this.materials.set(key, mat)
    }

    createMaterial(material) {
        const key = material.id
        const mat = new THREE.MeshPhongMaterial({
            color: material.color,
            emissive: material.emissive,
            specular: material.specular,
            opacity: material.color.a,
            shininess: material.shininess,
            map: material.textureref ? this.textures.get(material.textureref) : null,
            side: material.twosided ? THREE.DoubleSide : THREE.FrontSide,
            bumpMap: this.textures.get(material.bumpref) ? this.textures.get(material.bumpref) : null,
            bumpScale: material.bumpscale ? material.bumpscale : null,
            specularMap: this.textures.get(material.specularref) ? this.textures.get(material.specularref) : null,
        })


        mat.wireframe = material.wireframe;
        if (mat.opacity < 1) {
            mat.transparent = true;
        }

        mat.shadowSide = THREE.FrontSide;

        if (material.textureref != null) {

            mat.map.repeat.set(material.texlength_s, material.texlength_t); // Number of repetitions in the horizontal and vertical directions
            mat.map.wrapS = THREE.RepeatWrapping;
            mat.map.wrapT = THREE.RepeatWrapping;
        }

        this.materials.set(key, mat)


    }
    loadMipmap(parentTexture, level, path) {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path,
            function (mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);

                // const fontSize = 48
                const img = mipmapTexture.image
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0)

                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function (err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }

    createTexture(texture) {
        const key = texture.id
        let tex = null
        if (texture.filepath.endsWith(".mp4") || texture.filepath.endsWith(".webm")) {
            const video = document.createElement('video');
            video.id = key;
            video.setAttribute('playsInline', true); // Set playsInline using setAttribute
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.preload = 'auto';
            video.src = texture.filepath;
            //document.body.appendChild(video);
            tex = new THREE.VideoTexture(video);
            // No need to manually set tex.needsUpdate in this context
        }
        else {

            tex = new THREE.TextureLoader().load(texture.filepath)

        }
        if (!texture.mipmaps && texture.mipmap0) {
            tex.generateMipmaps = false;
            for (let i = 0; i < 8; i++) {
                const key = "mipmap" + i;
                if (!texture[key]) {
                    break;
                }
                else {
                    this.loadMipmap(tex, i, texture[key]);
                }
            }
            tex.needsUpdate = true;

        } else {
            tex.generateMipmaps = true;
        }


        if (tex instanceof THREE.VideoTexture) {
            // You may want to play the video immediately or in response to user interaction
            // For example, to play the video immediately:
            tex.image.play();
        }

        this.textures.set(key, tex)

    }

    async createSceneData(data) {
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options)

        if (data.fog !== null) {
            //this.app.scene.fog = new THREE.Fog(new THREE.Color(data.fog.color), data.fog.near, data.fog.far);
        }

        for (var key in data.skyboxes) {
            let skybox = data.skyboxes[key]
            const geometry = new THREE.BoxGeometry(skybox.size[0], skybox.size[1], skybox.size[2]);


            // The next lines will put various texture on that box based on the properties of the skybox up back front down left right

            const materialArray = [];

            materialArray.push(new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(skybox.back), emissive: skybox.emissive, emissiveMap: new THREE.TextureLoader().load(skybox.back), emissiveIntensity: skybox.intensity }));
            materialArray.push(new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(skybox.front), emissive: skybox.emissive, emissiveMap: new THREE.TextureLoader().load(skybox.front), emissiveIntensity: skybox.intensity }));
            materialArray.push(new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(skybox.up), emissive: skybox.emissive, emissiveMap: new THREE.TextureLoader().load(skybox.up), emissiveIntensity: skybox.intensity }));
            materialArray.push(new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(skybox.down), emissive: skybox.emissive, emissiveMap: new THREE.TextureLoader().load(skybox.down), emissiveIntensity: skybox.intensity }));
            materialArray.push(new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(skybox.left), emissive: skybox.emissive, emissiveMap: new THREE.TextureLoader().load(skybox.left), emissiveIntensity: skybox.intensity }));
            materialArray.push(new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(skybox.right), emissive: skybox.emissive, emissiveMap: new THREE.TextureLoader().load(skybox.right), emissiveIntensity: skybox.intensity }));

            //console.log(materialArray)

            for (let i = 0; i < 6; i++) {
                materialArray[i].side = THREE.BackSide;
            }
            const skyboxMesh = new THREE.Mesh(geometry, materialArray);
            this.scene.add(skyboxMesh);
        }

        console.log("textures:")
        for (const [key, alias] of data.alias.entries()) {
            this.alias.set(key, alias)
            //this.output(alias, 1)
        }

        this.narrowDistance = data.narrowDistance;

        for (var key in data.textures) {
            let texture = data.textures[key]
            this.createTexture(texture)
            //this.output(texture, 1)
        }

        console.log("materials:")
        for (var key in data.materials) {

            let material = data.materials[key]
            this.createMaterial(material)
        }

        console.log("shaders:")
        
        for (var key in data.shaders) {

            let shader = data.shaders[key]
            await this.createShader(shader)
        }

        
        for (const [key, object] of data.envs.entries()) {
            this.envs.set(key, object.value)
        }


        this.rootId = data.rootId;
        const defaultCascade = new MyCascade();
        this.visitChildren(data.nodes, defaultCascade);

        for (const [hud, hudElement] of data.huds.entries()) {
            let hudObject = new THREE.Group();
            for (const node of hudElement.children) {

                const object = this.objects.get(node.id);
                hudObject.add(object);
            }


            this.huds.set(hud, hudObject);
        }

        console.log("cameras:")

        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.addCamera(camera, key)

            if (camera.controller) {
                this.cameraControllers.set(camera.id, camera.controller)
            }

            if (camera.activeHud) {

                this.cameraHuds.set(camera.id, this.huds.get(camera.activeHud))
            }
        }


    }

    generateBox(primitive) {
        const [p1, p2] = [primitive.representations[0].xyz1, primitive.representations[0].xyz2];
        const dimensions = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            dimensions[i] = Math.abs(p1[i] - p2[i]);
        }
        const [w, h, d] = dimensions;

        const meshTransform = (mesh) => {
            mesh.translateX(p1[0] + w / 2);
            mesh.translateY(p1[1] + h / 2);
            mesh.translateZ(p1[2] + d / 2);
        }
        return [new THREE.BoxGeometry(w, h, d), meshTransform];
    }

    generateTriangle(primitive) {
        const a = primitive.representations[0].xyz1;
        const b = primitive.representations[0].xyz2;
        const c = primitive.representations[0].xyz3;
        const args = [...a, ...b, ...c];
        const geometry = new MyTriangle(...args);
        return geometry;

    }



    generateRectangle(primitive) {
        const [p1, p2] = [primitive.representations[0].xy1, primitive.representations[0].xy2];
        const dimensions = [0, 0];
        for (let i = 0; i < 2; i++) {
            dimensions[i] = Math.abs(p1[i] - p2[i]);

        }
        const [w, h] = dimensions;
        const meshTransform = (mesh) => {
            mesh.translateX(p1[0] + w / 2);
            mesh.translateY(p1[1] + h / 2);
        }
        return [new THREE.PlaneGeometry(w, h), meshTransform];
    }


    generateCylinder(primitive) {
        const p = primitive.representations[0];
        return new THREE.CylinderGeometry(
            p.top,
            p.base,
            p.height,
            p.slices,
            p.stacks,
            !p.capsclose,
            p.thetastart,
            p.thetalength
        );
    }

    generateSphere(primitive) {
        const p = primitive.representations[0];
        return new THREE.SphereGeometry(
            p.radius,
            p.slices,
            p.stacks,
            p.phistart,
            p.philength,
            p.thetastart,
            p.thetalength
        );
    }

    buildNurbs(controlPoints, degree1, degree2, samples1, samples2) {

        const knots1 = []
        const knots2 = []

        for (var i = 0; i <= degree1; i++) {
            knots1.push(0)
        }
        for (var i = 0; i <= degree1; i++) {
            knots1.push(1)
        }
        for (var i = 0; i <= degree2; i++) {
            knots2.push(0)
        }
        for (var i = 0; i <= degree2; i++) {
            knots2.push(1)
        }
        let stackedPoints = []
        for (var i = 0; i < controlPoints.length; i++) {
            let row = controlPoints[i]
            let newRow = []
            for (var j = 0; j < row.length; j++) {
                let item = row[j]
                newRow.push(new THREE.Vector4(item.xx,
                    item.yy, item.zz, 1));
            }
            stackedPoints.push(newRow);
        }

        const nurbsSurface = new NURBSSurface(degree1, degree2,
            knots1, knots2, stackedPoints);
        const geometry = new ParametricGeometry(getSurfacePoint,
            samples1, samples2);
        return geometry;

        function getSurfacePoint(u, v, target) {
            return nurbsSurface.getPoint(u, v, target);
        }
    }


    generateNurbs(primitive) {
        const n = primitive.representations[0];
        const controlPoints = [];
        const distance = n.distance;

        let controlSize = n.degree_v + 1;

        for (let i = 0; i < n.controlpoints.length; i += controlSize) {
            controlPoints.push(n.controlpoints.slice(i, i + controlSize));
        }
        const degreeU = n.degree_u;
        const partsU = n.parts_u;
        const degreeV = n.degree_v;
        const partsV = n.parts_v;

        const mesh = this.buildNurbs(controlPoints, degreeU, degreeV, partsU, partsV);
        return mesh;
    }

    generatePolygon(primitive) {

        const r = primitive.representations[0];

        const sides = r.slices;
        const radius = r.radius;
        const stacks = r.stacks;
        return new MyPolygon(sides, stacks, radius, r.color_c, r.color_p);
    }

    generateText(primitive) {
        const r = primitive.representations[0];
        const font = r.font || "default";
        const textRenderer = this.fonts.get(font);

        const textSquare = new MyTextSquare(textRenderer, r.content);
        textSquare.fontSize = parseInt(r.fontSize);
        textSquare.width = parseInt(r.width);
        textSquare.fit = r.fit;

        textSquare.bg = r.bg;
        textSquare.color = r.color;
        return textSquare.render();
    }
    generateParticle(primitive) {
        const r = primitive.representations[0];
        const p = new MyParticle(
            {
                start: r.start,
                finish: r.finish,
                velocity: r.velocity,
                loop: r.loop,
                color: r.color,
            }
        );
        return p;

    }

    generatePrimitiveMesh(material, geometry) {
        return new THREE.Mesh(geometry, material);
    }
    visitPrimitiveNode(primitive, cascade) {

        const map = {

            "triangle": this.generateTriangle.bind(this),
            "rectangle": this.generateRectangle.bind(this),
            "cylinder": this.generateCylinder.bind(this),
            "sphere": this.generateSphere.bind(this),
            "nurbs": this.generateNurbs.bind(this),
            "box": this.generateBox.bind(this),
            "polygon": this.generatePolygon.bind(this),
            "text": this.generateText.bind(this),
            "particle": this.generateParticle.bind(this),
        }
        let object;
        const activeMaterial = cascade.getActiveMaterial();
        if (!this.materials.get(activeMaterial)) {
            console.log(`Drawing primitive ${primitive.subtype} without material expected material:${activeMaterial} `);
        }
        let material = this.materials.get(activeMaterial);

        // Na definição de yaf ao definir certos objetos não dão uma definição abstrata mas sim uma definição concreta 
        // ou seja não criam uma caixa com w,h,d dimensões mas sim uma caixa "contida entre dois pontos" ou seja
        // será uma criação de uma caixa e depois uma transformção para aquele ponto

        if (primitive.subtype === "polygon") {
            if (material == null) {
                material = new THREE.MeshPhongMaterial();
            }
            material.vertexColors = true;
        }
        if (primitive.subtype === "text") {
            object = map[primitive.subtype](primitive);
        }
        else if (primitive.subtype === "particle") {
            const particles = map[primitive.subtype](primitive);
            this.particles.push(particles);
            object = particles.mesh;
        }
        else if (primitive.subtype !== "model3d") {

            const mightNeedTransform = map[primitive.subtype](primitive);

            let [geometry, meshTransform] = [null, null];
            if (Array.isArray(mightNeedTransform)) {
                [geometry, meshTransform] = mightNeedTransform;
            }
            else {
                geometry = mightNeedTransform;
            }

            object = this.generatePrimitiveMesh(material, geometry);
            object.userData.definedMaterial = (cascade.distance == 1 && activeMaterial !== null);

            if (meshTransform) {
                meshTransform(object);
            }

            if (this.shadowsOn) {
                object.castShadow = cascade.getCastsShadow();
                object.receiveShadow = cascade.getReceivesShadow();
            }
        }

        else {

            object = new THREE.Object3D();
            const p = primitive.representations[0];
            const path = p.filepath;
            this.models.set(object, path);
            object.material = material;
        }

        return object;
    }

    generateDirectionalLight(primitive) {
        const p = this.commonLightProperties(primitive);
        let light = new THREE.DirectionalLight(p.color, p.intesity);
        light.shadow.bias = -0.0001;
        return light
    }
    generatePointLight(primitive) {
        const p = this.commonLightProperties(primitive);

        let light = new THREE.PointLight(p.color, p.intensity, p.distance, p.decay);
        light.shadow.bias = -0.0001;
        return light

    }
    generateSpotLight(primitive) {
        const p = this.commonLightProperties(primitive);
        const angle = primitive.angle;
        const penumbra = primitive.penumbra;

        let light = new THREE.SpotLight(p.color, p.intensity, p.distance, angle, penumbra, p.decay);
        light.shadow.bias = -0.0001;

        return light
    }
    isLightType(type) {
        const map = {
            "directionallight": true,
            "pointlight": true,
            "spotlight": true,
        }
        return !!map[type];

    }

    commonLightProperties(primitive) {
        const keys = ["color", "decay", "distance", "enabled", "intensity", "position", "shadowfar", "shadowmap", "castshadow"];
        const properties = {};
        for (const key of keys) {
            properties[key] = primitive[key];
        }
        return properties;
    }
    setLightPosition(primitive, light) {
        light.position.set(...primitive.position);
    }
    setLightShadows(primitive, light) {
        if (!primitive.castshadow) {
            return;
        }
        light.castShadow = true;
        light.shadow.camera.far = 500;
        if (primitive.shadowmapsize) {
            light.shadow.mapSize.width = primitive.shadowmapsize;
            light.shadow.mapSize.height = primitive.shadowmapsize;
        }
        if (primitive.type == "directionallight") {
            light.shadow.camera.left = primitive.shadowleft;
            light.shadow.camera.right = primitive.shadowright;
            light.shadow.camera.top = primitive.shadowtop;
            light.shadow.camera.bottom = primitive.shadowbottom;
        }

    }
    visitLightNode(primitive) {
        const map = {
            "directionallight": this.generateDirectionalLight.bind(this),
            "pointlight": this.generatePointLight.bind(this),
            "spotlight": this.generateSpotLight.bind(this),
        }
        const light = map[primitive.type](primitive);
        this.lights.set(primitive.id, light);
        this.setLightPosition(primitive, light);
        this.setLightShadows(primitive, light);
        return light;
    }

    setPhysicsOn() {
        this.usePhysics = true;
        this.collisionQueue = new this.rapier.EventQueue(true);
        this.collisionQueue.drainCollisionEvents((handle1, handle2, started) => {
            this.eventQueue.push("aa");
        });
    }

    applyTransformations(node, object) {
        const ts = node.transformations;
        if (!(ts && ts.length > 0)) {
            return
        }
        for (const t of ts) {
            if (t.type == "T") {
                object.translateX(t.translate[0]);
                object.translateY(t.translate[1]);
                object.translateZ(t.translate[2]);
            }
            else if (t.type == "R") {
                const [x, y, z] = [t.rotation[0],
                t.rotation[1],
                t.rotation[2]]
                object.rotateX(x);
                object.rotateY(y);
                object.rotateZ(z);

            }
            else if (t.type == "S") {
                // Here it can't be += ??
                object.scale.x = t.scale[0];
                object.scale.y = t.scale[1];
                object.scale.z = t.scale[2];

            }
        }

    }

    updateClonedObjectMaterials(object, cascade) {

        if (object.userData.definedMaterial) {
            return;
        }
        const material = this.materials.get(cascade.getActiveMaterial());
        if (material) {
            object.material = material;
            object.material.needsUpdate = true;
        }
        if (object.children && object.children.length > 0) {
            for (const child of object.children) {
                this.updateClonedObjectMaterials(child, cascade.descend());
            }
        }
    }
    visitChildrenNode(node, parentCascade) {

        let object = new THREE.Group();

        if (this.objects.has(node.id)) {
            const original = this.objects.get(node.id);
            object = original.clone();
            this.updateClonedObjectMaterials(object, parentCascade);
            return object;
        }

        let cascade = parentCascade.generateChild(node);
        cascade.updateShadows(node.receiveShadows, node.castShadows);
        this.applyTransformations(node, object);


        const children = this.visitChildren(node.children, cascade);

        for (const child of children) {
            object.add(child);
        }

        this.objects.set(node.id, object);
        this.mixers.set(object.id, new THREE.AnimationMixer(object));
        this.nodes.set(object.id, node.id);

        if (node.controller !== null) {
            this.controllers.set(object, node.controller);
        }

        if (node.visible == false) {
            object.visible = false;
        }
        if (node.body !== null) {

            this.loadBody(node.body, object);
        }

        this.layers.set(object.id, node.layers);
        if (this.alias.has(node.id)) {
            this.alias.set(object.id, this.alias.get(node.id));
            this.alias.delete(node.id)
        }
        return object;

    }
    visitChildren(nodes, parentCascade) {
        const children = [];
        for (var key in nodes) {
            let node = nodes[key]
            const child = this.visitNode(node, parentCascade.descend());
            children.push(child);
        }
        return children;
    }

    visitNode(node, parentCascade) {

        let object = new THREE.Object3D();
        if (node.type == "primitive") {
            object = this.visitPrimitiveNode(node, parentCascade);
        }

        else if (node.type == "lod") {
            object = new THREE.LOD();
            for (const child of node.children) {
                const childObject = this.visitChildrenNode(child.node, parentCascade);
                object.addLevel(childObject, child.mindist);
            }
        }

        else if (node.children && node.children.length > 0) {
            object = this.visitChildrenNode(node, parentCascade);
        }

        else if (this.isLightType(node.type)) {
            object = this.visitLightNode(node)
        }
        else {
            debugger
            console.error("Bad Node Type Or node without children");
            console.log(node);
        }

        return object;
    }

    loadBody(body, object) {


        let ballDesc = this.rapier.ColliderDesc.ball(0.5);

        let rigidBodyDesc = this.rapier.RigidBodyDesc.dynamic()
            // The rigid body translation.
            // Default: zero vector.
            .setTranslation(0.0, 5.0, 1.0)
            // The rigid body rotation as a quaternion.
            // Default: no rotation.
            .setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 });

        let rigidBody = this.physics.createRigidBody(rigidBodyDesc);
        let collider = this.physics.createCollider(ballDesc, rigidBody);
        object.collider = collider;
    }
    shareLayer(object, otherObject) {

        let objectLayers = this.layers.get(object.id);
        let otherObjectLayers = this.layers.get(otherObject.id);

        if (objectLayers == undefined || otherObjectLayers == undefined) {
            return true;
        }

        for (const layer of objectLayers) {
            if (otherObjectLayers.includes(layer)) {
                return true;
            }
        }

        return false

    }


    checkCollisions() {

        let visited = new Set();
        let params = this.getParams();
        for (const [object, controller] of this.controllers.entries()) {
            for (const [_, otherObject] of this.objects.entries()) {
                if (object == otherObject || visited.has(otherObject)) {
                    continue;
                }

                if (this.shareLayer(object, otherObject)) {
                    object.box = new THREE.Box3().setFromObject(object);
                    otherObject.box = new THREE.Box3().setFromObject(otherObject);
                    otherObject.box.rotation = otherObject.rotation;
                    object.box.rotation = object.rotation;


                    if (object.position.distanceTo(otherObject.position) > this.narrowDistance) {
                        continue;
                    }

                    if (object.box.intersectsBox(otherObject.box)) {
                        params.object = object
                        params.otherObject = otherObject
                        controller.onCollide(params);

                        if (this.controllers.has(otherObject)) {


                            params.object = otherObject
                            params.otherObject = object
                            this.controllers.get(otherObject).onCollide(params);
                        }
                    }
                }
            }

            visited.add(object);
        }

    }
}

export { MyContents };


//TODO

// CAR AI COLLIDES LOSE SPEED
// NEW PARK
// 