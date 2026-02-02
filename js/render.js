(() => {
  const TD = (window.TD = window.TD || {});
  const canvas = TD.dom.canvas;
  const ctx = canvas.getContext("2d");

  function drawGrid() {
    ctx.fillStyle = "#365438";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const tile of TD.pathTiles) {
      ctx.fillStyle = "#8f7d57";
      ctx.fillRect(tile.x * TD.const.TILE, tile.y * TD.const.TILE, TD.const.TILE, TD.const.TILE);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= TD.const.GRID_COLS; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * TD.const.TILE, 0);
      ctx.lineTo(x * TD.const.TILE, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= TD.const.GRID_ROWS; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, y * TD.const.TILE);
      ctx.lineTo(canvas.width, y * TD.const.TILE);
      ctx.stroke();
    }
  }

  function drawTowers() {
    for (const tower of TD.towers) {
      ctx.fillStyle = tower.color;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, 10, 0, Math.PI * 2);
      ctx.fill();

      if (tower.id === TD.selectedTowerId || TD.mouse.showRanges) {
        ctx.strokeStyle = "rgba(246,183,60,0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function drawEnemies() {
    for (const enemy of TD.enemies) {
      ctx.fillStyle = enemy.slowTimer > 0 ? "#6ee7f2" : enemy.color;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
      ctx.fill();

      if (enemy.hitFlash > 0) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size + 3, 0, Math.PI * 2);
        ctx.fill();
      }

      const barWidth = 26;
      const hpRatio = TD.utils.clamp(enemy.hp / enemy.maxHp, 0, 1);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.size - 12, barWidth, 4);
      ctx.fillStyle = "#7bd389";
      ctx.fillRect(
        enemy.x - barWidth / 2,
        enemy.y - enemy.size - 12,
        barWidth * hpRatio,
        4
      );
    }
  }

  function drawProjectiles() {
    for (const shot of TD.projectiles) {
      ctx.fillStyle = shot.color;
      ctx.beginPath();
      ctx.arc(shot.x, shot.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawEffects() {
    for (const effect of TD.effects) {
      const progress = effect.life / effect.maxLife;
      ctx.strokeStyle = effect.color;
      ctx.globalAlpha = progress;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (1 - progress * 0.35), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    for (const floater of TD.floaters) {
      const progress = floater.life / floater.maxLife;
      ctx.fillStyle = floater.color;
      ctx.globalAlpha = progress;
      ctx.font = "12px Trebuchet MS";
      ctx.fillText(floater.text, floater.x, floater.y);
      ctx.globalAlpha = 1;
    }
  }

  function drawPlacement() {
    if (!TD.buildState.mode || !TD.mouse.inside) return;
    const tileX = TD.mouse.tileX;
    const tileY = TD.mouse.tileY;
    if (
      tileX < 0 ||
      tileX >= TD.const.GRID_COLS ||
      tileY < 0 ||
      tileY >= TD.const.GRID_ROWS
    ) {
      return;
    }

    const blocked =
      TD.pathSet.has(`${tileX},${tileY}`) ||
      TD.towers.some((tower) => tower.tileX === tileX && tower.tileY === tileY);

    ctx.fillStyle = blocked ? "rgba(255,107,107,0.35)" : "rgba(123,211,137,0.35)";
    ctx.fillRect(tileX * TD.const.TILE, tileY * TD.const.TILE, TD.const.TILE, TD.const.TILE);

    const base = TD.towerTypes[TD.buildState.mode];
    const centerX = tileX * TD.const.TILE + TD.const.TILE / 2;
    const centerY = tileY * TD.const.TILE + TD.const.TILE / 2;
    ctx.strokeStyle = "rgba(79,209,197,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, base.range, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawSelection() {
    const tower = TD.towers.find((item) => item.id === TD.selectedTowerId);
    if (!tower) return;
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      tower.tileX * TD.const.TILE + 6,
      tower.tileY * TD.const.TILE + 6,
      TD.const.TILE - 12,
      TD.const.TILE - 12
    );
  }

  function drawGameOver() {
    if (!TD.state.gameOver) return;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f2f4f8";
    ctx.font = "28px Rockwell";
    ctx.textAlign = "center";
    ctx.fillText("Spiel vorbei", canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = "14px Trebuchet MS";
    ctx.fillText(
      "Drücke Welle starten für einen neuen Versuch",
      canvas.width / 2,
      canvas.height / 2 + 16
    );
    ctx.textAlign = "left";
  }

  function render() {
    drawGrid();
    drawPlacement();
    drawTowers();
    drawSelection();
    drawEnemies();
    drawProjectiles();
    drawEffects();
    drawGameOver();
  }

  TD.render = {
    render,
  };
})();
