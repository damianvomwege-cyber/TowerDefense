(() => {
  const TD = (window.TD = window.TD || {});
  const canvas = TD.dom.canvas;

  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    TD.mouse.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    TD.mouse.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    TD.mouse.tileX = TD.utils.toTile(TD.mouse.x);
    TD.mouse.tileY = TD.utils.toTile(TD.mouse.y);
    TD.mouse.inside = true;
  });

  canvas.addEventListener("mouseleave", () => {
    TD.mouse.inside = false;
  });

  canvas.addEventListener("click", () => {
    if (TD.state.gameOver) {
      TD.game.reset();
      return;
    }
    if (TD.buildState.mode) {
      TD.tower.placeTower(TD.mouse.tileX, TD.mouse.tileY);
      return;
    }
    const clickedTower = TD.towers.find(
      (tower) => Math.hypot(tower.x - TD.mouse.x, tower.y - TD.mouse.y) < 20
    );
    TD.selectedTowerId = clickedTower ? clickedTower.id : null;
    TD.ui.updateSelection();
  });

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    TD.selectedTowerId = null;
    TD.ui.updateSelection();
    TD.ui.clearBuildMode();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Shift") {
      TD.mouse.showRanges = true;
    }
    if (event.key === "Escape") {
      TD.ui.clearBuildMode();
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Shift") {
      TD.mouse.showRanges = false;
    }
  });

  TD.dom.startWaveBtn.addEventListener("click", () => {
    if (TD.state.gameOver) {
      TD.game.reset();
      return;
    }
    TD.wave.startWave();
  });

  TD.dom.autoWaveBtn.addEventListener("click", () => {
    TD.settings.autoWave = !TD.settings.autoWave;
    TD.ui.setAutoWaveLabel(TD.settings.autoWave);
    if (TD.settings.autoWave && !TD.currentWave && TD.enemies.length === 0) {
      TD.wave.startWave();
    }
  });

  function tryAdminLogin() {
    const name = TD.dom.adminName.value.trim();
    const password = TD.dom.adminPassword.value;
    if (name === TD.adminAuth.name && password === TD.adminAuth.password) {
      TD.admin.enabled = true;
      TD.ui.setAdminState(true);
      TD.ui.hideAdminModal();
      TD.ui.syncAdminPanel();
      TD.ui.showAdminPanel();
    } else {
      TD.ui.setAdminError("Login fehlgeschlagen.");
    }
  }

  TD.dom.adminLogin.addEventListener("click", () => {
    if (!TD.admin.enabled) {
      TD.ui.showAdminModal();
    }
  });

  TD.dom.adminBackdrop.addEventListener("click", () => {
    TD.ui.hideAdminModal();
  });

  TD.dom.adminCancel.addEventListener("click", () => {
    TD.ui.hideAdminModal();
  });

  TD.dom.adminSubmit.addEventListener("click", () => {
    tryAdminLogin();
  });

  TD.dom.adminName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      tryAdminLogin();
    }
  });

  TD.dom.adminPassword.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      tryAdminLogin();
    }
  });

  TD.dom.adminPanelOpen.addEventListener("click", () => {
    if (!TD.admin.enabled) return;
    TD.ui.syncAdminPanel();
    TD.ui.showAdminPanel();
  });

  TD.dom.adminPanelBackdrop.addEventListener("click", () => {
    TD.ui.hideAdminPanel();
  });

  TD.dom.adminPanelClose.addEventListener("click", () => {
    TD.ui.hideAdminPanel();
  });

  function readNumber(input, fallback) {
    const value = Number(input.value);
    return Number.isFinite(value) ? value : fallback;
  }

  TD.dom.adminSetMoney.addEventListener("click", () => {
    if (!TD.admin.enabled) return;
    TD.state.money = Math.max(0, readNumber(TD.dom.adminMoneyInput, TD.state.money));
    TD.ui.updateUI();
    TD.ui.syncAdminPanel();
  });

  TD.dom.adminGiveMoney.addEventListener("click", () => {
    if (!TD.admin.enabled) return;
    TD.state.money += 1000;
    TD.ui.updateUI();
    TD.ui.syncAdminPanel();
  });

  TD.dom.adminInfiniteMoney.addEventListener("change", () => {
    if (!TD.admin.enabled) return;
    TD.admin.infiniteMoney = TD.dom.adminInfiniteMoney.checked;
    if (TD.admin.infiniteMoney) {
      TD.state.money = Math.max(TD.state.money, 9999);
      TD.ui.updateUI();
    }
  });

  TD.dom.adminSetLives.addEventListener("click", () => {
    if (!TD.admin.enabled) return;
    TD.state.lives = Math.max(0, readNumber(TD.dom.adminLivesInput, TD.state.lives));
    TD.ui.updateUI();
    TD.ui.syncAdminPanel();
  });

  TD.dom.adminGiveLives.addEventListener("click", () => {
    if (!TD.admin.enabled) return;
    TD.state.lives += 10;
    TD.ui.updateUI();
    TD.ui.syncAdminPanel();
  });

  TD.dom.adminInfiniteLives.addEventListener("change", () => {
    if (!TD.admin.enabled) return;
    TD.admin.infiniteLives = TD.dom.adminInfiniteLives.checked;
    if (TD.admin.infiniteLives && TD.state.lives <= 0) {
      TD.state.lives = 1;
      TD.ui.updateUI();
    }
  });

  TD.dom.adminSetWave.addEventListener("click", () => {
    if (!TD.admin.enabled) return;
    const nextWave = Math.max(0, Math.floor(readNumber(TD.dom.adminWaveInput, TD.state.wave)));
    TD.state.wave = nextWave;
    TD.ui.updateUI();
    TD.ui.setWavePreview(TD.wave.describeWave(TD.state.wave + 1));
    TD.ui.syncAdminPanel();
  });

  TD.dom.adminSkipWave.addEventListener("click", () => {
    if (!TD.admin.enabled) return;
    if (TD.currentWave) {
      TD.currentWave.queue.length = 0;
    }
    TD.enemies.length = 0;
    TD.projectiles.length = 0;
    TD.combat.updateWave(0);
  });

  TD.dom.adminSpawnBoss.addEventListener("click", () => {
    if (!TD.admin.enabled) return;
    TD.wave.spawnEnemy("boss");
  });

  TD.dom.adminClearEnemies.addEventListener("click", () => {
    if (!TD.admin.enabled) return;
    TD.enemies.length = 0;
    TD.projectiles.length = 0;
  });

  TD.dom.adminFreeBuild.addEventListener("change", () => {
    if (!TD.admin.enabled) return;
    TD.admin.freeBuild = TD.dom.adminFreeBuild.checked;
  });

  TD.dom.adminFreezeEnemies.addEventListener("change", () => {
    if (!TD.admin.enabled) return;
    TD.admin.freezeEnemies = TD.dom.adminFreezeEnemies.checked;
  });

  TD.dom.adminDamageBoost.addEventListener("input", () => {
    if (!TD.admin.enabled) return;
    TD.admin.damageMultiplier = parseFloat(TD.dom.adminDamageBoost.value);
    TD.ui.syncAdminPanel();
  });

  TD.dom.adminSpeedControl.addEventListener("input", () => {
    if (!TD.admin.enabled) return;
    TD.state.speed = parseFloat(TD.dom.adminSpeedControl.value);
    TD.ui.updateUI();
    TD.ui.syncAdminPanel();
  });

  TD.dom.toggleSpeedBtn.addEventListener("click", () => {
    TD.state.speed = TD.state.speed === 1 ? 2 : 1;
    TD.ui.updateUI();
  });

  TD.dom.pauseBtn.addEventListener("click", () => {
    TD.state.paused = !TD.state.paused;
    TD.ui.setPauseLabel(TD.state.paused);
  });

  TD.dom.upgradeBtn.addEventListener("click", () => {
    const tower = TD.towers.find((item) => item.id === TD.selectedTowerId);
    if (!tower) return;
    TD.tower.upgradeTower(tower);
  });

  TD.dom.sellBtn.addEventListener("click", () => {
    const tower = TD.towers.find((item) => item.id === TD.selectedTowerId);
    if (!tower) return;
    TD.tower.sellTower(tower);
  });

  TD.dom.towerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.tower;
      if (TD.buildState.mode === type) {
        TD.ui.clearBuildMode();
      } else {
        TD.ui.setBuildMode(type);
      }
    });
  });
})();
