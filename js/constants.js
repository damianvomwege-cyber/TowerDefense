(() => {
  const TD = (window.TD = window.TD || {});

  const TILE = 64;
  const GRID_COLS = 12;
  const GRID_ROWS = 8;

  const PATH_TILES = [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 5, y: 2 },
    { x: 5, y: 3 },
    { x: 4, y: 3 },
    { x: 3, y: 3 },
    { x: 2, y: 3 },
    { x: 2, y: 4 },
    { x: 2, y: 5 },
    { x: 2, y: 6 },
    { x: 3, y: 6 },
    { x: 4, y: 6 },
    { x: 5, y: 6 },
    { x: 6, y: 6 },
    { x: 7, y: 6 },
    { x: 8, y: 6 },
    { x: 9, y: 6 },
    { x: 9, y: 5 },
    { x: 9, y: 4 },
    { x: 9, y: 3 },
    { x: 9, y: 2 },
    { x: 10, y: 2 },
    { x: 11, y: 2 },
  ];

  const PATH_POINTS = PATH_TILES.map((tile) => ({
    x: tile.x * TILE + TILE / 2,
    y: tile.y * TILE + TILE / 2,
  }));

  const PATH_SET = new Set(PATH_TILES.map((tile) => `${tile.x},${tile.y}`));

  const TOWER_TYPES = {
    gun: {
      name: "Kanone",
      cost: 80,
      damage: 18,
      range: 120,
      rate: 0.7,
      projectileSpeed: 260,
      color: "#f6b73c",
    },
    rapid: {
      name: "Schnellfeuer",
      cost: 95,
      damage: 11,
      range: 105,
      rate: 0.35,
      projectileSpeed: 300,
      color: "#f88c9b",
    },
    sniper: {
      name: "Scharfschuetze",
      cost: 170,
      damage: 60,
      range: 190,
      rate: 1.5,
      projectileSpeed: 340,
      color: "#f3d9a6",
    },
    slow: {
      name: "Frost",
      cost: 110,
      damage: 8,
      range: 130,
      rate: 0.9,
      projectileSpeed: 230,
      slow: 0.55,
      slowDuration: 1.4,
      color: "#4fd1c5",
    },
    splash: {
      name: "Splitter",
      cost: 140,
      damage: 24,
      range: 110,
      rate: 1.15,
      projectileSpeed: 240,
      splash: 55,
      color: "#ff8b5c",
    },
    mortar: {
      name: "Moerser",
      cost: 210,
      damage: 36,
      range: 150,
      rate: 1.45,
      projectileSpeed: 220,
      splash: 85,
      color: "#ff6b6b",
    },
  };

  const ENEMY_TYPES = {
    grunt: { hp: 80, speed: 50, reward: 10, size: 12, color: "#ff6b6b" },
    scout: { hp: 55, speed: 75, reward: 9, size: 10, color: "#f6b73c" },
    runner: { hp: 90, speed: 62, reward: 12, size: 11, color: "#4fd1c5" },
    tank: { hp: 150, speed: 36, reward: 18, size: 14, color: "#7bd389" },
    bruiser: { hp: 220, speed: 30, reward: 26, size: 15, color: "#f59f6c" },
    shield: { hp: 260, speed: 28, reward: 30, size: 16, color: "#9aa7ff" },
    swarm: { hp: 45, speed: 90, reward: 7, size: 9, color: "#ffd166" },
    titan: { hp: 420, speed: 24, reward: 45, size: 18, color: "#6ee7b7" },
  };

  TD.const = { TILE, GRID_COLS, GRID_ROWS };
  TD.pathTiles = PATH_TILES;
  TD.pathPoints = PATH_POINTS;
  TD.pathSet = PATH_SET;
  TD.towerTypes = TOWER_TYPES;
  TD.enemyTypes = ENEMY_TYPES;
})();
