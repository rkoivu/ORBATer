(function(){
  if(window.__orbatBootModule ? !window.__orbatBootModule('themes-locks-search-background') : window.__orbatThemesLocksSearchBackgroundBooted) return;
  window.__orbatThemesLocksSearchBackgroundBooted = true;
  const head=document.head;
  const style=document.createElement('style');
  style.textContent=`
  body.theme-light{--bg:#f6f8fb;--surface:#ffffff;--surface2:#f1f5f9;--surface3:#dce7f1;--border:#9fb3c8;--accent:#2563eb;--accent2:#d97706;--text:#0f172a;--text2:#334155;--red:#dc2626;--green:#16a34a;--orange:#ea580c;--control-bg:#ffffff;--control-bg-soft:#f8fafc;--control-bg-hover:#e2e8f0;--control-border:rgba(148,163,184,.36);--control-border-strong:rgba(100,116,139,.46);--shell-glow:#f3f6fb;--topbar-bg:#f8fbff;--tabbar-bg:#f3f7fc;--sidebar-bg:#f8fbff;--sidebar-header-bg:#f1f5f9;--panel-bg:#f8fbff;--panel-header-bg:#f1f5f9;--statusbar-bg:#f8fbff}
  body.theme-briefing{--bg:#ffffff;--surface:#ffffff;--surface2:#f8fafc;--surface3:#edf2f7;--border:#cbd5e1;--accent:#1d4ed8;--accent2:#b45309;--text:#0f172a;--text2:#475569;--red:#b91c1c;--green:#15803d;--orange:#c2410c;--control-bg:#ffffff;--control-bg-soft:#f8fafc;--control-bg-hover:#eef3f8;--control-border:rgba(148,163,184,.34);--control-border-strong:rgba(100,116,139,.42);--shell-glow:#ffffff;--topbar-bg:#f8fafc;--tabbar-bg:#f4f7fb;--sidebar-bg:#fcfdff;--sidebar-header-bg:#f1f5f9;--panel-bg:#fcfdff;--panel-header-bg:#f1f5f9;--statusbar-bg:#f8fafc}
  body.theme-briefing #canvas-wrap,body.theme-light #canvas-wrap{background:var(--bg)}
  body.theme-briefing #canvas-wrap.snap-on{background-image:radial-gradient(circle,rgba(100,116,139,.28) 1px,transparent 1px)}
  body.theme-light #canvas-wrap.snap-on{background-image:radial-gradient(circle,rgba(100,116,139,.22) 1px,transparent 1px)}
  body.presentation-mode #sidebar,body.presentation-mode #edit-panel,body.presentation-mode #statusbar{display:none!important}
  body.presentation-mode #tab-bar{background:linear-gradient(180deg,rgba(16,20,28,.96),rgba(12,16,24,.98));border-bottom-color:rgba(148,163,184,.12)}
  body.presentation-mode #main{height:calc(100vh - 92px)!important}
  body.presentation-mode #canvas-wrap{background-color:#0b1220}
  body.presentation-mode #topbar::after{content:'PRESENTATION';display:inline-flex;align-items:center;justify-content:center;position:absolute;top:10px;right:12px;min-width:112px;height:28px;padding:0 10px;border-radius:999px;border:1px solid rgba(59,130,246,.42);background:rgba(59,130,246,.12);color:#dbeafe;font:700 10px/1 "Barlow Condensed",sans-serif;letter-spacing:1.2px;pointer-events:none}
  body.clarity-mode .node-card{background:linear-gradient(180deg,rgba(27,37,52,.98),rgba(18,24,36,.98));border-width:2px;box-shadow:0 16px 30px rgba(2,6,23,.26)}
  body.clarity-mode .node-name{font-size:14px;letter-spacing:.3px;max-width:156px}
  body.clarity-mode .node-designation{font-size:11px;letter-spacing:1.15px}
  body.clarity-mode .node-commander,body.clarity-mode .node-strength-lbl{font-size:10px}
  body.clarity-mode .node-task-lbl{font-size:10px;letter-spacing:.7px}
  body.clarity-mode .node-tag-chip{font-size:9px;padding:3px 5px}
  body.clarity-mode .node-readiness-pill{min-width:28px;height:16px;font-size:9px;line-height:14px}
  body.connector-focus #connector-svg path,body.connector-focus #connector-svg line,body.connector-focus #connector-svg polyline{stroke-width:2.6px!important;stroke-opacity:1!important;filter:drop-shadow(0 0 4px rgba(15,23,42,.35))}
  body.connector-focus .conn-label{font-size:10px;font-weight:800;letter-spacing:1px}
  .hint-kbd{margin-left:4px;color:var(--text2);font-size:9px;opacity:.8;font-family:'Share Tech Mono',monospace}
  #legend-overlay{position:absolute;top:8px;right:8px;z-index:70;background:rgba(13,17,23,.92);border:1px solid rgba(148,163,184,.18);border-radius:14px;padding:10px 12px;min-width:190px;display:none;box-shadow:0 20px 44px rgba(0,0,0,.34);backdrop-filter:blur(12px)}
  body.theme-light #legend-overlay, body.theme-briefing #legend-overlay{background:rgba(248,250,252,.97);border-color:var(--border);color:var(--text)}
  #legend-overlay.open{display:block}
  #legend-overlay h4{font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1.2px;margin-bottom:8px;color:var(--text)}
  #legend-overlay .lg-row{display:flex;align-items:center;gap:8px;font-size:10px;color:var(--text);margin:6px 0}
  #legend-overlay .lg-line{width:28px;height:0;border-top:2px solid var(--accent);display:inline-block}
  #legend-overlay .lg-dot{width:12px;height:12px;border-radius:3px;display:inline-block;border:1px solid var(--border);background:var(--surface3)}
  .palette-drag-ghost{position:fixed;top:-9999px;left:-9999px;pointer-events:none;z-index:99999;background:var(--surface2);border:1px solid var(--accent);border-radius:6px;padding:6px;display:flex;flex-direction:column;align-items:center;gap:3px;box-shadow:0 8px 24px rgba(0,0,0,.35)}
  .palette-drag-ghost span{font-family:'Barlow Condensed',sans-serif;font-size:8px;color:var(--text2);text-transform:uppercase}
  .orbat-node.locked .node-card{outline:1px dashed var(--accent)}
  .node-lock-btn,.node-fade-btn{position:absolute;width:16px;height:16px;border-radius:50%;border:2px solid var(--bg);background:#374151;color:#fff;font-size:9px;line-height:11px;text-align:center;cursor:pointer;opacity:0;transition:opacity .12s;z-index:6}
  .node-lock-btn{top:-11px;left:4px}
  .node-fade-btn{top:-11px;left:24px}
  .orbat-node:hover .node-lock-btn,.orbat-node:hover .node-fade-btn{opacity:1}
  .orbat-node.locked .node-lock-btn,.orbat-node.faded .node-fade-btn{opacity:1;background:var(--accent)}
  .orbat-node.faded{opacity:.42}
  body.theme-briefing .orbat-node.faded, body.theme-light .orbat-node.faded{opacity:.5}
  #search-meta{display:inline-flex;align-items:center;justify-content:center;min-height:28px;padding:0 10px;border-radius:999px;border:1px solid rgba(148,163,184,.16);background:rgba(255,255,255,.03);font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--text2);min-width:56px;text-align:center}
  #bg-modal .modal-box{min-width:360px}
  #bg-preview{width:100%;max-height:180px;object-fit:contain;border:1px solid var(--border);border-radius:6px;background:var(--surface2);display:none}
  .sticky-empty{font-size:11px;color:var(--text2);padding:8px 0}
  body.readonly-mode #topbar::before{content:'READ ONLY';display:inline-flex;align-items:center;justify-content:center;position:absolute;top:10px;right:12px;min-width:88px;height:28px;padding:0 10px;border-radius:999px;border:1px solid rgba(245,158,11,.4);background:rgba(245,158,11,.12);color:var(--accent2);font:700 10px/1 "Barlow Condensed",sans-serif;letter-spacing:1.1px;pointer-events:none}
  `
  head.appendChild(style)

  const topbar=document.getElementById('topbar');
  const statusbar=document.getElementById('statusbar');
  const canvasWrap=document.getElementById('canvas-wrap');
  const canvas=document.getElementById('canvas');
  const sidebarScroll=document.getElementById('sidebar-scroll');
  let currentTheme='dark', stickyPanel=false, bgImage=null, bgOpacity=0.22, presentationMode=false, clarityMode=false, connectorFocusMode=false, searchMatches=[], searchIndex=-1, undoAction=null;
  let midPan=false, midStart={x:0,y:0,panX:0,panY:0};

  // Extend node normalization/serialization
  const prevNorm=normalizeNode;
  normalizeNode=function(id,raw={}){ const n=prevNorm(id,raw); n.faded=raw.faded===true; return n; };
  const prevSer=serializeDocument;
  serializeDocument=function(){ const d=prevSer(); d.theme=currentTheme; d.stickyPanel=stickyPanel; d.canvasBackground=bgImage; d.canvasBackgroundOpacity=bgOpacity; d.presentationMode=presentationMode; d.clarityMode=clarityMode; d.connectorFocusMode=connectorFocusMode; return d; };
  const prevApply=applyDocumentState;
  applyDocumentState=function(doc,opts){ prevApply(doc,opts); currentTheme=doc.theme||currentTheme; stickyPanel=doc.stickyPanel===true; bgImage=doc.canvasBackground||null; bgOpacity=Number.isFinite(+doc.canvasBackgroundOpacity)?+doc.canvasBackgroundOpacity:bgOpacity; presentationMode=doc.presentationMode===true; clarityMode=doc.clarityMode===true; connectorFocusMode=doc.connectorFocusMode===true; applyTheme(); applyCanvasBackground(); syncStickyBtn(); syncReadabilityBtns(); refreshSearchEnhancements(); };

  // Insert toolbar controls
  function insertBtn(id,text,title,onclick,beforeSel){ if(document.getElementById(id)) return document.getElementById(id); const b=document.createElement('button'); b.className='tb-btn'; b.id=id; b.textContent=text; b.title=title; b.onclick=onclick; const ref=beforeSel?topbar.querySelector(beforeSel):null; topbar.insertBefore(b, ref); return b; }
  insertBtn('btn-present','Present','Presentation mode',()=>togglePresentationMode(),'#unit-search-input');
  insertBtn('btn-clarity','Clarity','Higher-contrast cards and labels',()=>toggleClarityMode(),'#unit-search-input');
  insertBtn('btn-connector-focus','Links','Emphasise connectors and labels',()=>toggleConnectorFocusMode(),'#unit-search-input');
  insertBtn('btn-theme','◐ Theme','Cycle theme',()=>cycleTheme(),'#unit-search-input');
  insertBtn('btn-sticky','📌 Panel','Sticky properties panel',()=>toggleStickyPanel(),'#unit-search-input');
  insertBtn('btn-legend','≡ Legend','Toggle connection legend',()=>toggleLegend(),'#unit-search-input');
  insertBtn('btn-csv','⤓ CSV','Export CSV',()=>exportCSV(),'#btn-random-orbat');
  insertBtn('btn-bg','🗺 Bg','Canvas background image',()=>openBgModal(),'#btn-random-orbat');
  const searchMeta=document.createElement('span'); searchMeta.id='search-meta'; searchMeta.textContent='0/0'; topbar.insertBefore(searchMeta, document.getElementById('tag-filter-input').nextSibling);

  // legend overlay
  if(!document.getElementById('legend-overlay')){
    const lg=document.createElement('div'); lg.id='legend-overlay'; lg.innerHTML=`<h4>CONNECTION LEGEND</h4>
      <div class="lg-row"><span class="lg-line" style="border-top-style:solid"></span><span>Command</span></div>
      <div class="lg-row"><span class="lg-line" style="border-top-style:dashed"></span><span>Support</span></div>
      <div class="lg-row"><span class="lg-line" style="border-top-style:dotted;border-top-color:#3b82f6"></span><span>OPCON</span></div>
      <div class="lg-row"><span class="lg-line" style="border-top-style:dotted;border-top-color:#f97316"></span><span>TACON</span></div>
      <div class="lg-row"><span class="lg-line" style="border-top-style:dotted;border-top-color:#6b7280"></span><span>Coordination</span></div>
      <div class="lg-row"><span class="lg-dot" style="background:#3b82f6"></span><span>Tag highlight / selected affiliation</span></div>`;
    canvasWrap.appendChild(lg);
  }

  // background modal
  if(!document.getElementById('bg-modal')){
    const modal=document.createElement('div'); modal.className='modal-ov'; modal.id='bg-modal';
    modal.innerHTML=`<div class="modal-box"><h2>Canvas Background <span class="modal-x" onclick="closeModal('bg-modal')">✕</span></h2>
      <div class="fg"><label>Image</label><input type="file" id="bg-file" accept="image/*" style="color:var(--text);background:var(--surface2);border:1px solid var(--border);border-radius:5px;padding:5px;width:100%"></div>
      <div class="fg"><label>Opacity</label><input id="bg-opacity" type="range" min="0" max="0.8" step="0.05" value="0.22"></div>
      <img id="bg-preview"><div class="modal-acts"><button class="pb" style="width:auto;margin:0" onclick="clearCanvasBackground()">Clear</button><button class="pb" style="width:auto;margin:0" onclick="closeModal('bg-modal')">Done</button></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#bg-file').addEventListener('change',e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{ bgImage=ev.target.result; applyCanvasBackground(); markDirtySafe(); showToast('Background image applied'); const prev=document.getElementById('bg-preview'); prev.src=bgImage; prev.style.display='block'; }; r.readAsDataURL(f); e.target.value=''; });
    modal.querySelector('#bg-opacity').addEventListener('input',e=>{ bgOpacity=parseFloat(e.target.value||'0.22'); applyCanvasBackground(); markDirtySafe(); });
  }

  // Search enhancement
  function refreshSearchEnhancements(){
    searchMatches=[...document.querySelectorAll('.orbat-node.search-hit:not(.filtered-out)')].map(el=>el.id.replace('el-',''));
    if(searchMatches.length===0){ searchIndex=-1; searchMeta.textContent='0/0'; return; }
    if(searchIndex<0 || searchIndex>=searchMatches.length) searchIndex=0;
    searchMeta.textContent=`${searchIndex+1}/${searchMatches.length}`;
  }
  const prevRefreshSF=window.refreshSearchAndFilter;
  if(typeof prevRefreshSF==='function') window.refreshSearchAndFilter=function(){ const r=prevRefreshSF(); refreshSearchEnhancements(); return r; };
  document.getElementById('unit-search-input')?.addEventListener('keydown',e=>{
    if(e.key==='Enter' && searchMatches.length){
      e.preventDefault();
      if(searchIndex===-1) searchIndex=0; else if(e.shiftKey) searchIndex=(searchIndex-1+searchMatches.length)%searchMatches.length; else searchIndex=(searchIndex+1)%searchMatches.length;
      const id=searchMatches[searchIndex];
      refreshSearchEnhancements();
      jumpToNode(id);
    }
  });
  document.getElementById('unit-search-input')?.addEventListener('input',()=>{ searchIndex=searchMatches.length?0:-1; setTimeout(refreshSearchEnhancements,0); });

  // Themes
  function applyTheme(){ document.body.classList.remove('theme-dark','theme-light','theme-briefing'); document.body.classList.add('theme-'+currentTheme); const b=document.getElementById('btn-theme'); if(b) b.textContent=currentTheme==='dark'?'◐ Dark':currentTheme==='light'?'◑ Light':'▣ Brief'; }
  window.cycleTheme=function(){ currentTheme=currentTheme==='dark'?'light':currentTheme==='light'?'briefing':'dark'; applyTheme(); saveState(); showToast('Theme: '+currentTheme); };
  applyTheme();
  // Presentation mode changes visible chrome, so a layout refresh keeps canvas,
  // minimap, and status calculations aligned with the new shell dimensions.
  function refreshPresentationLayout(){
    if(typeof window.applyTransform === 'function') window.applyTransform();
    if(typeof window.updateMinimap === 'function') window.updateMinimap();
    if(typeof window.updSB === 'function') window.updSB();
    window.dispatchEvent(new Event('resize'));
  }
  function syncReadabilityBtns(){
    document.body.classList.toggle('presentation-mode', presentationMode);
    document.body.classList.toggle('clarity-mode', clarityMode);
    document.body.classList.toggle('connector-focus', connectorFocusMode);
    document.getElementById('btn-present')?.classList.toggle('active', presentationMode);
    document.getElementById('btn-clarity')?.classList.toggle('active', clarityMode);
    document.getElementById('btn-connector-focus')?.classList.toggle('active', connectorFocusMode);
    refreshPresentationLayout();
  }
  window.togglePresentationMode=function(){ presentationMode=!presentationMode; syncReadabilityBtns(); saveState(); showToast(presentationMode?'Presentation mode on':'Presentation mode off'); };
  window.toggleClarityMode=function(){ clarityMode=!clarityMode; syncReadabilityBtns(); saveState(); showToast(clarityMode?'Clarity mode on':'Clarity mode off'); };
  window.toggleConnectorFocusMode=function(){ connectorFocusMode=!connectorFocusMode; syncReadabilityBtns(); if(typeof drawConnectors==='function') drawConnectors(); saveState(); showToast(connectorFocusMode?'Connector emphasis on':'Connector emphasis off'); };
  syncReadabilityBtns();

  // Sticky panel
  function syncStickyBtn(){ document.getElementById('btn-sticky')?.classList.toggle('active', stickyPanel); }
  window.toggleStickyPanel=function(){ stickyPanel=!stickyPanel; syncStickyBtn(); saveState(); showToast(stickyPanel?'Sticky panel on':'Sticky panel off'); };
  syncStickyBtn();
  const prevDeselect=deselectAll;
  deselectAll=function(){ if(stickyPanel){ document.querySelectorAll('.orbat-node').forEach(e=>e.classList.remove('selected','multi-selected')); selectedId=null; multiSel.clear(); const ep=document.getElementById('edit-panel'); ep.classList.remove('hid'); document.getElementById('ep-inner').style.display=''; document.getElementById('mp-inner').style.display='none'; const inner=document.getElementById('ep-inner'); if(!inner.querySelector('.sticky-empty')){ const div=document.createElement('div'); div.className='sticky-empty'; div.textContent='No unit selected. Click a unit to edit its properties.'; inner.prepend(div);} document.getElementById('align-bar').style.display='none'; updSB(); return; } prevDeselect(); };
  const prevPopulate=populateEditPanel; populateEditPanel=function(id){ document.querySelector('.sticky-empty')?.remove(); prevPopulate(id); };

  // Ctrl-click multi select
  const prevNClick=onNClick;
  onNClick=function(e,id){ if(e.ctrlKey||e.metaKey){ if(linkMode)return; if(multiSel.has(id))multiSel.delete(id); else multiSel.add(id); if(selectedId && selectedId!==id){ multiSel.add(selectedId); selectedId=null; } updSelUI(); return; } prevNClick(e,id); };

  // drag ghost
  const prevPalDrag=onPalDrag;
  onPalDrag=function(e){ prevPalDrag(e); try{ const src=e.currentTarget.cloneNode(true); src.classList.add('palette-drag-ghost'); document.body.appendChild(src); e.dataTransfer.setDragImage(src, 28, 28); setTimeout(()=>src.remove(),0);}catch(err){} };

  // inline undo helpers
  let undoTimer=null, undoToken=0;
  function offerUndo(msg, action){
    undoToken += 1;
    const token = undoToken;
    undoAction=action;
    if(undoTimer) clearTimeout(undoTimer);
    const t=document.getElementById('toast');
    t.innerHTML='';
    const span=document.createElement('span'); span.textContent=msg+' ';
    const btn=document.createElement('button');
    btn.textContent='Undo';
    btn.style.cssText='margin-left:8px;background:transparent;border:1px solid var(--accent);color:var(--accent);border-radius:4px;padding:1px 6px;cursor:pointer;pointer-events:auto';
    btn.onclick=()=>{ const act=undoAction; undoAction=null; if(undoTimer) clearTimeout(undoTimer); t.style.pointerEvents='none'; t.classList.remove('show'); t.textContent=''; if(act) act(); };
    t.append(span,btn); t.classList.add('show'); t.style.pointerEvents='auto';
    undoTimer=setTimeout(()=>{ if(undoToken===token) undoAction=null; t.style.pointerEvents='none'; t.classList.remove('show'); t.textContent=''; },5000);
  }
  function restoreDocSnapshot(snap){ applyDocumentState(JSON.parse(JSON.stringify(snap)), {trackHistory:false,preserveView:true}); saveState(); showToast('Undo restored'); }
  const prevDelSel=deleteSelected; deleteSelected=function(){ if(multiSel.size>1){ deleteMultiSel(); return;} if(!selectedId) return; const snap=serializeDocument(); const name=nodes[selectedId]?.name||'Unit'; deleteNode(selectedId); saveState(); offerUndo('Deleted '+name, ()=>restoreDocSnapshot(snap)); };
  const prevDelMulti=deleteMultiSel; deleteMultiSel=function(){ const ids=[...multiSel]; if(!ids.length) return; const snap=serializeDocument(); const count=ids.length; const rootIds=ids.filter(id=>!ids.includes(nodes[id]?.parentId)); rootIds.forEach(id=>deleteNode(id)); saveState(); offerUndo('Deleted '+count+' selected', ()=>restoreDocSnapshot(snap)); };
  const prevClear=clearAll; clearAll=function(silent=false){ const snap=serializeDocument(); if(!silent && Object.keys(nodes).length>0 && !confirm('Clear entire ORBAT?')) return; prevClear(true); offerUndo('Canvas cleared', ()=>restoreDocSnapshot(snap)); };

  // shortcut hints
  const hints={'btn-focus':'Alt+F','btn-smart-labels':'S','btn-theme':'T','btn-csv':'CSV','btn-bg':'B','btn-sticky':'P','btn-present':'V','btn-clarity':'C','btn-connector-focus':'LNK','btn-legend':'I','btn-random-orbat':'RND'};
  Object.entries(hints).forEach(([id,h])=>{ const b=document.getElementById(id); if(b && !b.querySelector('.hint-kbd')){ const s=document.createElement('span'); s.className='hint-kbd'; s.textContent=h; b.appendChild(s);} });

  // middle mouse panning
  canvasWrap.addEventListener('mousedown',e=>{ if(e.button!==1) return; e.preventDefault(); midPan=true; midStart={x:e.clientX,y:e.clientY,panX,panY}; canvasWrap.style.cursor='grabbing'; }, true);
  window.addEventListener('mousemove',e=>{ if(!midPan) return; panX=midStart.panX + (e.clientX-midStart.x); panY=midStart.panY + (e.clientY-midStart.y); applyTransform(); }, true);
  window.addEventListener('mouseup',e=>{ if(e.button===1 && midPan){ midPan=false; canvasWrap.style.cursor='default'; } }, true);

  // legend toggle
  window.toggleLegend=function(){ const lg=document.getElementById('legend-overlay'); lg.classList.toggle('open'); document.getElementById('btn-legend')?.classList.toggle('active', lg.classList.contains('open')); };

  // lock/fade UI and behavior
  const prevRender=renderNode;
  renderNode=function(id){ prevRender(id); const n=nodes[id], el=document.getElementById('el-'+id); if(!n||!el) return; el.classList.toggle('locked', !!n.locked); el.classList.toggle('faded', !!n.faded);
    let lock=el.querySelector('.node-lock-btn'); if(!lock){ lock=document.createElement('div'); lock.className='node-lock-btn'; lock.textContent='🔒'; lock.title='Toggle lock'; lock.onclick=(ev)=>{ev.stopPropagation(); n.locked=!n.locked; renderNode(id); saveState(); showToast(n.locked?'Node locked':'Node unlocked');}; el.querySelector('.node-card')?.appendChild(lock);} lock.style.opacity=n.locked?'1':'';
    let fade=el.querySelector('.node-fade-btn'); if(!fade){ fade=document.createElement('div'); fade.className='node-fade-btn'; fade.textContent='◐'; fade.title='Toggle faded state'; fade.onclick=(ev)=>{ev.stopPropagation(); n.faded=!n.faded; renderNode(id); saveState(); showToast(n.faded?'Node faded':'Node restored');}; el.querySelector('.node-card')?.appendChild(fade);} fade.style.opacity=n.faded?'1':''; };
  Object.keys(nodes).forEach(renderNode);
  const prevOnNMD2=onNMD; onNMD=function(e){ const id=e.currentTarget.id.replace('el-',''); if(nodes[id]?.locked){ showToast('Node is locked'); return; } prevOnNMD2(e); };
  document.addEventListener('keydown',e=>{ if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){ const ids=(multiSel.size?[...multiSel]:(selectedId?[selectedId]:[])).filter(id=>nodes[id] && !nodes[id].locked); if(!ids.length && (selectedId||multiSel.size)){ e.preventDefault(); showToast('Selection is locked'); } } }, true);

  // panel controls for lock/fade
  if(document.getElementById('ep-inner') && !document.getElementById('ep-lock-toggle')){
    const psec=[...document.querySelectorAll('#ep-inner .psec')].find(el=>el.textContent.trim()==='Actions');
    const wrap=document.createElement('div'); wrap.innerHTML=`<div class="psec">View State</div><div class="fr"><button class="pb" id="ep-lock-toggle" style="margin:0">🔒 Lock</button><button class="pb" id="ep-fade-toggle" style="margin:0">◐ Fade</button></div>`;
    document.getElementById('ep-inner').insertBefore(wrap, psec||document.getElementById('ep-inner').lastChild);
    document.getElementById('ep-lock-toggle').onclick=()=>{ if(!selectedId||!nodes[selectedId]) return; nodes[selectedId].locked=!nodes[selectedId].locked; renderNode(selectedId); saveState(); showToast(nodes[selectedId].locked?'Node locked':'Node unlocked'); };
    document.getElementById('ep-fade-toggle').onclick=()=>{ if(!selectedId||!nodes[selectedId]) return; nodes[selectedId].faded=!nodes[selectedId].faded; renderNode(selectedId); saveState(); showToast(nodes[selectedId].faded?'Node faded':'Node restored'); };
    const prevPop2=populateEditPanel; populateEditPanel=function(id){ prevPop2(id); const n=nodes[id]||{}; const lb=document.getElementById('ep-lock-toggle'); const fb=document.getElementById('ep-fade-toggle'); if(lb) lb.classList.toggle('active',!!n.locked); if(fb) fb.classList.toggle('active',!!n.faded); };
  }

  // CSV export
  window.exportCSV=function(){
    const headers=['Name','Designation','Commander','Type','Echelon','Strength','Equipment','Readiness','Location','Task','Higher HQ','Parent','Tags','Locked','Faded'];
    const rows=Object.values(nodes).map(n=>[n.name,n.designation,n.commander,n.typeId,n.echelon,n.strength,n.equipment,n.readiness,n.location,n.task,n.higherHQ,n.parentId?nodes[n.parentId]?.name||n.parentId:'',(n.tags||[]).join('; '),n.locked?'Yes':'No',n.faded?'Yes':'No']);
    const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
    const csv=[headers,...rows].map(r=>r.map(esc).join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=(document.getElementById('op-name-input')?.value||'orbat').replace(/\s+/g,'_')+'.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); showToast('CSV exported'); };

  // background image functions
  function applyCanvasBackground(){ canvasWrap.style.backgroundImage=(bgImage?`linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0)), url(${bgImage})`:''); canvasWrap.style.backgroundSize=bgImage?'cover':''; canvasWrap.style.backgroundPosition=bgImage?'center center':''; canvasWrap.style.setProperty('--bgimg-opacity', String(bgOpacity)); const prev=document.getElementById('bg-preview'); if(prev){ if(bgImage){ prev.src=bgImage; prev.style.display='block'; } else { prev.style.display='none'; prev.src=''; } } const slider=document.getElementById('bg-opacity'); if(slider) slider.value=String(bgOpacity); }
  window.openBgModal=function(){ openModal('bg-modal'); applyCanvasBackground(); };
  window.clearCanvasBackground=function(){ bgImage=null; applyCanvasBackground(); markDirtySafe(); showToast('Background image cleared'); };
  function markDirtySafe(){ try{ if(typeof markDirty==='function') markDirty(); }catch(e){} }
  applyCanvasBackground();

  // enhance search/filter: search designation/type/tags already, add filter by faded/locked keywords
  const prevNodeSearchText=window.nodeSearchText; if(typeof prevNodeSearchText==='function') window.nodeSearchText=function(n){ return prevNodeSearchText(n)+' '+(n.locked?'locked ':'')+(n.faded?'faded grey withdrawn ':''); };

  // background overlay pseudo-element via real element
  if(!document.getElementById('canvas-bg-overlay')){ const bg=document.createElement('div'); bg.id='canvas-bg-overlay'; bg.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:0;background-repeat:no-repeat;background-position:center;background-size:cover;opacity:'+bgOpacity; canvasWrap.insertBefore(bg, canvasWrap.firstChild); const origApply=applyCanvasBackground; applyCanvasBackground=function(){ bg.style.backgroundImage=bgImage?`url(${bgImage})`:'none'; bg.style.opacity=String(bgOpacity); }; applyCanvasBackground(); }

  // ensure new theme/background save on initial autosave
  window.addEventListener('load',()=>{ refreshSearchEnhancements(); applyTheme(); applyCanvasBackground(); });
})();
