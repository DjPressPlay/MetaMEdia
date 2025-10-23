const CharacterTemplate = {
  css: `
    .character-template {
      position: relative;
      width: 200px;
      height: 400px;
      border-radius: 12px;
      overflow: hidden;
    }
    .character-part {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      border: 2px solid #888;
    }
    .head {
      top: 10px;
      height: 70px;
      width: 110px;
      border-radius: 50%;
    }
    .body {
      top: 90px;
      height: 120px;
      width: 130px;
      border-radius: 16px;
    }
    .legs {
      top: 220px;
      height: 90px;
      width: 120px;
      border-radius: 12px;
    }
    .shoes {
      top: 320px;
      height: 50px;
      width: 120px;
      border-radius: 8px;
    }
    .character-part span {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      opacity: 0.8;
      display: block;
    }
  `,

  /**
   * Inject the character into the document.
   * @param {HTMLElement} target - where to place it
   * @param {Object} characterData - { head, body, legs, shoes }
   */
  inject(target = document.body, characterData = {}) {
    // apply style if not already there
    if (!document.getElementById("character-style")) {
      const style = document.createElement("style");
      style.id = "character-style";
      style.textContent = this.css;
      document.head.appendChild(style);
    }

    // create the wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "character-template";

    // build each part dynamically from provided data
    const parts = ["head", "body", "legs", "shoes"];
    parts.forEach(part => {
      const div = document.createElement("div");
      div.className = `character-part ${part}`;
      const span = document.createElement("span");
      span.textContent = characterData[part] || "";
      div.appendChild(span);
      wrapper.appendChild(div);
    });

    target.appendChild(wrapper);
  }
};
