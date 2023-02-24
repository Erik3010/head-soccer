import Dialog from "./Dialog";

class PlayerDialog extends Dialog {
  constructor(options) {
    super({ selector: "#player-dialog", ...options });
  }
  init() {
    super.init();

    const btnDialogNext = document.querySelector(".btn-dialog-next");
    btnDialogNext.addEventListener("click", async () => {
      await this.hide();

      console.log("dialog closed");
    });
  }
}

export default PlayerDialog;
