import { drawTile, EngineObject, vec2, Vector2 } from "littlejsengine";
import * as foliageSpriteData from "./foliage.json";
import { SpriteFrameData } from "../sprite-frame-data";
import { createTileInfo } from "../create-tile-info";

export class Foliage extends EngineObject {
  constructor(pos: Vector2, sprite: keyof typeof foliageSpriteData.frames) {
    super(pos);
    this.size = vec2(4);
    this.drawSize = vec2(4);
    const spriteData: SpriteFrameData = foliageSpriteData.frames[sprite];
    this.tileInfo = createTileInfo(spriteData, 2);
  }

  render(): void {
    drawTile(this.pos, this.drawSize, this.tileInfo)
  }
}