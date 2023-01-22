import { CHARACTER_STATES } from "../constants";
import Sprite from "../engine/Sprite";

class Character extends Sprite {
  constructor({ sprites, gameInstance, ...options }) {
    super({
      ...options,
      sprites: sprites[CHARACTER_STATES.idle],
    });

    this.game = gameInstance;
    this.state = CHARACTER_STATES.idle;
    this.spriteCollection = sprites;

    this.gravity = 0.5;
    this.moveSpeed = 3;
    this.jumpHeight = 15;

    this.isKick = false;

    this.velocity = { x: 0, y: 0 };
  }
  update() {
    super.update();

    this.watchState();
    this.applyVelocity();
    this.applyGravity();

    this.restrictToBottom();
  }
  watchState() {
    const kickSpriteLength =
      this.spriteCollection[CHARACTER_STATES.kick].length;

    if (this.isKick) {
      if (this.currentFrameIndex < kickSpriteLength - 1) return;

      this.isKick = false;
      this.resetSpriteAnimation();
    }

    if (this.velocity.y !== 0) {
      this.updateState(CHARACTER_STATES.jump);
    } else if (this.velocity.x !== 0) {
      this.updateState(
        this.velocity.x > 0
          ? CHARACTER_STATES.move_forward
          : CHARACTER_STATES.move_backward
      );
    } else {
      this.updateState(CHARACTER_STATES.idle);
    }
  }
  applyGravity() {
    this.velocity.y += this.gravity;
  }
  applyVelocity() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
  restrictToBottom() {
    const bottom = this.game.canvas.height - this.height - this.game.bottomGap;

    if (this.y >= bottom) {
      this.y = bottom;
      this.velocity.y = 0;
    }
  }
  updateState(state) {
    if (this.state === state) return;

    this.state = state;
    this.resetSpriteAnimation();

    this.sprites = this.spriteCollection[this.state];
  }
  move(direction) {
    this.velocity.x = direction * this.moveSpeed;
  }
  stopMove() {
    this.velocity.x = 0;
  }
  jump() {
    if (this.velocity.y !== 0) this.velocity.y = 0;

    this.velocity.y -= this.jumpHeight;
  }
  kick() {
    this.isKick = true;
    this.updateState(CHARACTER_STATES.kick);
  }
}

export default Character;
