import Screen from "./Screen";
import Game from "../Game";

class GameScreen extends Screen {
  constructor(options) {
    super({ selector: ".game-screen", ...options });
  }
  init() {
    super.init();

    const { player, opponent } = this.manager.selectedPlayer;

    const canvas = document.querySelector("#canvas");
    const game = new Game({
      canvas,
      player,
      opponent,
      username: this.manager.username,
      level: this.manager.gameLevel,
      background: this.manager.selectedBg,
      ball: this.manager.selectedBall,
    });
    game.init();
  }
}

export default GameScreen;
