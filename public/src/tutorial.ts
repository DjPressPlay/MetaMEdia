import { InfoBox } from "./components/InfoBox";
import { JessicaBox } from "./components/JessicaBox";
import { KiroBox } from "./components/KiroBox";
import { WinBox } from "./components/WinBox";
import { TextBox } from "./components/TextBox";


const info = new InfoBox("System initialized.");
const jess = new JessicaBox("Jessica: Welcome.");
const kiro = new KiroBox("Kiro: Let's do this.");
const win = new WinBox("🎉 You Win!");

document.getElementById("info-box-container")?.appendChild(info.getElement());
document.getElementById("jessica-box-container")?.appendChild(jess.getElement());
document.getElementById("kiro-box-container")?.appendChild(kiro.getElement());
document.getElementById("win-box-container")?.appendChild(win.getElement());




const continueBtn = document.getElementById("continue-btn") as HTMLButtonElement | null;





if (continueBtn) {
  continueBtn.addEventListener("click", () => {
    window.location.href = "character-creator.html";
  });
}

const tutorialScreen = document.getElementById("tutorial-screen");

if (tutorialScreen) {
  const box = new TextBox("Welcome to the tutorial. Pay attention.");
  tutorialScreen.appendChild(box.getElement());
}
