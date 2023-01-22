import CanvasImage from "../engine/Image";

class Background extends CanvasImage {
  constructor({ type, ...options }) {
    super({ ...options, x: 0, y: 0 });

    this.type = type;
  }
}

export default Background;
