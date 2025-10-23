document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn") as HTMLButtonElement | null;

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      window.location.href = "./tutorial.html";
    });
  }
});
