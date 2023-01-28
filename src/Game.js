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
import {
  collidedSide,
  isAllowedKey,
  isCollide,
  isJumpKey,
  isKickKey,
  isMovementKey,
  mapValue,
  random,
} from "./utility";
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

    this.startTimestamp = null;

    this.background = null;
    this.flagBoard = null;
    this.ball = null;
    // this.goals = [];
    this.goals = {};
    this.character = {
      player: null,
      opponent: null,
    };

    this.bottomGap = 70;

    this.score = {
      player: 0,
      opponent: 0,
    };

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
    }, 2500);

    this.registerEventHandler();

    requestAnimationFrame(this.render.bind(this));
    // this.render();
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
      x: this.canvas.width - width - 350,
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

    const left = new Goal({ ...params, x: 50, y: 260, side: "left" });
    const right = new Goal({
      ...params,
      x: this.canvas.width - width / goalScale - 50,
      y: 260,
      isFlip: true,
      side: "right",
    });

    this.goals = { left, right };
    // this.goals = [left, right];
  }
  initBall() {
    const { width: originalWidth, height: originalHeight } =
      this.assetLoader.assets.ball;
    const ballScale = 2.5;
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
  handleCharacterCollideWithBall(side) {
    const force = { x: random(8, 15), y: random(8, 15) };

    if (side === "left") {
      force.x *= -1;
      force.y *= -1;
    } else if (side === "top") {
      force.y *= -1;
    }

    this.ball.velocity.x = force.x;
    this.ball.velocity.y = force.y;
  }
  handleBallCollisionDirection(goal, side) {
    let force = 10;

    const isHittingUpperPart = side === "top" && !goal.isGoal;

    if (isHittingUpperPart) {
      force *= -1;
    } else if (goal.side === "right") {
      force *= -1;
    }

    this.ball.velocity.x = force;
    this.ball.velocity.y = force;

    goal.isGoal = false;
  }
  handleBallCollideWithGoals(goal, side) {
    if (
      (goal.side === "left" && side === "right") ||
      (goal.side === "right" && side === "left")
    ) {
      goal.isGoal = true;
      return;
    }

    this.handleBallCollisionDirection(goal, side);

    // if (goalSide === "left") {
    //   if (side === "right") {
    //     // goal.isGoal === false && this.score.opponent++;
    //     goal.isGoal = true;
    //   } else {
    //     if (side === "top" && !goal.isGoal) {
    //       force.x *= -1;
    //       force.y *= -1;
    //     }
    //     this.ball.velocity.x = force.x;
    //     this.ball.velocity.y = force.y;

    //     goal.isGoal = false;
    //   }
    // } else if (goalSide === "right") {
    //   if (side === "left") {
    //     goal.isGoal = true;
    //   } else {
    //     if (side === "top" && !goal.isGoal) {
    //       force.x *= -1;
    //       force.y *= -1;
    //     }
    //     this.ball.velocity.x = force.x;
    //     this.ball.velocity.y = force.y;

    //     goal.isGoal = false;
    //   }
    // }
  }
  draw() {
    this.background.draw();
    this.flagBoard.draw();

    this.character.player.draw();
    this.character.opponent.draw();
    this.ball.draw();

    for (const key of Object.keys(this.goals)) {
      const goal = this.goals[key];
      goal.draw();

      if (isCollide(goal, this.ball)) {
        const side = collidedSide(goal, this.ball);
        this.handleBallCollideWithGoals(goal, side);
      }
    }

    for (const characterType in this.character) {
      const character = this.character[characterType];
      if (isCollide(character, this.ball)) {
        const side = collidedSide(character, this.ball);
        this.handleCharacterCollideWithBall(side);
      }
    }
  }
  render(timestamp) {
    if (this.startTimestamp === null) {
      this.startTimestamp = timestamp;
    }

    const elapsed = timestamp - this.startTimestamp;
    const time = Math.floor(elapsed / 1000);
    const angle = mapValue(elapsed % 1000, 0, 1000, 0, 360);
    this.ball.angle = angle;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw();
    requestAnimationFrame(this.render.bind(this));
  }
}

export default Game;
