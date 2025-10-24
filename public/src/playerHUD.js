// ===============================
// 🧠 PLAYER HUD MODULE
// ===============================

export class PlayerHUD {
  constructor(game) {
    this.game = game;
    this.element = document.createElement("div");
    this.element.className = "player-hud";
    this.element.innerHTML = `
      <div class="hud-bar">
        <span class="hud-health">❤️ 100</span>
        <span class="hud-score">💎 0</span>
      </div>
    `;
    document.body.appendChild(this.element);
  }

  // Update HUD values
  update(state) {
    this.element.querySelector(".hud-health").textContent = `❤️ ${state.health}`;
    this.element.querySelector(".hud-score").textContent = `💎 ${state.score}`;
  }
}
