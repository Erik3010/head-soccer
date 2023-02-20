import CanvasImage from "../engine/Image";
import { clamp, mapValue } from "../utility";

class Ball extends CanvasImage {
  constructor({ gameInstance, ...options }) {
    super(options);

    this.game = gameInstance;

    // this.velocity = { x: 10, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.previousVelocity = null;
    this.actualSize = { width: this.width, height: this.height };

    this.gravity = 0.5;
    this.bounce = 0.7;

    this.angle = 0;

    this.force = 0;

    this.scale = 1;
    this.scaleAmount = 0.25;

    this.maxScale = 2.5;
    this.minScale = 0.5;

    this.isFreezeBall = false;
  }
  update() {
    super.update();

    !this.isFreezeBall && this.applyGravity();
    this.applyVelocity();

    this.constrainToGameArea();
  }
  constrainToGameArea() {
    const bottom =
      this.game.canvas.height - this.height - (this.game.bottomGap + 20);
    const right = this.game.canvas.width - this.width;

    if (this.y > bottom) {
      this.y = bottom;
      this.velocity.y *= -this.bounce;
    }

    if (this.x > right) {
      this.x = right;
      this.velocity.x *= -this.bounce;
    }

    if (this.x < 0) {
      this.x = 0;
      this.velocity.x *= -this.bounce;
    }
  }
  get renderCoordinate() {
    return {
      x: -this.width / 2,
      y: -this.height / 2,
    };
  }
  beforeDraw() {
    // for rotate purposes
    this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (!this.isFreezeBall) {
      this.ctx.rotate(this.angle * (Math.PI / 180));
    }
  }
  applyGravity() {
    this.velocity.y += this.gravity;
  }
  applyVelocity() {
    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }
  canChangeSize(scale) {
    return scale >= this.minScale && scale <= this.maxScale;
  }
  updateSize(scale) {
    this.width *= scale;
    this.height *= scale;
  }
  changeSize(scaleAmount) {
    const newScale = this.scale + scaleAmount;
    if (!this.canChangeSize(newScale)) return;

    this.scale = newScale;
    this.updateSize(1 + scaleAmount);
  }
  increaseSize() {
    this.changeSize(this.scaleAmount);
  }
  decreaseSize() {
    this.changeSize(-this.scaleAmount);
  }
  resetToDefaultSize() {
    this.scale = 1;
    this.width = this.actualSize.width;
    this.height = this.actualSize.height;
  }
  freezeBall() {
    this.previousVelocity = this.velocity;
    this.velocity = { x: 0, y: 0 };

    this.isFreezeBall = true;
  }
  unFreezeBall() {
    this.velocity = this.previousVelocity;
    this.previousVelocity = null;

    this.isFreezeBall = false;
  }
}

export default Ball;
