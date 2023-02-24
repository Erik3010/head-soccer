class CharacterSelection {
  constructor(selector) {
    this.selector = selector;
    this.el = document.querySelector(this.selector);
    this.characters = [];

    this.init();
  }
  init() {
    this.characters = [...this.el.querySelectorAll(".character-item")];

    for (const [index, character] of this.characters.entries()) {
      character.addEventListener(
        "click",
        this.handleCharacterClick.bind(this, character, index)
      );
    }
  }
  handleCharacterClick(character, index) {
    const wrapper = this.el.querySelector(".character-selection-wrapper");

    const activeCharacter = this.el.querySelector(".character-item.active");
    activeCharacter.classList.remove("active");

    if (index === 0 || index === this.characters.length - 1) {
      wrapper.style.transition = "none";

      const map = {
        0: { distanceFromTop: character.clientHeight * 7 - 50 * 7, order: 8 },
        [this.characters.length - 1]: { distanceFromTop: 0, order: 1 },
      };

      const { distanceFromTop, order } = map[index];
      wrapper.style.transform = `translateY(-${distanceFromTop}px)`;
      this.characters[order].classList.add("active");

      setTimeout(() => (wrapper.style.transition = ".3s ease"));
      return;
    }

    character.classList.add("active");

    const offsetTop = character.clientHeight * (index - 1) - 50 * (index - 1);
    wrapper.style.transform = `translateY(-${offsetTop}px)`;
  }
}

export default CharacterSelection;
