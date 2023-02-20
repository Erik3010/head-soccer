import Drawable from "../engine/Drawable";
import { easeAnimation } from "../utility";

class GoalText extends Drawable {
  constructor({ x, y, width, height, image, scale, gameInstance, ...options }) {
    super(options);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.scale = scale;

    this.game = gameInstance;

    this.topPart = {
      x: -this.width,
      y: this.y,
    };

    this.bottomPart = {
      x: this.game.canvas.width,
      y: this.y + this.height / 2,
    };

    this.currentFrame = 0;
    this.step = 60;

    this.isShow = false;
  }
  /**
   *
   * @param {"top" | "bottom"} part
   */
  getPosition(part) {
    const { width: actualWidth, height: actualHeight } = this.image;
    const cropMap = {
      top: 0,
      bottom: actualHeight / 2,
    };

    const partMap = {
      top: this.topPart,
      bottom: this.bottomPart,
    };
    const { x, y } = partMap[part];

    const cropRect = [0, cropMap[part], actualWidth, actualHeight / 2];
    const positionRect = [x, y, this.width, this.height / 2];

    return [this.image, ...cropRect, ...positionRect];
  }
  drawTopPart() {
    this.ctx.drawImage(...this.getPosition("top"));
  }
  drawBottomPart() {
    this.ctx.drawImage(...this.getPosition("bottom"));
  }
  draw() {
    this.ctx.save();

    this.drawTopPart();
    this.drawBottomPart();

    this.ctx.restore();
  }
  async animate({ top, bottom }) {
    const topPartDistance = top - this.topPart.x;
    const bottomPartDistance = bottom - this.bottomPart.x;

    const topPartStartX = this.topPart.x;
    const bottomPartStartX = this.bottomPart.x;

    return new Promise((resolve) => {
      const animate = () => {
        if (this.currentFrame > this.step) {
          this.currentFrame = 0;
          return resolve();
        }

        this.topPart.x =
          topPartStartX +
          easeAnimation(topPartDistance, this.currentFrame, this.step);

        this.bottomPart.x =
          bottomPartStartX +
          easeAnimation(bottomPartDistance, this.currentFrame, this.step);

        this.currentFrame++;
        requestAnimationFrame(animate);
      };

      animate();
    });
  }
  async show() {
    await this.animate({ top: this.x, bottom: this.x });
    this.isShow = true;
  }
  async hide() {
    await this.animate({ top: -this.width, bottom: this.game.canvas.width });
    this.isShow = false;
  }
}

export default GoalText;
