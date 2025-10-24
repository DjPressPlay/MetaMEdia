// ===============================
// 🧠 PLAYER HUD MODULE — MetaMeda v3
// ===============================

export class PlayerHUD {
  constructor(game) {
    this.game = game;

    // 🧱 HUD ROOT
    this.element = document.createElement("div");
    this.element.className = "player-hud";

    // 🎨 HUD STRUCTURE
    this.element.innerHTML = `
      <div class="hud-container">
        <div class="hud-rank">
          <img class="rank-badge" src="assets/ranks/newbie.png" alt="Rank Badge">
        </div>
        
        <div class="hud-stats">
          <div class="hud-row"><span>🪙 Post Points:</span><span class="hud-postPoints">0</span></div>
          <div class="hud-row"><span>⭐ Clout:</span><span class="hud-clout">0</span></div>
          <div class="hud-row"><span>👥 Followers:</span><span class="hud-followers">0</span></div>
          <div class="hud-row"><span>❤️ Likes:</span><span class="hud-likes">0</span></div>
        </div>

        <div class="hud-quest">
          <span class="hud-quest-label">📜 Quest:</span>
          <span class="hud-quest-value">None</span>
        </div>
      </div>
    `;

    document.body.appendChild(this.element);
  }

  // ===============================
  // 🌀 UPDATE HUD DYNAMICALLY
  // ===============================
  update(state) {
    this.element.querySelector(".hud-postPoints").textContent = state.postPoints ?? 0;
    this.element.querySelector(".hud-clout").textContent = state.clout?.toLocaleString() ?? 0;
    this.element.querySelector(".hud-followers").textContent = state.followers ?? 0;
    this.element.querySelector(".hud-likes").textContent = state.likes ?? 0;

    const questText = state.quest > 0 ? `#${state.quest}` : "None";
    this.element.querySelector(".hud-quest-value").textContent = questText;

    // 🏅 Update rank badge
    const badgeEl = this.element.querySelector(".rank-badge");
    if (state.rankBadge) badgeEl.src = state.rankBadge;
  }
}
