import { drawRect, drawTile, EngineObject, keyIsDown, lerpAngle, mousePos, PI, rgb, tile, TileInfo, Timer, vec2 } from "littlejsengine";
import { SpriteFrameData } from "../sprite-frame-data";
import * as idleFramesData from "./survivor-idle_flashlight.json";
import * as moveFramesData from "./survivor-move_flashlight.json";
import { FlashLight } from "./flash-light";

export class Player extends EngineObject {
  private _idleTileInfos: TileInfo[];
  private _moveTileInfos: TileInfo[];
  private _frameIndex = 0;
  private _frameTimer = new Timer(0.05);
  private _flashlight = new FlashLight();

  constructor() {
    super();
    this._idleTileInfos = this.createTileInfos(idleFramesData.frames, 0);
    this._moveTileInfos = this.createTileInfos(moveFramesData.frames, 1);
    this.size = vec2(4);
    this.drawSize = vec2(4);
    this.damping = 0.9;
    this.addChild(this._flashlight);
    this._flashlight.localPos = vec2(0, 2.2);
  }

  createTileInfos(frames: SpriteFrameData[], textureIndex: number): TileInfo[] {
    const tileInfos: TileInfo[] = [];
    for (const frame of frames) {
      const sprite: SpriteFrameData = frame;
      const spritePos = vec2(sprite.frame.x, sprite.frame.y);
      const spriteSize = vec2(sprite.frame.w, sprite.frame.h);
      tileInfos.push(tile(spritePos, spriteSize, textureIndex));
    }
    return tileInfos;
  }

  update(): void {
    const lookDirection = mousePos.subtract(this.pos);
    this.angle = lerpAngle(0.8, this.angle, lookDirection.angle());

    const movementDirection = vec2(0, 0);
    if (keyIsDown("KeyW")) movementDirection.y += 1;
    if (keyIsDown("KeyS")) movementDirection.y -= 1;
    if (keyIsDown("KeyA")) movementDirection.x -= 1;
    if (keyIsDown("KeyD")) movementDirection.x += 1;

    if (movementDirection.length() > 0) {
      const acceleration = 0.07;
      this.velocity = this.velocity.add(movementDirection.normalize().scale(acceleration));
    }

    const maxSpeed = 0.3;
    if (this.velocity.length() > maxSpeed) {
      this.velocity = this.velocity.normalize().scale(maxSpeed);
    }

    console.log(this.velocity);
    super.update();
  }

  render(): void {
    this.renderIdle();
    this.renderFlashlightBeam();
  }

  private renderIdle(): void {
    if (this._frameTimer.elapsed()) {
      this._frameIndex = (this._frameIndex + 1) % this._idleTileInfos.length;
      this._frameTimer.set(0.05);
    }

    drawTile(this.pos, this.drawSize, this._idleTileInfos[this._frameIndex], undefined, this.angle - PI / 2);
  }

  private renderFlashlightBeam(): void {
    
  }
}