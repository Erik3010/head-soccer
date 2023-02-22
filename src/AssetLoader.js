import {
  CHARACTER_STATES,
  CHARACTER_STATE_FRAME_MAP,
  COUNTRIES,
} from "./constants";
import { loadImage, padZero } from "./utility";

class AssetLoader {
  constructor({ backgroundType, ballType, player, opponent }) {
    this.assets = {
      background: null,
      ball: null,
      goal: null,
      goalText: null,
      diamondIce: null,
      decreaseBall: null,
      increaseBall: null,
      character: {
        player: null,
        opponent: null,
      },
      flag: {
        player: null,
        opponent: null,
      },
    };

    this.assetUrl = "./assets";
    this.characterAssetUrl = `${this.assetUrl}/Characters`;
    this.flagAssetUrl = `${this.assetUrl}/Flag`;

    this.backgroundType = backgroundType;
    this.ballType = ballType;
    this.player = player;
    this.opponent = opponent;

    this.assetFileName = {
      background: `${this.backgroundType}.jpg`,
      ball: `${this.ballType}.png`,
      goal: "Goal - Side.png",
      decreaseBall: "Decrease Ball.png",
      increaseBall: "Increase Ball.png",
      diamondIce: "Diamond Ice.png",
      goalText: "Goal - Text.png",
      scoreBar: "Score Bar.png",
    };
  }
  async loadAssets() {
    for (const name in this.assetFileName) {
      const assetUrl = `${this.assetUrl}/${this.assetFileName[name]}`;
      this.assets[name] = await loadImage(assetUrl);
    }

    this.assets.flag.player = await loadImage(
      `${this.flagAssetUrl}/${COUNTRIES[this.player].name}.png`
    );
    this.assets.flag.opponent = await loadImage(
      `${this.flagAssetUrl}/${COUNTRIES[this.opponent].name}.png`
    );

    const playerSprites = await this.loadCharacterSprite(this.player);
    const opponentSprites = await this.loadCharacterSprite(this.opponent);

    this.assets.character.player = playerSprites;
    this.assets.character.opponent = opponentSprites;
  }
  async loadCharacterSprite(character) {
    const images = {};

    for (const stateKey in CHARACTER_STATES) {
      const spriteState = CHARACTER_STATES[stateKey];
      const frameCount = CHARACTER_STATE_FRAME_MAP[spriteState];
      const { name, code } = COUNTRIES[character];

      images[spriteState] = [];

      for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
        const frameNumber = padZero(frameIndex);
        const spriteStateName = `${spriteState}_${frameNumber}`;
        const imagePath = `${this.characterAssetUrl}/Character ${code} - ${name}/${spriteState}/${spriteStateName}.png`;

        images[spriteState].push(await loadImage(imagePath));
      }
    }

    return images;
  }
}

export default AssetLoader;
