import { Color, EngineObject, Vector2 } from "littlejsengine";

export abstract class Light extends EngineObject {
  constructor(
    pos?: Vector2,
    size?: Vector2,
    angle?: number,
    color?: Color,
    renderOrder?: number,
    public intensity = 1,
  ) {
    super(pos, size, undefined, angle, color, renderOrder);
  }

  override render(): void {}

  abstract applyLighting(pixel: Color, pos: Vector2, normal?: Color): Color;
}
