(() => {
  const TD = (window.TD = window.TD || {});

  function makeId() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `tower-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function toTile(value) {
    return Math.floor(value / TD.const.TILE);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  TD.utils = {
    makeId,
    toTile,
    clamp,
    distance,
  };
})();
