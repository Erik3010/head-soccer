import Drawable from "./Drawable";

class Text extends Drawable {
  constructor({
    x,
    y,
    fontFamily = "Arial",
    fontSize = 16,
    fontWeight = "normal",
    color = "#000",
    text,
    ...options
  }) {
    super(options);

    this.x = x;
    this.y = y;
    this.text = text;

    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.color = color;
  }
  draw(newText = null) {
    this.ctx.save();
    this.ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    this.ctx.fillStyle = this.color;
    // this.ctx.fillText(newText ?? this.text, this.x, this.y);
    this.ctx.fillText(this.text, this.x, this.y);
    this.ctx.restore();
  }
}

export default Text;
