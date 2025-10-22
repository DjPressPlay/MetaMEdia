export class TextBox {
  private element: HTMLDivElement;
  private nameLabel: HTMLDivElement;
  private messageArea: HTMLDivElement;

  constructor(name: string = "System", message: string = "") {
    // Outer container
    this.element = document.createElement("div");
    this.element.className = "text-box";

    // Name label (top-left)
    this.nameLabel = document.createElement("div");
    this.nameLabel.className = "name-label";
    this.nameLabel.textContent = name;
    this.element.appendChild(this.nameLabel);

    // Message display area
    this.messageArea = document.createElement("div");
    this.messageArea.className = "message-area";
    this.element.appendChild(this.messageArea);

    this.typeText(message);
  }

  private async typeText(text: string, delay: number = 40) {
    this.messageArea.textContent = "";
    for (let i = 0; i < text.length; i++) {
      this.messageArea.textContent += text[i];
      await new Promise(res => setTimeout(res, delay));
    }
  }

  getElement(): HTMLDivElement {
    return this.element;
  }
}
