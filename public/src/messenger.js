// ===============================
// 💬 MESSENGER SYSTEM — MetaMeda
// ===============================

import { InfoBox } from "./components/InfoBox.js";
import { JessicaBox } from "./components/JessicaBox.js";
import { KiroBox } from "./components/KiroBox.js";
import { WinBox } from "./components/WinBox.js";
import { TextBox } from "./components/TextBox.js";

export class Messenger {
  constructor(game) {
    this.game = game;
    console.log("✅ Messenger initialized");

    // Root container
    this.container = document.createElement("div");
    this.container.className = "messenger";
    document.body.appendChild(this.container);

    // ===== BOX COMPONENTS =====
    this.infoBox = new InfoBox(this.container);
    this.jessicaBox = new JessicaBox(this.container);
    this.kiroBox = new KiroBox(this.container);
    this.winBox = new WinBox(this.container);
    this.textBox = new TextBox(this.container);

    // default active channel
    this.activeBox = this.textBox;
  }

  // ===============================
  // 🎯 METHODS
  // ===============================

  // Send to active box
  display(text) {
    if (this.activeBox && typeof this.activeBox.show === "function") {
      this.activeBox.show(text);
    } else {
      console.warn("Messenger: activeBox has no show() method");
    }
  }

  // switch between text channels
  setActive(channel) {
    switch (channel) {
      case "info":     this.activeBox = this.infoBox; break;
      case "jessica":  this.activeBox = this.jessicaBox; break;
      case "kiro":     this.activeBox = this.kiroBox; break;
      case "win":      this.activeBox = this.winBox; break;
      case "text":
      default:         this.activeBox = this.textBox; break;
    }
    console.log(`🪶 Messenger switched to ${channel} channel`);
  }

  // quick shortcuts
  info(text) { this.setActive("info"); this.display(text); }
  jessica(text) { this.setActive("jessica"); this.display(text); }
  kiro(text) { this.setActive("kiro"); this.display(text); }
  win(text) { this.setActive("win"); this.display(text); }
  text(text) { this.setActive("text"); this.display(text); }
}
