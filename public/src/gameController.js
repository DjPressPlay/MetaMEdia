// ===============================
// 🎮 GAME CONTROLLER v5 — MetaMeda (Reddit DevKit)
// ===============================

import { PlayerHUD } from "./playerHUD.js";
import { Messenger } from "./messenger.js";

export class GameController {
  constructor() {
    console.log("🚀 MetaMeda GameController — Reddit DevKit Mode");

    // ===== 🎯 PLAYER STATE =====
    this.state = {
      postPoints: 0,    // quest tokens / currency
      clout: 0,         // XP / reputation
      followers: 0,     // audience size
      likes: 0,         // cumulative likes
      rankBadge: "assets/ranks/newbie.png", // visual rank icon
      quest: 0,         // current quest id
      messages: []      // log history
    };

    // ===== 🧩 CORE SYSTEMS =====
    this.hud = new PlayerHUD(this);
    this.messenger = new Messenger(this);

    // ===== 🧭 QUEST DATA =====
    this.quests = [
      { id: 1, name: "Tutorial Post", trigger: "onPostMade", text: "Make your first post on Meta Reddit." },
      { id: 2, name: "Phone Key", trigger: "onPhoneOpen", text: "Enter the key your phone shows you." },
      { id: 3, name: "Job Offer", trigger: "onMessageRead", text: "Reply to your first job offer from Jessica." },
      { id: 4, name: "First Job Post", trigger: "onPostMade", text: "Post under your job category." },
      { id: 5, name: "Answer Phone", trigger: "onPhoneCall", text: "Answer Jessica’s call." },
      { id: 6, name: "SignalZ Intro", trigger: "onSignalZOpen", text: "Learn about SignalZ from Jessica." },
      { id: 7, name: "Meet Kiro", trigger: "onPhotoLiked", text: "Like the tutorial photo to meet Kiro." },
      { id: 8, name: "Work With Kiro", trigger: "onSignalZPost", text: "Help Kiro with SignalZ tasks." },
      { id: 9, name: "MMRR Invite", trigger: "onMessageRead", text: "You’re invited to MMRR Con!" },
      { id:10, name: "Final Prep", trigger: "onCameraOpen", text: "Rank up and earn ticket money for MMRR Con." }
    ];

    // ===== 🧠 EVENT REGISTRY =====
    this.events = {
      onPCOpen: () => this.triggerEvent("onPCOpen"),
      onPhoneOpen: () => this.triggerEvent("onPhoneOpen"),
      onClosetOpen: () => this.triggerEvent("onClosetOpen"),
      onMessageRead: () => this.triggerEvent("onMessageRead"),
      onPhoneCall: () => this.triggerEvent("onPhoneCall"),
      onSignalZOpen: () => this.triggerEvent("onSignalZOpen"),
      onSignalZPost: () => this.triggerEvent("onSignalZPost"),
      onPhotoLiked: () => this.triggerEvent("onPhotoLiked"),
      onCameraOpen: () => this.triggerEvent("onCameraOpen"),
      onPostMade: (likes = 0) => this.handlePostMade(likes)
    };

    // ===== 🏁 INITIAL SETUP =====
    this.hud.update(this.state);
    this.messenger.info("Welcome to MetaMeda — click your PC to begin.");
  }

  // =====================================================
  // 🎯 EVENT / QUEST CORE
  // =====================================================

  triggerEvent(eventName) {
    console.log(`📡 Trigger: ${eventName}`);
    const quest = this.quests.find(q => q.id === this.state.quest + 1 && q.trigger === eventName);
    if (quest) {
      this.startQuest(quest);
    } else {
      this.handleAmbientEvent(eventName);
    }
  }

  startQuest(quest) {
    this.state.quest = quest.id;
    this.messenger.info(`📜 Quest ${quest.id}: ${quest.text}`);
    this.hud.update(this.state);
  }

  handleAmbientEvent(eventName) {
    switch (eventName) {
      case "onPCOpen":
        this.messenger.info("💻 Zetsu Online loaded.");
        break;
      case "onPhoneOpen":
        this.messenger.info("📱 Phone interface opened.");
        break;
      case "onClosetOpen":
        this.messenger.info("👕 Closet unlocked.");
        break;
      default:
        break;
    }
  }

  // =====================================================
  // 🧩 GAMEPLAY HANDLERS
  // =====================================================

  handlePostMade(likes = 0) {
    // scaled for leaderboard
    this.state.postPoints += 100;
    this.state.likes += likes;
    this.state.clout += 500; // clout now measured in 1000s-scale increments
    this.hud.update(this.state);
    this.messenger.text(`🧠 Post uploaded — +100 post points, +${likes} likes, +500 clout.`);
    this.triggerEvent("onPostMade");
  }

  handleFollowerGain(count = 10) {
    this.state.followers += count;
    this.hud.update(this.state);
    this.messenger.info(`👥 +${count} followers`);
  }

  handleRankUp(newBadge) {
    if (newBadge) this.state.rankBadge = newBadge;
    this.hud.update(this.state);
    this.messenger.win(`🚀 Rank Up! Your badge has evolved!`);
  }

  handleMessage(text) {
    this.state.messages.push(text);
    this.messenger.text(text);
  }

  // =====================================================
  // 🧱 UTILITY
  // =====================================================

  updateHUD(data) {
    this.state = { ...this.state, ...data };
    this.hud.update(this.state);
  }

  tick() {
    // Reddit DevKit update loop hooks go here later
  }
}

// Global init (Reddit DevKit entry point)
window.MetaMeda = new GameController();
