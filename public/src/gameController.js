// ===============================
// 🎮 GAME CONTROLLER OBJECT
// ===============================

// Imports
import { PlayerHUD } from "./playerHUD.js";
import { Messenger } from "./messenger.js";

export class GameController {
  constructor() {
    // Initialize core systems
    this.hud = new PlayerHUD(this);
    this.messenger = new Messenger(this);

    // Global game state
    this.state = {
      score: 0,
      health: 100,
      messages: []
    };

    console.log("✅ GameController initialized");
  }

  // Example: update player HUD
  updateHUD(data) {
    this.state = { ...this.state, ...data };
    this.hud.update(this.state);
  }

  // Example: send a message
  sendMessage(text) {
    this.messenger.display(text);
  }

  // Example: main loop tick or input handling
  tick() {
    // Future: add logic for updates, input, etc.
  }
}

// Optional auto-init
window.GameCon = new GameController();
