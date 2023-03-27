import {
  AnimatedSprite,
  BaseTexture,
  Container,
  Rectangle,
  Texture,
  // Sprite
} from "pixi.js";

enum Direction {
  DOWN = 0,
  LEFT = 1,
  RIGHT = 2,
  UP = 3,
}

export class Character extends Container {

  protected direction: Direction;

  protected isMoving: boolean;

  // There are 8 characters to choose from in the player spritesheet
  protected spriteNumber: number;

  private sprite: AnimatedSprite;

  constructor(spriteNumber: number) {
    super();

    this.spriteNumber = spriteNumber;
    this.direction = Direction.UP;
    this.isMoving = false;

    this.sprite = this.getTextureFrames();
    this.sprite.x = 200;
    this.sprite.y = 200;
    this.addChild(this.sprite);
    console.log(this.sprite)
  }

  protected getTextureFrames(): AnimatedSprite {
    if (this.spriteNumber < 0 || this.spriteNumber > 7) {
      throw new Error(`"${this.spriteNumber}" is not a viable character. There are 8 characters available. Pick number from 0 to 7!`);
    }

    const baseTexture = new BaseTexture("sprites/player-spritesheet.png");

    const TEXTURE_TILE_SIZE = 48;
    const NUMBER_OF_TEXTURES_IN_ROW = 3;
    const NUMBER_OF_DIRECTIONS = 4;

    const spriteOffset = {
      column: (this.spriteNumber % 4) * NUMBER_OF_TEXTURES_IN_ROW,
      row: Math.floor(this.spriteNumber / 4) * NUMBER_OF_DIRECTIONS
    }

    // If the character is moving we use the left and right texture and if it is stationary we use the middle one
    const framesUsed = this.isMoving ? [0, 2] : [1];

    return new AnimatedSprite(framesUsed.map((columnOffset) => {
      return new Texture(baseTexture,
        new Rectangle(
          TEXTURE_TILE_SIZE * (spriteOffset.row + columnOffset),
          TEXTURE_TILE_SIZE * (spriteOffset.column + this.direction)
        ))
    }));
  }
  // private updateTextureFrames() {
  //   this.sprite.destroy();
  //   this.sprite = 
  //   //console.log(character, character % 4);
  // }
}