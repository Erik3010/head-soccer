import PlayerDialog from "../dialogs/PlayerDialog";
import CharacterSelection from "./CharacterSelection";
import Screen from "./Screen";

class SelectionScreen extends Screen {
  constructor(options) {
    super({ selector: ".selection-screen", ...options });

    this.playerCharacterSelection = new CharacterSelection("#player-character");
    this.opponentCharacterSelection = new CharacterSelection(
      "#opponent-character"
    );

    this.playerDialog = new PlayerDialog({
      isOpen: false,
      onConfirm: this.onConfirmDialog.bind(this),
      canClose: () => !!this.usernameField.value,
    });

    this.usernameField = document.querySelector("#username");
  }
  init() {
    super.init();

    const btnNext = document.querySelector(".btn-next");
    btnNext.addEventListener("click", this.nextHandler.bind(this));
  }
  async nextHandler() {
    // this.manager.changeScreen("welcome");
    await this.playerDialog.show();
  }
  onConfirmDialog() {
    this.manager.changeScreen("countdown");
  }
}

export default SelectionScreen;
