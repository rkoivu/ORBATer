(function () {
  function q(id) {
    return document.getElementById(id);
  }

  function ensureFades() {
    const bar = q('topbar');
    if (!bar) return null;

    if (!q('topbar-overflow-left')) {
      const leftFade = document.createElement('div');
      leftFade.id = 'topbar-overflow-left';
      leftFade.className = 'topbar-overflow-fade left';
      bar.appendChild(leftFade);
    }

    if (!q('topbar-overflow-right')) {
      const rightFade = document.createElement('div');
      rightFade.id = 'topbar-overflow-right';
      rightFade.className = 'topbar-overflow-fade right';
      bar.appendChild(rightFade);
    }

    return bar;
  }

  function syncFades() {
    const bar = q('topbar');
    const leftFade = q('topbar-overflow-left');
    const rightFade = q('topbar-overflow-right');
    if (!bar || !leftFade || !rightFade) return;

    const maxScroll = Math.max(0, bar.scrollWidth - bar.clientWidth);
    const hasOverflow = maxScroll > 8;
    const atStart = bar.scrollLeft <= 8;
    const atEnd = bar.scrollLeft >= maxScroll - 8;

    leftFade.classList.toggle('show', hasOverflow && !atStart);
    rightFade.classList.toggle('show', hasOverflow && !atEnd);
  }

  function bindWheel(bar) {
    if (!bar || bar.dataset.topbarWheelBound === '1') return;
    bar.dataset.topbarWheelBound = '1';
    bar.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (bar.scrollWidth <= bar.clientWidth + 8) return;
      event.preventDefault();
      bar.scrollLeft += event.deltaY;
    }, { passive: false });
  }

  let syncQueued = false;
  function scheduleSync() {
    if (syncQueued) return;
    syncQueued = true;
    requestAnimationFrame(() => {
      syncQueued = false;
      syncFades();
    });
  }

  function init() {
    const bar = ensureFades();
    if (!bar || bar.dataset.topbarOverflowBound === '1') return;
    bar.dataset.topbarOverflowBound = '1';

    bindWheel(bar);
    bar.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);

    if (window.ResizeObserver) {
      new ResizeObserver(scheduleSync).observe(bar);
    }

    if (window.MutationObserver) {
      new MutationObserver(scheduleSync).observe(bar, { childList: true });
    }

    scheduleSync();
    setTimeout(scheduleSync, 120);
    setTimeout(scheduleSync, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
