import Drawable from "../engine/Drawable";

class FlagBoard extends Drawable {
  constructor({ ctx, x, y, width, height, flagImage }) {
    super({ ctx });

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.flagImage = flagImage;

    this.flagCount = 10;
  }
  draw() {
    for (let i = 0; i < this.flagCount; i++) {
      this.ctx.save();
      this.ctx.drawImage(
        i % 2 === 0 ? this.flagImage.player : this.flagImage.opponent,
        this.x + i * this.width,
        this.y,
        this.width,
        this.height
      );
      this.ctx.restore();
    }
  }
}

export default FlagBoard;
