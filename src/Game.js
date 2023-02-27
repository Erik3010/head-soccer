import Background from "./elements/Background";
import FlagBoard from "./elements/FlagBoard";
import Character from "./elements/Character";
import Goal from "./elements/Goal";
import {
  BACKGROUND_TYPES,
  BALL_TYPES,
  CHARACTER_STATES,
  GAME_DURATION,
  MOVEMENT_DIRECTION_MAP,
} from "./constants";
import AssetLoader from "./AssetLoader";
import {
  clamp,
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
import ScoreBoard from "./elements/ScoreBoard";
import Text from "./engine/Text";
import GameOverDialog from "./dialogs/GameOverDialog";

class Game {
  constructor({ canvas, background, ball, player, opponent, username, level }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.selectedPlayer = { player, opponent };
    this.selectedBall = BALL_TYPES[ball];
    this.selectedBackground = BACKGROUND_TYPES[background];
    this.username = username;
    this.level = level;

    this.gameDuration = GAME_DURATION[this.level];
    this.startTimestamp = null;
    this.elapsedTime = 0;
    this.currentTime = this.gameDuration;

    this.character = { player: null, opponent: null };
    this.background = null;
    this.flagBoard = null;
    this.ball = null;
    this.goals = {};
    this.powerUpItems = [];

    this.goalText = null;
    this.scoreBoard = null;
    this.timerText = null;

    this.bottomGap = 70;

    this.isResetPosition = false;
    this.isSuddenDeath = false;
    this.score = { player: 0, opponent: 0 };

    this.assetLoader = new AssetLoader({
      backgroundType: this.selectedBackground,
      ballType: this.selectedBall,
      player: this.selectedPlayer.player,
      opponent: this.selectedPlayer.opponent,
    });

    this.characterRespawnPos = { x: 150, y: 100 };

    this.availablePowerUpItems = [
      DecreaseBallSizePowerUp,
      IncreaseBallSizePowerUp,
      DiamondIcePowerUp,
    ];
    this.isPowerUpActive = false;

    this.intervalIds = {
      spawnPowerUp: null,
      powerUpActivation: null,
      countDownTimer: null,
    };

    this.pause = false;

    this.gameOverDialog = new GameOverDialog();
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
    this.initScoreBoard();

    this.spawnPowerUpItem();

    this.initCountDownTimer();
    this.initTimerText();

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
      type: this.selectedBackground,
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
      y: 120,
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
  initScoreBoard() {
    this.scoreBoard = new ScoreBoard({ gameInstance: this, ctx: this.ctx });
  }
  initCountDownTimer() {
    const countDownCallback = () => {
      const second = Math.floor(this.elapsedTime / 1000);
      this.currentTime = this.gameDuration - second;

      if (this.currentTime === 0) {
        if (this.score.player === this.score.opponent) {
          this.isSuddenDeath = true;

          this.timerText.x -= 90;
          this.timerText.fontSize = 32;
        } else {
          this.stopGame();
        }
        clearTimeout(this.intervalIds.countDownTimer);
        this.intervalIds.countDownTimer = null;
        return;
      }

      this.intervalIds.countDownTimer = setTimeout(countDownCallback, 1000);
    };

    countDownCallback();
  }
  initTimerText() {
    this.timerText = new Text({
      ctx: this.ctx,
      x: this.canvas.width / 2 - 25,
      fontWeight: "bold",
      y: 165,
      fontSize: 48,
      color: "#225497",
      text: this.currentTime,
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

        // TODO: need to check is sudden death or no
        this.isResetPosition = true;
        if (this.isSuddenDeath) {
          this.stopGame();
          return;
        }

        this.resetPosition();
      }

      return;
    }

    this.handleBallCollisionDirection(goal, side);
  }
  stopGame() {
    // TODO: functionality to stop the game and show game over modal
    const stopGameHandler = () => {
      for (const key in this.intervalIds) {
        clearTimeout(this.intervalIds[key]);
      }

      this.pause = true;

      this.gameOverDialog.update({
        username: this.username,
        flag: this.selectedPlayer,
        score: this.score,
      });
      this.gameOverDialog.show();
    };

    setTimeout(stopGameHandler, 60);
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
      this.ball.y = 120;
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
    this.scoreBoard.draw();
    // this.timerText.draw(this.currentTime);
    this.timerText.draw();
    this.timerText.text = this.isSuddenDeath
      ? "Sudden Death"
      : this.currentTime;

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
  simulateOpponentBotMove() {
    const ballCenterX = this.ball.x + this.ball.width / 2;
    const opponentCenterX =
      this.character.opponent.x + this.character.opponent.width / 2;
    const distanceX = ballCenterX - opponentCenterX;

    const newVelocity = Number((distanceX * 0.05).toFixed());
    const maxSpeed = this.character.opponent.moveSpeed;

    const clampedNewVelocity = clamp(newVelocity, -maxSpeed, maxSpeed);
    this.character.opponent.velocity.x = clampedNewVelocity;
  }
  render(timestamp) {
    if (this.pause) return;

    if (this.startTimestamp === null) {
      this.startTimestamp = timestamp;
    }

    this.elapsedTime = timestamp - this.startTimestamp;

    const angle = mapValue(this.elapsedTime % 1000, 0, 1000, 0, 360);
    this.ball.angle = angle;

    this.simulateOpponentBotMove();

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.draw();
    requestAnimationFrame(this.render.bind(this));
  }
}

export default Game;
