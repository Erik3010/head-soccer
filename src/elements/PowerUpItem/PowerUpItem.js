import CanvasImage from "../../engine/Image";

class PowerUpItem extends CanvasImage {
  constructor({ gameInstance, ...options }) {
    super(options);

    this.game = gameInstance;

    this.gravity = 0.03;
    this.velocity = { x: 0, y: 0 };
  }
  update() {
    super.update();

    this.applyGravity();
    this.applyVelocity();
  }
  applyGravity() {
    this.velocity.y += this.gravity;
  }
  applyVelocity() {
    this.y += this.velocity.y;
  }
  activatePowerUp() {
    // this.game.ball.increaseSize();
    // this.game.ball.decreaseSize();
  }
}

export default PowerUpItem;
