import "../css/style.css";
import Game from "./Game";

const canvas = document.querySelector("#canvas");

const game = new Game({ canvas });
game.init();
