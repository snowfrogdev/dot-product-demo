import { drawRect, glCanvas, glContext, glCreateProgram, glCreateTexture, glEnable, glInitPostProcess, mainCanvas, mainCanvasSize, mainContext, overlayCanvas, rgb, vec2 } from "littlejsengine";
import { Scene } from "../extensions/scene";
import { Sprite } from "../extensions/sprite";
import * as foliageSpriteData from "../foliage.json";
import { createTileInfo } from "../create-tile-info";
import { DirectionalLight } from "../extensions/directional-light";
import { Light } from "../extensions/light";

export class LightingScene extends Scene {
  private _normalMapCanvas!: OffscreenCanvas;
  private _normalMapContext!: OffscreenCanvasRenderingContext2D;
  private _ambientLight = { color: rgb(201 / 255, 226 / 255, 255 / 255), intensity: 0 };
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
    this._normalMapCanvas = new OffscreenCanvas(1, 1);
    this._normalMapContext = this._normalMapCanvas.getContext("2d", { willReadFrequently: true })!;

    new Sprite(
      vec2(0),
      vec2(7),
      createTileInfo(foliageSpriteData.frames["tree6.png" as keyof typeof foliageSpriteData.frames], 2),
      createTileInfo(foliageSpriteData.frames["tree6.png" as keyof typeof foliageSpriteData.frames], 3),
      this._normalMapContext
    );

    this.initializeLights();

    const ambientLightShader = `
      uniform vec3 uAmbientLightColor;
      uniform float uAmbientIntensity;

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec3 sceneColor = texture(iChannel0, fragCoord / iResolution.xy);
        vec3 ambient = ambientLightColor.rgb * ambientIntensity;
        fragColor = vec4(sceneColor.rgb * ambient, sceneColor.a);
      }
    `;
    glInitPostProcess(ambientLightShader, false);

    const uniformLocation = (name: string) => glContext.getUniformLocation(glPostShader, name);
    glContext.uniform3f(uniformLocation("uAmbientLightColor"), 201 / 255, 226 / 255, 255 / 255);
    glContext.uniform1f(uniformLocation("uAmbientIntensity"), 0.5);
  }

  private initializeLights(): void {
    const angle = (90 * Math.PI) / 180;
    const dirLight = new DirectionalLight(angle, rgb(201 / 255, 226 / 255, 255 / 255), 1, 1);
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
    this._normalMapCanvas.width = mainCanvas.width;
    this._normalMapCanvas.height = mainCanvas.height;

    drawRect(vec2(0), mainCanvasSize, rgb(201/255, 168/255, 120/255));
  }

  /**
   * Called after objects are rendered, draw effects or hud that appear above all objects.
   */
  override gameRenderPost(): void {
    // 
  }

  /**
   * Called when the scene is exited. It is the last method called when the scene is switched from.
   */
  override onExit(): void {}

  private glInitLightProcess(): void {
    const glLightShader = glCreateProgram(`
      #version 300 es
      precision highp float;
      in vec2 p;
      void main() {
        gl_Position = vec4(p + p - 1., 1, 1);
      }`,
      `#version 300 es
      precision highp float;
      uniform sampler2D iChannel0;
      uniform vec3 iResolution;
      uniform float iTime;
      uniform vec3 uAmbientLightColor;
      uniform float uAmbientIntensity;
      out vec4 c;
  
      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec3 sceneColor = texture(iChannel0, fragCoord / iResolution.xy);
        vec3 ambient = ambientLightColor.rgb * ambientIntensity;
        fragColor = vec4(sceneColor.rgb * ambient, sceneColor.a);
      }
  
      void main() {
        mainImage(c, gl_FragCoord.xy);
        c.a = 1.;
      }`
    );
  
    // create buffer and texture
    const glLightTexture = glCreateTexture(undefined as any);
  
    // hide the original 2d canvas
    mainCanvas.style.visibility = 'hidden';
  }

  private glRenderLightProcess() {
    if (glEnable) {
      glFlush()
    }
  }

  private glFlush() {
    const destBlend = glBatchAdditive ? gl_ONE : gl_ONE_MINUS_SRC_ALPHA;
    glContext.blendFuncSeparate(gl_SRC_ALPHA, destBlend, gl_ONE, destBlend);
    glContext.enable(gl_BLEND);

    // draw all the sprites in the batch and reset the buffer
    glContext.bufferSubData(gl_ARRAY_BUFFER, 0, glPositionData);
    glContext.drawArraysInstanced(gl_TRIANGLE_STRIP, 0, 4, glInstanceCount);
    if (showWatermark)
        drawCount += glInstanceCount;
    glInstanceCount = 0;
    glBatchAdditive = glAdditive;
  }
}

// WebGL internal variables not exposed to documentation
let glShader, glActiveTexture, glArrayBuffer, glGeometryBuffer, glPositionData, glColorData, glInstanceCount, glAdditive, glBatchAdditive: number;
glBatchAdditive = 0;

const
gl_ONE = 1,
gl_ONE_MINUS_SRC_ALPHA = 771,
gl_SRC_ALPHA = 770,
gl_BLEND = 3042,
gl_ARRAY_BUFFER = 34962,
gl_TRIANGLE_STRIP = 5;