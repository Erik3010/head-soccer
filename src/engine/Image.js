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
  draw() {
    this.update();

    if (!this.image) return;

    this.ctx.save();
    if (this.isFlip) {
      this.ctx.scale(-1, 1);
    }
    this.ctx.drawImage(
      this.image,
      this.x * (this.isFlip ? -1 : 1),
      this.y,
      this.width * (this.isFlip ? -1 : 1),
      this.height
    );
    this.ctx.restore();
  }
  update() {}
}

export default CanvasImage;
