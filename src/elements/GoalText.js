import Drawable from "../engine/Drawable";

class GoalText extends Drawable {
  constructor({ x, y, width, height, image, scale, ...options }) {
    super(options);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.image = image;

    this.scale = scale;
  }
  draw() {
    this.ctx.save();
    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height / 2,
      this.x,
      this.y,
      this.width,
      this.height / 2
    );
    this.ctx.drawImage(
      this.image,
      0,
      this.image.height / 2,
      this.image.width,
      this.image.height / 2,
      this.x,
      this.y + this.height / 2,
      this.width,
      this.height / 2
    );
    this.ctx.restore();
  }
}

export default GoalText;
