(function(){
  const LS_VIEWS='orbat_saved_views_v1';
  const LS_SNAPS='orbat_version_snaps_v1';
  const LS_RECENTS='orbat_recent_docs_v1';
  let orbatMode=(()=>{try{return localStorage.getItem('orbat_mode_v1')||'admin';}catch(e){return 'admin';}})();
  let lastAutoDiffBase='';

  function readSelectedId(){
    return (typeof selectedId!=='undefined') ? selectedId : (window.selectedId ?? null);
  }
  function readMultiSelection(){
    if(typeof multiSel!=='undefined' && multiSel instanceof Set) return [...multiSel];
    if(window.multiSel instanceof Set) return [...window.multiSel];
    if(Array.isArray(window.multiSel)) return [...window.multiSel];
    return [];
  }
  function readNodeMap(){
    return (typeof nodes!=='undefined' && nodes) ? nodes : (window.nodes || {});
  }
  function readOpName(){
    return document.getElementById('op-name-input')?.value?.trim() || 'orbat';
  }
  function createEmptyTabDoc(){
    return {
      schemaVersion: typeof APP_SCHEMA_VERSION!=='undefined' ? APP_SCHEMA_VERSION : 1,
      opName: 'OPERATION',
      nodeIdC: 1,
      textboxIdC: 1,
      nodes: {},
      textboxes: {},
      customTypes: [],
      showRelLabels: true,
      useSymbolPackImages: true,
      minimapVisible: true
    };
  }
  function createDefaultTabView(){
    return {scale:1, panX:24, panY:24, selected:null, multi:[], mode:orbatMode};
  }
  function normalizeTab(tab, idx=0){
    const baseDoc = tab?.doc ? JSON.parse(JSON.stringify(tab.doc)) : createEmptyTabDoc();
    const baseView = tab?.view && typeof tab.view === 'object'
      ? {...createDefaultTabView(), ...JSON.parse(JSON.stringify(tab.view))}
      : createDefaultTabView();
    if(!tab?.doc && tab?.nodes) baseDoc.nodes = JSON.parse(JSON.stringify(tab.nodes));
    if(!tab?.doc && tab?.nodeIdC != null) baseDoc.nodeIdC = tab.nodeIdC;
    if(!tab?.doc && tab?.opName) baseDoc.opName = tab.opName;
    if(!tab?.doc && Array.isArray(tab?.customTypes)) baseDoc.customTypes = JSON.parse(JSON.stringify(tab.customTypes));
    if(!tab?.doc && tab?.showRelLabels === false) baseDoc.showRelLabels = false;
    if(!tab?.doc && tab?.useSymbolPackImages === false) baseDoc.useSymbolPackImages = false;
    return {
      id: tab?.id || (idx === 0 ? 'default' : Date.now() + Math.random().toString(16).slice(2)),
      name: tab?.name || (idx === 0 ? 'Main' : `Tab ${idx + 1}`),
      doc: baseDoc,
      view: baseView,
      selectedId: tab?.selectedId || null,
      multiSel: Array.isArray(tab?.multiSel) ? [...tab.multiSel] : [],
      nodeIdC: baseDoc.nodeIdC || 1
    };
  }

  // Tabs for multiple canvases
  let tabs = (()=>{try{
    const raw = JSON.parse(localStorage.getItem('orbat_tabs_v1')||'[{"id":"default","name":"Main","doc":{"nodes":{},"textboxes":{},"nodeIdC":1,"textboxIdC":1,"customTypes":[],"opName":"OPERATION","showRelLabels":true,"useSymbolPackImages":true,"minimapVisible":true},"selectedId":null,"multiSel":[]}]');
    const arr = Array.isArray(raw) && raw.length ? raw : [{}];
    return arr.map((tab, idx)=>normalizeTab(tab, idx));
  }catch(e){
    return [normalizeTab({id:'default', name:'Main'}, 0)];
  }})();
  let currentTabId = 'default';
  let activeTabMenuId = null;
  let cmdkMatches = [];
  let cmdkActiveIndex = 0;

  function saveTabs(){ try{ localStorage.setItem('orbat_tabs_v1', JSON.stringify(tabs)); }catch(e){ console.warn('Failed to save tabs:', e); toast('Tabs could not be saved. Check browser storage availability.'); } }
  function cloneTabDoc(tab){
    return normalizeTab(tab).doc;
  }
  function cloneTabView(tab){
    return normalizeTab(tab).view;
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
  function countNodes(doc){
    return Object.keys(doc?.nodes || {}).length;
  }
  function isFreshLauncherCandidate(doc){
    if(!doc) return true;
    const name = String(doc.opName || '').trim();
    return countNodes(doc) <= 1 && (!name || name === 'OPERATION' || name === 'OPERATION IRONGATE');
  }

  // Check for readonly mode
  const urlParams = new URLSearchParams(window.location.search);
  const readonly = urlParams.get('readonly') === '1';
  const sharedViewId = urlParams.get('view');
  if (readonly) document.body.classList.add('readonly-mode');
  if (sharedViewId) {
    // Load the shared view
    setTimeout(() => {
      window.__loadView(sharedViewId);
    }, 100);
  }

  // Layout mode
  window.layoutMode = localStorage.getItem('orbat_layout_mode') || 'tree';
  function syncLayoutModeUI(){
    const sel = q('layout-mode-sel');
    if(!sel) return;
    sel.value = window.layoutMode;
    sel.classList.toggle('active', window.layoutMode !== 'tree');
    sel.title = `Layout mode: ${window.layoutMode}`;
  }
  window.setLayoutMode = function(mode){
    window.layoutMode = mode;
    try{ localStorage.setItem('orbat_layout_mode', mode); }catch(e){ console.warn('Failed to save layout mode:', e); }
    syncLayoutModeUI();
  };
  setTimeout(syncLayoutModeUI, 100);

  function toast(msg){ try{ (window.showToast||function(){})(msg); }catch(e){} }
  function q(id){ return document.getElementById(id); }
  function setReadonlyBanner(){
    const banner=q('readonly-banner');
    if(!banner) return;
    if(readonly){
      banner.style.display='block';
      banner.textContent=sharedViewId?'Read-only shared view. Use Share to copy the link again.':'Read-only mode. Editing actions are intentionally limited.';
      return;
    }
    if(sharedViewId){
      banner.style.display='block';
      banner.textContent='Shared camera view loaded. Use Share to copy a view-only link.';
      return;
    }
    banner.style.display='none';
    banner.textContent='';
  }
  function getRecentDocs(){ try{return JSON.parse(localStorage.getItem(LS_RECENTS)||'[]')}catch(e){return []} }
  function setRecentDocs(items){ try{ localStorage.setItem(LS_RECENTS, JSON.stringify(items.slice(0,6))); }catch(e){ console.warn('Failed to save recent docs:', e); toast('Recent diagrams could not be saved.'); } }
  function rememberRecentDoc(doc){
    if(!doc) return;
    const name=String(doc.opName||'OPERATION').trim()||'OPERATION';
    const next={id:Date.now()+Math.random().toString(16).slice(2),name,ts:new Date().toISOString(),units:Object.keys(doc.nodes||{}).length,state:doc};
    const items=[next,...getRecentDocs().filter(item=>item.name!==name)];
    setRecentDocs(items);
  }
  function renderRecentDocs(){
    const box=q('recent-doc-list');
    if(!box) return;
    const items=getRecentDocs();
    if(!items.length){
      box.innerHTML='<div class="panel-help">No recent diagrams yet. Your last saved or restored work will appear here for quick startup access.</div>';
      return;
    }
    box.innerHTML=items.map(item=>`<div class="view-row"><div><div style="font-weight:700">${esc(item.name)}</div><div class="panel-help">${new Date(item.ts).toLocaleString()} · ${item.units||0} unit(s)</div></div><div style="display:flex;gap:6px"><button class="pb" onclick="window.__restoreRecentDoc('${item.id}')">Restore</button></div></div>`).join('');
  }
  // Restoring selection through updSelUI/selectNode keeps all downstream wrappers
  // in sync, including focus dimming, panel state, and stats overlays.
  function restoreTabSelectionState(tab){
    const selected = tab?.selectedId || null;
    const liveNodes = readNodeMap();
    const multi = (tab?.multiSel || []).filter(id=>liveNodes[id]);
    if(selected && typeof window.selectNode === 'function' && liveNodes[selected]){
      window.selectNode(selected);
      return;
    }
    if(typeof selectedId!=='undefined') selectedId = null;
    else window.selectedId = null;
    if(typeof multiSel!=='undefined') multiSel = new Set(multi);
    else window.multiSel = new Set(multi);
    if(multi.length > 1 && typeof window.updSelUI === 'function'){
      window.updSelUI();
      return;
    }
    if(typeof window.updSelUI === 'function') window.updSelUI();
  }
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
  function ensureTabOverflowUI(){
    const bar=q('tab-bar');
    if(!bar) return;
    if(!q('tab-overflow-left')){
      const left=document.createElement('div');
      left.id='tab-overflow-left';
      left.className='tab-overflow-fade left';
      bar.appendChild(left);
    }
    if(!q('tab-overflow-right')){
      const right=document.createElement('div');
      right.id='tab-overflow-right';
      right.className='tab-overflow-fade right';
      bar.appendChild(right);
    }
    if(!q('btn-tab-list')){
      const btn=document.createElement('button');
      btn.className='tb-btn tab-overflow-btn';
      btn.id='btn-tab-list';
      btn.textContent='Tabs';
      btn.title='Open tab list';
      btn.addEventListener('click',()=>{ renderTabListModal(); open('tab-list-modal'); });
      bar.appendChild(btn);
    }
    ensureModal('tab-list-modal','Tab List',`<div class="panel-help" style="margin-bottom:10px">Use this list when the tab strip is crowded or partially off-screen.</div><div id="tab-list-rows"></div>`);
  }
  function renderTabListModal(){
    const host=q('tab-list-rows');
    if(!host) return;
    host.innerHTML=tabs.map(tab=>{
      const dirty=tabDirtyStates[tab.id] ? 'Unsaved' : 'Saved';
      const active=tab.id===currentTabId ? 'active' : '';
      return `<div class="tab-list-row ${active}"><div><div style="font-weight:700">${esc(tab.name)}</div><div class="tab-list-meta">${dirty} | ${countNodes(tab.doc)} unit(s)</div></div><div style="display:flex;gap:6px"><button class="pb" style="width:auto;margin:0" onclick="window.__switchTab('${tab.id}');close('tab-list-modal');">Open</button></div></div>`;
    }).join('');
  }
  function syncTabOverflowUI(){
    const bar=q('tab-bar');
    const left=q('tab-overflow-left');
    const right=q('tab-overflow-right');
    const listBtn=q('btn-tab-list');
    if(!bar || !left || !right || !listBtn) return;
    const hasOverflow=bar.scrollWidth > bar.clientWidth + 12;
    bar.classList.toggle('has-overflow', hasOverflow);
    listBtn.style.display=(hasOverflow || tabs.length > 6) ? 'inline-flex' : 'none';
    left.classList.toggle('show', hasOverflow && bar.scrollLeft > 8);
    right.classList.toggle('show', hasOverflow && (bar.scrollLeft + bar.clientWidth) < (bar.scrollWidth - 8));
  }
  setTimeout(()=>{
    const bar=q('tab-bar');
    if(!bar || bar.dataset.overflowBound==='1') return;
    bar.dataset.overflowBound='1';
    bar.addEventListener('scroll', syncTabOverflowUI, {passive:true});
    window.addEventListener('resize', syncTabOverflowUI);
  }, 160);
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
  function setViews(v){ try{ localStorage.setItem(LS_VIEWS, JSON.stringify(v)); }catch(e){ console.warn('Failed to save views:', e); toast('Views could not be saved. Check browser storage availability.'); } }
  function getSnaps(){ try{return JSON.parse(localStorage.getItem(LS_SNAPS)||'[]')}catch(e){return []} }
  function setSnaps(v){ try{ localStorage.setItem(LS_SNAPS, JSON.stringify(v.slice(0,40))); }catch(e){ console.warn('Failed to save snapshots:', e); toast('Snapshots could not be saved. Check browser storage availability.'); } }
  function currentTransform(){
    const scaleVal = Number.isFinite(window.zoom) ? window.zoom : (typeof zoom!=='undefined' && Number.isFinite(zoom) ? zoom : 1);
    const panXVal = Number.isFinite(window.panX) ? window.panX : (typeof panX!=='undefined' && Number.isFinite(panX) ? panX : 0);
    const panYVal = Number.isFinite(window.panY) ? window.panY : (typeof panY!=='undefined' && Number.isFinite(panY) ? panY : 0);
    const selectedVal = readSelectedId();
    const multiVal = readMultiSelection();
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
    if(v.selected && readNodeMap()?.[v.selected]) window.selectNode(v.selected);
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
    renderRecentDocs();
    if(!views.length){
      box.innerHTML='<div class="panel-help">No saved views yet. Save the current camera position to jump back to it later.</div>';
      return;
    }
    box.innerHTML=views.map(v=>`<div class="view-row"><div><div style="font-weight:700">${esc(v.name)}</div><div class="panel-help">Scale ${Math.round((v.transform?.scale||1)*100)}%</div></div><div style="display:flex;gap:6px"><button class="pb" onclick="window.__loadView('${v.id}')">Load</button><button class="pb" onclick="window.__shareView('${v.id}')">Share</button><button class="pb del" onclick="window.__deleteView('${v.id}')">Delete</button></div></div>`).join('');
  }
  function renderSnapshots(){
    const box=q('snapshot-list'); if(!box) return; const snaps=getSnaps();
    if(!snaps.length){
      box.innerHTML='<div class="panel-help">No snapshots yet. Create one before a major edit if you want an easy restore point.</div>';
      return;
    }
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
  window.__restoreRecentDoc=function(id){
    const doc=getRecentDocs().find(item=>item.id===id)?.state;
    if(!doc || typeof window.applyDocumentState!=='function') return;
    window.applyDocumentState(doc,{trackHistory:true,preserveView:false});
    close('view-modal');
    toast('Recent diagram restored');
  };

  renderRecentDocs = function(){
    const box=q('recent-doc-list');
    if(!box) return;
    const items=getRecentDocs();
    if(!items.length){
      box.innerHTML='<div class="panel-help">No recent diagrams yet. Your last saved or restored work will appear here for quick startup access.</div>';
      return;
    }
    box.innerHTML=items.map(item=>`<div class="view-row"><div><div style="font-weight:700">${esc(item.name)}</div><div class="panel-help">${new Date(item.ts).toLocaleString()} | ${item.units||0} unit(s)</div></div><div style="display:flex;gap:6px"><button class="pb" onclick="window.__restoreRecentDoc('${item.id}')">Restore</button></div></div>`).join('');
  };
  renderViews = function(){
    const box=q('view-list');
    if(!box) return;
    const views=getViews();
    renderRecentDocs();
    if(!views.length){
      box.innerHTML='<div class="panel-help">No saved views yet. Save the current camera position to reopen the same frame, or use Recent Diagrams below to resume a whole document.</div>';
      return;
    }
    box.innerHTML=views.map(v=>`<div class="view-row"><div><div style="font-weight:700">${esc(v.name)}</div><div class="panel-help">Scale ${Math.round((v.transform?.scale||1)*100)}%</div></div><div style="display:flex;gap:6px"><button class="pb" onclick="window.__loadView('${v.id}')">Load</button><button class="pb" onclick="window.__shareView('${v.id}')">Share</button><button class="pb del" onclick="window.__deleteView('${v.id}')">Delete</button></div></div>`).join('');
  };
  renderSnapshots = function(){
    const box=q('snapshot-list');
    if(!box) return;
    const snaps=getSnaps();
    if(!snaps.length){
      box.innerHTML='<div class="panel-help">No snapshots yet. Create one before a major edit, import, or layout pass so you can restore the exact document and camera state later.</div>';
      return;
    }
    box.innerHTML=snaps.map(s=>`<div class="snap-row"><div><div style="font-weight:700">${esc(s.reason)}</div><div class="panel-help">${new Date(s.ts).toLocaleString()} | <span class="diff-pill">+${s.diff?.added||0} / -${s.diff?.removed||0} / delta ${s.diff?.changed||0}</span></div></div><div style="display:flex;gap:6px"><button class="pb" onclick="window.__restoreSnap('${s.id}')">Restore</button><button class="pb" onclick="window.__loadSnapView('${s.id}')">View</button><button class="pb del" onclick="window.__deleteSnap('${s.id}')">Delete</button></div></div>`).join('');
    const slider = q('phase-slider');
    if(slider) {
      slider.max = snaps.length - 1;
      slider.value = 0;
      updatePhaseLabel(0);
      slider.oninput = () => {
        updatePhaseLabel(slider.value);
        const currentSnaps=getSnaps();
        if(currentSnaps[slider.value]) window.__loadPhaseSnap(currentSnaps[slider.value].id);
      };
    }
  };
  window.__restoreRecentDoc=function(id){
    const doc=getRecentDocs().find(item=>item.id===id)?.state;
    if(!doc || typeof window.applyDocumentState!=='function') return;
    window.applyDocumentState(doc,{trackHistory:true,preserveView:false});
    close('view-modal');
    close('startup-modal');
    toast('Recent diagram restored');
  };
  function renderStartupLauncher(){
    const box=q('startup-recent-list');
    if(!box) return;
    const items=getRecentDocs();
    if(!items.length){
      box.innerHTML='<div class="panel-help">No recent diagrams yet. Start a new ORBAT, load a doctrinal template, or import JSON to populate this launcher.</div>';
      return;
    }
    box.innerHTML=items.map(item=>`<div class="view-row"><div><div style="font-weight:700">${esc(item.name)}</div><div class="panel-help">${new Date(item.ts).toLocaleString()} | ${item.units||0} unit(s)</div></div><div style="display:flex;gap:6px"><button class="pb" onclick="window.__restoreRecentDoc('${item.id}')">Open</button></div></div>`).join('');
  }
  function maybeOpenStartupLauncher(){
    if(readonly || sharedViewId) return;
    const tab=tabs.find(t=>t.id===currentTabId) || tabs[0];
    const liveDoc=(typeof window.serializeDocument==='function') ? window.serializeDocument() : tab?.doc;
    if(!isFreshLauncherCandidate(liveDoc)) return;
    renderStartupLauncher();
    open('startup-modal');
  }

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
    ensureBtn('btn-export-outline','Outline','Copy or download an indented text outline',()=>window.exportOutlineText&&window.exportOutlineText(),'btn-export-pdf');
    ensureModal('view-modal','Saved Views',`<div class="fg"><label>Save current view as</label><div style="display:flex;gap:8px"><input id="view-name-input" type="text" placeholder="e.g. Corps overview"><button class="pb" style="width:auto;margin:0" id="save-view-btn">Save</button></div></div><div class="psec">Saved Views</div><div id="view-list"></div><div class="psec">Recent Diagrams</div><div id="recent-doc-list"></div>`);
    ensureModal('snapshot-modal','Version Snapshots',`<div style="display:flex;gap:8px;margin-bottom:10px"><button class="pb" style="width:auto;margin:0" id="snap-now-btn">Create snapshot</button></div><div id="timeline-slider" style="margin-bottom:10px"><input type="range" id="phase-slider" min="0" max="0" value="0" style="width:100%"><div id="phase-label"></div></div><div id="snapshot-list"></div>`);
    ensureModal('cmdk-modal','Command Palette',`<input id="cmdk-input" placeholder="Type a command…"><div id="cmdk-list"></div><div class="cmdk-hint">Enter to run · Esc to close · Cmd/Ctrl+K to open</div>`);
    q('save-view-btn')?.addEventListener('click',()=>{ const name=q('view-name-input').value.trim(); if(!name) return; const views=getViews(); views.unshift({id:Date.now()+Math.random().toString(16).slice(2), name, transform:currentTransform()}); setViews(views.slice(0,20)); q('view-name-input').value=''; renderViews(); toast('View saved'); });
    q('snap-now-btn')?.addEventListener('click',()=>{ snapshotNow('Manual snapshot'); toast('Snapshot created'); });
    updateOrgBtn(); renderViews(); renderSnapshots(); renderRecentDocs(); setReadonlyBanner();
  }
  const prevEnsureViewsUI = ensureViewsUI;
  ensureViewsUI = function(){
    prevEnsureViewsUI();
    ensureTabOverflowUI();
    const orgBtn = q('btn-org-toggle'); if(orgBtn) orgBtn.textContent = 'Mode';
    const viewsBtn = q('btn-views'); if(viewsBtn) viewsBtn.textContent = 'Views';
    const snapsBtn = q('btn-snapshots'); if(snapsBtn) snapsBtn.textContent = 'Snapshots';
    const outlineBtn = q('btn-export-outline'); if(outlineBtn) outlineBtn.textContent = 'Outline';
    const pdfBtn = q('btn-export-pdf'); if(pdfBtn) pdfBtn.textContent = 'Export PDF';
    const cmdBtn = q('btn-cmdk'); if(cmdBtn) cmdBtn.textContent = 'Commands';
    if(!q('btn-launcher')) ensureBtn('btn-launcher','Open','Open the startup launcher',()=>{ renderStartupLauncher(); open('startup-modal'); },'btn-views');
    ensureModal('startup-modal','Open Diagram',`<div class="panel-help" style="margin-bottom:12px">Resume a recent ORBAT, start clean, or jump into import and template flows.</div><div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap"><button class="pb" id="startup-new-btn" style="width:auto;margin:0">New Diagram</button><button class="pb" id="startup-template-btn" style="width:auto;margin:0">Templates</button><button class="pb" id="startup-import-btn" style="width:auto;margin:0">Import JSON</button></div><div class="psec">Recent Diagrams</div><div id="startup-recent-list"></div>`);
    const startupNew = q('startup-new-btn');
    if(startupNew && startupNew.dataset.bound !== '1'){
      startupNew.dataset.bound = '1';
      startupNew.addEventListener('click',()=>{
        close('startup-modal');
        if(typeof window.clearAll === 'function') window.clearAll();
        toast('Started a new diagram');
      });
    }
    const startupTpl = q('startup-template-btn');
    if(startupTpl && startupTpl.dataset.bound !== '1'){
      startupTpl.dataset.bound = '1';
      startupTpl.addEventListener('click',()=>{ close('startup-modal'); if(typeof window.openTplModal==='function') window.openTplModal(); });
    }
    const startupImport = q('startup-import-btn');
    if(startupImport && startupImport.dataset.bound !== '1'){
      startupImport.dataset.bound = '1';
      startupImport.addEventListener('click',()=>{ close('startup-modal'); if(typeof window.importJSON==='function') window.importJSON(); });
    }
    const viewInput = q('view-name-input');
    if(viewInput && viewInput.dataset.enterBound !== '1'){
      viewInput.dataset.enterBound = '1';
      viewInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); q('save-view-btn')?.click(); } });
    }
    const saveBtn = q('save-view-btn');
    if(saveBtn && saveBtn.dataset.validationBound !== '1'){
      saveBtn.dataset.validationBound = '1';
      saveBtn.addEventListener('click',()=>{
        if(q('view-name-input')?.value.trim()) return;
        toast('Name the view before saving');
      }, true);
    }
    renderStartupLauncher();
    syncTabOverflowUI();
  };
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
  // The later renderTabs override keeps legacy boot behavior intact while adding
  // richer tab controls without rewriting the earlier initialization path.
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
        currTab.selectedId = readSelectedId();
        currTab.multiSel = readMultiSelection();
        currTab.nodeIdC = currTab.doc?.nodeIdC || currTab.nodeIdC || 1;
        currTab.view = {...currentTransform(), selected:currTab.selectedId, multi:[...currTab.multiSel]};
        rememberRecentDoc(currTab.doc);
        renderRecentDocs();
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
  function persistTabState(tab,{rememberRecent=true}={}){
    if(!tab) return;
    if(typeof window.serializeDocument==='function'){
      tab.doc = JSON.parse(JSON.stringify(window.serializeDocument()));
      tab.selectedId = readSelectedId();
      tab.multiSel = readMultiSelection();
      tab.nodeIdC = tab.doc?.nodeIdC || tab.nodeIdC || 1;
      tab.view = {...currentTransform(), selected:tab.selectedId, multi:[...tab.multiSel]};
      if(rememberRecent){
        rememberRecentDoc(tab.doc);
        renderRecentDocs();
      }
    }
  }
  function activateTab(tab){
    if(!tab || typeof window.applyDocumentState!=='function') return;
    currentTabId = tab.id;
    tab.doc = cloneTabDoc(tab);
    const nextView = cloneTabView(tab);
    window.applyDocumentState(tab.doc,{trackHistory:false,preserveView:false});
    applyTransformState(nextView);
    restoreTabSelectionState(tab);
    clearTabDirty(tab.id);
    renderTabs();
    saveTabs();
  }
  window.__switchTab = function(id){
    if(id === currentTabId) return;
    const currTab = tabs.find(t=>t.id===currentTabId);
    persistTabState(currTab);
    saveTabs();
    const tab = tabs.find(t=>t.id===id);
    if(tab) activateTab(tab);
  };
  window.__closeTab = function(id){
    if(id === 'default' || tabs.length <= 1) return;
    hideTabMenu();
    const idx = tabs.findIndex(t=>t.id===id);
    if(idx > -1){
      const nextTab = currentTabId === id ? (tabs[idx+1] || tabs[idx-1] || tabs[0]) : null;
      tabs.splice(idx, 1);
      saveTabs();
      if(currentTabId === id){
        if(nextTab) activateTab(nextTab);
      } else {
        renderTabs();
      }
    }
  };
  window.__duplicateTab = function(id = currentTabId){
    const sourceTab = tabs.find(t=>t.id===id);
    if(!sourceTab) return;
    const newId = Date.now() + Math.random().toString(16).slice(2);
    const liveSelected = id === currentTabId ? readSelectedId() : (sourceTab.selectedId || null);
    const liveMultiSel = id === currentTabId ? readMultiSelection() : [...(sourceTab.multiSel || [])];
    const liveDoc = (id === currentTabId && typeof window.serializeDocument === 'function')
      ? JSON.parse(JSON.stringify(window.serializeDocument()))
      : cloneTabDoc(sourceTab);
    const dup = {
      id: newId,
      name: nextTabName(sourceTab.name || 'Tab'),
      doc: liveDoc,
      view: id === currentTabId ? {...currentTransform(), selected:liveSelected, multi:[...liveMultiSel]} : cloneTabView(sourceTab),
      selectedId: liveSelected,
      multiSel: liveMultiSel,
      nodeIdC: sourceTab.nodeIdC || 1
    };
    tabs.push(dup);
    tabDirtyStates[newId] = false;
    saveTabs();
    activateTab(dup);
  };
  window.__newTab = function(){
    const newId = Date.now() + Math.random().toString(16).slice(2);
    const newName = 'Tab ' + (tabs.length + 1);
    const freshTab = normalizeTab({id: newId, name: newName, doc: createEmptyTabDoc(), view: createDefaultTabView(), selectedId: null, multiSel: [], nodeIdC: 1}, tabs.length);
    tabs.push(freshTab);
    saveTabs();
    activateTab(freshTab);
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
  function nodeOutlineLabel(node){
    const parts=[String(node?.designation||'').trim(), String(node?.name||'').trim()].filter(Boolean);
    const unique=[];
    parts.forEach(part=>{ if(!unique.includes(part)) unique.push(part); });
    return unique.join(' ').trim() || 'Unnamed Unit';
  }
  function sortedChildren(nodeId, source){
    return Object.values(source)
      .filter(node=>node.parentId===nodeId)
      .sort((a,b)=>(a.y-b.y)||(a.x-b.x)||nodeOutlineLabel(a).localeCompare(nodeOutlineLabel(b)));
  }
  function buildOutlineLines(nodeId, source, depth, lines){
    const node = source[nodeId];
    if(!node) return;
    lines.push(`${'  '.repeat(depth)}${nodeOutlineLabel(node)}`);
    sortedChildren(nodeId, source).forEach(child=>buildOutlineLines(child.id, source, depth+1, lines));
  }
  function downloadTextFile(filename, text){
    const blob=new Blob([text],{type:'text/plain;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),1200);
  }
  window.exportOutlineText=async function(){
    const source = readNodeMap();
    const selected = readSelectedId();
    const roots = selected && source[selected]
      ? [selected]
      : Object.values(source)
        .filter(node=>!node.parentId || !source[node.parentId])
        .sort((a,b)=>(a.y-b.y)||(a.x-b.x)||nodeOutlineLabel(a).localeCompare(nodeOutlineLabel(b)))
        .map(node=>node.id);
    if(!roots.length){
      toast('Nothing to export');
      return;
    }
    const lines=[];
    roots.forEach(rootId=>buildOutlineLines(rootId, source, 0, lines));
    const text=lines.join('\n');
    const baseName=readOpName().replace(/[^\w.-]+/g,'_').replace(/^_+|_+$/g,'') || 'orbat';
    const copiedMsg = selected && source[selected] ? 'Selected branch outline copied' : 'Outline copied';
    try{
      if(navigator.clipboard?.writeText){
        await navigator.clipboard.writeText(text);
        toast(copiedMsg);
        return;
      }
    }catch(err){
      console.warn('Failed to copy outline to clipboard:', err);
    }
    downloadTextFile(`${baseName}-outline.txt`, text);
    toast(selected && source[selected] ? 'Selected branch outline downloaded' : 'Outline downloaded');
  };
  function normalizeCmdkText(value=''){
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
  }
  function commandSearchInfo(command){
    const haystack = [command.name].concat(command.aliases || []).join(' ');
    const normalized = normalizeCmdkText(haystack);
    return { normalized, compact: normalized.replace(/\s+/g,'') };
  }
  function commandMatchScore(command, term){
    if(!term) return 0;
    const info = commandSearchInfo(command);
    const compactTerm = term.replace(/\s+/g,'');
    if(info.normalized.startsWith(term) || info.compact.startsWith(compactTerm)) return 0;
    if(info.normalized.includes(term) || info.compact.includes(compactTerm)) return 1;
    const tokens = term.split(' ').filter(Boolean);
    if(tokens.length && tokens.every(token=>info.normalized.includes(token))) return 2;
    return -1;
  }
  // Command palette
  const commands=[
    {name:'Add root unit', aliases:['new root','add unit','create root','root node'], run:()=>window.addRootUnit&&window.addRootUnit()},
    {name:'Auto layout', aliases:['layout','arrange','organize','reflow'], run:()=>window.autoLayout&&window.autoLayout()},
    {name:'Fit screen', aliases:['fit view','zoom fit','fit canvas'], run:()=>window.fitScreen&&window.fitScreen()},
    {name:'Center on root', aliases:['center root','focus root','home root'], run:()=>window.centerOnRoot&&window.centerOnRoot()},
    {name:'Center on hostile root', aliases:['enemy root','hostile root','red root'], run:()=>window.centerOnHostileRoot&&window.centerOnHostileRoot()},
    {name:'Center on neutral root', aliases:['neutral root','green root'], run:()=>window.centerOnNeutralRoot&&window.centerOnNeutralRoot()},
    {name:'Zoom to selection', aliases:['focus selection','selected units','frame selection'], run:()=>window.focusSelection&&window.focusSelection()},
    {name:'Rename current tab', aliases:['rename tab','tab name'], run:()=>window.__renameTabPrompt&&window.__renameTabPrompt(currentTabId)},
    {name:'Duplicate current tab', aliases:['copy tab','clone tab'], run:()=>window.__duplicateTab&&window.__duplicateTab(currentTabId)},
    {name:'Toggle ORBAT mode', aliases:['task org','task organized','task organised','admin mode','orbat mode'], run:()=>q('btn-org-toggle')?.click()},
    {name:'Open saved views', aliases:['views','camera views'], run:()=>q('btn-views')?.click()},
    {name:'Open snapshots', aliases:['snaps','history','timeline'], run:()=>q('btn-snapshots')?.click()},
    {name:'Export outline text', aliases:['copy outline','outline export','text outline','briefing notes','txt outline'], run:()=>window.exportOutlineText&&window.exportOutlineText()},
    {name:'Export PDF', aliases:['pdf','print pdf'], run:()=>window.exportPDF&&window.exportPDF()},
    {name:'Import text outline', aliases:['outline import','paste outline','text import'], run:()=>window.openOutlineModal&&window.openOutlineModal()},
    {name:'Toggle minimap', aliases:['mini map','map overview'], run:()=>window.toggleMinimap&&window.toggleMinimap()},
    {name:'Undo', aliases:['back'], run:()=>window.undo&&window.undo()},
    {name:'Redo', aliases:['forward'], run:()=>window.redo&&window.redo()},
    {name:'Save snapshot', aliases:['create snapshot','manual snapshot'], run:()=>snapshotNow('Manual snapshot')},
  ];
  function renderCmdk(filter=''){
    const box=q('cmdk-list'); if(!box) return; const term=normalizeCmdkText(filter);
    const items=commands
      .map(command=>({command, score:commandMatchScore(command, term)}))
      .filter(entry=>!term||entry.score>=0)
      .sort((a,b)=>{
        if(a.score!==b.score) return a.score-b.score;
        return a.command.name.localeCompare(b.command.name);
      });
    box.innerHTML=items.map((entry,i)=>`<div class="cmdk-row"><div>${esc(entry.command.name)}</div><button class="pb" data-cmd-idx="${i}" style="width:auto;margin:0">Run</button></div>`).join('') || '<div class="panel-help">No commands match that search. Try a shorter term.</div>';
    [...box.querySelectorAll('[data-cmd-idx]')].forEach((btn,idx)=>btn.onclick=()=>{ items[idx].command.run(); close('cmdk-modal'); });
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
  setTimeout(()=>{ q('cmdk-input')?.addEventListener('input',e=>renderCmdk(e.target.value)); }, 100);

  const commandSectionFor = name => {
    if(name.includes('tab')) return 'Tabs';
    if(name.includes('view') || name.includes('snapshot')) return 'Views and Snapshots';
    if(name.includes('import') || name.includes('export')) return 'Import and Export';
    return 'Canvas';
  };
  function setCmdkActive(nextIndex){
    const rows=[...document.querySelectorAll('#cmdk-list [data-cmd-match-idx]')];
    if(!rows.length){
      cmdkActiveIndex = 0;
      return;
    }
    cmdkActiveIndex = (nextIndex + rows.length) % rows.length;
    rows.forEach((row, idx)=>row.classList.toggle('active', idx===cmdkActiveIndex));
    rows[cmdkActiveIndex]?.scrollIntoView({block:'nearest'});
  }
  renderCmdk = function(filter=''){
    const box=q('cmdk-list');
    if(!box) return;
    const term=normalizeCmdkText(filter);
    cmdkMatches = commands
      .map(command => ({...command, section:command.section || commandSectionFor(command.name.toLowerCase())}))
      .map(command=>({...command, _score:commandMatchScore(command, term)}))
      .filter(command=>!term||command._score>=0)
      .sort((a,b)=>{
        if(a.section!==b.section) return a.section.localeCompare(b.section);
        if(a._score!==b._score) return a._score-b._score;
        return a.name.localeCompare(b.name);
      });
    if(!cmdkMatches.length){
      box.innerHTML='<div class="panel-help">No commands match that search. Try a shorter term.</div>';
      cmdkActiveIndex = 0;
      return;
    }
    let matchIndex = 0;
    const sections = [];
    cmdkMatches.forEach(command => {
      let section = sections.find(entry=>entry.name===command.section);
      if(!section){
        section = {name:command.section, items:[]};
        sections.push(section);
      }
      section.items.push({...command, matchIndex:matchIndex++});
    });
    box.innerHTML = sections.map(section => [
      `<div class="psec">${esc(section.name)}</div>`,
      ...section.items.map(command=>`<div class="cmdk-row" data-cmd-match-idx="${command.matchIndex}"><div>${esc(command.name)}</div><button class="pb" data-cmd-match-run="${command.matchIndex}" style="width:auto;margin:0">Run</button></div>`)
    ].join('')).join('');
    box.querySelectorAll('[data-cmd-match-idx]').forEach(row=>{
      row.addEventListener('click',()=>{ const idx=Number(row.dataset.cmdMatchIdx); cmdkMatches[idx]?.run(); close('cmdk-modal'); });
    });
    box.querySelectorAll('[data-cmd-match-run]').forEach(btn=>{
      btn.addEventListener('click',ev=>{
        ev.stopPropagation();
        const idx=Number(btn.dataset.cmdMatchRun);
        cmdkMatches[idx]?.run();
        close('cmdk-modal');
      });
    });
    setCmdkActive(0);
  };
  window.openCommandPalette=function(){
    renderCmdk('');
    open('cmdk-modal');
    setTimeout(()=>q('cmdk-input')?.focus(),30);
  };
  setTimeout(()=>{
    const cmdkInput=q('cmdk-input');
    if(!cmdkInput || cmdkInput.dataset.navBound==='1') return;
    cmdkInput.dataset.navBound='1';
    cmdkInput.placeholder='Search commands';
    cmdkInput.addEventListener('input',e=>renderCmdk(e.target.value));
    cmdkInput.addEventListener('keydown',e=>{
      if(e.key==='ArrowDown'){ e.preventDefault(); setCmdkActive(cmdkActiveIndex+1); return; }
      if(e.key==='ArrowUp'){ e.preventDefault(); setCmdkActive(cmdkActiveIndex-1); return; }
      if(e.key==='Enter'){ e.preventDefault(); cmdkMatches[cmdkActiveIndex]?.run(); close('cmdk-modal'); }
    });
  }, 140);

  const prevDeleteView = window.__deleteView;
  if(prevDeleteView){
    window.__deleteView = function(id){
      prevDeleteView(id);
      toast('View deleted');
    };
  }
  const prevDeleteSnap = window.__deleteSnap;
  if(prevDeleteSnap){
    window.__deleteSnap = function(id){
      prevDeleteSnap(id);
      toast('Snapshot deleted');
    };
  }
  const prevDuplicateTab = window.__duplicateTab;
  if(prevDuplicateTab){
    window.__duplicateTab = function(id = currentTabId){
      const sourceTab = tabs.find(t=>t.id===id);
      prevDuplicateTab(id);
      const newestTab = tabs[tabs.length-1];
      toast(`Duplicated tab: ${(newestTab?.name || sourceTab?.name || 'Tab')}`);
    };
  }
  const prevNewTab = window.__newTab;
  if(prevNewTab){
    window.__newTab = function(){
      const nextName = 'Tab ' + (tabs.length + 1);
      prevNewTab();
      toast(`Opened ${nextName}`);
    };
  }
  const prevCloseTab = window.__closeTab;
  if(prevCloseTab){
    window.__closeTab = function(id){
      const tabName = tabs.find(t=>t.id===id)?.name || 'Tab';
      prevCloseTab(id);
      if(id !== 'default') toast(`Closed tab: ${tabName}`);
    };
  }
  const mojibakeLeadRE = /[\u00C2\u00C3\u00E2]/;
  function cleanViewsUiText(){
    const orgBtn = q('btn-org-toggle'); if(orgBtn) orgBtn.textContent = '\u224B ORBAT';
    const viewsBtn = q('btn-views'); if(viewsBtn) viewsBtn.textContent = 'Views';
    const snapsBtn = q('btn-snapshots'); if(snapsBtn) snapsBtn.textContent = 'Snaps';
    const pdfBtn = q('btn-export-pdf'); if(pdfBtn) pdfBtn.textContent = 'PDF';
    const cmdBtn = q('btn-cmdk'); if(cmdBtn) cmdBtn.textContent = 'Cmd';
    const cmdInput = q('cmdk-input'); if(cmdInput) cmdInput.placeholder = 'Type a command...';
    const cmdHint = document.querySelector('#cmdk-modal .cmdk-hint');
    if(cmdHint) cmdHint.textContent = 'Enter to run \u00B7 Esc to close \u00B7 Cmd/Ctrl+K to open';
    const viewInput = q('view-name-input');
    if(viewInput && viewInput.dataset.enterBound !== '1'){
      viewInput.dataset.enterBound = '1';
      viewInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); q('save-view-btn')?.click(); } });
    }
    document.querySelectorAll('#tab-bar .tab, #tab-bar .tab-dirty, #tab-bar .tab-close').forEach(el=>{
      if(el.classList.contains('tab-dirty') && el.childNodes.length === 1 && mojibakeLeadRE.test(el.textContent || '')) el.textContent = '\u25CF';
      if(el.classList.contains('tab-close') && el.childNodes.length === 1 && mojibakeLeadRE.test(el.textContent || '')) el.textContent = '\u00D7';
      if(el.title) el.title = el.title.replaceAll('\u00C2\u00B7','\u00B7');
    });
  }
  const prevAccessibleRenderTabs = renderTabs;
  renderTabs = function(){
    prevAccessibleRenderTabs();
    cleanViewsUiText();
  };
  function normalizeAccessibleLabels(){
    const orgBtn = q('btn-org-toggle'); if(orgBtn) orgBtn.textContent = '\u224B ORBAT';
    const cmdHint = document.querySelector('#cmdk-modal .cmdk-hint');
    if(cmdHint) cmdHint.textContent = 'Enter to run \u00B7 Esc to close \u00B7 Cmd/Ctrl+K to open';
    document.querySelectorAll('#tab-bar .tab, #tab-bar .tab-dirty, #tab-bar .tab-close').forEach(el=>{
      if(!mojibakeLeadRE.test(el.textContent || '')) return;
      if(el.classList.contains('tab-close')) el.textContent = '\u00D7';
      else if(el.childNodes.length === 1) el.textContent = '\u25CF';
      if(el.title) el.title = el.title.replaceAll('\u00C2\u00B7','\u00B7');
    });
  }
  const prevNormalizedRenderTabs = renderTabs;
  renderTabs = function(){
    prevNormalizedRenderTabs();
    normalizeAccessibleLabels();
    ensureTabOverflowUI();
    renderTabListModal();
    syncTabOverflowUI();
  };
  cleanViewsUiText = function(){
    const orgBtn = q('btn-org-toggle'); if(orgBtn) orgBtn.textContent = 'Mode';
    const launcherBtn = q('btn-launcher'); if(launcherBtn) launcherBtn.textContent = 'Open';
    const viewsBtn = q('btn-views'); if(viewsBtn) viewsBtn.textContent = 'Views';
    const snapsBtn = q('btn-snapshots'); if(snapsBtn) snapsBtn.textContent = 'Snapshots';
    const pdfBtn = q('btn-export-pdf'); if(pdfBtn) pdfBtn.textContent = 'Export PDF';
    const cmdBtn = q('btn-cmdk'); if(cmdBtn) cmdBtn.textContent = 'Commands';
    const cmdInput = q('cmdk-input'); if(cmdInput) cmdInput.placeholder = 'Search commands';
    const cmdHint = document.querySelector('#cmdk-modal .cmdk-hint');
    if(cmdHint) cmdHint.textContent = 'Arrow keys to move | Enter to run | Esc to close | Ctrl/Cmd+K to open';
    const histBtn = q('btn-history'); if(histBtn) histBtn.textContent = 'History';
  };
  normalizeAccessibleLabels = function(){
    document.querySelectorAll('#tab-bar .tab, #tab-bar .tab-dirty').forEach(el=>{
      if(el.childNodes.length === 1 && mojibakeLeadRE.test(el.textContent || '')) el.textContent = '\u25CF';
    });
    document.querySelectorAll('#tab-bar .tab-close').forEach(el=>{
      if(mojibakeLeadRE.test(el.textContent || '')) el.textContent = '\u00D7';
    });
    document.querySelectorAll('#tab-bar .tab').forEach(el=>{
      if(el.title) el.title = el.title.replaceAll('\u00C2\u00B7','\u00B7');
    });
  };

  // init
  setTimeout(()=>{ 
    ensureViewsUI(); 
    enhanceHistory(); 
    // Initialize default tab with current state
    if(tabs.length === 1 && tabs[0].id === 'default' && typeof window.serializeDocument==='function'){
      tabs[0].doc = JSON.parse(JSON.stringify(window.serializeDocument()));
      tabs[0].selectedId = readSelectedId();
      tabs[0].multiSel = readMultiSelection();
      tabs[0].nodeIdC = tabs[0].doc?.nodeIdC || 1;
      tabs[0].view = {...currentTransform(), selected:tabs[0].selectedId, multi:[...tabs[0].multiSel]};
      saveTabs();
    }
    renderTabs();
    cleanViewsUiText();
    normalizeAccessibleLabels();
    maybeOpenStartupLauncher();
  }, 120);
})();
