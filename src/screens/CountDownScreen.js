import Screen from "./Screen";

class CountDownScreen extends Screen {
  constructor(options) {
    super({ selector: ".countdown-screen", ...options });

    this.timer = null;
    this.countdown = 3;

    this.wrapper = this.screen.querySelector(".countdown-screen-wrapper");
  }
  init() {
    super.init();

    // TODO: for development purpose this code below will be commented
    this.timer = setInterval(() => {
      if (this.countdown === 1) {
        clearInterval(this.timer);
        this.manager.changeScreen("game");
        return;
      }

      const htmlString = `<h1 class="countdown-text">${--this.countdown}</h1>`;
      this.wrapper.innerHTML = htmlString;
    }, 1000);
  }
}

export default CountDownScreen;
