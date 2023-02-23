import Screen from "./Screen";

class SelectionScreen extends Screen {
  constructor(options) {
    super({ selector: ".selection-screen", ...options });

    this.characters = [];
    this.tempIndex = 0;
  }
  init() {
    this.characters = Array(...document.querySelectorAll(".character-item"));

    for (const [index, character] of this.characters.entries()) {
      character.addEventListener(
        "click",
        this.characterClickHandler.bind(this, character, index)
      );
    }
  }
  characterClickHandler(character, index, event) {
    this.tempIndex = index;
    const wrapper = document.querySelector(".character-selection-wrapper");

    const activeCharacter = document.querySelector(".character-item.active");
    activeCharacter.classList.remove("active");

    if (index === this.characters.length - 3) {
      // do something if it's last character
      const offsetTop = character.clientHeight * (index - 1) - 50 * (index - 1);
      wrapper.style.transform = `translateY(-${offsetTop}px)`;

      setTimeout(() => {
        wrapper.style.transition = "none";
        wrapper.style.transform = `translateY(0px)`;
        this.characters[1].classList.add("active");

        setTimeout(
          () => (wrapper.style.transition = "transform .3s ease"),
          200
        );
      }, 300);

      return;
    }

    character.classList.add("active");

    const offsetTop = character.clientHeight * (index - 1) - 50 * (index - 1);
    wrapper.style.transform = `translateY(-${offsetTop}px)`;
  }
}

export default SelectionScreen;
