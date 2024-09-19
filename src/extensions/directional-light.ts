import { Color, rgb, Timer, vec2, Vector2, wave } from "littlejsengine";
import { Light } from "./light";

const animationTimer = new Timer(1);

export class DirectionalLight extends Light {
  /**
   *
   * @param angle
   * @param color
   * @param intensity
   * @param height The height of the light. Used with 2D normal mapping. Ranges from 0 (parallel to the plane) to 1 (perpendicular to the plane).
   */
  constructor(angle?: number, color?: Color, intensity?: number, public height = 1) {
    super(undefined, undefined, angle, color, undefined, intensity);
  }

  override update(): void {
    if (animationTimer.elapsed()) animationTimer.set(0);
    this.angle = wave(0.1, 2 * Math.PI, animationTimer.time);
  }

  applyLighting(pixel: Color, pos: Vector2, normal?: Color): Color {
    if (!normal) {
      // If no normal is provided, assume the normal is straight up
      normal = rgb(0, 0, 1);
    }
    const direction = {
      y: (1 - this.height) * Math.cos(this.angle),
      x: (1 - this.height) * Math.sin(this.angle),
      z: this.height,
    };

    // Calculate dot product between light direction and normal
    const dot = Math.max(0, direction.x * normal.r + direction.y * normal.g + direction.z * normal.b);
    // Scale the light's color by intensity and dot product
    const scaledLightColor = this.color.scale(this.intensity * dot, 1);

    // Add only the RGB channels
    const newR = pixel.r + scaledLightColor.r;
    const newG = pixel.g + scaledLightColor.g;
    const newB = pixel.b + scaledLightColor.b;

    // Preserve the original alpha
    const newPixel = rgb(newR, newG, newB, pixel.a);

    return newPixel.clamp();
  }
}
