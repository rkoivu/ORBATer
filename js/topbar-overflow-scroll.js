(function () {
  const STEP = 280;

  function q(id) {
    return document.getElementById(id);
  }

  function ensureControls() {
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

    if (!q('topbar-overflow-controls')) {
      const controls = document.createElement('div');
      controls.id = 'topbar-overflow-controls';
      controls.className = 'hidden';
      controls.setAttribute('aria-label', 'Toolbar scroll controls');
      controls.innerHTML = [
        '<button class="tb-btn" id="btn-topbar-scroll-left" title="Scroll toolbar left" aria-label="Scroll toolbar left">&#9664;</button>',
        '<button class="tb-btn" id="btn-topbar-scroll-right" title="Scroll toolbar right" aria-label="Scroll toolbar right">&#9654;</button>'
      ].join('');
      bar.appendChild(controls);

      q('btn-topbar-scroll-left').addEventListener('click', () => {
        bar.scrollBy({ left: -STEP, behavior: 'smooth' });
      });
      q('btn-topbar-scroll-right').addEventListener('click', () => {
        bar.scrollBy({ left: STEP, behavior: 'smooth' });
      });
    }

    return bar;
  }

  function syncControls() {
    const bar = ensureControls();
    const leftFade = q('topbar-overflow-left');
    const rightFade = q('topbar-overflow-right');
    const controls = q('topbar-overflow-controls');
    const leftBtn = q('btn-topbar-scroll-left');
    const rightBtn = q('btn-topbar-scroll-right');
    if (!bar || !leftFade || !rightFade || !controls || !leftBtn || !rightBtn) return;

    const maxScroll = Math.max(0, bar.scrollWidth - bar.clientWidth);
    const hasOverflow = maxScroll > 8;
    const atStart = bar.scrollLeft <= 8;
    const atEnd = bar.scrollLeft >= maxScroll - 8;

    bar.classList.toggle('has-overflow-controls', hasOverflow);
    controls.classList.toggle('hidden', !hasOverflow);
    leftFade.classList.toggle('show', hasOverflow && !atStart);
    rightFade.classList.toggle('show', hasOverflow && !atEnd);
    leftBtn.disabled = !hasOverflow || atStart;
    rightBtn.disabled = !hasOverflow || atEnd;
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
      syncControls();
    });
  }

  function init() {
    const bar = ensureControls();
    if (!bar || bar.dataset.topbarOverflowBound === '1') return;
    bar.dataset.topbarOverflowBound = '1';

    bindWheel(bar);
    bar.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(scheduleSync);
      resizeObserver.observe(bar);
    }

    if (window.MutationObserver) {
      const mutationObserver = new MutationObserver(scheduleSync);
      mutationObserver.observe(bar, { childList: true });
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
