import { drawRect, mainCanvasSize, rgb, vec2 } from "littlejsengine";
import { Scene } from "../scene";
import { Player } from "./player";

export class FieldOfViewScene extends Scene {
  constructor() {
    super("field-of-view", ["./survivor-idle_flashlight.png", "./survivor-move_flashlight.png"]);
  }

  onEnter(): void {
    new Player();
  }

  gameRender(): void {
    drawRect(vec2(0), vec2(mainCanvasSize.x, mainCanvasSize.y), rgb(0.3, 0.3, 0.3));
  }
}