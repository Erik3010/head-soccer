import "../css/style.css";
import Game from "./Game";
import ScreenManager from "./ScreenManager";

const screenManager = new ScreenManager();
screenManager.init();

const canvas = document.querySelector("#canvas");
const game = new Game({ canvas });
game.init();
