import { COUNTRIES } from "../constants";
import Dialog from "./Dialog";

class GameOverDialog extends Dialog {
  constructor(options) {
    super({ selector: "#game-over-dialog", ...options });
  }
  init() {
    super.init();

    const btnRestart = document.querySelector(".btn-dialog-restart");
    btnRestart.addEventListener("click", this.handleRestart.bind(this));

    const btnLeaderboard = document.querySelector(".btn-dialog-leaderboard");
    btnLeaderboard.addEventListener("click", this.handleLeaderboard.bind(this));
  }
  handleRestart() {
    window.location.reload();
  }
  handleLeaderboard() {
    console.log("Leaderboard TBA...");
  }
  update({ username, flag, score }) {
    const usernameArea = document.querySelector("#username-area");
    const playerFlagImage = document.querySelector("#player-score-flag img");
    const opponentFlagImage = document.querySelector(
      "#opponent-score-flag img"
    );
    const playerScoreText = document.querySelector("#player-score-text");
    const opponentScoreText = document.querySelector("#opponent-score-text");

    const playerFlag = COUNTRIES[flag.player].name;
    const opponentFlag = COUNTRIES[flag.opponent].name;

    usernameArea.innerHTML = username;

    playerFlagImage.src = `./assets/Flag/${playerFlag}.png`;
    opponentFlagImage.src = `./assets/Flag/${opponentFlag}.png`;

    playerScoreText.innerHTML = score.player;
    opponentScoreText.innerHTML = score.opponent;
  }
}

export default GameOverDialog;
