import { Application } from 'pixi.js'
import { Scene } from './scene';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480
});

const scene: Scene = new Scene(app.screen.width, app.screen.height);

app.stage.addChild(scene);
