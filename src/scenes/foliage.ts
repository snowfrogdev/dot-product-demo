import { drawTile, EngineObject, vec2, Vector2 } from "littlejsengine";
import * as foliageSpriteData from "./foliage.json";

export class Foliage extends EngineObject {
  constructor(pos: Vector2, sprite: string) {
    super(pos);
    this.size = vec2(4);
    this.drawSize = vec2(4);
  }

  render(): void {
    drawTile(this.pos, this.drawSize,)
  }
}