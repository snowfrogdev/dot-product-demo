import { drawRect, drawTile, EngineObject, mousePos, PI, rgb, tile, TileInfo, Timer, vec2 } from "littlejsengine";
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
    this.addChild(this._flashlight);
    this._flashlight.localPos = vec2(0, 2);
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
    const direction = mousePos.subtract(this.pos);
    this.angle = direction.angle();
    console.log(this.angle);
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