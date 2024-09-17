import { drawCanvas2D, EngineObject, overlayContext, PI, vec2 } from "littlejsengine";

export class FlashLight extends EngineObject {
  constructor() {
    super();
    this.renderOrder = 0;
  }

  render(): void {
    drawCanvas2D(this.pos, vec2(5, 5), this.angle, false, (ctx: CanvasRenderingContext2D) => {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 3.5);
      gradient.addColorStop(0, 'rgba(230, 245, 255, 1)'); // Bright center
      gradient.addColorStop(1, 'rgba(230, 245, 255, 0)'); // Transparent edge

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);

      const coneAngleInDegrees = 45;
      const coneAngleInRadians = coneAngleInDegrees * PI / 180;

      ctx.arc(0, 0, 3.5, -coneAngleInRadians / 2, coneAngleInRadians / 2);
      ctx.closePath();
      ctx.fill();
    }, false, overlayContext)
  }
}