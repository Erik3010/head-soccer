import PowerUpItem from "./PowerUpItem";

class DiamondIcePowerUp extends PowerUpItem {
  constructor(options) {
    super(options);

    this.image = this.game.assetLoader.assets.diamondIce;
    this.freezeDuration = 3000;
  }
  activatePowerUp() {
    super.activatePowerUp();

    this.game.ball.freezeBall();
    this.game.isPowerUpActive = true;

    if (this.game.intervalIds.powerUpActivation) {
      clearTimeout(this.game.intervalIds.powerUpActivation);
    }

    const timeoutId = setTimeout(() => {
      this.game.ball.unFreezeBall();
      this.game.isPowerUpActive = false;
    }, this.freezeDuration);

    this.game.intervalIds.powerUpActivation = timeoutId;
  }
}

export default DiamondIcePowerUp;
