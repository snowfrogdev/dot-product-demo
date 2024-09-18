import { drawRect, glCanvas, mainCanvas, mainCanvasSize, min, overlayCanvas, PI, rgb, vec2 } from "littlejsengine";
import { Scene } from "../scene";
import { Player } from "./player";
import { Foliage } from "./foliage"; 
import { FlashLight } from "./flash-light";

export class FieldOfViewScene extends Scene {
  private _player!: Player;
  private _lightMapCanvas!: HTMLCanvasElement;
  private _lightMapContext!: CanvasRenderingContext2D;
  constructor() {
    super("field-of-view", ["./survivor-idle_flashlight.png", "./survivor-move_flashlight.png", "./foliage.png"]);
  }

  onEnter(): void {
    this._lightMapCanvas = document.createElement("canvas");
    document.body.appendChild(this._lightMapCanvas);
    this._lightMapCanvas.style.cssText = mainCanvas.style.cssText;
    this._lightMapCanvas.style.mixBlendMode = "multiply";
    (glCanvas || mainCanvas).style.zIndex = mainCanvas.style.zIndex = "0";
    this._lightMapCanvas.style.zIndex = "1";
    overlayCanvas.style.zIndex = "2";
    this._lightMapContext = this._lightMapCanvas.getContext("2d")!;
    

    this._player = new Player();
    const flashlight = new FlashLight(this._lightMapContext);
    this._player.addChild(flashlight);
    flashlight.localPos = vec2(0, 1.5);
    flashlight.localAngle = -PI / 2;

    new Foliage(vec2(3,3), "palmtree5.png");
  }

  gameUpdatePost(): void {
    // center camera on player
  }
  gameRender(): void {
    this._lightMapCanvas.style.width = mainCanvas.style.width;
    this._lightMapCanvas.style.height = mainCanvas.style.height;
    this._lightMapCanvas.width = mainCanvas.width;
    this._lightMapCanvas.height = mainCanvas.height;
    this._lightMapContext.clearRect(0, 0, mainCanvasSize.x, mainCanvasSize.y);
    this._lightMapContext.fillStyle = "rgba(0, 0, 0, 0.7)";
    this._lightMapContext.fillRect(0, 0, mainCanvasSize.x, mainCanvasSize.y);


    drawRect(vec2(0), vec2(mainCanvasSize.x, mainCanvasSize.y), rgb(203, 170, 125));
  }
}