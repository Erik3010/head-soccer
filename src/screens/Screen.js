class Screen {
  constructor({ selector, manager }) {
    this.selector = selector;

    this.screen = document.querySelector(this.selector);
    this.manager = manager;
  }
  init() {}
  show() {
    if (this.screen.classList.contains("hide")) {
      this.screen.classList.remove("hide");
    }

    this.screen.classList.add("show");
    this.init();
  }
  hide() {
    if (this.screen.classList.contains("show")) {
      this.screen.classList.remove("show");
    }

    this.screen.classList.add("hide");
  }
}

export default Screen;
