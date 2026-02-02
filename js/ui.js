(() => {
  const TD = (window.TD = window.TD || {});

  const dom = {
    canvas: document.getElementById("game"),
    moneyEl: document.getElementById("money"),
    livesEl: document.getElementById("lives"),
    waveEl: document.getElementById("wave"),
    speedEl: document.getElementById("speed"),
    wavePreviewEl: document.getElementById("wavePreview"),
    startWaveBtn: document.getElementById("startWave"),
    autoWaveBtn: document.getElementById("autoWave"),
    toggleSpeedBtn: document.getElementById("toggleSpeed"),
    pauseBtn: document.getElementById("pause"),
    adminStatus: document.getElementById("adminStatus"),
    adminActions: document.getElementById("adminActions"),
    adminLogin: document.getElementById("adminLogin"),
    adminMoney: document.getElementById("adminMoney"),
    adminLives: document.getElementById("adminLives"),
    adminSkip: document.getElementById("adminSkip"),
    adminModal: document.getElementById("adminModal"),
    adminBackdrop: document.getElementById("adminBackdrop"),
    adminName: document.getElementById("adminName"),
    adminPassword: document.getElementById("adminPassword"),
    adminError: document.getElementById("adminError"),
    adminSubmit: document.getElementById("adminSubmit"),
    adminCancel: document.getElementById("adminCancel"),
    selectionEl: document.getElementById("selection"),
    upgradeBtn: document.getElementById("upgrade"),
    sellBtn: document.getElementById("sell"),
    towerButtons: Array.from(document.querySelectorAll(".tower-btn")),
  };

  function updateUI() {
    dom.moneyEl.textContent = TD.state.money;
    dom.livesEl.textContent = TD.state.lives;
    dom.waveEl.textContent = TD.state.wave;
    dom.speedEl.textContent = `${TD.state.speed}x`;
  }

  function updateSelection() {
    const tower = TD.towers.find((item) => item.id === TD.selectedTowerId);
    if (!tower) {
      dom.selectionEl.innerHTML = "<p>Kein Tower ausgewählt.</p>";
      dom.upgradeBtn.disabled = true;
      dom.sellBtn.disabled = true;
      return;
    }

    const upgradeCost = TD.tower.getUpgradeCost(tower);
    dom.selectionEl.innerHTML = `
      <strong>${tower.name}</strong><br />
      Level: ${tower.level}<br />
      Schaden: ${Math.round(tower.damage)}<br />
      Reichweite: ${Math.round(tower.range)}<br />
      Feuerrate: ${(1 / tower.rate).toFixed(2)} / s<br />
      Wert: ${Math.round(tower.invested * 0.7)}
    `;
    dom.upgradeBtn.disabled = TD.state.money < upgradeCost;
    dom.sellBtn.disabled = false;
  }

  function setBuildMode(type) {
    TD.buildState.mode = type;
    dom.towerButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tower === type);
    });
  }

  function clearBuildMode() {
    TD.buildState.mode = null;
    dom.towerButtons.forEach((btn) => btn.classList.remove("active"));
  }

  function setWavePreview(text) {
    dom.wavePreviewEl.textContent = text;
  }

  function setPauseLabel(paused) {
    dom.pauseBtn.textContent = paused ? "Weiter" : "Pause";
  }

  function setAutoWaveLabel(enabled) {
    dom.autoWaveBtn.textContent = enabled ? "Auto-Welle: An" : "Auto-Welle: Aus";
  }

  function setAdminState(enabled) {
    dom.adminStatus.textContent = enabled ? "Admin: An" : "Admin: Aus";
    dom.adminStatus.classList.toggle("active", enabled);
    dom.adminLogin.textContent = enabled ? "Admin aktiv" : "Admin Login";
    dom.adminLogin.disabled = enabled;
    dom.adminMoney.disabled = !enabled;
    dom.adminLives.disabled = !enabled;
    dom.adminSkip.disabled = !enabled;
  }

  function showAdminModal() {
    dom.adminModal.classList.add("show");
    dom.adminModal.setAttribute("aria-hidden", "false");
    dom.adminError.textContent = "";
    dom.adminName.value = "";
    dom.adminPassword.value = "";
    dom.adminName.focus();
  }

  function hideAdminModal() {
    dom.adminModal.classList.remove("show");
    dom.adminModal.setAttribute("aria-hidden", "true");
  }

  function setAdminError(message) {
    dom.adminError.textContent = message;
  }

  TD.dom = dom;
  TD.ui = {
    updateUI,
    updateSelection,
    setBuildMode,
    clearBuildMode,
    setWavePreview,
    setPauseLabel,
    setAutoWaveLabel,
    setAdminState,
    showAdminModal,
    hideAdminModal,
    setAdminError,
  };
})();
