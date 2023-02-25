class Dialog {
  constructor({
    selector,
    isOpen = false,
    canClose = () => true,
    onConfirm = () => {},
  }) {
    this.selector = selector;
    this.el = document.querySelector(this.selector);
    this.isOpen = isOpen;
    this.isAnimating = false;
    this.canClose = canClose;
    this.onConfirm = onConfirm;

    this.modalEl = this.el.querySelector(".modal");

    this.init();
  }
  init() {
    if (!this.isOpen) {
      this.el.classList.add("hide");
    } else {
      this.el.classList.remove("hide");
      this.el.classList.add("show");
    }
  }
  async show() {
    if (this.isAnimating) return;

    return new Promise((resolve) => {
      if (this.el.classList.contains("hide")) {
        this.el.classList.remove("hide");
      }

      this.isOpen = true;

      this.el.classList.add("show");
      this.modalEl.classList.add("modal-show");
      this.isAnimating = true;

      const animationEndHandler = () => {
        this.handleEndAnimation();
        this.modalEl.removeEventListener("animationend", animationEndHandler);
        return resolve();
      };
      this.modalEl.addEventListener("animationend", animationEndHandler);
    });
  }
  hide() {
    if (this.isAnimating) return;

    return new Promise((resolve) => {
      if (this.el.classList.contains("show")) {
        this.el.classList.remove("show");
      }

      this.isOpen = false;
      this.modalEl.classList.add("modal-disapear");
      this.isAnimating = true;

      const animationEndHandler = () => {
        this.handleEndAnimation();
        this.modalEl.removeEventListener("animationend", animationEndHandler);
        return resolve();
      };
      this.modalEl.addEventListener("animationend", animationEndHandler);
    });
  }
  handleEndAnimation() {
    if (this.isOpen) {
      this.modalEl.classList.remove("modal-show");
    } else {
      this.modalEl.classList.remove("modal-disapear");
      this.el.classList.add("hide");
    }

    this.isAnimating = false;
  }
}

export default Dialog;
