import CanvasImage from "../engine/Image";

class Ball extends CanvasImage {
  constructor(options) {
    super(options);

    this.velocity = { x: 0, y: 0 };

    this.gravity = 0.5;
    this.bounce = 0.7;
  }
}

export default Ball;
