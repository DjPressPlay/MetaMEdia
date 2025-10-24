// ===============================
// 🧠 QUEST MANAGER — MetaMeda (v4)
// 🏅 Rank uses badge images, not numbers
// ===============================

export class QuestManager {
  constructor(game) {
    this.game = game;
    this.active = null;
    this.completed = [];

    // === 🏅 SOCIAL RANK BADGE MAP ===
    this.rankBadges = {
      1: "assets/ranks/newbie.png",
      2: "assets/ranks/poster.png",
      3: "assets/ranks/creator.png",
      4: "assets/ranks/influencer.png",
      5: "assets/ranks/legend.png"
    };

    // === MAIN QUESTLINE ===
    this.quests = [
      {
        id: 1,
        name: "Tutorial Post",
        trigger: "onPostMade",
        speaker: "info",
        text: "Make your first post on Meta Reddit.",
        reward: { postPoints: 100, clout: 500 }
      },
      {
        id: 2,
        name: "Phone Key",
        trigger: "onPhoneOpen",
        speaker: "info",
        text: "Enter the key your phone shows you.",
        reward: { postPoints: 150, clout: 700 }
      },
      {
        id: 3,
        name: "Job Offer",
        trigger: "onMessageRead",
        speaker: "jessica",
        text: "Reply to Jessica's job offer.",
        reward: { clout: 1200, followers: 50 }
      },
      {
        id: 4,
        name: "Job Post",
        trigger: "onPostMade",
        speaker: "info",
        text: "Post under your job category.",
        reward: { postPoints: 300, clout: 1500 }
      },
      {
        id: 5,
        name: "Answer the Phone",
        trigger: "onPhoneCall",
        speaker: "jessica",
        text: "Pick up the phone to talk to Jessica.",
        reward: { clout: 2000, followers: 100 }
      },
      {
        id: 6,
        name: "SignalZ Intro",
        trigger: "onSignalZOpen",
        speaker: "jessica",
        text: "Learn about SignalZ with Jessica.",
        reward: { postPoints: 400, clout: 2500 }
      },
      {
        id: 7,
        name: "Meet Kiro",
        trigger: "onPhotoLiked",
        speaker: "kiro",
        text: "Like the tutorial photo to meet Kiro.",
        reward: { clout: 3000, followers: 200 }
      },
      {
        id: 8,
        name: "Work With Kiro",
        trigger: "onSignalZPost",
        speaker: "kiro",
        text: "Assist Kiro with a SignalZ project.",
        reward: { postPoints: 500, clout: 3500, followers: 250 }
      },
      {
        id: 9,
        name: "MMRR Invite",
        trigger: "onMessageRead",
        speaker: "info",
        text: "You've been invited to MMRR Con!",
        reward: { clout: 5000, rankBadge: 2 }
      },
      {
        id: 10,
        name: "Final Prep",
        trigger: "onCameraOpen",
        speaker: "info",
        text: "Rank up and prepare for the Meta Merge.",
        reward: { postPoints: 1000, clout: 8000, rankBadge: 3 }
      }
    ];
  }

  // ===============================
  // 🎯 CHECK QUEST TRIGGERS
  // ===============================
  check(eventName) {
    const nextQuest = this.quests.find(
      q => q.id === (this.active ? this.active.id + 1 : 1)
    );
    if (nextQuest && nextQuest.trigger === eventName) {
      this.start(nextQuest);
      return true;
    }
    return false;
  }

  // ===============================
  // 🚀 START QUEST
  // ===============================
  start(quest) {
    this.active = quest;
    this.game.state.quest = quest.id;

    // Route message to correct speaker box
    const say =
      this.game.messenger[quest.speaker] || this.game.messenger.info;
    say.call(this.game.messenger, `📜 Quest ${quest.id}: ${quest.text}`);

    this.game.hud.update(this.game.state);
  }

  // ===============================
  // 🏁 COMPLETE QUEST
  // ===============================
  complete(id) {
    const quest = this.quests.find(q => q.id === id);
    if (!quest) return;

    this.completed.push(quest.id);
    this.active = null;

    // Apply rewards
    Object.entries(quest.reward || {}).forEach(([key, val]) => {
      if (key === "rankBadge") {
        const newBadge = this.rankBadges[val];
        if (newBadge) this.game.state.rankBadge = newBadge;
      } else {
        this.game.state[key] = (this.game.state[key] || 0) + val;
      }
    });

    this.game.messenger.win(
      `✅ Quest ${quest.id} completed! Rewards applied.`
    );
    this.game.hud.update(this.game.state);
  }

  // ===============================
  // 📦 RESET OR REPLAY
  // ===============================
  reset() {
    this.active = null;
    this.completed = [];
    this.game.state.quest = 0;
    this.game.state.rankBadge = this.rankBadges[1];
    this.game.messenger.info("🔄 Questline reset.");
    this.game.hud.update(this.game.state);
  }
}
