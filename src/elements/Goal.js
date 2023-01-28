import CanvasImage from "../engine/Image";

class Goal extends CanvasImage {
  constructor({ side, ...options }) {
    super(options);

    this.isGoal = false;
    this.side = side;
  }
  draw() {
    // this.ctx.beginPath();
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    // this.ctx.fillStyle = "red";
    // this.ctx.closePath();

    super.draw();
  }
}

export default Goal;
