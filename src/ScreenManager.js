import CountDownScreen from "./screens/CountDownScreen";
import GameScreen from "./screens/GameScreen";
import SelectionScreen from "./screens/SelectionScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

class ScreenManager {
  constructor() {
    this.screens = {
      welcome: WelcomeScreen,
      selection: SelectionScreen,
      countdown: CountDownScreen,
      game: GameScreen,
    };

    // this.activeScreen = "welcome";
    this.activeScreen = "selection";
    // this.activeScreen = "countdown";
  }
  get screen() {
    return new this.screens[this.activeScreen]({ manager: this });
  }
  init() {
    this.screen.show();
  }
  changeScreen(screen) {
    this.screen.hide();

    this.activeScreen = screen;
    this.screen.show();
  }
}

export default ScreenManager;
