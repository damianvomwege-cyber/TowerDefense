(() => {
  const TD = (window.TD = window.TD || {});
  let lastTime = performance.now();

  function resetGame() {
    TD.state.gameOver = false;
    TD.state.lives = 15;
    TD.state.money = 180;
    TD.state.wave = 0;
    TD.enemies.length = 0;
    TD.projectiles.length = 0;
    TD.towers.length = 0;
    TD.effects.length = 0;
    TD.floaters.length = 0;
    TD.currentWave = null;
    TD.selectedTowerId = null;
    TD.ui.updateUI();
    TD.ui.updateSelection();
    TD.ui.setWavePreview(TD.wave.describeWave(1));
  }

  function loop(now) {
    const dt = Math.min(0.04, (now - lastTime) / 1000);
    lastTime = now;
    if (!TD.auth || !TD.auth.isAuthenticated) {
      TD.render.render();
      requestAnimationFrame(loop);
      return;
    }
    TD.combat.update(dt);
    TD.render.render();
    requestAnimationFrame(loop);
  }

  function start() {
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  TD.game = {
    reset: resetGame,
    start,
  };
})();
