import { drawTile, EngineObject, TileInfo, Vector2 } from "littlejsengine";

export class Sprite extends EngineObject {
  constructor(pos: Vector2, size: Vector2, tileInfo: TileInfo) {
    super(pos, size, tileInfo);
  }

  // Render the object, draws a tile by default, automatically called each frame, sorted by renderOrder
  override render(): void {
    drawTile(this.pos, this.size, this.tileInfo);
  }
}