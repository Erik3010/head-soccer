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
import DecreaseBallSizePowerUp from "./elements/PowerUpItem/DecreaseBallSize";
import IncreaseBallSizePowerUp from "./elements/PowerUpItem/IncreaseBallSize";
import DiamondIcePowerUp from "./elements/PowerUpItem/DiamondIce";
import GoalText from "./elements/GoalText";

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
    this.powerUpItems = [];
    this.character = {
      player: null,
      opponent: null,
    };
    this.goalText = null;

    this.bottomGap = 70;

    this.isResetPosition = false;
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

    this.characterRespawnPos = {
      x: 150,
      y: 100,
    };

    this.availablePowerUpItems = [
      DecreaseBallSizePowerUp,
      IncreaseBallSizePowerUp,
      DiamondIcePowerUp,
    ];

    this.isPowerUpActive = false;
    this.intervalIds = {
      spawnPowerUp: null,
      powerUpActivation: null,
    };
  }
  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  async init() {
    await this.assetLoader.loadAssets();

    this.initBackground();
    this.initCharacter();
    this.initGoals();
    this.initBall();
    this.initGoalText();

    this.spawnPowerUpItem();

    // dummy code
    setInterval(() => {
      this.character.opponent.kick();
    }, 2500);

    this.registerEventHandler();

    requestAnimationFrame(this.render.bind(this));
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
      width: this.width,
      height: this.height,
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
      x: this.characterRespawnPos.x,
      y: this.characterRespawnPos.y,
      sprites: this.assetLoader.assets.character.player,
    });
    this.character.opponent = new Character({
      ...params,
      x: this.width - width - this.characterRespawnPos.x,
      y: this.characterRespawnPos.y,
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
      x: this.width - width / goalScale - 50,
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
      x: this.width / 2 - width / 2,
      y: 70,
      image: this.assetLoader.assets.ball,
    });
  }
  initGoalText() {
    const scale = 0.4;
    const { width, height } = this.assetLoader.assets.goalText;

    this.goalText = new GoalText({
      scale,
      gameInstance: this,
      ctx: this.ctx,
      x: (this.width - width * scale) / 2,
      y: (this.height - height * scale) / 2,
      width: width * scale,
      height: height * scale,
      image: this.assetLoader.assets.goalText,
    });
  }
  spawnPowerUpItem() {
    const powerUpItem = this.generatePowerUpItem();
    this.powerUpItems.push(powerUpItem);

    this.intervalIds.spawnPowerUp = setTimeout(
      this.spawnPowerUpItem.bind(this),
      1000
    );
  }
  generatePowerUpItem() {
    const size = 50;

    const randomIndex = random(0, this.availablePowerUpItems.length - 1);
    const PowerUpItem = this.availablePowerUpItems[randomIndex];
    const randomXPosition = random(size, this.width - size);

    return new PowerUpItem({
      gameInstance: this,
      ctx: this.ctx,
      x: randomXPosition,
      y: -size,
      width: size,
      height: size,
    });
  }
  handleCharacterCollideWithBall(side) {
    const force = { x: random(8, 15), y: random(8, 15) };

    if (this.ball.isFreezeBall) return;

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

      const scoreMap = {
        left: "opponent",
        right: "player",
      };
      if (!this.isResetPosition) {
        this.score[scoreMap[goal.side]]++;
        this.isResetPosition = true;
        this.resetPosition();
      }

      return;
    }

    this.handleBallCollisionDirection(goal, side);
  }
  resetPosition() {
    this.goalText.show();

    const setInitialVelocity = () => {
      this.character.player.velocity = { x: 0, y: 0 };
      this.character.opponent.velocity = { x: 0, y: 0 };
      this.ball.velocity = { x: 0, y: 0 };
    };

    const resetCharacterPosition = () => {
      const { x, y } = this.characterRespawnPos;
      const { width: opponentWidth } = this.character.opponent;

      this.character.player.x = x;
      this.character.player.y = y;

      this.character.opponent.x = this.width - opponentWidth - x;
      this.character.opponent.y = y;
    };

    const resetBallPosition = () => {
      this.ball.x = this.width / 2 - this.ball.width / 2;
      this.ball.y = 70;
    };

    const reset = () => {
      this.isResetPosition = false;

      this.powerUpItems = [];

      setInitialVelocity();
      resetCharacterPosition();
      resetBallPosition();

      this.goalText.hide();

      this.ball.resetToDefaultSize();

      // reset if ball freezed
      if (this.ball.isFreezeBall) {
        this.ball.unFreezeBall();
        this.isPowerUpActive = false;
        clearTimeout(this.intervalIds.powerUpActivation);
        this.intervalIds.powerUpActivation = null;
      }
    };

    setTimeout(reset, 2000);
  }
  draw() {
    this.background.draw();
    this.flagBoard.draw();

    this.character.player.draw();
    this.character.opponent.draw();
    this.ball.draw();
    this.goalText.draw();

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

    for (const [index, powerUpItem] of this.powerUpItems.entries()) {
      powerUpItem.draw();
      if (isCollide(powerUpItem, this.ball) && !this.isResetPosition) {
        powerUpItem.activatePowerUp();
        this.powerUpItems.splice(index, 1);
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

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.draw();
    requestAnimationFrame(this.render.bind(this));
  }
}

export default Game;
