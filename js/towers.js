(() => {
  const TD = (window.TD = window.TD || {});

  function createTower(type, tileX, tileY) {
    const base = TD.towerTypes[type];
    return {
      id: TD.utils.makeId(),
      type,
      name: base.name,
      x: tileX * TD.const.TILE + TD.const.TILE / 2,
      y: tileY * TD.const.TILE + TD.const.TILE / 2,
      tileX,
      tileY,
      damage: base.damage,
      range: base.range,
      rate: base.rate,
      projectileSpeed: base.projectileSpeed,
      slow: base.slow,
      slowDuration: base.slowDuration,
      splash: base.splash,
      color: base.color,
      cooldown: 0,
      level: 1,
      invested: base.cost,
    };
  }

  function getUpgradeCost(tower) {
    return Math.round((TD.towerTypes[tower.type].cost * 0.65 + tower.level * 18) * 1.2);
  }

  function upgradeTower(tower) {
    const cost = getUpgradeCost(tower);
    const adminFree = TD.admin.enabled && TD.admin.infiniteMoney;
    if (!adminFree && TD.state.money < cost) {
      return;
    }
    if (!adminFree) {
      TD.state.money -= cost;
    } else {
      TD.state.money = Math.max(TD.state.money, 9999);
    }
    tower.level += 1;
    tower.damage *= 1.25;
    tower.range *= 1.08;
    tower.rate *= 0.9;
    tower.projectileSpeed *= 1.05;
    tower.invested += cost;
    TD.combat.addFloatingText(tower.x, tower.y - 10, `+L${tower.level}`, "#f6b73c");
    TD.ui.updateUI();
    TD.ui.updateSelection();
  }

  function sellTower(tower) {
    const payout = Math.round(tower.invested * 0.7);
    TD.state.money += payout;
    const index = TD.towers.findIndex((item) => item.id === tower.id);
    if (index >= 0) {
      TD.towers.splice(index, 1);
    }
    TD.selectedTowerId = null;
    TD.ui.updateUI();
    TD.ui.updateSelection();
  }

  function placeTower(tileX, tileY) {
    if (!TD.buildState.mode) {
      return;
    }
    if (
      tileX < 0 ||
      tileX >= TD.const.GRID_COLS ||
      tileY < 0 ||
      tileY >= TD.const.GRID_ROWS
    ) {
      return;
    }
    if (TD.pathSet.has(`${tileX},${tileY}`)) {
      return;
    }
    if (TD.towers.some((tower) => tower.tileX === tileX && tower.tileY === tileY)) {
      return;
    }
    const type = TD.buildState.mode;
    const base = TD.towerTypes[type];
    const adminFree = TD.admin.enabled && (TD.admin.freeBuild || TD.admin.infiniteMoney);
    if (!adminFree && TD.state.money < base.cost) {
      return;
    }
    if (!adminFree) {
      TD.state.money -= base.cost;
    } else if (TD.admin.infiniteMoney) {
      TD.state.money = Math.max(TD.state.money, 9999);
    }
    TD.towers.push(createTower(type, tileX, tileY));
    TD.ui.updateUI();
    TD.ui.updateSelection();
  }

  function findTarget(tower) {
    let best = null;
    let bestProgress = -1;
    for (const enemy of TD.enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - tower.x, enemy.y - tower.y);
      if (dist > tower.range) continue;
      const progress = enemy.pathIndex + dist / 1000;
      if (progress > bestProgress) {
        best = enemy;
        bestProgress = progress;
      }
    }
    return best;
  }

  function shoot(tower, target) {
    const damageMultiplier = TD.admin.enabled ? TD.admin.damageMultiplier : 1;
    TD.projectiles.push({
      x: tower.x,
      y: tower.y,
      target,
      speed: tower.projectileSpeed,
      damage: tower.damage * damageMultiplier,
      slow: tower.slow,
      slowDuration: tower.slowDuration,
      splash: tower.splash,
      color: tower.color,
    });
    TD.combat.addEffect(tower.x, tower.y, tower.color, 14);
  }

  TD.tower = {
    createTower,
    getUpgradeCost,
    upgradeTower,
    sellTower,
    placeTower,
    findTarget,
    shoot,
  };
})();
