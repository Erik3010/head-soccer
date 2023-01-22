import CanvasImage from "../engine/Image";

class Ball extends CanvasImage {
  constructor({ gameInstance, ...options }) {
    super(options);

    this.game = gameInstance;

    this.velocity = { x: 10, y: 0 };

    this.gravity = 0.5;
    this.bounce = 0.7;
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
  applyGravity() {
    this.velocity.y += this.gravity;
  }
  applyVelocity() {
    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }
}

export default Ball;
