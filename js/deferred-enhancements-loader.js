(function () {
  if (window.__orbatDeferredLoaderBooted) return;
  window.__orbatDeferredLoaderBooted = true;

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
    'js/topbar-overflow-scroll.js',
    'js/ui-flow-polish.js'
  ];

  const diagnostics = window.__orbatDiagnostics = window.__orbatDiagnostics || {};
  const boot = diagnostics.boot = diagnostics.boot || {};
  const deferred = boot.deferred = boot.deferred || {};
  deferred.scheduledAt = deferred.scheduledAt || Date.now();
  deferred.modules = deferred.modules || [];
  deferred.loaded = deferred.loaded || [];
  deferred.failed = deferred.failed || [];
  deferred.pending = scripts.slice();
  deferred.total = scripts.length;
  deferred.status = deferred.status || 'scheduled';

  function updateModuleStatus(src, status, extra = {}) {
    const existing = deferred.modules.find(entry => entry.src === src) || { src };
    Object.assign(existing, extra, { src, status });
    const idx = deferred.modules.findIndex(entry => entry.src === src);
    if (idx >= 0) deferred.modules[idx] = existing;
    else deferred.modules.push(existing);
    deferred.loaded = deferred.modules.filter(entry => entry.status === 'loaded').map(entry => entry.src);
    deferred.failed = deferred.modules.filter(entry => entry.status === 'failed').map(entry => entry.src);
    deferred.pending = scripts.filter(name => !deferred.loaded.includes(name) && !deferred.failed.includes(name));
    window.dispatchEvent(new CustomEvent('orbat:deferred-module', { detail: { ...existing } }));
  }

  function markBootStatus(status, extra = {}) {
    deferred.status = status;
    Object.assign(deferred, extra);
    window.dispatchEvent(new CustomEvent('orbat:deferred-status', { detail: { ...deferred } }));
  }

  function isCoreReady() {
    return !!(
      document.getElementById('app-root') &&
      document.getElementById('topbar') &&
      document.getElementById('canvas-wrap') &&
      typeof window.serializeDocument === 'function' &&
      typeof window.applyDocumentState === 'function'
    );
  }

  function waitForCoreReady(timeoutMs = 4000) {
    if (isCoreReady()) {
      deferred.coreReady = true;
      deferred.coreReadyAt = Date.now();
      return Promise.resolve(true);
    }
    const startedAt = Date.now();
    return new Promise(resolve => {
      const timer = window.setInterval(() => {
        if (isCoreReady()) {
          window.clearInterval(timer);
          deferred.coreReady = true;
          deferred.coreReadyAt = Date.now();
          deferred.coreWaitMs = Date.now() - startedAt;
          resolve(true);
          return;
        }
        if (Date.now() - startedAt >= timeoutMs) {
          window.clearInterval(timer);
          deferred.coreReady = false;
          deferred.coreWaitMs = Date.now() - startedAt;
          resolve(false);
        }
      }, 40);
    });
  }

  function loadScriptElement(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing?.dataset.orbatLoaded === '1') {
        resolve('cached');
        return;
      }
      if (existing) {
        existing.addEventListener('load', () => {
          existing.dataset.orbatLoaded = '1';
          resolve('existing');
        }, { once: true });
        existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.dataset.orbatDeferred = '1';
      script.onload = () => {
        script.dataset.orbatLoaded = '1';
        resolve('loaded');
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  }

  function loadScriptWithRuntimeCapture(src) {
    return new Promise((resolve, reject) => {
      let runtimeError = null;
      const startedAt = Date.now();
      const finish = (ok, error) => {
        window.removeEventListener('error', onError);
        window.removeEventListener('unhandledrejection', onRejection);
        if (ok) resolve({ durationMs: Date.now() - startedAt });
        else reject(error);
      };
      const onError = event => {
        runtimeError = runtimeError || event?.error || new Error(event?.message || `Runtime error while loading ${src}`);
      };
      const onRejection = event => {
        runtimeError = runtimeError || event?.reason || new Error(`Unhandled rejection while loading ${src}`);
      };
      window.addEventListener('error', onError);
      window.addEventListener('unhandledrejection', onRejection);
      loadScriptElement(src)
        .then(() => {
          window.setTimeout(() => {
            if (runtimeError) finish(false, runtimeError);
            else finish(true);
          }, 32);
        })
        .catch(error => finish(false, error));
    });
  }

  async function loadAll() {
    if (deferred.startedAt) return;
    deferred.startedAt = Date.now();
    markBootStatus('waiting-for-core');
    const coreReady = await waitForCoreReady();
    if (!coreReady) {
      console.warn('Deferred enhancements started before core readiness was confirmed.');
    }
    markBootStatus('loading', { coreReady });
    for (const src of scripts) {
      updateModuleStatus(src, 'loading', { startedAt: Date.now() });
      try {
        const result = await loadScriptWithRuntimeCapture(src);
        updateModuleStatus(src, 'loaded', { completedAt: Date.now(), durationMs: result.durationMs });
      } catch (error) {
        console.warn(error);
        updateModuleStatus(src, 'failed', {
          completedAt: Date.now(),
          error: String(error?.message || error || 'Unknown load failure')
        });
      }
    }
    deferred.completedAt = Date.now();
    deferred.totalDurationMs = deferred.completedAt - deferred.startedAt;
    markBootStatus(deferred.failed.length ? 'completed-with-errors' : 'completed');
    if (deferred.failed.length && typeof window.showToast === 'function') {
      window.showToast(`Deferred startup completed with ${deferred.failed.length} module error${deferred.failed.length === 1 ? '' : 's'}`);
    }
  }

  function scheduleLoad() {
    const kick = () => window.setTimeout(loadAll, 0);
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(kick, { timeout: 1200 });
      return;
    }
    if (document.readyState === 'complete') {
      kick();
      return;
    }
    window.addEventListener('load', kick, { once: true });
  }

  scheduleLoad();
})();
