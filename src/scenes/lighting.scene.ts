import { glCanvas, mainCanvas, mainCanvasSize, overlayCanvas, rgb, vec2 } from "littlejsengine";
import { Scene } from "../extensions/scene";
import { Sprite } from "../extensions/sprite";
import * as foliageSpriteData from "../foliage.json";
import { createTileInfo } from "../create-tile-info";
import { DirectionalLight } from "../extensions/directional-light";
import { Light } from "../extensions/light";

export class LightingScene extends Scene {
  private _lightMapCanvas!: HTMLCanvasElement;
  private _lightMapContext!: CanvasRenderingContext2D;
  private _normalMapCanvas!: OffscreenCanvas;
  private _normalMapContext!: OffscreenCanvasRenderingContext2D;
  private _ambientLight = { color: rgb(201 / 255, 226 / 255, 255 / 255), intensity: 0.0 };
  private _lights: Light[] = [];

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
    this._lightMapContext = this._lightMapCanvas.getContext("2d", { willReadFrequently: true })!;
    this._normalMapCanvas = new OffscreenCanvas(1, 1);
    this._normalMapContext = this._normalMapCanvas.getContext("2d", { willReadFrequently: true})!;

    new Sprite(
      vec2(0),
      vec2(7),
      createTileInfo(foliageSpriteData.frames["tree6.png" as keyof typeof foliageSpriteData.frames], 2),
      createTileInfo(foliageSpriteData.frames["tree6.png" as keyof typeof foliageSpriteData.frames], 3),
      this._normalMapContext
    );

    this.initializeLights();
  }

  private initializeLights(): void {
    const angle = (90 * Math.PI) / 180;
    const dirLight = new DirectionalLight(angle, rgb(201 / 255, 226 / 255, 255 / 255), 1, 0.5);
    this._lights.push(dirLight);
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
    this._lightMapCanvas.style.width = mainCanvas.style.width;
    this._lightMapCanvas.style.height = mainCanvas.style.height;
    this._lightMapCanvas.width = mainCanvas.width;
    this._lightMapCanvas.height = mainCanvas.height;
    this._normalMapCanvas.width = mainCanvas.width;
    this._normalMapCanvas.height = mainCanvas.height;

    // Fill the light map canvas with ambient light
    this._lightMapContext.globalCompositeOperation = "source-over";
    const ambientColor = `rgba(${this._ambientLight.color.r * 255 * this._ambientLight.intensity}, ${
      this._ambientLight.color.g * 255 * this._ambientLight.intensity
    }, ${this._ambientLight.color.b * 255 * this._ambientLight.intensity}, 1)`;
    this._lightMapContext.fillStyle = ambientColor;
    this._lightMapContext.fillRect(0, 0, this._lightMapCanvas.width, this._lightMapCanvas.height);
  }

  /**
   * Called after objects are rendered, draw effects or hud that appear above all objects.
   */
  override gameRenderPost(): void {
    this._lightMapContext.globalCompositeOperation = "lighter";
    const litImageData: ImageData = this._lightMapContext.getImageData(
      0,
      0,
      this._lightMapCanvas.width,
      this._lightMapCanvas.height
    );
    const normalImageData: ImageData = this._normalMapContext.getImageData(
      0,
      0,
      this._normalMapCanvas.width,
      this._normalMapCanvas.height
    );

    for (let y = Math.round(mainCanvas.height / 2 - 200); y < Math.round(mainCanvas.height / 2 + 200); y++) {
      for (let x = Math.round(mainCanvas.width / 2 - 200); x < Math.round(mainCanvas.width / 2 + 200); x++) {
        const index = (y * this._lightMapCanvas.width + x) * 4;
        let pixel = rgb(
          litImageData.data[index] / 255,
          litImageData.data[index + 1] / 255,
          litImageData.data[index + 2] / 255,
          litImageData.data[index + 3] / 255
        );
        const normal = rgb(
          (normalImageData.data[index] / 255) * 2 - 1,
          (normalImageData.data[index + 1] / 255) * 2 - 1,
          (normalImageData.data[index + 2] / 255) * 2 - 1,
          (normalImageData.data[index + 3] / 255) * 2 - 1
        );

        const pos = vec2(x, y);

        for (const light of this._lights) {
          pixel = light.applyLighting(pixel, pos, normal);
        }

        pixel = pixel.clamp();

        litImageData.data[index] = pixel.r * 255;
        litImageData.data[index + 1] = pixel.g * 255;
        litImageData.data[index + 2] = pixel.b * 255;
        litImageData.data[index + 3] = pixel.a * 255;
      }
    }

    this._lightMapContext.putImageData(litImageData, 0, 0);
  }

  /**
   * Called when the scene is exited. It is the last method called when the scene is switched from.
   */
  override onExit(): void {}
}
