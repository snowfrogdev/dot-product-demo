import { drawCanvas2D, drawTile, EngineObject, tileFixBleedScale, TileInfo, Vector2 } from "littlejsengine";
import * as foliageSpriteData from "./foliage.json";
import { SpriteFrameData } from "./sprite-frame-data";
import { createTileInfo } from "./create-tile-info";

export class Foliage extends EngineObject {
  private _normalsTileInfo: TileInfo;

  constructor(
    pos: Vector2,
    size: Vector2,
    sprite: keyof typeof foliageSpriteData.frames,
    private lightmapContext: CanvasRenderingContext2D
  ) {
    super(pos, size);
    this.drawSize = this.size;
    const spriteData: SpriteFrameData = foliageSpriteData.frames[sprite];
    this.tileInfo = createTileInfo(spriteData, 2);

    this._normalsTileInfo = createTileInfo(spriteData, 3);
  }

  render(): void {
    drawTile(this.pos, this.size, this.tileInfo, undefined, this.angle);

    const x = this.tileInfo.pos.x + tileFixBleedScale;
    const y = this.tileInfo.pos.y + tileFixBleedScale;
    const w = this.tileInfo.size.x - tileFixBleedScale * 2;
    const h = this.tileInfo.size.y - tileFixBleedScale * 2;
    drawCanvas2D(
      this.pos,
      this.size,
      this.angle,
      false,
      (ctx: CanvasRenderingContext2D) => {
        ctx.drawImage(this._normalsTileInfo.getTextureInfo().image, x, y, w, h, -0.5, -0.5, 1, 1);
      },
      false,
      this.lightmapContext
    );
  }
}
