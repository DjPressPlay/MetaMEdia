import { TextBox } from "./components/TextBox.js";

export class Messenger {
  constructor(game) {
    this.game = game;
    this.container = document.createElement("div");
    this.container.className = "messenger";
    document.body.appendChild(this.container);

    // internal text handler
    this.textBox = new TextBox(this.container);
  }

  display(text) {
    this.textBox.show(text);
  }
}
