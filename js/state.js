(() => {
  const TD = (window.TD = window.TD || {});

  TD.state = {
    money: 180,
    lives: 15,
    wave: 0,
    speed: 1,
    paused: false,
    gameOver: false,
  };

  TD.settings = {
    autoWave: false,
  };

  TD.admin = {
    enabled: false,
    infiniteMoney: false,
    infiniteLives: false,
    freeBuild: false,
    freezeEnemies: false,
    damageMultiplier: 1,
  };

  TD.buildState = {
    mode: null,
  };

  TD.mouse = {
    x: 0,
    y: 0,
    tileX: -1,
    tileY: -1,
    inside: false,
    showRanges: false,
  };

  TD.selectedTowerId = null;
  TD.currentWave = null;
  TD.enemyIdCounter = 1;

  TD.towers = [];
  TD.enemies = [];
  TD.projectiles = [];
  TD.effects = [];
  TD.floaters = [];
})();
