import Drawable from "./Drawable";

class CanvasImage extends Drawable {
  constructor({
    ctx,
    x,
    y,
    width,
    height,
    imageSrc = null,
    image = null,
    isFlip = false,
  }) {
    super({ ctx });

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.isFlip = isFlip;

    this.imageSrc = imageSrc;
    this.image = image;

    if (!this.image && this.imageSrc) {
      this.image = new Image();
      this.image.src = this.imageSrc;
    }
  }
  get renderCoordinate() {
    return {
      x: this.x,
      y: this.y,
    };
  }
  get drawImageParams() {
    const { x, y } = this.renderCoordinate;
    const inverse = this.isFlip ? -1 : 1;

    return [this.image, x * inverse, y, this.width * inverse, this.height];
  }
  beforeDraw() {}
  draw() {
    this.update();

    if (!this.image) return;

    this.ctx.save();
    this.isFlip && this.ctx.scale(-1, 1);
    this.beforeDraw();
    this.ctx.drawImage(...this.drawImageParams);
    this.ctx.restore();
  }
  update() {}
}

export default CanvasImage;
