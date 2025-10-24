// ===============================
// 💬 MESSENGER MODULE
// ===============================

export class Messenger {
  constructor(game) {
    this.game = game;
    this.container = document.createElement("div");
    this.container.className = "messenger";
    document.body.appendChild(this.container);
  }

  display(text) {
    const msg = document.createElement("div");
    msg.className = "message";
    msg.textContent = text;
    this.container.appendChild(msg);

    // optional fade/remove
    setTimeout(() => msg.remove(), 5000);
  }
}
