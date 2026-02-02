(() => {
  const TD = (window.TD = window.TD || {});

  function addEffect(x, y, color, radius) {
    TD.effects.push({
      x,
      y,
      radius,
      color,
      life: 0.35,
      maxLife: 0.35,
    });
  }

  function addFloatingText(x, y, text, color) {
    TD.floaters.push({
      x,
      y,
      text,
      color,
      life: 0.9,
      maxLife: 0.9,
    });
  }

  function updateEnemies(dt) {
    const freeze = TD.admin.enabled && TD.admin.freezeEnemies;
    for (const enemy of TD.enemies) {
      if (enemy.dead) continue;
      const nextPoint = TD.pathPoints[enemy.pathIndex + 1];
      if (!nextPoint) {
        enemy.dead = true;
        if (!(TD.admin.enabled && TD.admin.infiniteLives)) {
          TD.state.lives -= 1;
          addFloatingText(enemy.x, enemy.y - 6, "-1 Leben", "#ff6b6b");
          TD.ui.updateUI();
        }
        continue;
      }
      if (enemy.slowTimer > 0) {
        enemy.slowTimer -= dt;
      } else {
        enemy.slowFactor = 1;
      }
      const speed = freeze ? 0 : enemy.speed * enemy.slowFactor;
      const dx = nextPoint.x - enemy.x;
      const dy = nextPoint.y - enemy.y;
      const dist = Math.hypot(dx, dy);
      const step = speed * dt;
      if (dist <= step) {
        enemy.x = nextPoint.x;
        enemy.y = nextPoint.y;
        enemy.pathIndex += 1;
      } else {
        enemy.x += (dx / dist) * step;
        enemy.y += (dy / dist) * step;
      }
      enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    }
  }

  function updateTowers(dt) {
    for (const tower of TD.towers) {
      tower.cooldown -= dt;
      if (tower.cooldown > 0) continue;
      const target = TD.tower.findTarget(tower);
      if (!target) continue;
      TD.tower.shoot(tower, target);
      tower.cooldown = tower.rate;
    }
  }

  function applyDamage(enemy, damage) {
    enemy.hp -= damage;
    enemy.hitFlash = 0.12;
    if (enemy.hp <= 0 && !enemy.dead) {
      enemy.dead = true;
      TD.state.money += enemy.reward;
      addFloatingText(enemy.x, enemy.y - 8, `+${enemy.reward}`, "#7bd389");
      TD.ui.updateUI();
    }
  }

  function updateProjectiles(dt) {
    for (let i = TD.projectiles.length - 1; i >= 0; i -= 1) {
      const shot = TD.projectiles[i];
      if (!shot.target || shot.target.dead) {
        TD.projectiles.splice(i, 1);
        continue;
      }
      const dx = shot.target.x - shot.x;
      const dy = shot.target.y - shot.y;
      const dist = Math.hypot(dx, dy);
      const step = shot.speed * dt;
      if (dist <= step || dist < 6) {
        if (shot.splash) {
          for (const enemy of TD.enemies) {
            if (enemy.dead) continue;
            const splashDist = Math.hypot(
              enemy.x - shot.target.x,
              enemy.y - shot.target.y
            );
            if (splashDist <= shot.splash) {
              const scaled = shot.damage * (1 - (splashDist / shot.splash) * 0.4);
              applyDamage(enemy, scaled);
            }
          }
          addEffect(shot.target.x, shot.target.y, shot.color, shot.splash);
        } else {
          applyDamage(shot.target, shot.damage);
          addEffect(shot.target.x, shot.target.y, shot.color, 18);
        }
        if (shot.slow && !shot.target.dead) {
          shot.target.slowTimer = Math.max(shot.target.slowTimer, shot.slowDuration);
          shot.target.slowFactor = Math.min(shot.target.slowFactor, shot.slow);
        }
        TD.projectiles.splice(i, 1);
        continue;
      }
      shot.x += (dx / dist) * step;
      shot.y += (dy / dist) * step;
    }
  }

  function updateEffects(dt) {
    for (const effect of TD.effects) {
      effect.life -= dt;
    }
    for (const floater of TD.floaters) {
      floater.life -= dt;
      floater.y -= 18 * dt;
    }
  }

  function cleanup() {
    for (let i = TD.enemies.length - 1; i >= 0; i -= 1) {
      if (TD.enemies[i].dead) TD.enemies.splice(i, 1);
    }
    for (let i = TD.effects.length - 1; i >= 0; i -= 1) {
      if (TD.effects[i].life <= 0) TD.effects.splice(i, 1);
    }
    for (let i = TD.floaters.length - 1; i >= 0; i -= 1) {
      if (TD.floaters[i].life <= 0) TD.floaters.splice(i, 1);
    }
  }

  function updateWave(dt) {
    if (!TD.currentWave) return;
    TD.currentWave.timer -= dt;
    while (TD.currentWave.timer <= 0 && TD.currentWave.queue.length > 0) {
      const type = TD.currentWave.queue.shift();
      TD.wave.spawnEnemy(type);
      TD.currentWave.timer += TD.currentWave.interval;
    }
    if (TD.currentWave.queue.length === 0 && TD.enemies.length === 0) {
      TD.currentWave = null;
      TD.state.money += 30 + TD.state.wave * 3;
      addFloatingText(300, 60, "Welle geschafft!", "#f6b73c");
      TD.ui.updateUI();
      TD.ui.setWavePreview(TD.wave.describeWave(TD.state.wave + 1));
    }
  }

  function update(dt) {
    if (TD.state.paused || TD.state.gameOver) {
      return;
    }
    const scaled = dt * TD.state.speed;
    updateWave(scaled);
    updateEnemies(scaled);
    updateTowers(scaled);
    updateProjectiles(scaled);
    updateEffects(scaled);
    cleanup();
    if (
      TD.settings.autoWave &&
      !TD.currentWave &&
      TD.enemies.length === 0 &&
      !TD.state.gameOver
    ) {
      TD.wave.startWave();
    }
    if (
      TD.state.lives <= 0 &&
      !TD.state.gameOver &&
      !(TD.admin.enabled && TD.admin.infiniteLives)
    ) {
      TD.state.gameOver = true;
    }
  }

  TD.combat = {
    addEffect,
    addFloatingText,
    updateEnemies,
    updateTowers,
    applyDamage,
    updateProjectiles,
    updateEffects,
    cleanup,
    updateWave,
    update,
  };
})();
