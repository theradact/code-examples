import { Application, Container, Sprite } from 'pixi.js'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480
});

const conty: Container = new Container();
conty.x = 100;
conty.y = 100;
conty.scale.set(1, 1)
conty.rotation = 90 * Math.PI / 180
app.stage.addChild(conty);

const clampy: Sprite = Sprite.from("sprites/clampy.png");
clampy.texture.baseTexture.on('loaded', () => {
	clampy.x = - clampy.width / 2;
	clampy.y = - clampy.height / 2;
})
clampy.rotation = 0 * Math.PI / 180
conty.addChild(clampy);
