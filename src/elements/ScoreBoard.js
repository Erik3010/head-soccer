import Drawable from "../engine/Drawable";
import Text from "../engine/Text";

class ScoreBoard extends Drawable {
  constructor({ gameInstance, ...options }) {
    super(options);

    this.game = gameInstance;
    this.scoreText = { player: null, opponent: null };

    this.init();
  }
  init() {
    const { player, opponent } = this.game.score;
    const screenCenterX = this.game.width / 2;
    const params = {
      ctx: this.ctx,
      y: 85,
      fontSize: 42,
      fontWeight: "bold",
      color: "#fff",
    };

    this.scoreText.player = new Text({
      ...params,
      text: player,
      x: screenCenterX - 85,
    });
    this.scoreText.opponent = new Text({
      ...params,
      text: opponent,
      x: screenCenterX + 60,
    });
  }
  drawFlag(type) {
    const { flag: flags, scoreBar } = this.game.assetLoader.assets;
    const flag = flags[type];

    const centerX = this.game.width / 2;
    const scoreBarWidth = scoreBar.width / 2;
    const gap = { x: 20, y: 20 };
    const scale = 0.6;

    const xAxisMap = {
      player: centerX - flag.width * scale - scoreBarWidth - gap.x,
      opponent: centerX + scoreBarWidth + gap.x,
    };

    this.ctx.drawImage(
      flag,
      xAxisMap[type],
      gap.y,
      flag.width * scale,
      flag.height * scale
    );
  }
  draw() {
    const { scoreBar } = this.game.assetLoader.assets;
    const centerX = this.game.width / 2 - scoreBar.width / 2;

    this.ctx.drawImage(scoreBar, centerX, 30, scoreBar.width, scoreBar.height);

    for (const characterType in this.scoreText) {
      this.scoreText[characterType].draw(this.game.score[characterType]);
      this.drawFlag(characterType);
    }
  }
}

export default ScoreBoard;
