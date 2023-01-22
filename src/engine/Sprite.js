import CanvasImage from "./Image";

class Sprite extends CanvasImage {
  constructor({ sprites, ...options }) {
    super(options);

    this.sprites = sprites;
    this.spriteCounter = 0;
    this.currentFrameIndex = 0;
  }
  get frameBuffer() {
    return 3;
  }
  get currentSprite() {
    return this.sprites[this.currentFrameIndex];
  }
  update() {
    super.update();
    this.updateFrame();
  }
  get shouldUpdateFrame() {
    return this.spriteCounter % this.frameBuffer === 0;
  }
  updateFrame() {
    this.spriteCounter++;

    if (this.shouldUpdateFrame) {
      this.currentFrameIndex = ++this.currentFrameIndex % this.sprites.length;
      this.image = this.currentSprite;
    }
  }
  resetSpriteAnimation() {
    this.spriteCounter = 0;
    this.currentFrameIndex = 0;
  }
}

export default Sprite;
