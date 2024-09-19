import { ASSERT, drawCanvas2D, drawTile, EngineObject, tileFixBleedScale, TileInfo, Vector2 } from "littlejsengine";

export class Sprite extends EngineObject {
  constructor(
    pos: Vector2,
    size: Vector2,
    tileInfo: TileInfo,
    normalMap: TileInfo,
    normalMapContext: OffscreenCanvasRenderingContext2D
  );
  constructor(
    pos: Vector2,
    size: Vector2,
    tileInfo: TileInfo,
    public normalMap?: TileInfo,
    public normalMapContext?: OffscreenCanvasRenderingContext2D
  ) {
    ASSERT(
      normalMap === undefined || normalMapContext !== undefined,
      "Normal map context must be set if normal map is set"
    );
    super(pos, size, tileInfo);
  }

  override render(): void {
    drawTile(this.pos, this.size, this.tileInfo, this.color, this.angle);

    if (this.normalMap && this.normalMapContext) {
      drawCanvas2D(
        this.pos,
        this.size,
        this.angle,
        false,
        (ctx: OffscreenCanvasRenderingContext2D) => {
          const x = this.normalMap!.pos.x + tileFixBleedScale;
          const y = this.normalMap!.pos.y + tileFixBleedScale;
          const w = this.normalMap!.size.x - 2 * tileFixBleedScale;
          const h = this.normalMap!.size.y - 2 * tileFixBleedScale;
          ctx.drawImage(this.normalMap!.getTextureInfo().image, x, y, w, h, -0.5, -0.5, 1, 1);
        },
        false,
        this.normalMapContext as any
      );
    }
  }
}
