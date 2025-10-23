// public/src/components/TextBox.ts
var TextBox = class {
  element;
  nameLabel;
  messageArea;
  constructor(name = "System", message = "") {
    this.element = document.createElement("div");
    this.element.className = "text-box";
    this.nameLabel = document.createElement("div");
    this.nameLabel.className = "name-label";
    this.nameLabel.textContent = name;
    this.element.appendChild(this.nameLabel);
    this.messageArea = document.createElement("div");
    this.messageArea.className = "message-area";
    this.element.appendChild(this.messageArea);
    this.typeText(message);
  }
  async typeText(text, delay = 40) {
    this.messageArea.textContent = "";
    for (let i = 0; i < text.length; i++) {
      this.messageArea.textContent += text[i];
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  getElement() {
    return this.element;
  }
};

// public/src/components/InfoBox.ts
var InfoBox = class extends TextBox {
  constructor(message = "") {
    super(message, "info-box");
  }
};

// public/src/components/JessicaBox.ts
var JessicaBox = class extends TextBox {
  constructor(message = "") {
    super(message, "jessica-box");
  }
};

// public/src/components/KiroBox.ts
var KiroBox = class extends TextBox {
  constructor(message = "") {
    super(message, "kiro-box");
  }
};

// public/src/components/WinBox.ts
var WinBox = class extends TextBox {
  constructor(message = "") {
    super(message, "win-box");
  }
};

// public/src/tutorial.ts
var info = new InfoBox("System initialized.");
var jess = new JessicaBox("Jessica: Welcome.");
var kiro = new KiroBox("Kiro: Let's do this.");
var win = new WinBox("\u{1F389} You Win!");
document.getElementById("info-box-container")?.appendChild(info.getElement());
document.getElementById("jessica-box-container")?.appendChild(jess.getElement());
document.getElementById("kiro-box-container")?.appendChild(kiro.getElement());
document.getElementById("win-box-container")?.appendChild(win.getElement());
var continueBtn = document.getElementById("continue-btn");
if (continueBtn) {
  continueBtn.addEventListener("click", () => {
    window.location.href = "character-creator.html";
  });
}
var tutorialScreen = document.getElementById("tutorial-screen");
if (tutorialScreen) {
  const box = new TextBox("Welcome to the tutorial. Pay attention.");
  tutorialScreen.appendChild(box.getElement());
}
