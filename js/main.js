(() => {
  const TD = (window.TD = window.TD || {});
  TD.ui.updateUI();
  TD.ui.updateSelection();
  TD.ui.setWavePreview(TD.wave.describeWave(1));
  TD.ui.setAutoWaveLabel(TD.settings.autoWave);
  TD.ui.setAdminState(TD.admin.enabled);
  TD.ui.syncAdminPanel();
  if (TD.auth && typeof TD.auth.init === "function") {
    TD.auth.init();
  }
  TD.game.start();
})();
