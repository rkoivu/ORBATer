(function(){
  if(window.__orbatBootModule ? !window.__orbatBootModule('history-search-connectors') : window.__orbatHistorySearchConnectorsBooted) return;
  window.__orbatHistorySearchConnectorsBooted = true;
  // Consolidated post-fix layer
  const topbar=document.getElementById('topbar');
  const canvasWrap=document.getElementById('canvas-wrap');
  const searchInput=document.getElementById('unit-search-input');
  const tagInput=document.getElementById('tag-filter-input');
  const searchMeta=document.getElementById('search-meta');

  // ---- Cross-tab autosave conflict warning ----
  window.addEventListener('storage', function(ev){
    if(ev.key==='orbat_v3' && ev.newValue && document.visibilityState==='visible'){
      showToast('Autosave updated in another tab');
    }
  });

  // ---- Undo/Redo visualiser ----
  if(!document.getElementById('hist-modal')){
    const modal=document.createElement('div');
    modal.className='modal-ov';
    modal.id='hist-modal';
    modal.innerHTML='<div class="modal-box" style="min-width:420px"><h2>History <span class="modal-x" onclick="closeModal(\'hist-modal\')">✕</span></h2><div id="hist-list" style="display:flex;flex-direction:column;gap:6px"></div></div>';
    document.body.appendChild(modal);
    const btn=document.createElement('button');
    btn.className='tb-btn'; btn.id='btn-history'; btn.textContent='🕘 History'; btn.title='Open history list';
    btn.onclick=function(){
      const list=document.getElementById('hist-list'); list.innerHTML='';
      const entries=(history||[]).map((_,i)=>i).reverse();
      if(!entries.length){ list.innerHTML='<div style="font-size:11px;color:var(--text2)">No history yet. Make a change to create the first restore point.</div>'; }
      entries.forEach(i=>{
        const row=document.createElement('button');
        row.className='pb'; row.style.margin='0'; row.style.textAlign='left';
        row.textContent=(i===histIdx?'● ':'○ ')+'State '+i;
        row.onclick=function(){ if(i===histIdx){ closeModal('hist-modal'); return; } const snap=history[i]; if(snap){ histIdx=i; restoreState(snap); updSB(); showToast('Jumped to history state '+i); } closeModal('hist-modal'); };
        list.appendChild(row);
      });
      openModal('hist-modal');
    };
    const ref=document.getElementById('btn-random-orbat');
    if(ref) topbar.insertBefore(btn, ref);
  }

  // ---- Search counter consolidation ----
  let currentHits=[];
  let currentHitIndex=-1;
  function collectHits(){
    currentHits=[...document.querySelectorAll('.orbat-node.search-hit:not(.filtered-out)')].map(el=>el.id.replace('el-',''));
    if(!currentHits.length){ currentHitIndex=-1; }
    else if(currentHitIndex<0 || currentHitIndex>=currentHits.length){ currentHitIndex=0; }
  }
  function updateSearchCounter(){
    collectHits();
    if(searchMeta) searchMeta.textContent=currentHits.length ? `${currentHitIndex+1}/${currentHits.length}` : '0/0';
  }
  function gotoSearchHit(step){
    collectHits();
    if(!currentHits.length) return;
    if(currentHitIndex<0) currentHitIndex=0;
    else currentHitIndex=(currentHitIndex+step+currentHits.length)%currentHits.length;
    if(searchMeta) searchMeta.textContent=`${currentHitIndex+1}/${currentHits.length}`;
    jumpToNode(currentHits[currentHitIndex]);
  }
  if(searchInput){
    searchInput.addEventListener('input', ()=>setTimeout(updateSearchCounter,0), true);
    searchInput.addEventListener('keydown', e=>{
      if(e.key==='Enter'){
        e.preventDefault();
        gotoSearchHit(e.shiftKey?-1:1);
      }
    }, true);
  }
  if(tagInput) tagInput.addEventListener('input', ()=>setTimeout(updateSearchCounter,0), true);
  const prevRefresh=window.refreshSearchAndFilter;
  if(typeof prevRefresh==='function'){
    window.refreshSearchAndFilter=function(){ const r=prevRefresh.apply(this, arguments); setTimeout(updateSearchCounter,0); return r; };
  }
  setTimeout(updateSearchCounter, 50);

  // ---- Clear-all — canonical single implementation ----
  const _prevClearAllChain = (typeof clearAll==='function') ? clearAll : null;
  clearAll=window.clearAll=function(silent=false){
    const hasNodes=Object.keys(nodes||{}).length>0;
    const snap=hasNodes ? serializeDocument() : null;
    if(!silent && hasNodes && !confirm('Clear entire ORBAT?')) return;
    // Reset search/filter state by clearing inputs (IIFE vars reset via their listeners)
    try{ const si=document.getElementById('unit-search-input'); if(si){ si.value=''; si.dispatchEvent(new Event('input')); } }catch(_){}
    try{ const tf=document.getElementById('tag-filter-input'); if(tf){ tf.value=''; tf.dispatchEvent(new Event('input')); } }catch(_){}
    // Belt-and-braces: call refreshSearchAndFilter if available
    try{ if(typeof refreshSearchAndFilter==='function') refreshSearchAndFilter(); }catch(_){}
    clearCanvas();
    nodes={};
    nodeIdC=1;
    deselectAll();
    updSB();
    updEmpty();
    saveState();
    // markDirty shows the title asterisk — saveState only schedules autosave, not the title flag.
    try{ if(typeof markDirty==='function') markDirty(); }catch(_){}
    if(snap){
      if(typeof offerUndo==='function' && typeof restoreDocSnapshot==='function') offerUndo('Canvas cleared', ()=>restoreDocSnapshot(snap));
      else showToast('Canvas cleared');
    }
  };

  // ---- Consolidated renderNode (replaces chain) ----
  function consolidatedRenderNode(id){
    const n=nodes[id];
    const canvas=document.getElementById('canvas');
    if(!n || !canvas) return;
    let el=document.getElementById('el-'+id);
    if(!el){
      el=document.createElement('div'); el.id='el-'+id; canvas.appendChild(el);
      el.addEventListener('mousedown', onNMD);
      el.addEventListener('click', e=>{ e.stopPropagation(); onNClick(e,id); });
      el.addEventListener('contextmenu', e=>{ e.preventDefault(); e.stopPropagation(); showCtx(e,id); });
      el.addEventListener('mouseenter', ()=>highlightChain(id,true));
      el.addEventListener('mouseleave', ()=>highlightChain(id,false));
      el.addEventListener('dblclick', ev=>{ if(ev.target.closest('.node-add-btn,.node-link-btn,.collapse-btn,.node-collapsed-badge,.node-lock-btn,.node-fade-btn')) return; ev.stopPropagation(); if(typeof beginInlineRename==='function') beginInlineRename(id); });
    }
    el.style.left=n.x+'px'; el.style.top=n.y+'px';
    const szClass=n.size==='compact'?'sz-compact':n.size==='expanded'?'sz-expanded':'';
    el.className=`orbat-node ${szClass}${n.frameStatus==='planned'?' planned':''}`;
    el.classList.toggle('locked', !!n.locked);
    el.classList.toggle('faded', !!n.faded);
    if(selectedId===id) el.classList.add('selected');
    if(multiSel.has(id)) el.classList.add('multi-selected');

    const afC={friendly:'#3b82f6',hostile:'#ef4444',neutral:'#f59e0b',unknown:'#a855f7'};
    const baseBorder=(typeof affBorder==='function')?affBorder(n):(afC[n.affil]||'#3b82f6');
    const border=(typeof tagHighlightEnabled!=='undefined' && tagHighlightEnabled && n.tags && n.tags.length && typeof tagColor==='function') ? tagColor(n.tags[0]) : baseBorder;
    const bg=n.tint||'#1a2332';
    const stBadge=n.status?`<div class="node-status-badge ${n.status}" title="${n.status}"></div>`:'';
    const modMap={reinforced:'+',reduced:'−',hq:'⊕'};
    const modBadge=n.mod&&n.mod!=='none'?`<div class="node-mod-badge" title="${n.mod}">${modMap[n.mod]||''}</div>`:'';
    const showImg=(typeof useSymbolPackImages!=='undefined') ? !!useSymbolPackImages : true;
    // Use window.getSym to guarantee we call the patched version (which checks
    // useSymbolPackImages) rather than the original function-declaration binding.
    const _getSym = window.getSym || getSym;
    const iconHtml=(showImg && n.customIcon)
      ? `<div class="node-symbol"><img class="node-custom-img" src="${n.customIcon}"></div>`
      : `<div class="node-symbol">${_getSym(n.typeId,n.affil,n.echelon,n.frameStatus==='planned')}</div>`;
    const childCount=Object.values(nodes).filter(c=>c.parentId===id).length;
    const colBtnHtml=childCount>0?`<div class="collapse-btn" onclick="toggleCollapse(event,'${id}')" title="${n.collapsed?'Expand subtree':'Collapse subtree'}">${n.collapsed?'▸':'▾'}</div>`:'';
    const colBadge=n.collapsed&&childCount>0?`<div class="node-collapsed-badge" onclick="toggleCollapse(event,'${id}')">▸ ${childCount} hidden</div>`:'';
    const relC={command:'transparent',support:'#f59e0b',opcon:'#3b82f6',tacon:'#f97316',coord:'#6b7280'};
    const stripCol=relC[n.reltype]||'transparent';
    const relStrip=n.parentId&&n.reltype!=='command'?`<div class="node-reltype-strip" style="background:${stripCol}"></div>`:'';
    const displayName=(typeof smartLabelsEnabled!=='undefined' && smartLabelsEnabled && typeof formatSmartLabel==='function') ? formatSmartLabel(n.name) : n.name;
    const _esc=escXml||((v)=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    el.innerHTML=`<div class="node-card" style="background:${bg};border-color:${border}">
      ${stBadge}${modBadge}${relStrip}
      ${iconHtml}
      ${n.showDesig&&n.designation?`<div class="node-designation">${_esc(n.designation)}</div>`:''}
      <div class="node-name" title="${_esc(n.name)}">${_esc(displayName)}</div>
      ${n.showCmd&&n.commander?`<div class="node-commander">${_esc(n.commander)}</div>`:''}
      ${n.showStr&&n.strength?`<div class="node-strength-lbl">${_esc(n.strength)}${n.equipment?' · '+_esc(n.equipment):''}</div>`:''}
      ${n.showRdy&&n.readiness!==''&&n.readiness!=null?`<div class="node-strength-lbl">Rdy: ${_esc(n.readiness)}%</div>`:''}
      ${n.showTask&&n.task?`<div class="node-task-lbl">${_esc(n.task)}</div>`:''}
      <div class="node-link-btn" onmousedown="startLink(event,'${id}')" title="Drag to set parent">⤢</div>
      <div class="node-add-btn" onclick="addChildNode(event,'${id}')" title="Add subordinate">+</div>
      ${colBtnHtml}${colBadge}
    </div>`;
    const card=el.querySelector('.node-card');
    if(card){
      card.title=(typeof tooltipText==='function')?tooltipText(n):((n.designation? n.designation+' — ':'')+(n.name||'Unit'));
      const r=parseFloat(n.readiness);
      if(Number.isFinite(r)){
        const clamped=Math.max(0,Math.min(100,r));
        const pill=document.createElement('div'); pill.className='node-readiness-pill'; pill.textContent=`${Math.round(clamped)}%`;
        pill.style.background=clamped>=75?'#166534':clamped>=50?'#92400e':'#991b1b'; pill.title=`Readiness ${Math.round(clamped)}%`;
        card.appendChild(pill);
        card.style.boxShadow=`0 0 0 2px rgba(${clamped>=75?'34,197,94':clamped>=50?'245,158,11':'239,68,68'},0.24)`;
      }
      if(n.tags && n.tags.length && typeof tagColor==='function'){
        const tagsWrap=document.createElement('div'); tagsWrap.className='node-tags';
        n.tags.slice(0,3).forEach(tag=>{ const chip=document.createElement('span'); chip.className='node-tag-chip'; chip.textContent=tag; chip.style.background=tagColor(tag); tagsWrap.appendChild(chip); });
        card.appendChild(tagsWrap);
      }
      if(n.insignia){ let ins=document.createElement('img'); ins.className='node-insignia-mini'; ins.style.cssText='width:22px;height:22px;object-fit:contain;position:absolute;bottom:-10px;right:-10px;border:2px solid var(--bg);border-radius:50%;background:var(--surface2)'; ins.src=n.insignia; ins.title='Unit insignia'; card.appendChild(ins); }
      let lock=document.createElement('div'); lock.className='node-lock-btn'; lock.textContent='🔒'; lock.title='Toggle lock'; lock.style.opacity=n.locked?'1':''; lock.onclick=(ev)=>{ ev.stopPropagation(); n.locked=!n.locked; consolidatedRenderNode(id); saveState(); showToast(n.locked?'Node locked':'Node unlocked'); }; card.appendChild(lock);
      let fade=document.createElement('div'); fade.className='node-fade-btn'; fade.textContent='◐'; fade.title='Toggle faded state'; fade.style.opacity=n.faded?'1':''; fade.onclick=(ev)=>{ ev.stopPropagation(); n.faded=!n.faded; consolidatedRenderNode(id); saveState(); showToast(n.faded?'Node faded':'Node restored'); }; card.appendChild(fade);
    }
  }
  renderNode=window.renderNode=consolidatedRenderNode;
  Object.keys(nodes||{}).forEach(id=>renderNode(id));

  // ---- Connector interactivity ----
  let hitSvg=document.getElementById('connector-hit-svg');
  if(!hitSvg){
    hitSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    hitSvg.setAttribute('id','connector-hit-svg');
    hitSvg.style.cssText='position:absolute;top:0;left:0;overflow:visible;z-index:79;pointer-events:auto;width:1px;height:1px;transform-origin:0 0';
    canvasWrap.insertBefore(hitSvg, document.getElementById('link-svg'));
  }
  function applyHitTransform(){ hitSvg.style.transform=document.getElementById('canvas').style.transform || ''; }
  const prevApplyTransform=applyTransform;
  applyTransform=function(){ prevApplyTransform(); applyHitTransform(); };
  function connectorTooltipText(child){
    const parent=nodes[child.parentId];
    const rel=child.reltype||'command';
    return `${parent?.name||child.parentId} → ${child.name}\n${rel.toUpperCase()}`;
  }
  let selectedConnectorChildId=null;
  function drawConnectorHits(){
    hitSvg.innerHTML='';
    Object.values(nodes).forEach(n=>{
      if(!n.parentId || !nodes[n.parentId]) return;
      const pEl=document.getElementById('el-'+n.parentId), cEl=document.getElementById('el-'+n.id); if(!pEl||!cEl||pEl.style.display==='none'||cEl.style.display==='none') return;
      const parent=nodes[n.parentId];
      const x1=parent.x+pEl.offsetWidth/2, y1=parent.y+pEl.offsetHeight;
      const x2=n.x+cEl.offsetWidth/2, y2=n.y;
      const pathDef=getConnPath(x1,y1,x2,y2);
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', pathDef);
      path.setAttribute('stroke', selectedConnectorChildId===n.id ? 'rgba(245,158,11,0.30)' : 'transparent');
      path.setAttribute('stroke-width', selectedConnectorChildId===n.id ? '18' : '14');
      path.setAttribute('fill','none');
      path.dataset.childId=n.id;
      path.style.pointerEvents='stroke';
      path.style.cursor='pointer';
      path.addEventListener('mouseenter', ()=>showToast(connectorTooltipText(n)));
      path.addEventListener('click', ev=>{ ev.preventDefault(); ev.stopPropagation(); selectedConnectorChildId=n.id; selectNode(n.id); drawConnectorHits(); showToast('Connector selected'); });
      path.addEventListener('contextmenu', ev=>{
        ev.preventDefault();
        ev.stopPropagation();
        selectedConnectorChildId=n.id;
        drawConnectorHits();
        if(confirm('Delete connector?')){ n.parentId=null; selectedConnectorChildId=null; drawConnectors(); saveState(); showToast('Connector deleted'); }
      });
      hitSvg.appendChild(path);
    });
    applyHitTransform();
  }
  document.addEventListener('mousedown', ev=>{
    const hit=ev.target && ev.target.closest ? ev.target.closest('#connector-hit-svg path') : null;
    if(!hit && selectedConnectorChildId!==null){ selectedConnectorChildId=null; drawConnectorHits(); }
  }, true);

  const prevDrawConnectors=drawConnectors;
  drawConnectors=function(){ prevDrawConnectors(); drawConnectorHits(); updateSearchCounter(); };
  drawConnectors();
})();
