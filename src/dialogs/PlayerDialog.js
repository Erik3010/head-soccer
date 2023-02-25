import Dialog from "./Dialog";

class PlayerDialog extends Dialog {
  constructor(options) {
    super({ selector: "#player-dialog", ...options });
  }
  init() {
    super.init();

    const btnDialogNext = document.querySelector(".btn-dialog-next");
    btnDialogNext.addEventListener("click", async () => {
      if (!this.canClose()) return;

      await this.hide();
      this.onConfirm();
    });
  }
}

export default PlayerDialog;
