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
    adminPanelOpen: document.getElementById("adminPanelOpen"),
    adminModal: document.getElementById("adminModal"),
    adminBackdrop: document.getElementById("adminBackdrop"),
    adminName: document.getElementById("adminName"),
    adminPassword: document.getElementById("adminPassword"),
    adminError: document.getElementById("adminError"),
    adminSubmit: document.getElementById("adminSubmit"),
    adminCancel: document.getElementById("adminCancel"),
    adminPanel: document.getElementById("adminPanel"),
    adminPanelBackdrop: document.getElementById("adminPanelBackdrop"),
    adminPanelClose: document.getElementById("adminPanelClose"),
    adminMoneyInput: document.getElementById("adminMoneyInput"),
    adminSetMoney: document.getElementById("adminSetMoney"),
    adminGiveMoney: document.getElementById("adminGiveMoney"),
    adminInfiniteMoney: document.getElementById("adminInfiniteMoney"),
    adminLivesInput: document.getElementById("adminLivesInput"),
    adminSetLives: document.getElementById("adminSetLives"),
    adminGiveLives: document.getElementById("adminGiveLives"),
    adminInfiniteLives: document.getElementById("adminInfiniteLives"),
    adminWaveInput: document.getElementById("adminWaveInput"),
    adminSetWave: document.getElementById("adminSetWave"),
    adminSkipWave: document.getElementById("adminSkipWave"),
    adminSpawnBoss: document.getElementById("adminSpawnBoss"),
    adminClearEnemies: document.getElementById("adminClearEnemies"),
    adminFreeBuild: document.getElementById("adminFreeBuild"),
    adminFreezeEnemies: document.getElementById("adminFreezeEnemies"),
    adminDamageBoost: document.getElementById("adminDamageBoost"),
    adminDamageValue: document.getElementById("adminDamageValue"),
    adminSpeedControl: document.getElementById("adminSpeedControl"),
    adminSpeedValue: document.getElementById("adminSpeedValue"),
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
    const canAfford = TD.state.money >= upgradeCost || (TD.admin.enabled && TD.admin.infiniteMoney);
    dom.upgradeBtn.disabled = !canAfford;
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
    dom.adminPanelOpen.disabled = !enabled;
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

  function showAdminPanel() {
    dom.adminPanel.classList.add("show");
    dom.adminPanel.setAttribute("aria-hidden", "false");
  }

  function hideAdminPanel() {
    dom.adminPanel.classList.remove("show");
    dom.adminPanel.setAttribute("aria-hidden", "true");
  }

  function syncAdminPanel() {
    dom.adminMoneyInput.value = TD.state.money;
    dom.adminLivesInput.value = TD.state.lives;
    dom.adminWaveInput.value = TD.state.wave;
    dom.adminInfiniteMoney.checked = TD.admin.infiniteMoney;
    dom.adminInfiniteLives.checked = TD.admin.infiniteLives;
    dom.adminFreeBuild.checked = TD.admin.freeBuild;
    dom.adminFreezeEnemies.checked = TD.admin.freezeEnemies;
    dom.adminDamageBoost.value = TD.admin.damageMultiplier;
    dom.adminDamageValue.textContent = `x${TD.admin.damageMultiplier.toFixed(1)}`;
    dom.adminSpeedControl.value = TD.state.speed;
    dom.adminSpeedValue.textContent = `x${TD.state.speed.toFixed(1)}`;
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
    showAdminPanel,
    hideAdminPanel,
    syncAdminPanel,
  };
})();
