import PowerUpItem from "./PowerUpItem";

class DecreaseBallSizePowerUp extends PowerUpItem {
  constructor(options) {
    super(options);

    this.image = this.game.assetLoader.assets.decreaseBall;
  }
  activatePowerUp() {
    super.activatePowerUp();
    this.game.ball.decreaseSize();
  }
}

export default DecreaseBallSizePowerUp;
