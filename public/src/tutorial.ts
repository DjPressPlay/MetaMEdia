const continueBtn = document.getElementById('continue-btn');
if (continueBtn) {
  continueBtn.addEventListener('click', () => {
    window.location.href = '/character-selector.html';
  });
}
