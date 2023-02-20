import PowerUpItem from "./PowerUpItem";

class IncreaseBallSizePowerUp extends PowerUpItem {
  constructor(options) {
    super(options);

    this.image = this.game.assetLoader.assets.increaseBall;
  }
  activatePowerUp() {
    super.activatePowerUp();
    this.game.ball.increaseSize();
  }
}

export default IncreaseBallSizePowerUp;
