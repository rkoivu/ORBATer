(function () {
  const scripts = [
    'js/identity-search-insignia.js',
    'js/custom-icon-pack.js',
    'js/selection-focus-highlights.js',
    'js/qol-zoom-status-rename.js',
    'js/dirty-state-navigation.js',
    'js/print-tooltips-shortcuts.js',
    'js/themes-locks-search-background.js',
    'js/compat-fixes-statusbar.js',
    'js/history-search-connectors.js',
    'js/tooltips-resize-minimap.js',
    'js/stats-outline-tour-stacking.js',
    'js/toolbar-menus-auto-organise.js',
    'js/outline-import-enhancements.js',
    'js/views-snapshots-command-palette.js',
    'js/qol-keyboard-feedback.js',
    'js/topbar-overflow-scroll.js'
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  }

  async function loadAll() {
    for (const src of scripts) {
      try {
        await loadScript(src);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  function scheduleLoad() {
    const kick = () => setTimeout(loadAll, 0);
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(kick, { timeout: 1200 });
      return;
    }
    window.addEventListener('load', kick, { once: true });
  }

  scheduleLoad();
})();
