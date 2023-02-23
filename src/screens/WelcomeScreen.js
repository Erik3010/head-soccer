import Screen from "./Screen";

class WelcomeScreen extends Screen {
  constructor(options) {
    super({ selector: ".welcome-screen", ...options });
  }
  init() {
    super.init();

    const btnPlay = document.querySelector(".btn-play");
    btnPlay.addEventListener("click", this.playHandler.bind(this));
  }
  playHandler() {
    this.manager.changeScreen("selection");
  }
}

export default WelcomeScreen;
