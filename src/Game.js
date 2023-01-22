import Background from "./elements/Background";
import FlagBoard from "./elements/FlagBoard";
import Character from "./elements/Character";
import Goal from "./elements/Goal";
import {
  BACKGROUND_TYPES,
  BALL_TYPES,
  CHARACTER_STATES,
  MOVEMENT_DIRECTION_MAP,
} from "./constants";
import AssetLoader from "./AssetLoader";
import { isAllowedKey, isJumpKey, isKickKey, isMovementKey } from "./utility";
import Ball from "./elements/Ball";

class Game {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.selectedPlayer = {
      player: "japan",
      opponent: "germany",
    };
    this.selectedBall = null;
    this.selectedBackground = null;

    this.background = null;
    this.flagBoard = null;
    this.ball = null;
    this.goals = [];
    this.character = {
      player: null,
      opponent: null,
    };

    this.bottomGap = 70;

    this.assetLoader = new AssetLoader({
      backgroundType: BACKGROUND_TYPES.general,
      ballType: BALL_TYPES.general,
      player: this.selectedPlayer.player,
      opponent: this.selectedPlayer.opponent,
    });
  }
  async init() {
    await this.assetLoader.loadAssets();

    this.initBackground();
    this.initCharacter();
    this.initGoals();
    this.initBall();

    // dummy code
    setInterval(() => {
      this.character.opponent.kick();
    }, 2000);

    this.registerEventHandler();

    this.render();
  }
  registerEventHandler() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }
  handleKeyDown(event) {
    if (!isAllowedKey(event.code)) return;

    if (isMovementKey(event.code)) {
      this.character.player.move(MOVEMENT_DIRECTION_MAP[event.code]);
    } else if (isJumpKey(event.code)) {
      this.character.player.jump();
    } else if (isKickKey(event.code)) {
      this.character.player.kick();
    }
  }
  handleKeyUp(event) {
    if (!isAllowedKey(event.code)) return;

    if (isMovementKey(event.code)) {
      this.character.player.stopMove();
    }
  }
  initBackground() {
    this.background = new Background({
      ctx: this.ctx,
      width: this.canvas.width,
      height: this.canvas.height,
      type: BACKGROUND_TYPES.general,
      image: this.assetLoader.assets.background,
    });

    this.flagBoard = new FlagBoard({
      ctx: this.ctx,
      x: 0,
      y: 380,
      height: 60,
      width: 100,
      flagImage: this.assetLoader.assets.flag,
    });
  }
  initCharacter() {
    const { width: originalWidth, height: originalHeight } =
      this.assetLoader.assets.character.player[CHARACTER_STATES.idle][0];

    const characterScale = 2.3;
    const { width, height } = {
      width: originalWidth / characterScale,
      height: originalHeight / characterScale,
    };

    const params = {
      width,
      height,
      gameInstance: this,
      ctx: this.ctx,
    };

    this.character.player = new Character({
      ...params,
      x: 150,
      y: 100,
      sprites: this.assetLoader.assets.character.player,
    });
    this.character.opponent = new Character({
      ...params,
      x: this.canvas.width - width - 150,
      y: 100,
      isFlip: true,
      sprites: this.assetLoader.assets.character.opponent,
    });
  }
  initGoals() {
    const { width, height } = this.assetLoader.assets.goal;
    const goalScale = 1.5;

    const params = {
      ctx: this.ctx,
      width: width / goalScale,
      height: height / goalScale,
      image: this.assetLoader.assets.goal,
    };

    const left = new Goal({ ...params, x: 50, y: 260 });
    const right = new Goal({
      ...params,
      x: this.canvas.width - width / goalScale - 50,
      y: 260,
      isFlip: true,
    });

    this.goals = [left, right];
  }
  initBall() {
    const { width: originalWidth, height: originalHeight } =
      this.assetLoader.assets.ball;
    const ballScale = 2;
    const { width, height } = {
      width: originalWidth / ballScale,
      height: originalHeight / ballScale,
    };

    this.ball = new Ball({
      width,
      height,
      gameInstance: this,
      ctx: this.ctx,
      x: this.canvas.width / 2 - width / 2,
      y: 70,
      image: this.assetLoader.assets.ball,
    });
  }
  draw() {
    this.background.draw();
    this.flagBoard.draw();

    this.character.player.draw();
    this.character.opponent.draw();
    this.ball.draw();

    for (const goal of this.goals) {
      goal.draw();
    }
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw();
    requestAnimationFrame(this.render.bind(this));
  }
}

export default Game;
