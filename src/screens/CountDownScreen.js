import Screen from "./Screen";

class CountDownScreen extends Screen {
  constructor(options) {
    super({ selector: ".countdown-screen", ...options });
  }
  init() {
    super.init();

    // start countdown
  }
}

export default CountDownScreen;
