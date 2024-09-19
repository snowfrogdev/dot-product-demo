import { glCanvas, mainCanvas, mainCanvasSize, overlayCanvas, rgb, vec2 } from "littlejsengine";
import { Scene } from "../scene";
import { Sprite } from "../sprite";
import * as foliageSpriteData from "../foliage.json";
import { createTileInfo } from "../create-tile-info";

export class LightingScene extends Scene {
  private _lightMapCanvas!: HTMLCanvasElement;
  private _lightMapContext!: CanvasRenderingContext2D;
  private _ambientLight = { color: rgb(201/255, 226/255, 255/255), intensity: 0.5 };

  constructor() {
    super("lighting", [
      "./survivor-idle_flashlight.png",
      "./survivor-move_flashlight.png",
      "./foliage.png",
      "./foliage_n.png",
    ]);
  }

  /**
   * Called when the scene is entered. It is the first method called when the scene is switched to.
   */
  override onEnter(): void {
    this._lightMapCanvas = document.createElement("canvas");
    this._lightMapCanvas.id = "light-map";
    document.body.appendChild(this._lightMapCanvas);
    this._lightMapCanvas.style.cssText = mainCanvas.style.cssText;
    this._lightMapCanvas.style.mixBlendMode = "multiply";
    (glCanvas || mainCanvas).style.zIndex = mainCanvas.style.zIndex = "0";
    this._lightMapCanvas.style.zIndex = "1";
    overlayCanvas.style.zIndex = "2";
    this._lightMapContext = this._lightMapCanvas.getContext("2d")!;

    new Sprite(
      vec2(0),
      vec2(7),
      createTileInfo(foliageSpriteData.frames["tree6.png" as keyof typeof foliageSpriteData.frames], 2)
    );
  }

  /**
   * Called every frame at 60 frames per second, handle input and update the game state.
   */
  override gameUpdate(): void {}

  /**
   * Called after physics and objects are updated, setup camera and prepare for rendering.
   */
  override gameUpdatePost(): void {}

  /**
   * Called before objects are rendered, draw any background effects that appear behind objects.
   */
  override gameRender(): void {
    // Clear the light map canvas with black
    this._lightMapCanvas.style.width = mainCanvas.style.width;
    this._lightMapCanvas.style.height = mainCanvas.style.height;
    this._lightMapCanvas.width = mainCanvas.width;
    this._lightMapCanvas.height = mainCanvas.height;

    const ambientColor = `rgba(${this._ambientLight.color.r * 255 * this._ambientLight.intensity}, ${this._ambientLight.color.g * 255 * this._ambientLight.intensity}, ${this._ambientLight.color.b * 255 * this._ambientLight.intensity}, 1)`;
    this._lightMapContext.fillStyle = ambientColor;
    this._lightMapContext.fillRect(0, 0, this._lightMapCanvas.width, this._lightMapCanvas.height);
  }

  /**
   * Called after objects are rendered, draw effects or hud that appear above all objects.
   */
  override gameRenderPost(): void {
    
  }

  /**
   * Called when the scene is exited. It is the last method called when the scene is switched from.
   */
  override onExit(): void {}
}
