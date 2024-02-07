import * as raceScene from './scenes/race.js';
import * as menuScene from './scenes/menu.js';
import * as testScene from './scenes/test.js';
import * as resultsScene from './scenes/results.js';
import { MyFileReader } from '../../parser/MyFileReader.js';

class SceneManager {

    constructor(app) {

        this.scenes       = new Map();
        this.currentScene = 'race';
        this.app          = app;
        this.scenes.set("race", raceScene);
        this.scenes.set("menu", menuScene);
        this.scenes.set("test", testScene);
        this.scenes.set("results", resultsScene);
    }

    async loadScene(sceneName, contents, context) {
        
        const yafxScenes = "./projects/";
        const project    = "racingGame";
        const yafxOutput = yafxScenes + `${project}/scenes/${sceneName}.xml`;
        
        const scene = this.scenes.get(sceneName)

        await fetch(yafxOutput, {
            method: "PUT",
            body: scene.create(context),
        });

        
        this.app.resetScene()
        
        let reader = new MyFileReader(this.app);
        let xmlData;
        
        await fetch(yafxOutput).then((response) => {
            return response.text();
        }).then((data) => {
            xmlData = data;
        });
        
        
        let parser = new window.DOMParser();
        reader.xmlDoc = parser.parseFromString(xmlData, "text/xml");
        contents.reset();
        await reader.readXML();
        await contents.onSceneLoaded(reader.data)
        contents.loadModels();

        
        
        contents.startScene()
        contents.init()

        return contents;
    }
}

export { SceneManager };