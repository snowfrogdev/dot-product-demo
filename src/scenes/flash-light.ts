import { drawCanvas2D, EngineObject, PI, vec2 } from "littlejsengine";

export class FlashLight extends EngineObject {
  constructor(private readonly imageMap: CanvasRenderingContext2D) {
    super();
    this.renderOrder = 1000;
  }

  render(): void {
    drawCanvas2D(
      this.pos,
      vec2(5, 5),
      this.angle,
      false,
      (ctx: CanvasRenderingContext2D) => {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
        gradient.addColorStop(0, "rgba(230, 245, 255, 1)");
        gradient.addColorStop(1, `rgba(1, 1, 1, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);

        const coneAngleInDegrees = 45;
        const coneAngleInRadians = (coneAngleInDegrees * PI) / 180;

        ctx.arc(0, 0, 30, -coneAngleInRadians / 2, coneAngleInRadians / 2);
        ctx.closePath();
        ctx.fill();
      },
      false,
      this.imageMap
    );
  }
}
