(function(){
  // QOL: Keyboard shortcuts help + Improved feedback
  
  // Add keyboard shortcuts modal when page loads
  const setupKeyboardHelp = () => {
    if (document.getElementById('help-modal')) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-ov';
    modal.id = 'help-modal';
    
    const shortcuts = [
      { key: 'Ctrl+Z / Cmd+Z', desc: 'Undo' },
      { key: 'Ctrl+Y / Cmd+Y', desc: 'Redo' },
      { key: 'Ctrl+C / Cmd+C', desc: 'Copy selected' },
      { key: 'Ctrl+V / Cmd+V', desc: 'Paste' },
      { key: 'Ctrl+D / Cmd+D', desc: 'Duplicate' },
      { key: 'Shift+N', desc: 'Add root unit' },
      { key: 'Ctrl+K / Cmd+K', desc: 'Command palette' },
      { key: 'F2', desc: 'Rename current tab' },
      { key: 'Ctrl+Shift+D / Cmd+Shift+D', desc: 'Duplicate current tab' },
      { key: 'Ctrl+W / Cmd+W', desc: 'Close current tab' },
      { key: 'Delete', desc: 'Delete selected unit(s)' },
      { key: 'Enter (in search)', desc: 'Next search result' },
      { key: 'Shift+Enter (in search)', desc: 'Previous search result' },
      { key: 'L', desc: 'Auto layout' },
      { key: 'G', desc: 'Cycle grid mode' },
      { key: 'M', desc: 'Toggle minimap' },
      { key: 'Home', desc: 'Center on root' },
      { key: 'Alt+F', desc: 'Zoom to selection' },
      { key: '/', desc: 'Focus unit search' },
      { key: '[', desc: 'Toggle palette sidebar' },
      { key: ']', desc: 'Toggle properties panel' },
    ];
    
    let html = '<div class="modal-box" style="min-width:420px"><h2>Keyboard Shortcuts <span class="modal-x" onclick="closeModal(\'help-modal\')">✕</span></h2><div style="margin-top:12px">';
    shortcuts.forEach(s => {
      html += '<div style="display:flex;gap:12px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border)">' +
              '<code style="min-width:130px;font-family:monospace;font-size:11px;color:var(--accent);font-weight:600">' + s.key + '</code>' +
              '<span style="color:var(--text2);font-size:12px">' + s.desc + '</span></div>';
    });
    html += '</div><div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);color:var(--text2);font-size:11px">💡 Tip: Toolbar buttons show shortcuts on hover</div></div>';
    
    modal.innerHTML = html;
    document.body.appendChild(modal);
  };
  
  // Add help button to toolbar
  const addHelpButton = () => {
    const ref = document.getElementById('btn-cmdk') || document.getElementById('btn-random-orbat');
    if (!ref || document.getElementById('btn-keyboard-help')) return;
    
    setupKeyboardHelp();
    
    const btn = document.createElement('button');
    btn.className = 'tb-btn';
    btn.id = 'btn-keyboard-help';
    btn.textContent = '⌨ Shortcuts';
    btn.title = 'View keyboard shortcuts';
    btn.onclick = () => {
      try { 
        if (typeof openModal === 'function') openModal('help-modal');
      } catch(e) {}
    };
    
    if (ref.parentNode) {
      ref.parentNode.insertBefore(btn, ref.nextSibling);
    }
  };
  
  // Bind Ctrl+Shift+? to open help
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '?') {
      e.preventDefault();
      try { 
        if (typeof openModal === 'function') openModal('help-modal');
      } catch(e) {}
    }
  });
  
  // Initialize on document load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHelpButton);
  } else {
    setTimeout(addHelpButton, 100);
  }
  
  // Enhance error messages for imports
  const enhanceImports = () => {
    if (typeof window.reviewImportPayload === 'function') return;
    const fileInput = document.getElementById('file-input');
    if (!fileInput) return;
    
    // Remove old listener if it exists
    const clonedInput = fileInput.cloneNode(true);
    fileInput.replaceWith(clonedInput);
    const newFileInput = document.getElementById('file-input');
    
    newFileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      
      const r = new FileReader();
      r.onerror = () => {
        if (typeof showToast === 'function') {
          showToast('⚠ Import failed: could not read file');
        }
      };
      
      r.onload = ev => {
        try {
          const text = ev.target.result;
          if (!text || text.trim() === '') {
            if (typeof showToast === 'function') showToast('⚠ Import failed: file is empty');
            return;
          }
          
          const d = JSON.parse(text);
          
          if (!d || typeof d !== 'object') {
            if (typeof showToast === 'function') showToast('⚠ Import failed: not valid JSON');
            return;
          }
          
          if (!d.nodes || typeof d.nodes !== 'object') {
            if (typeof showToast === 'function') showToast('⚠ Import failed: missing units');
            return;
          }
          
          // Document is valid - proceed with import
          if (typeof applyDocumentState === 'function') {
            applyDocumentState(d, {trackHistory: true, preserveView: false});
            const unitCount = Object.keys(d.nodes).length;
            if (typeof showToast === 'function') {
              showToast('✓ Imported: ' + unitCount + ' units');
            }
          }
        } catch (err) {
          const msg = (err && err.message) ? err.message : 'unknown error';
          if (typeof showToast === 'function') {
            if (msg.includes('JSON')) {
              showToast('⚠ Import failed: invalid JSON');
            } else if (msg.includes('schema') || msg.includes('version')) {
              showToast('⚠ Import failed: unsupported format');
            } else {
              showToast('⚠ Import error: ' + msg.substring(0, 30));
            }
          }
        }
      };
      
      r.readAsText(file);
      e.target.value = '';
    });
  };
  
  // Wait for page to load then enhance imports
  setTimeout(enhanceImports, 200);

  function enhanceEmptyState() {
    const emptyHint = document.getElementById('empty-hint');
    if (!emptyHint || emptyHint.dataset.enhanced === '1') return;
    emptyHint.dataset.enhanced = '1';
    emptyHint.innerHTML = [
      '<div class="eh-hero">🪖</div>',
      '<div class="eh-title">Start Building</div>',
      '<div class="eh-copy">Drag a unit from the palette, click <b>+ Root</b>, or double-click the canvas to drop your first unit.</div>',
      '<div class="eh-kbd-row"><span><kbd>/</kbd> Search</span><span><kbd>L</kbd> Layout</span><span><kbd>Ctrl</kbd> + <kbd>K</kbd> Commands</span></div>'
    ].join('');
  }

  function addQuickCanvasActions() {
    const wrap = document.getElementById('canvas-wrap');
    const canvas = document.getElementById('canvas');
    if (!wrap || !canvas || wrap.dataset.qolCanvas === '1') return;
    wrap.dataset.qolCanvas = '1';

    function createRootAtClientPoint(clientX, clientY) {
      if (typeof createNode !== 'function') {
        if (typeof addRootUnit === 'function') addRootUnit();
        return;
      }
      const rect = wrap.getBoundingClientRect();
      const x = typeof snapV === 'function' ? snapV((clientX - rect.left - panX) / zoom) : ((clientX - rect.left - panX) / zoom);
      const y = typeof snapV === 'function' ? snapV((clientY - rect.top - panY) / zoom) : ((clientY - rect.top - panY) / zoom);
      const id = createNode({ x, y });
      if (typeof selectNode === 'function') selectNode(id);
      if (typeof saveState === 'function') saveState();
      if (typeof showToast === 'function') showToast('Root unit added');
    }
    window.createRootAtClientPoint = createRootAtClientPoint;

    wrap.addEventListener('dblclick', e => {
      const blocked = e.target.closest('.orbat-node, #minimap, #ctx, #edit-panel, #sidebar, .tb-btn, input, select, textarea, button');
      if (blocked) return;
      try {
        createRootAtClientPoint(e.clientX, e.clientY);
      } catch (_) {}
    });
  }

  function improveSearchInputs() {
    const search = document.getElementById('unit-search-input');
    const tag = document.getElementById('tag-filter-input');
    if (search && search.dataset.qolBound !== '1') {
      search.dataset.qolBound = '1';
      search.placeholder = 'Search units /';
      search.addEventListener('focus', () => search.select());
      search.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          search.value = '';
          search.dispatchEvent(new Event('input', { bubbles: true }));
          search.blur();
        }
      });
    }
    if (tag && tag.dataset.qolBound !== '1') {
      tag.dataset.qolBound = '1';
      tag.placeholder = 'Tag filter #';
      tag.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          tag.value = '';
          tag.dispatchEvent(new Event('input', { bubbles: true }));
          tag.blur();
        }
      });
    }
  }

  function addSearchClearButtons() {
    const pairs = [
      { inputId: 'unit-search-input', btnId: 'btn-clear-unit-search', title: 'Clear unit search' },
      { inputId: 'tag-filter-input', btnId: 'btn-clear-tag-filter', title: 'Clear tag filter' }
    ];
    pairs.forEach(({ inputId, btnId, title }) => {
      const input = document.getElementById(inputId);
      const topbar = document.getElementById('topbar');
      if (!input || !topbar) return;
      let btn = document.getElementById(btnId);
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.id = btnId;
        btn.className = 'input-clear-btn hidden';
        btn.textContent = '×';
        btn.title = title;
        btn.onclick = () => {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        };
        input.insertAdjacentElement('afterend', btn);
      }
      const sync = () => btn.classList.toggle('hidden', !input.value.trim());
      if (btn.dataset.bound !== '1') {
        btn.dataset.bound = '1';
        input.addEventListener('input', sync);
        input.addEventListener('change', sync);
        input.addEventListener('blur', sync);
      }
      sync();
    });
  }

  function setupPaletteControls() {
    const header = document.getElementById('sidebar-header');
    const scroll = document.getElementById('sidebar-scroll');
    if (!header || !scroll) return;
    const LS_KEY = 'orbat_palette_sections_v1';
    const readState = () => {
      try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {}; } catch (_) { return {}; }
    };
    const writeState = state => {
      try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (_) {}
    };
    const sectionKey = title => title.textContent.replace(/[▼▾▸]/g, '').trim();
    const saveCurrentState = () => {
      const state = {};
      scroll.querySelectorAll('.palette-section-title').forEach(title => {
        state[sectionKey(title)] = title.classList.contains('collapsed');
      });
      writeState(state);
    };
    const applyState = () => {
      const state = readState();
      scroll.querySelectorAll('.palette-section').forEach(sec => {
        const title = sec.querySelector('.palette-section-title');
        const grid = sec.querySelector('.palette-grid');
        if (!title || !grid) return;
        const collapsed = state[sectionKey(title)] === true;
        title.classList.toggle('collapsed', collapsed);
        grid.classList.toggle('hidden', collapsed);
        if (title.dataset.paletteBound !== '1') {
          title.dataset.paletteBound = '1';
          title.addEventListener('click', () => setTimeout(saveCurrentState, 0));
        }
      });
    };
    const setAll = collapsed => {
      scroll.querySelectorAll('.palette-section').forEach(sec => {
        const title = sec.querySelector('.palette-section-title');
        const grid = sec.querySelector('.palette-grid');
        if (!title || !grid) return;
        title.classList.toggle('collapsed', collapsed);
        grid.classList.toggle('hidden', collapsed);
      });
      saveCurrentState();
      try { if (typeof showToast === 'function') showToast(collapsed ? 'Palette collapsed' : 'Palette expanded'); } catch (_) {}
    };

    let actions = header.querySelector('.sidebar-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'sidebar-actions';
      header.appendChild(actions);
    }
    if (!document.getElementById('btn-palette-collapse')) {
      const collapseBtn = document.createElement('button');
      collapseBtn.type = 'button';
      collapseBtn.id = 'btn-palette-collapse';
      collapseBtn.className = 'tb-btn';
      collapseBtn.textContent = 'Fold';
      collapseBtn.title = 'Collapse all palette sections';
      collapseBtn.onclick = () => setAll(true);
      actions.insertBefore(collapseBtn, actions.firstChild);
    }
    if (!document.getElementById('btn-palette-expand')) {
      const expandBtn = document.createElement('button');
      expandBtn.type = 'button';
      expandBtn.id = 'btn-palette-expand';
      expandBtn.className = 'tb-btn';
      expandBtn.textContent = 'Open';
      expandBtn.title = 'Expand all palette sections';
      expandBtn.onclick = () => setAll(false);
      actions.insertBefore(expandBtn, actions.firstChild);
    }

    if (typeof buildPalette === 'function' && !buildPalette._qolPaletteWrapped) {
      const prevBuildPalette = buildPalette;
      buildPalette = function() {
        const result = prevBuildPalette.apply(this, arguments);
        applyState();
        return result;
      };
      buildPalette._qolPaletteWrapped = true;
    }

    applyState();
  }

  function setupPanelShortcuts() {
    if (document.body.dataset.panelShortcuts === '1') return;
    document.body.dataset.panelShortcuts = '1';
    document.addEventListener('keydown', e => {
      const ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.tagName === 'SELECT' || ae.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === '/') {
        const search = document.getElementById('unit-search-input');
        if (!search) return;
        e.preventDefault();
        search.focus();
        search.select();
        return;
      }
      if (e.key === 'N' && e.shiftKey) {
        e.preventDefault();
        try {
          const wrap = document.getElementById('canvas-wrap');
          if (wrap && typeof window.createRootAtClientPoint === 'function') {
            const rect = wrap.getBoundingClientRect();
            window.createRootAtClientPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
          } else if (typeof addRootUnit === 'function') {
            addRootUnit();
            if (typeof showToast === 'function') showToast('Root unit added');
          }
        } catch (_) {}
        return;
      }
      if (e.key === '[') {
        e.preventDefault();
        try {
          if (typeof toggleSidebar === 'function') toggleSidebar();
          if (typeof showToast === 'function') {
            const hidden = document.getElementById('sidebar')?.classList.contains('sb-collapsed');
            showToast(hidden ? 'Palette hidden' : 'Palette shown');
          }
        } catch (_) {}
      }
      if (e.key === ']') {
        e.preventDefault();
        try {
          const panel = document.getElementById('edit-panel');
          if (!panel) return;
          panel.classList.toggle('hid');
          if (typeof showToast === 'function') showToast(panel.classList.contains('hid') ? 'Properties hidden' : 'Properties shown');
        } catch (_) {}
      }
    }, true);
  }

  // Final layout enforcement after all other modules have patched the page.
  function enforceLayoutFixes() {
    const topbar = document.getElementById('topbar');
    const tabBar = document.getElementById('tab-bar');
    const statusbar = document.getElementById('statusbar');
    const main = document.getElementById('main');
    const sidebar = document.getElementById('sidebar');
    const sidebarHeader = document.getElementById('sidebar-header');
    const sidebarScroll = document.getElementById('sidebar-scroll');
    const editPanel = document.getElementById('edit-panel');
    const epInner = document.getElementById('ep-inner');
    const mpInner = document.getElementById('mp-inner');
    const minimap = document.getElementById('minimap');
    const mmToggle = document.getElementById('mm-toggle');

    const topbarH = topbar ? topbar.offsetHeight : 50;
    const tabBarH = tabBar ? tabBar.offsetHeight : 0;
    const statusbarH = statusbar ? statusbar.offsetHeight : 25;
    const availableH = Math.max(240, window.innerHeight - topbarH - tabBarH - statusbarH);

    if (main) {
      main.style.minHeight = '0';
      main.style.height = '';
    }

    if (sidebar) {
      sidebar.style.minHeight = '0';
      sidebar.style.height = '';
    }

    if (sidebarScroll) {
      const sidebarHeaderH = sidebarHeader ? sidebarHeader.offsetHeight : 36;
      sidebarScroll.style.overflowY = 'auto';
      sidebarScroll.style.minHeight = '0';
      sidebarScroll.style.height = Math.max(120, availableH - sidebarHeaderH) + 'px';
    }

    if (editPanel && !editPanel.classList.contains('hid') && !editPanel.classList.contains('hidden')) {
      editPanel.style.minHeight = '0';
      editPanel.style.height = '';
    }

    [epInner, mpInner].forEach(panel => {
      if (!panel) return;
      panel.style.overflowY = 'auto';
      panel.style.minHeight = '0';
      panel.style.maxHeight = Math.max(120, availableH - 8) + 'px';
    });

    if (minimap) {
      minimap.style.position = 'fixed';
      minimap.style.right = '8px';
      minimap.style.bottom = '8px';
      minimap.style.display = (typeof mmVisible === 'undefined' || mmVisible) ? 'block' : 'none';
      minimap.style.zIndex = '7000';
      minimap.style.pointerEvents = 'auto';
    }

    if (mmToggle) {
      document.body.appendChild(mmToggle);
      mmToggle.style.position = 'fixed';
      mmToggle.style.right = '8px';
      mmToggle.style.bottom = '112px';
      mmToggle.style.zIndex = '7001';
    }
  }

  function normalizeQolText() {
    const helpBtn = document.getElementById('btn-keyboard-help');
    if (helpBtn) helpBtn.textContent = 'Shortcuts';
    const emptyHint = document.getElementById('empty-hint');
    if (emptyHint && emptyHint.dataset.enhanced === '1') {
      const hero = emptyHint.querySelector('.eh-hero');
      if (hero) hero.textContent = '+';
      const copy = emptyHint.querySelector('.eh-copy');
      if (copy) copy.innerHTML = 'Drag a unit from the palette, click <b>Add Root</b>, or double-click the canvas to drop your first unit.';
    }
  }

  setTimeout(enhanceEmptyState, 120);
  setTimeout(addQuickCanvasActions, 150);
  setTimeout(improveSearchInputs, 180);
  setTimeout(addSearchClearButtons, 220);
  setTimeout(setupPaletteControls, 260);
  setTimeout(setupPanelShortcuts, 300);
  setTimeout(enforceLayoutFixes, 400);
  setTimeout(normalizeQolText, 420);
  window.addEventListener('resize', enforceLayoutFixes);
  document.addEventListener('click', () => setTimeout(enforceLayoutFixes, 0), true);
  
})();
