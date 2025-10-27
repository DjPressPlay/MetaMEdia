// ===============================
// 🧠 PLAYER HUD MODULE — MetaMeda v3 (Linked to HOMEROOM)
// ===============================

export class PlayerHUD {
  constructor(game) {
    this.game = game;

    // 🧱 Use same structure as .nameplate in HOMEROOM
    this.element = document.createElement("div");
    this.element.className = "nameplate"; // 👈 matches your CSS

    this.element.innerHTML = `
      <div class="header">
        <div class="name-text hud-name">Unknown</div>
        <div class="rank-badge"></div>
      </div>

      <div class="stats-grid">
        <div><div class="stat-value hud-postPoints">0</div><div class="stat-label">Post</div></div>
        <div><div class="stat-value hud-clout">0</div><div class="stat-label">Clout</div></div>
        <div><div class="stat-value hud-followers">0</div><div class="stat-label">Followers</div></div>
        <div><div class="stat-value hud-likes">0</div><div class="stat-label">Likes</div></div>
        <div><div class="stat-value hud-quest">None</div><div class="stat-label">Quest</div></div>
        <div><div class="stat-value hud-messages">0</div><div class="stat-label">Msgs</div></div>
      </div>
    `;

    // 🔹 Attach HUD inside the game frame (not body)
    const frame = document.querySelector(".frame");
    if (frame) frame.appendChild(this.element);
    else document.body.appendChild(this.element);
  }

  // ===============================
  // 🌀 Syncs HUD with game state
  // ===============================
  update(state) {
    if (!state) return;

    this.element.querySelector(".hud-name").textContent = state.selectedCharacter || "Unknown";
    this.element.querySelector(".hud-postPoints").textContent = state.postPoints ?? 0;
    this.element.querySelector(".hud-clout").textContent = state.clout ?? 0;
    this.element.querySelector(".hud-followers").textContent = state.followers ?? 0;
    this.element.querySelector(".hud-likes").textContent = state.likes ?? 0;
    this.element.querySelector(".hud-quest").textContent = state.quest ?? "None";
    this.element.querySelector(".hud-messages").textContent = state.messages?.length ?? 0;

    const badge = this.element.querySelector(".rank-badge");
    if (state.rankBadge) badge.style.backgroundImage = `url('${state.rankBadge}')`;
  }
}
