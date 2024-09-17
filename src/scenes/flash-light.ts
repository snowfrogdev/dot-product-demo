import { drawRect, EngineObject, rgb, vec2 } from "littlejsengine";

export class FlashLight extends EngineObject {
  constructor() {
    super();
  }

  render(): void {
    drawRect(this.pos, vec2(0.2), rgb(1, 1, 1));
  }
}