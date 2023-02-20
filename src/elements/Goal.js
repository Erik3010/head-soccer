import CanvasImage from "../engine/Image";

class Goal extends CanvasImage {
  constructor({ side, ...options }) {
    super(options);

    this.isGoal = false;
    this.side = side;
  }
}

export default Goal;
