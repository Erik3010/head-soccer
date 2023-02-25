import Screen from "./Screen";
import Game from "../Game";

class GameScreen extends Screen {
  constructor(options) {
    super({ selector: ".game-screen", ...options });
  }
  init() {
    super.init();
    console.log("asdasd");

    const canvas = document.querySelector("#canvas");
    const game = new Game({ canvas });
    game.init();
  }
}

export default GameScreen;
