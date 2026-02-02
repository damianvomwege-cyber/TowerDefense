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
