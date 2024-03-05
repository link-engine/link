import { MyApp } from './MyApp.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

let app, contents, gui;

app = new MyApp()
app.init()
await RAPIER.init();
let gravity = { x: 0.0, y: -9.81, z: 0.0 };
app.contents.rapier = RAPIER;
app.contents.physics = new RAPIER.World(gravity);

await app.loadScene("menu", app.contents)

gui = new MyGuiInterface(app);
gui.setContents(contents)
gui.init()
app.render();