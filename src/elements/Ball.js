import CanvasImage from "../engine/Image";
import { clamp, mapValue } from "../utility";

class Ball extends CanvasImage {
  constructor({ gameInstance, ...options }) {
    super(options);

    this.game = gameInstance;

    this.velocity = { x: 10, y: 0 };

    this.gravity = 0.5;
    this.bounce = 0.7;

    this.angle = 0;
  }
  update() {
    super.update();

    this.applyGravity();
    this.applyVelocity();

    this.constrainToGameArea();
  }
  constrainToGameArea() {
    const bottom =
      this.game.canvas.height - this.height - (this.game.bottomGap + 15);
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
    this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    this.ctx.rotate(this.angle * (Math.PI / 180));
  }
  applyGravity() {
    this.velocity.y += this.gravity;
  }
  applyVelocity() {
    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }
}

export default Ball;
