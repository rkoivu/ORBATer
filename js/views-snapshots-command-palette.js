(function(){
  const LS_VIEWS='orbat_saved_views_v1';
  const LS_SNAPS='orbat_version_snaps_v1';
  let orbatMode=(()=>{try{return localStorage.getItem('orbat_mode_v1')||'admin';}catch(e){return 'admin';}})();
  let lastAutoDiffBase='';

  // Tabs for multiple canvases
  let tabs = (()=>{try{return JSON.parse(localStorage.getItem('orbat_tabs_v1')||'[{"id":"default","name":"Main","nodes":{},"selectedId":null}]')}catch(e){return [{"id":"default","name":"Main","nodes":{},"selectedId":null}]}})();
  let currentTabId = 'default';
  let activeTabMenuId = null;

  function saveTabs(){ try{ localStorage.setItem('orbat_tabs_v1', JSON.stringify(tabs)); }catch(e){ console.warn('Failed to save tabs:', e); } }
  function cloneTabDoc(tab){
    if(tab?.doc) return JSON.parse(JSON.stringify(tab.doc));
    return {
      nodes: JSON.parse(JSON.stringify(tab?.nodes || {})),
      selectedId: tab?.selectedId || null,
      multiSel: [...(tab?.multiSel || [])],
      nodeIdC: tab?.nodeIdC || 1
    };
  }
  function nextTabName(baseName='Tab'){
    const existing = new Set(tabs.map(t => String(t.name || '').toLowerCase()));
    if(!existing.has(String(baseName).toLowerCase())) return baseName;
    let idx = 2;
    let candidate = `${baseName} Copy`;
    while(existing.has(candidate.toLowerCase())){
      candidate = `${baseName} Copy ${idx++}`;
    }
    return candidate;
  }

  // Check for readonly mode
  const urlParams = new URLSearchParams(window.location.search);
  const readonly = urlParams.get('readonly') === '1';
  const sharedViewId = urlParams.get('view');
  if (readonly) {
    document.body.classList.add('readonly-mode');
    // Disable editing buttons, etc.
    // This is a basic implementation; more can be added
  }
  if (sharedViewId) {
    // Load the shared view
    setTimeout(() => {
      window.__loadView(sharedViewId);
    }, 100);
  }

  // Layout mode
  window.layoutMode = localStorage.getItem('orbat_layout_mode') || 'tree';
  window.setLayoutMode = function(mode){ window.layoutMode = mode; try{ localStorage.setItem('orbat_layout_mode', mode); }catch(e){ console.warn('Failed to save layout mode:', e); } };
  setTimeout(() => { const sel = q('layout-mode-sel'); if(sel) sel.value = window.layoutMode; }, 100);

  function toast(msg){ try{ (window.showToast||function(){})(msg); }catch(e){} }
  function q(id){ return document.getElementById(id); }
  function ensureBtn(id,text,title,onclick,beforeId){
    if(q(id)) return q(id);
    const b=document.createElement('button'); b.className='tb-btn'; b.id=id; b.textContent=text; if(title) b.title=title; b.onclick=onclick;
    const ref=beforeId?q(beforeId):null; const top=q('topbar'); if(ref&&top) top.insertBefore(b, ref); else if(top) top.appendChild(b);
    return b;
  }
  function ensureModal(id,title,inner){
    if(q(id)) return q(id);
    const ov=document.createElement('div'); ov.className='modal-ov'; ov.id=id;
    ov.innerHTML=`<div class="modal-box"><h2>${title} <span class="modal-x" onclick="closeModal('${id}')">✕</span></h2>${inner}</div>`;
    document.body.appendChild(ov); return ov;
  }
  function ensureTabMenu(){
    let menu = q('tab-context-menu');
    if(menu) return menu;
    const style = document.createElement('style');
    style.textContent = `
      #tab-context-menu{position:fixed;display:none;min-width:168px;padding:6px;background:rgba(15,23,42,.97);border:1px solid rgba(148,163,184,.28);border-radius:10px;box-shadow:0 16px 32px rgba(2,6,23,.4);z-index:12000}
      #tab-context-menu.open{display:block}
      #tab-context-menu button{display:flex;width:100%;align-items:center;justify-content:space-between;gap:12px;padding:8px 10px;border:0;background:transparent;color:var(--text);font:600 12px 'Barlow',sans-serif;text-align:left;cursor:pointer;border-radius:7px}
      #tab-context-menu button:hover{background:rgba(59,130,246,.14)}
      #tab-context-menu button[disabled]{opacity:.45;cursor:not-allowed}
      #tab-context-menu .hint{color:var(--text2);font:11px 'Share Tech Mono',monospace}
    `;
    document.head.appendChild(style);
    menu = document.createElement('div');
    menu.id = 'tab-context-menu';
    menu.innerHTML = `
      <button type="button" data-act="rename"><span>Rename tab</span><span class="hint">F2</span></button>
      <button type="button" data-act="duplicate"><span>Duplicate tab</span><span class="hint">Ctrl+Shift+D</span></button>
      <button type="button" data-act="close"><span>Close tab</span><span class="hint">Ctrl+W</span></button>
    `;
    menu.addEventListener('click', ev => {
      const action = ev.target.closest('button')?.dataset.act;
      if(!action || !activeTabMenuId) return;
      if(action === 'rename') window.__renameTabPrompt(activeTabMenuId);
      if(action === 'duplicate') window.__duplicateTab(activeTabMenuId);
      if(action === 'close') window.__closeTab(activeTabMenuId);
      hideTabMenu();
    });
    document.body.appendChild(menu);
    document.addEventListener('click', ev => {
      if(!menu.classList.contains('open')) return;
      if(ev.target.closest('#tab-context-menu')) return;
      hideTabMenu();
    }, true);
    document.addEventListener('keydown', ev => {
      if(ev.key === 'Escape' && menu.classList.contains('open')) hideTabMenu();
    }, true);
    window.addEventListener('resize', hideTabMenu);
    window.addEventListener('scroll', hideTabMenu, true);
    return menu;
  }
  function hideTabMenu(){
    const menu = q('tab-context-menu');
    if(menu) menu.classList.remove('open');
    activeTabMenuId = null;
  }
  function openTabMenu(tabId, clientX, clientY){
    const menu = ensureTabMenu();
    activeTabMenuId = tabId;
    const closable = tabId !== 'default' && tabs.length > 1;
    const closeBtn = menu.querySelector('[data-act="close"]');
    if(closeBtn) closeBtn.disabled = !closable;
    menu.style.left = '0px';
    menu.style.top = '0px';
    menu.classList.add('open');
    const rect = menu.getBoundingClientRect();
    const left = Math.min(window.innerWidth - rect.width - 8, Math.max(8, clientX));
    const top = Math.min(window.innerHeight - rect.height - 8, Math.max(8, clientY));
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
  }
  function open(id){ try{ openModal(id); }catch(e){ q(id)?.classList.add('open'); } }
  function close(id){ try{ closeModal(id); }catch(e){ q(id)?.classList.remove('open'); } }
  function esc(s){ return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function getViews(){ try{return JSON.parse(localStorage.getItem(LS_VIEWS)||'[]')}catch(e){return []} }
  function setViews(v){ try{ localStorage.setItem(LS_VIEWS, JSON.stringify(v)); }catch(e){ console.warn('Failed to save views:', e); } }
  function getSnaps(){ try{return JSON.parse(localStorage.getItem(LS_SNAPS)||'[]')}catch(e){return []} }
  function setSnaps(v){ try{ localStorage.setItem(LS_SNAPS, JSON.stringify(v.slice(0,40))); }catch(e){ console.warn('Failed to save snapshots:', e); } }
  function currentTransform(){
    const scaleVal = Number.isFinite(window.zoom) ? window.zoom : (typeof zoom!=='undefined' && Number.isFinite(zoom) ? zoom : 1);
    const panXVal = Number.isFinite(window.panX) ? window.panX : (typeof panX!=='undefined' && Number.isFinite(panX) ? panX : 0);
    const panYVal = Number.isFinite(window.panY) ? window.panY : (typeof panY!=='undefined' && Number.isFinite(panY) ? panY : 0);
    const selectedVal = window.selectedId ?? (typeof selectedId!=='undefined' ? selectedId : null);
    const multiVal = window.multiSel ?? (typeof multiSel!=='undefined' ? multiSel : []);
    return {scale:scaleVal, panX:panXVal, panY:panYVal, selected:selectedVal, multi:[...multiVal], mode:orbatMode};
  }
  function applyTransformState(v){
    if(!v) return;
    // Write to the actual closure vars used by applyTransform
    try{
      if(typeof zoom!=='undefined' && v.scale!=null) { zoom=v.scale; window.zoom=zoom; }
      if(typeof panX!=='undefined' && v.panX!=null) { panX=v.panX; window.panX=panX; }
      if(typeof panY!=='undefined' && v.panY!=null) { panY=v.panY; window.panY=panY; }
    }catch(e){}
    if(typeof window.applyTransform==='function') window.applyTransform();
    if(v.selected && window.nodes?.[v.selected]) window.selectNode(v.selected);
  }
  function summariseState(doc){
    try{ const obj=JSON.parse(doc); const nodes=obj.nodes||{}; const arr=Object.values(nodes); return {count:arr.length, roots:arr.filter(n=>!n.parentId).length}; }catch(e){ return {count:0,roots:0}; }
  }
  function diffSummary(a,b){
    try{
      const A=JSON.parse(a||'{}').nodes||{}, B=JSON.parse(b||'{}').nodes||{};
      const aKeys=new Set(Object.keys(A)), bKeys=new Set(Object.keys(B));
      let added=0, removed=0, changed=0;
      for(const k of bKeys){ if(!aKeys.has(k)) added++; else if(JSON.stringify(A[k])!==JSON.stringify(B[k])) changed++; }
      for(const k of aKeys){ if(!bKeys.has(k)) removed++; }
      return {added,removed,changed};
    }catch(e){ return {added:0,removed:0,changed:0}; }
  }
  function snapshotNow(reason='Manual snapshot'){
    if(typeof window.serializeDocument!=='function') return;
    const state = JSON.stringify(window.serializeDocument());
    // Guard: skip snapshot if state is too large (base64 images etc) to avoid localStorage overflow
    if(state.length > 150000 && reason !== 'Manual snapshot'){
      console.warn('Snapshot skipped: state too large ('+Math.round(state.length/1024)+'KB)');
      return;
    }
    const snaps=getSnaps();
    if(snaps[0]?.state===state && reason!=='Manual snapshot') return;
    const prev=snaps[0]?.state||'';
    const diff=diffSummary(prev,state);
    snaps.unshift({id:Date.now()+Math.random().toString(16).slice(2), ts:new Date().toISOString(), reason, state, diff, transform:currentTransform()});
    setSnaps(snaps);
    renderSnapshots();
  }
  function renderViews(){
    const box=q('view-list'); if(!box) return; const views=getViews();
    if(!views.length){ box.innerHTML='<div class="panel-help">No saved views yet.</div>'; return; }
    box.innerHTML=views.map(v=>`<div class="view-row"><div><div style="font-weight:700">${esc(v.name)}</div><div class="panel-help">Scale ${Math.round((v.transform?.scale||1)*100)}%</div></div><div style="display:flex;gap:6px"><button class="pb" onclick="window.__loadView('${v.id}')">Load</button><button class="pb" onclick="window.__shareView('${v.id}')">Share</button><button class="pb del" onclick="window.__deleteView('${v.id}')">Delete</button></div></div>`).join('');
  }
  function renderSnapshots(){
    const box=q('snapshot-list'); if(!box) return; const snaps=getSnaps();
    if(!snaps.length){ box.innerHTML='<div class="panel-help">No snapshots yet.</div>'; return; }
    box.innerHTML=snaps.map(s=>`<div class="snap-row"><div><div style="font-weight:700">${esc(s.reason)}</div><div class="panel-help">${new Date(s.ts).toLocaleString()} · <span class="diff-pill">+${s.diff?.added||0} −${s.diff?.removed||0} Δ${s.diff?.changed||0}</span></div></div><div style="display:flex;gap:6px"><button class="pb" onclick="window.__restoreSnap('${s.id}')">Restore</button><button class="pb" onclick="window.__loadSnapView('${s.id}')">View</button><button class="pb del" onclick="window.__deleteSnap('${s.id}')">Delete</button></div></div>`).join('');
    // Update slider
    const slider = q('phase-slider');
    if(slider) {
      slider.max = snaps.length - 1;
      slider.value = 0;
      updatePhaseLabel(0);
      slider.oninput = () => { updatePhaseLabel(slider.value); const currentSnaps=getSnaps(); if(currentSnaps[slider.value]) window.__loadPhaseSnap(currentSnaps[slider.value].id); };
    }
  }
  function updatePhaseLabel(idx){ const snaps=getSnaps(); const s=snaps[idx]; q('phase-label').textContent = s ? new Date(s.ts).toLocaleString() + ' - ' + s.reason : 'Current'; }
  window.__loadPhaseSnap = function(id){ const s=getSnaps().find(x=>x.id===id); if(!s) return; if(typeof window.restoreState==='function') window.restoreState(s.state); applyTransformState(s.transform); if(typeof window.updSB==='function') window.updSB(); };
  window.__loadView=function(id){ const v=getViews().find(x=>x.id===id); if(!v) return; applyTransformState(v.transform); close('view-modal'); toast('View loaded'); };
  window.__shareView=function(id){ const url = window.location.origin + window.location.pathname + '?view=' + encodeURIComponent(id) + '&readonly=1'; navigator.clipboard.writeText(url).then(() => toast('Shareable link copied to clipboard')).catch(() => toast('Link: ' + url)); };
  window.__deleteView=function(id){ setViews(getViews().filter(x=>x.id!==id)); renderViews(); };
  window.__restoreSnap=function(id){ const s=getSnaps().find(x=>x.id===id); if(!s) return; if(typeof window.restoreState==='function') window.restoreState(s.state); applyTransformState(s.transform); if(typeof window.updSB==='function') window.updSB(); close('snapshot-modal'); toast('Snapshot restored'); };
  window.__loadSnapView=function(id){ const s=getSnaps().find(x=>x.id===id); if(!s) return; applyTransformState(s.transform); toast('Snapshot camera restored'); };
  window.__deleteSnap=function(id){ setSnaps(getSnaps().filter(x=>x.id!==id)); renderSnapshots(); };

  function ensureViewsUI(){
    // Add tab bar
    if (!q('tab-bar')) {
      const tb = document.createElement('div'); tb.id='tab-bar'; tb.style.cssText='display:flex;background:#f0f0f0;border-bottom:1px solid #ccc;padding:4px;';
      document.body.insertBefore(tb, q('topbar'));
      renderTabs();
    }

    ensureBtn('btn-org-toggle','≋ ORBAT','Toggle admin/task-organised ORBAT',()=>{ orbatMode=orbatMode==='admin'?'task':'admin'; try{localStorage.setItem('orbat_mode_v1',orbatMode);}catch(e){} updateOrgBtn(); if(typeof window.autoLayout==='function') window.autoLayout(); toast(orbatMode==='admin'?'Admin ORBAT':'Task-organised ORBAT'); },'btn-random-orbat');
    ensureBtn('btn-views','👁 Views','Saved views',()=>{ renderViews(); open('view-modal'); },'btn-org-toggle');
    ensureBtn('btn-snapshots','🗂 Snaps','Version snapshots',()=>{ renderSnapshots(); open('snapshot-modal'); },'btn-views');
    ensureBtn('btn-export-pdf','⤓ PDF','Export PDF',()=>window.exportPDF&&window.exportPDF(),'btn-random-orbat');
    ensureBtn('btn-cmdk','⌘K','Command palette',()=>window.openCommandPalette&&window.openCommandPalette(),'btn-export-pdf');
    ensureModal('view-modal','Saved Views',`<div class="fg"><label>Save current view as</label><div style="display:flex;gap:8px"><input id="view-name-input" type="text" placeholder="e.g. Corps overview"><button class="pb" style="width:auto;margin:0" id="save-view-btn">Save</button></div></div><div id="view-list"></div>`);
    ensureModal('snapshot-modal','Version Snapshots',`<div style="display:flex;gap:8px;margin-bottom:10px"><button class="pb" style="width:auto;margin:0" id="snap-now-btn">Create snapshot</button></div><div id="timeline-slider" style="margin-bottom:10px"><input type="range" id="phase-slider" min="0" max="0" value="0" style="width:100%"><div id="phase-label"></div></div><div id="snapshot-list"></div>`);
    ensureModal('cmdk-modal','Command Palette',`<input id="cmdk-input" placeholder="Type a command…"><div id="cmdk-list"></div><div class="cmdk-hint">Enter to run · Esc to close · Cmd/Ctrl+K to open</div>`);
    q('save-view-btn')?.addEventListener('click',()=>{ const name=q('view-name-input').value.trim(); if(!name) return; const views=getViews(); views.unshift({id:Date.now()+Math.random().toString(16).slice(2), name, transform:currentTransform()}); setViews(views.slice(0,20)); q('view-name-input').value=''; renderViews(); toast('View saved'); });
    q('snap-now-btn')?.addEventListener('click',()=>{ snapshotNow('Manual snapshot'); toast('Snapshot created'); });
    updateOrgBtn(); renderViews(); renderSnapshots();
  }
  let tabDirtyStates = {}; // Track dirty state per tab
  
  function renderTabs(){
    const tb = q('tab-bar'); if(!tb) return;
    tb.innerHTML = tabs.map(t => {
      const isDirty = tabDirtyStates[t.id] || false;
      const dirtyMark = isDirty ? '●' : '';
      return `<div class="tab ${t.id === currentTabId ? 'active' : ''}" onclick="window.__switchTab('${t.id}')" title="${isDirty ? 'Unsaved changes' : ''}">${dirtyMark} ${esc(t.name)} <span onclick="event.stopPropagation(); window.__closeTab('${t.id}')">✕</span></div>`;
    }).join('') + '<button onclick="window.__newTab()" title="New tab">+</button>';
    tb.innerHTML += '<style>.tab {padding:4px 8px; border:1px solid #ccc; cursor:pointer; background:#fff; position:relative;} .tab.active {background:#e0e0e0; border-color:#666;} .tab:hover {background:#f0f0f0;} .tab[title] {font-weight:600;}</style>';
  }
  
  renderTabs = function(){
    const tb = q('tab-bar'); if(!tb) return;
    tb.innerHTML = tabs.map(t => {
      const isDirty = tabDirtyStates[t.id] || false;
      const dirtyMark = isDirty ? '<span class="tab-dirty" aria-hidden="true">●</span>' : '';
      const closeBtn = t.id === 'default' ? '' : `<button class="tab-close" type="button" onclick="event.stopPropagation(); window.__closeTab('${t.id}')" aria-label="Close ${esc(t.name)}">×</button>`;
      return `<div class="tab ${t.id === currentTabId ? 'active' : ''}" onclick="window.__switchTab('${t.id}')" ondblclick="event.stopPropagation(); window.__renameTabPrompt('${t.id}')" title="${isDirty ? 'Unsaved changes · Double-click to rename' : 'Double-click to rename'}">${dirtyMark}<span class="tab-label">${esc(t.name)}</span>${closeBtn}</div>`;
    }).join('') + '<button class="tab-add" type="button" onclick="window.__newTab()" title="New tab" aria-label="New tab">+</button>';
  };

  window.__renameTabPrompt = function(id){
    const tab = tabs.find(t=>t.id===id);
    const bar = q('tab-bar');
    if(!tab || !bar) return;
    renderTabs();
    const tabEls = [...bar.querySelectorAll('.tab')];
    const idx = tabs.findIndex(t=>t.id===id);
    const el = tabEls[idx];
    if(!el) return;
    const label = el.querySelector('.tab-label');
    if(!label) return;
    const oldName = tab.name || 'Tab';
    label.innerHTML = '';
    const input = document.createElement('input');
    input.className = 'tab-rename-input';
    input.type = 'text';
    input.maxLength = 40;
    input.value = oldName;
    label.appendChild(input);
    input.focus();
    input.select();
    let done = false;
    const finish = commit => {
      if(done) return;
      done = true;
      if(commit){
        const nextName = input.value.trim() || oldName;
        tab.name = nextName;
        saveTabs();
      }
      renderTabs();
    };
    input.addEventListener('click', ev => ev.stopPropagation());
    input.addEventListener('dblclick', ev => ev.stopPropagation());
    input.addEventListener('keydown', ev => {
      if(ev.key === 'Enter'){ ev.preventDefault(); finish(true); }
      if(ev.key === 'Escape'){ ev.preventDefault(); finish(false); }
    });
    input.addEventListener('blur', ()=>finish(true), {once:true});
  };
  const prevRenderTabsWithRename = renderTabs;
  renderTabs = function(){
    prevRenderTabsWithRename();
    const tb = q('tab-bar');
    if(!tb) return;
    [...tb.querySelectorAll('.tab')].forEach(el => {
      if(el.dataset.menuBound === '1') return;
      const tabId = el.getAttribute('onclick')?.match(/__switchTab\('([^']+)'\)/)?.[1];
      if(tabId) el.dataset.tabId = tabId;
      el.dataset.menuBound = '1';
      el.title = el.classList.contains('active') ? 'Double-click or right-click for tab actions' : (el.title ? `${el.title} · Right-click for tab actions` : 'Double-click or right-click for tab actions');
      el.addEventListener('contextmenu', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        const id = el.dataset.tabId;
        if(id) openTabMenu(id, ev.clientX, ev.clientY);
      });
    });
  };

  function markTabDirty(tabId = currentTabId){
    if(!tabId) return;
    if(tabDirtyStates[tabId] !== true) {
      tabDirtyStates[tabId] = true;
      renderTabs();
    }
  }
  
  function clearTabDirty(tabId = currentTabId){
    if(!tabId) return;
    if(tabDirtyStates[tabId] !== false) {
      tabDirtyStates[tabId] = false;
      renderTabs();
    }
  }
  
  // Hook into existing saveState to clear tab dirty flag and persist current tab data
  const prevSaveState = (typeof window.saveState === 'function') ? window.saveState : null;
  if(prevSaveState) {
    window.saveState = function(){
      const result = prevSaveState.apply(this, arguments);
      const currTab = tabs.find(t=>t.id===currentTabId);
      if(currTab && typeof window.serializeDocument==='function'){
        currTab.doc = JSON.parse(JSON.stringify(window.serializeDocument()));
        currTab.selectedId = window.selectedId || null;
        currTab.multiSel = [...(window.multiSel || [])];
        saveTabs();
      }
      clearTabDirty(currentTabId);
      return result;
    };
  }
  
  // Hook into applyDocumentState to clear tab dirty flag
  const prevApplyDocumentState = (typeof window.applyDocumentState === 'function') ? window.applyDocumentState : null;
  if(prevApplyDocumentState) {
    window.applyDocumentState = function(){
      const result = prevApplyDocumentState.apply(this, arguments);
      clearTabDirty(currentTabId);
      return result;
    };
  }
  
  // Track mutations as dirty
  const markDirtyListener = () => markTabDirty(currentTabId);
  document.addEventListener('input', markDirtyListener, true);
  document.addEventListener('change', markDirtyListener, true);
  window.__switchTab = function(id){
    if(id === currentTabId) return;
    // Save current state to current tab
    const currTab = tabs.find(t=>t.id===currentTabId);
    if(currTab && typeof window.serializeDocument==='function'){
      currTab.doc = JSON.parse(JSON.stringify(window.serializeDocument()));
      currTab.selectedId = window.selectedId || null;
      currTab.multiSel = [...(window.multiSel || [])];
      saveTabs();
    }
    // Load new tab state
    const tab = tabs.find(t=>t.id===id);
    if(tab){
      currentTabId = id;
      if(tab.doc){
        applyDocumentState(tab.doc,{trackHistory:false,preserveView:true});
        window.multiSel = new Set(tab.multiSel || []);
        window.selectedId = tab.selectedId || null;
        if(window.selectedId && typeof window.selectNode==='function') window.selectNode(window.selectedId);
      } else {
        window.nodes = JSON.parse(JSON.stringify(tab.nodes || {}));
        window.selectedId = tab.selectedId || null;
        window.multiSel = new Set(tab.multiSel || []);
        window.nodeIdC = tab.nodeIdC || 1;
        if(typeof customTypes !== 'undefined' && Array.isArray(tab.customTypes)) customTypes = JSON.parse(JSON.stringify(tab.customTypes));
        showRelLabels = tab.showRelLabels !== false;
        useSymbolPackImages = tab.useSymbolPackImages !== false;
        const opNameInput = document.getElementById('op-name-input');
        if(opNameInput) opNameInput.value = tab.opName || 'OPERATION';
        if(typeof buildPalette==='function') buildPalette();
        if(typeof buildTypeSelect==='function') buildTypeSelect();
        if(typeof clearCanvas === 'function') clearCanvas();
        Object.keys(window.nodes||{}).forEach(nid=> { if(typeof renderNode === 'function') renderNode(nid); });
        if(typeof updSB === 'function') updSB();
        if(typeof syncRelLabelBtn==='function') syncRelLabelBtn();
        if(typeof syncIconModeBtn==='function') syncIconModeBtn();
      }
      clearTabDirty(id);
      renderTabs();
      saveTabs();
    }
  };
  window.__closeTab = function(id){
    if(id === 'default' || tabs.length <= 1) return;
    hideTabMenu();
    const idx = tabs.findIndex(t=>t.id===id);
    if(idx > -1){
      tabs.splice(idx, 1);
      saveTabs();
      if(currentTabId === id){
        const nextId = tabs[0].id;
        window.__switchTab(nextId);
      } else {
        renderTabs();
      }
    }
  };
  window.__duplicateTab = function(id = currentTabId){
    const sourceTab = tabs.find(t=>t.id===id);
    if(!sourceTab) return;
    const newId = Date.now() + Math.random().toString(16).slice(2);
    const liveSelected = id === currentTabId ? (window.selectedId || null) : (sourceTab.selectedId || null);
    const liveMultiSel = id === currentTabId ? [...(window.multiSel || [])] : [...(sourceTab.multiSel || [])];
    const liveDoc = (id === currentTabId && typeof window.serializeDocument === 'function')
      ? JSON.parse(JSON.stringify(window.serializeDocument()))
      : cloneTabDoc(sourceTab);
    const dup = {
      id: newId,
      name: nextTabName(sourceTab.name || 'Tab'),
      doc: liveDoc,
      selectedId: liveSelected,
      multiSel: liveMultiSel,
      nodeIdC: sourceTab.nodeIdC || 1
    };
    tabs.push(dup);
    tabDirtyStates[newId] = false;
    saveTabs();
    window.__switchTab(newId);
    toast('Tab duplicated');
  };
  window.__newTab = function(){
    const newId = Date.now() + Math.random().toString(16).slice(2);
    const newName = 'Tab ' + (tabs.length + 1);
    tabs.push({id: newId, name: newName, nodes: {}, selectedId: null, multiSel: [], nodeIdC: 1});
    saveTabs();
    window.__switchTab(newId);
  };
  function loadTab(id){ /* placeholder */ }

  // Animated layout transitions
  function animateNodes(){ document.querySelectorAll('.orbat-node').forEach(el=>{ el.classList.add('anim-layout'); setTimeout(()=>el.classList.remove('anim-layout'), 420); }); }
  if(window.autoLayout && !window.autoLayout._v15Anim){ const prev=window.autoLayout; window.autoLayout=function(){ animateNodes(); const r=prev.apply(this, arguments); setTimeout(animateNodes, 10); return r; }; window.autoLayout._v15Anim=true; }

  // Task-organised vs admin layout sorting + sibling drag/drop reorder
  function getSiblingSortVal(n){
    if(orbatMode==='task') return `${(n.task||'').toLowerCase()}|${(n.reltype||'').toLowerCase()}|${n.taskOrder??9999}|${(n.name||'').toLowerCase()}`;
    return `${n.adminOrder??9999}|${(n.designation||'').toLowerCase()}|${(n.name||'').toLowerCase()}`;
  }
  if(window.autoLayout && !window.autoLayout._v15Sort){
    const prev=window.autoLayout;
    window.autoLayout=function(onlyIds){
      try{
        const byParent={}; Object.values(window.nodes||{}).forEach(n=>{ const k=n.parentId||'root'; (byParent[k]||(byParent[k]=[])).push(n); });
        Object.values(byParent).forEach(arr=>{ arr.sort((a,b)=>getSiblingSortVal(a).localeCompare(getSiblingSortVal(b))); arr.forEach((n,i)=>{ if(orbatMode==='task') n.taskOrder=i; else n.adminOrder=i; }); });
      }catch(e){}
      return prev.apply(this, arguments);
    };
    window.autoLayout._v15Sort=true;
  }
  let dragStartInfo=null;
  document.addEventListener('mousedown',e=>{ const el=e.target.closest?.('.orbat-node'); if(!el) return; const id=el.id.replace('el-',''); const n=window.nodes?.[id]; if(!n) return; dragStartInfo={id,parentId:n.parentId,startX:n.x,startY:n.y}; }, true);
  document.addEventListener('mouseup',e=>{
    if(!dragStartInfo || !window.nodes?.[dragStartInfo.id]){ dragStartInfo=null; return; }
    const n=window.nodes[dragStartInfo.id];
    if(n.parentId===dragStartInfo.parentId && (Math.abs((n.x||0)-dragStartInfo.startX)>8 || Math.abs((n.y||0)-dragStartInfo.startY)>8)){
      const sibs=Object.values(window.nodes).filter(x=>(x.parentId||null)===(n.parentId||null));
      sibs.sort((a,b)=>(a.x-b.x)||(a.y-b.y));
      sibs.forEach((s,i)=>{ if(orbatMode==='task') s.taskOrder=i; else s.adminOrder=i; });
      toast('Sibling order updated');
      if(window.saveState) window.saveState();
    }
    dragStartInfo=null;
  }, true);

  // Undo history panel enhancement
  function enhanceHistory(){
    const btn=q('btn-history'); if(!btn) return; btn.textContent='🕘 Undo Panel'; btn.title='Undo history panel';
    const old=btn.onclick; btn.onclick=function(){ if(old) old(); const list=q('hist-list'); if(list){ [...list.children].forEach((row,idx)=>{ row.insertAdjacentHTML('beforeend', `<span class="panel-help">#${idx}</span>`); }); } };
  }

  // Autosave version diffing by wrapping scheduleAutosave/saveState
  if(window.saveState && !window.saveState._v15Diff){
    const prev=window.saveState;
    window.saveState=function(){ const r=prev.apply(this, arguments); try{ const now=JSON.stringify(window.serializeDocument?.()||{}); if(lastAutoDiffBase && now!==lastAutoDiffBase){ const d=diffSummary(lastAutoDiffBase, now); if((d.added+d.removed+d.changed)>0){ snapshotNow('Autosave diff'); } } lastAutoDiffBase=now; }catch(e){} return r; };
    window.saveState._v15Diff=true;
  }
  setTimeout(()=>{ try{ lastAutoDiffBase=JSON.stringify(window.serializeDocument?.()||{}); }catch(e){} }, 100);

  // PDF export
  window.exportPDF=async function(){
    try{
      const target=q('canvas-wrap');
      const cv=await html2canvas(target,{backgroundColor:'#ffffff',scale:2,useCORS:true});
      const img=cv.toDataURL('image/jpeg',0.92);
      const bin=atob(img.split(',')[1]);
      const bytes=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
      const w=cv.width, h=cv.height; const pageW=842, pageH=595;
      const scale=Math.min(pageW/w, pageH/h); const drawW=Math.round(w*scale), drawH=Math.round(h*scale); const offX=Math.round((pageW-drawW)/2), offY=Math.round((pageH-drawH)/2);
      const chunks=[]; const add=s=>chunks.push(typeof s==='string'?new TextEncoder().encode(s):s);
      const offsets=[]; const pushObj=(id,body)=>{ offsets[id]=chunks.reduce((a,b)=>a+b.length,0); add(`${id} 0 obj\n${body}\nendobj\n`); };
      add('%PDF-1.4\n');
      pushObj(1,'<< /Type /Catalog /Pages 2 0 R >>');
      pushObj(2,'<< /Type /Pages /Count 1 /Kids [3 0 R] >>');
      pushObj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
      offsets[4]=chunks.reduce((a,b)=>a+b.length,0);
      add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`);
      add(bytes);
      add('\nendstream\nendobj\n');
      const content=`q\n${drawW} 0 0 ${drawH} ${offX} ${offY} cm\n/Im0 Do\nQ`;
      pushObj(5,`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
      const xrefPos=chunks.reduce((a,b)=>a+b.length,0);
      add('xref\n0 6\n0000000000 65535 f \n');
      for(let i=1;i<=5;i++) add(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);
      add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`);
      const blob=new Blob(chunks,{type:'application/pdf'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download='orbat-export.pdf';
      a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href),1500);
      toast('PDF exported');
    }catch(err){ console.error(err); toast('PDF export failed'); }
  };
  // Command palette
  const commands=[
    {name:'Add root unit', run:()=>window.addRootUnit&&window.addRootUnit()},
    {name:'Auto layout', run:()=>window.autoLayout&&window.autoLayout()},
    {name:'Fit screen', run:()=>window.fitScreen&&window.fitScreen()},
    {name:'Rename current tab', run:()=>window.__renameTabPrompt&&window.__renameTabPrompt(currentTabId)},
    {name:'Duplicate current tab', run:()=>window.__duplicateTab&&window.__duplicateTab(currentTabId)},
    {name:'Toggle ORBAT mode', run:()=>q('btn-org-toggle')?.click()},
    {name:'Open saved views', run:()=>q('btn-views')?.click()},
    {name:'Open snapshots', run:()=>q('btn-snapshots')?.click()},
    {name:'Export PDF', run:()=>window.exportPDF&&window.exportPDF()},
    {name:'Import text outline', run:()=>window.openOutlineModal&&window.openOutlineModal()},
    {name:'Toggle minimap', run:()=>window.toggleMinimap&&window.toggleMinimap()},
    {name:'Undo', run:()=>window.undo&&window.undo()},
    {name:'Redo', run:()=>window.redo&&window.redo()},
    {name:'Save snapshot', run:()=>snapshotNow('Manual snapshot')},
  ];
  function renderCmdk(filter=''){
    const box=q('cmdk-list'); if(!box) return; const term=filter.trim().toLowerCase();
    const items=commands.filter(c=>!term||c.name.toLowerCase().includes(term));
    box.innerHTML=items.map((c,i)=>`<div class="cmdk-row"><div>${esc(c.name)}</div><button class="pb" data-cmd-idx="${i}" style="width:auto;margin:0">Run</button></div>`).join('') || '<div class="panel-help">No commands</div>';
    [...box.querySelectorAll('[data-cmd-idx]')].forEach((btn,idx)=>btn.onclick=()=>{ items[idx].run(); close('cmdk-modal'); });
  }
  window.openCommandPalette=function(){ renderCmdk(''); open('cmdk-modal'); setTimeout(()=>q('cmdk-input')?.focus(),30); };
  document.addEventListener('keydown',e=>{
    const tag = e.target?.tagName || '';
    const isTyping = tag==='INPUT' || tag==='TEXTAREA' || tag==='SELECT' || e.target?.isContentEditable;
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); window.openCommandPalette(); }
    if(e.key==='Escape' && q('cmdk-modal')?.classList.contains('open')) close('cmdk-modal');
    if(isTyping) return;
    if(e.key === 'F2'){ e.preventDefault(); window.__renameTabPrompt(currentTabId); return; }
    if((e.metaKey||e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'd'){ e.preventDefault(); window.__duplicateTab(currentTabId); return; }
    if((e.metaKey||e.ctrlKey) && e.key.toLowerCase() === 'w'){ e.preventDefault(); window.__closeTab(currentTabId); }
  });
  setTimeout(()=>{ q('cmdk-input')?.addEventListener('input',e=>renderCmdk(e.target.value)); q('cmdk-input')?.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const btn=document.querySelector('#cmdk-list [data-cmd-idx]'); if(btn) btn.click(); }}); }, 100);

  // init
  setTimeout(()=>{ 
    ensureViewsUI(); 
    enhanceHistory(); 
    // Initialize default tab with current state
    if(tabs.length === 1 && tabs[0].id === 'default' && typeof window.serializeDocument==='function'){
      tabs[0].doc = JSON.parse(JSON.stringify(window.serializeDocument()));
      tabs[0].selectedId = window.selectedId || null;
      tabs[0].multiSel = [...(window.multiSel || [])];
      saveTabs();
    }
    renderTabs();
  }, 120);
})();
