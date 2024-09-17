import { drawTile, EngineObject, keyIsDown, lerpAngle, mousePos, PI, TileInfo, Timer, vec2 } from "littlejsengine";
import * as idleFramesData from "./survivor-idle_flashlight.json";
import * as moveFramesData from "./survivor-move_flashlight.json";
import { FlashLight } from "./flash-light";
import { createTileInfos } from "../create-tile-info";

export class Player extends EngineObject {
  private _idleTileInfos: TileInfo[];
  private _moveTileInfos: TileInfo[];
  private _frameIndex = 0;
  private _frameTimer = new Timer(0.05);
  private _flashlight = new FlashLight();
  private _isIdle = true;
  private _animatingIdle = true;

  constructor() {
    super();
    this._idleTileInfos = createTileInfos(idleFramesData.frames, 0);
    this._moveTileInfos = createTileInfos(moveFramesData.frames, 1);
    this.size = vec2(4);
    this.drawSize = vec2(4);
    this.damping = 0.85;
    this.addChild(this._flashlight);
    this._flashlight.localPos = vec2(0, 2.2);
    this._flashlight.localAngle = -PI / 2;
  }

  update(): void {
    const lookDirection = mousePos.subtract(this.pos);
    this.angle = lerpAngle(0.8, this.angle, lookDirection.angle());
    this._isIdle = true;

    const movementDirection = vec2(0, 0);
    if (keyIsDown("KeyW")) movementDirection.y += 1;
    if (keyIsDown("KeyS")) movementDirection.y -= 1;
    if (keyIsDown("KeyA")) movementDirection.x -= 1;
    if (keyIsDown("KeyD")) movementDirection.x += 1;

    if (movementDirection.length() > 0) {
      const acceleration = 0.07;
      this.velocity = this.velocity.add(movementDirection.normalize().scale(acceleration));
      this._isIdle = false;
    }

    const maxSpeed = 0.3;
    if (this.velocity.length() > maxSpeed) {
      this.velocity = this.velocity.normalize().scale(maxSpeed);
    }

    super.update();
  }

  render(): void {
    if (this._isIdle) {
      if (!this._animatingIdle) {
        this._frameIndex = 0;
        this._animatingIdle = true;
      }
      this.renderIdle();
    } else {
      if (this._animatingIdle) {
        this._frameIndex = 0;
        this._animatingIdle = false;
      }
      this.renderMove();
    }
  }

  private renderIdle(): void {
    if (this._frameTimer.elapsed()) {
      this._frameIndex = (this._frameIndex + 1) % this._idleTileInfos.length;
      this._frameTimer.set(0.05);
    }

    drawTile(this.pos, this.drawSize, this._idleTileInfos[this._frameIndex], undefined, this.angle - PI / 2);
  }

  private renderMove(): void {
    if (this._frameTimer.elapsed()) {
      this._frameIndex = (this._frameIndex + 1) % this._moveTileInfos.length;
      this._frameTimer.set(0.05);
    }

    drawTile(this.pos, this.drawSize, this._moveTileInfos[this._frameIndex], undefined, this.angle - PI / 2);
  }
}