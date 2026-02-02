(() => {
  const TD = (window.TD = window.TD || {});

  function createWaveConfig(waveNumber, previewOnly = false) {
    const total = 8 + waveNumber * 3 + Math.floor(waveNumber / 3);
    const queue = [];
    for (let i = 0; i < total; i += 1) {
      const roll = Math.random();
      if (waveNumber < 3) {
        queue.push(roll < 0.65 ? "grunt" : roll < 0.9 ? "scout" : "swarm");
      } else if (waveNumber < 6) {
        queue.push(roll < 0.4 ? "grunt" : roll < 0.7 ? "runner" : roll < 0.9 ? "tank" : "swarm");
      } else if (waveNumber < 9) {
        queue.push(roll < 0.35 ? "runner" : roll < 0.6 ? "tank" : roll < 0.8 ? "bruiser" : "swarm");
      } else if (waveNumber < 12) {
        queue.push(roll < 0.25 ? "runner" : roll < 0.5 ? "tank" : roll < 0.7 ? "bruiser" : roll < 0.88 ? "shield" : "swarm");
      } else {
        queue.push(roll < 0.22 ? "tank" : roll < 0.44 ? "bruiser" : roll < 0.64 ? "shield" : roll < 0.85 ? "titan" : "swarm");
      }
    }

    if (waveNumber >= 5) {
      queue.push("bruiser");
    }
    if (waveNumber >= 10) {
      queue.push("titan");
    }

    const interval = Math.max(0.35, 0.92 - waveNumber * 0.05);
    return {
      queue: previewOnly ? queue : queue.slice(),
      interval,
      timer: 0,
    };
  }

  function describeWave(waveNumber) {
    const config = createWaveConfig(waveNumber, true);
    const counts = config.queue.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    const parts = Object.entries(counts).map(
      ([type, amount]) => `${amount} ${type}`
    );
    return `${parts.join(", ")}.`;
  }

  function startWave() {
    if (TD.state.gameOver || TD.currentWave) {
      return;
    }
    TD.state.wave += 1;
    TD.currentWave = createWaveConfig(TD.state.wave);
    TD.ui.updateUI();
    TD.ui.setWavePreview(describeWave(TD.state.wave + 1));
  }

  function spawnEnemy(type) {
    const data = TD.enemyTypes[type];
    const start = TD.pathPoints[0];
    const waveFactor = Math.max(0, TD.state.wave - 1);
    const hpScale = 1 + waveFactor * 0.07;
    const speedScale = Math.min(1 + waveFactor * 0.015, 1.25);
    const rewardScale = 1 + waveFactor * 0.015;
    TD.enemies.push({
      id: TD.enemyIdCounter++,
      type,
      x: start.x,
      y: start.y,
      hp: data.hp * hpScale,
      maxHp: data.hp * hpScale,
      speed: data.speed * speedScale,
      reward: Math.round(data.reward * rewardScale),
      size: data.size,
      color: data.color,
      pathIndex: 0,
      slowTimer: 0,
      slowFactor: 1,
      hitFlash: 0,
    });
  }

  TD.wave = {
    createWaveConfig,
    describeWave,
    startWave,
    spawnEnemy,
  };
})();
