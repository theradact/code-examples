import { Container } from "pixi.js";
import { Character } from "./Character";

export class Scene extends Container {
  private readonly screenWidth: number;
  private readonly screenHeight: number;

  private player: Character;
  constructor(screenWidth: number, screenHeight: number) {
      super();

      this.screenWidth = screenWidth;
      this.screenHeight = screenHeight;

      console.log(this.screenWidth, this.screenHeight);
      this.player = new Character(1);

      this.addChild(this.player)
  }
}