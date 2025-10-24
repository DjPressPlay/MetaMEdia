// ===============================
// 🎮 GAME CONTROLLER v3 — MetaMeda
// ===============================

import { PlayerHUD } from "./playerHUD.js";
import { Messenger } from "./messenger.js";

export class GameController {
  constructor() {
    console.log("✅ MetaMeda GameController initialized");

    // ====== 🎯 PLAYER STATE ======
    this.state = {
      postPoints: 0,   // main currency / quest tokens
      clout: 0,        // XP / influence growth
      followers: 0,    // number of followers
      likes: 0,        // total likes across posts
      socialRank: 1,   // overall rank in the MetaMeda world
      quest: 0,        // quest number or stage
      messages: []     // logs or conversation history
    };

    // ====== 🧩 CORE MODULES ======
    this.hud = new PlayerHUD(this);
    this.messenger = new Messenger(this);

    // ====== 🧠 EVENT REGISTRY ======
    this.events = {
      onPostMade: (likes = 0) => this.handlePostMade(likes),
      onFollowerGain: (count = 1) => this.handleFollowerGain(count),
      onQuestAdvance: () => this.handleQuestAdvance(),
      onCloutGain: (amount = 5) => this.handleCloutGain(amount),
      onRankUp: () => this.handleRankUp(),
      onMessage: (text) => this.handleMessage(text)
    };

    // initial draw
    this.hud.update(this.state);
  }

  // ===========================
  // 🎮 HANDLERS / GAME LOGIC
  // ===========================

  handlePostMade(likes) {
    this.state.postPoints += 5;
    this.state.likes += likes;
    this.state.clout += 2;
    this.messenger.display(`🧠 Post uploaded — +5 post points, +${likes} likes!`);
    this.hud.update(this.state);
  }

  handleFollowerGain(count) {
    this.state.followers += count;
    this.messenger.display(`👥 You gained ${count} new followers!`);
    this.hud.update(this.state);
  }

  handleQuestAdvance() {
    this.state.quest += 1;
    this.state.postPoints += 10;
    this.messenger.display(`📜 Quest advanced to stage ${this.state.quest}!`);
    this.hud.update(this.state);
  }

  handleCloutGain(amount) {
    this.state.clout += amount;
    this.messenger.display(`⭐ Clout +${amount}`);
    this.hud.update(this.state);
  }

  handleRankUp() {
    this.state.socialRank += 1;
    this.messenger.display(`🚀 Rank Up! Now Level ${this.state.socialRank}`);
    this.hud.update(this.state);
  }

  handleMessage(text) {
    this.state.messages.push(text);
    this.messenger.display(text);
  }

  // ===========================
  // ⚙️ GENERAL INTERFACE
  // ===========================

  updateHUD(data) {
    this.state = { ...this.state, ...data };
    this.hud.update(this.state);
  }

  sendMessage(text) {
    this.messenger.display(text);
  }

  tick() {
    // Placeholder for frame or timed updates
  }
}

// Auto-init global controller
window.GameCon = new GameController();
