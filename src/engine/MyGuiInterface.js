import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui = new GUI();
        this.contents = null
        this.editor = null;
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {

        this.buildCameraFolder();
        this.buildFillFolder();
        this.editor = this.buildNodeEditor(this.contents.selectedNode);
        this.lights = this.buildLightsFolder();

    }

    buildCameraFolder() {
        this.cameraNames = Object.keys(this.app.cameras);
        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', this.cameraNames).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.close();
    }
    buildFillFolder() {
        const folder = this.datgui.addFolder('Fill');
        folder.add(this.contents.fillingTracker.o, 'filling', this.contents.fillingTypes);
        folder.close();
    }
    buildNodeEditor() {
        const editor = this.contents.editor.o;
        const folder = this.datgui.addFolder("Node Editor");
        const range = [];
        for (let i = 0; i < editor.node.children.length; i++) {
            range.push(i);
        }
        if (editor.node) {
            folder.add(editor, "moveToParent").name("Move To Parent").onChange(this.rebuildNodeEditor.bind(this));
            folder.add(editor, "selectedChild", range);
            folder.add(editor, "moveToChild").name("Move To Child").onChange(this.rebuildNodeEditor.bind(this));
        }

        folder.add(editor, "visible").name("Visible");
        const fill = folder.addFolder('Fill');
        fill.add(editor, 'filling', this.contents.fillingTypes);
        fill.close();

        const shadows = folder.addFolder("Shadows");
        shadows.add(editor.shadows, 'castShadows').name("Cast Shadows");
        shadows.add(editor.shadows, 'receiveShadows').name("Receive Shadows");


        const position = folder.addFolder("Position");
        position.add(editor.position, "x", 0, 10);
        position.add(editor.position, "y", 0, 10);
        position.add(editor.position, "z", 0, 10);
        position.close();

        const rotation = folder.addFolder("Rotation");
        rotation.add(editor.rotation, "x", 0, 10);
        rotation.add(editor.rotation, "y", 0, 10);
        rotation.add(editor.rotation, "z", 0, 10);
        rotation.close();
        const scale = folder.addFolder("Scale");
        scale.add(editor.scale, "x", 0, 10);
        scale.add(editor.scale, "y", 0, 10);
        scale.add(editor.scale, "z", 0, 10);
        scale.close();


        return folder;
    }
    rebuildNodeEditor() {
        // Run the changes detected
        this.contents.editor.run();
        // So that we can rebuild the UI

        this.editor.hide();
        this.editor = this.buildNodeEditor();
    }
    rebuildLightsFolder() {

        // Run the changes detected
        this.contents.selectedLightTracker.run();
        // So that we can rebuild the UI with the updated values

        this.lights.hide();
        this.lights = this.buildLightsFolder();
    }
    buildDirectionalLightFolder(folder) {
        const o = this.contents.selectedLightTracker.o;
        folder.add(o.properties, "left", 0, 1000);
        folder.add(o.properties, "right", 0, 1000);
        folder.add(o.properties, "top", 0, 1000);
        folder.add(o.properties, "bottom", 0, 1000);
    }
    buildNonDirectionalLightFolder(folder) {
        const o = this.contents.selectedLightTracker.o;
        folder.add(o.properties, "mapWidth").name("Map Width");
        folder.add(o.properties, "mapHeight").name("Map Height");
    }

    buildLightsFolder() {
        const folder = this.datgui.addFolder("Lights");
        const o = this.contents.selectedLightTracker.o;
        const options = Array.from(this.contents.lights.keys());
        folder.add(o, "selected", options).name("Selected Light").onChange(this.rebuildLightsFolder.bind(this));
        if (o.selected) {
            folder.add(o.properties, "visible").name("On/Off");
            folder.add(o.properties, "castShadow").name("Cast Shadows");
            folder.add(o.properties, "bias", -0.01, 0.01).name("Bias");
        }
        if (o.properties) {
            if (o.properties.isDirectional) {
                // TODO
                //this.buildDirectionalLightFolder(folder);
            }
            else {
                this.buildNonDirectionalLightFolder(folder);
            }

        }
        return folder;
    }

}

export { MyGuiInterface };