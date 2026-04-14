(function(){
  const topbar=document.getElementById('topbar');
  const sidebar=document.getElementById('sidebar');
  const editPanel=document.getElementById('edit-panel');
  const canvasWrap=document.getElementById('canvas-wrap');
  const minimap=document.getElementById('minimap');
  const mmCanvas=document.getElementById('mm-canvas');
  if(!topbar||!sidebar||!editPanel||!canvasWrap) return;

  // Tooltip UI
  let tooltip=document.getElementById('orbat-tooltip');
  if(!tooltip){ tooltip=document.createElement('div'); tooltip.id='orbat-tooltip'; tooltip.className='orbat-tooltip'; document.body.appendChild(tooltip); }
  let minimapPreview=document.getElementById('minimap-preview-box');
  if(!minimapPreview){ minimapPreview=document.createElement('div'); minimapPreview.id='minimap-preview-box'; minimapPreview.className='minimap-preview'; canvasWrap.appendChild(minimapPreview); }

  function showTip(text,x,y){
    if(!text){ hideTip(); return; }
    tooltip.textContent=text;
    tooltip.style.display='block';
    const pad=14;
    const rect=tooltip.getBoundingClientRect();
    let left=x+14, top=y+14;
    if(left+rect.width>window.innerWidth-pad) left=x-rect.width-14;
    if(top+rect.height>window.innerHeight-pad) top=y-rect.height-14;
    tooltip.style.left=Math.max(pad,left)+'px';
    tooltip.style.top=Math.max(pad,top)+'px';
  }
  function hideTip(){ tooltip.style.display='none'; }
  const ECH_MAP={team:'Team / Crew',squad:'Squad / Section',platoon:'Platoon',company:'Company / Battery',battalion:'Battalion / Squadron',regiment:'Regiment',brigade:'Brigade',division:'Division',corps:'Corps',army:'Army',army_group:'Army Group',region:'Region'};
  const AFF_MAP={friendly:'Friendly',hostile:'Hostile',neutral:'Neutral',unknown:'Unknown'};
  const FRAME_TIPS={
    present:'Present: the unit is currently in being. APP-6 style uses a solid frame for present formations.',
    planned:'Planned: the unit is intended or scheduled but not yet in place. APP-6 style uses a dashed frame for planned formations.'
  };
  const MOD_TIPS={
    none:'No modifier: the unit displays without an extra strength or headquarters marker.',
    reinforced:'Reinforced: shows that the unit has been strengthened beyond its normal establishment.',
    reduced:'Reduced: shows that the unit is under strength or operating with fewer elements than normal.',
    hq:'HQ: marks the unit as a headquarters or command post element.'
  };
  function findTypeLabel(typeId){
    const typeSelect=document.getElementById('ep-type');
    const option=[...(typeSelect?.options||[])].find(opt=>opt.value===typeId);
    return option?.textContent||typeId||'Unknown type';
  }
  function symbolTooltipText(n){
    if(!n) return '';
    const lines=[];
    lines.push(`${findTypeLabel(n.typeId)} symbol`);
    lines.push(`Affiliation: ${AFF_MAP[n.affil]||'Unknown'}`);
    lines.push(`Echelon: ${ECH_MAP[n.echelon]||n.echelon||'Unknown'}`);
    if(n.frameStatus&&FRAME_TIPS[n.frameStatus]) lines.push(FRAME_TIPS[n.frameStatus]);
    if(n.mod&&n.mod!=='none'&&MOD_TIPS[n.mod]) lines.push(MOD_TIPS[n.mod]);
    return lines.join('\n');
  }

  function nodeTooltipText(n){
    const parts=[];
    parts.push((n.designation? n.designation+' — ':'')+(n.name||'Unit'));
    parts.push('Type: '+(n.typeId||'unknown')+' · '+(n.echelon||'unknown'));
    if(n.commander) parts.push('Cmdr: '+n.commander);
    if(n.strength) parts.push('Strength: '+n.strength);
    if(n.equipment) parts.push('Equipment: '+n.equipment);
    if(n.readiness!==undefined && n.readiness!==null && String(n.readiness).trim()!=='') parts.push('Readiness: '+n.readiness+'%');
    if(n.task) parts.push('Task: '+n.task);
    if(n.location) parts.push('Location: '+n.location);
    if(n.tags&&n.tags.length) parts.push('Tags: '+n.tags.join(', '));
    if(n.notes) parts.push('Notes: '+String(n.notes).replace(/\s+/g,' ').slice(0,140));
    return parts.join('\n');
  }
  function bindSymbolAndModifierTips(scope=document){
    scope.querySelectorAll?.('[data-fs]').forEach(btn=>{
      if(btn.dataset.tipBound==='1') return;
      btn.dataset.tipBound='1';
      const text=FRAME_TIPS[btn.dataset.fs];
      if(text) btn.title=text;
      btn.addEventListener('mousemove',ev=>showTip(text,ev.clientX,ev.clientY));
      btn.addEventListener('mouseleave',hideTip);
    });
    scope.querySelectorAll?.('[data-mod]').forEach(btn=>{
      if(btn.dataset.tipBound==='1') return;
      btn.dataset.tipBound='1';
      const text=MOD_TIPS[btn.dataset.mod];
      if(text) btn.title=text;
      btn.addEventListener('mousemove',ev=>showTip(text,ev.clientX,ev.clientY));
      btn.addEventListener('mouseleave',hideTip);
    });
    const frameLabel=document.getElementById('ep-frame-status-label');
    if(frameLabel && frameLabel.dataset.tipBound!=='1'){
      frameLabel.dataset.tipBound='1';
      const text='Frame status controls whether the APP-6 unit frame reads as present or planned.';
      frameLabel.title=text;
      frameLabel.addEventListener('mousemove',ev=>showTip(text,ev.clientX,ev.clientY));
      frameLabel.addEventListener('mouseleave',hideTip);
    }
    const modifierLabel=document.getElementById('ep-modifier-label');
    if(modifierLabel && modifierLabel.dataset.tipBound!=='1'){
      modifierLabel.dataset.tipBound='1';
      const text='Unit modifiers add APP-6 context such as reinforced, reduced, or headquarters status.';
      modifierLabel.title=text;
      modifierLabel.addEventListener('mousemove',ev=>showTip(text,ev.clientX,ev.clientY));
      modifierLabel.addEventListener('mouseleave',hideTip);
    }
  }

  // Zoom buttons if absent
  if(!document.getElementById('btn-zoom-out')){
    const fitBtn=[...topbar.querySelectorAll('.tb-btn')].find(b=>b.textContent.includes('Fit'));
    const mk=(id,text,title,fn)=>{ const b=document.createElement('button'); b.className='tb-btn'; b.id=id; b.textContent=text; b.title=title; b.onclick=fn; return b; };
    if(fitBtn){
      const out=mk('btn-zoom-out','−','Zoom out',()=>window.zoomByStep&&window.zoomByStep(-1));
      const inn=mk('btn-zoom-in','＋','Zoom in',()=>window.zoomByStep&&window.zoomByStep(1));
      topbar.insertBefore(out, fitBtn.nextSibling);
      topbar.insertBefore(inn, out.nextSibling);
    }
  }

  // Bulk rename feature
  if(!document.getElementById('btn-bulk-prefix')){
    const ref=document.getElementById('btn-random-orbat') || topbar.lastElementChild;
    const b=document.createElement('button');
    b.className='tb-btn'; b.id='btn-bulk-prefix'; b.textContent='⇥ Prefix'; b.title='Bulk rename prefix / suffix';
    b.onclick=function(){
      const ids=(multiSel&&multiSel.size)?[...multiSel]:(selectedId?[selectedId]:[]);
      if(!ids.length){ showToast('Select one or more units first'); return; }
      const prefix=prompt('Prefix to prepend to selected unit names:', '');
      if(prefix===null) return;
      const suffix=prompt('Suffix to append to selected unit names:', '');
      if(suffix===null) return;
      ids.forEach(id=>{ if(nodes[id]){ nodes[id].name=(prefix||'')+(nodes[id].name||'')+(suffix||''); renderNode(id);} });
      drawConnectors(); saveState(); showToast('Bulk rename applied');
    };
    topbar.insertBefore(b, ref);
  }

  // Resize handles
  function ensureHandle(parent,id){
    let h=document.getElementById(id);
    if(!h){ h=document.createElement('div'); h.id=id; h.className='resize-handle'; parent.appendChild(h); }
    return h;
  }
  const sh=ensureHandle(sidebar,'sidebar-resize-handle');
  const ph=ensureHandle(editPanel,'panel-resize-handle');

  function makeResizable(handle,target,cssVar,min,max,fromRight){
    let active=false,startX=0,startW=0;
    handle.addEventListener('mousedown',e=>{
      e.preventDefault(); active=true; startX=e.clientX; startW=target.getBoundingClientRect().width; handle.classList.add('active'); document.body.style.cursor='ew-resize';
    });
    window.addEventListener('mousemove',e=>{
      if(!active) return;
      const dx=e.clientX-startX;
      let w=fromRight ? startW-dx : startW+dx;
      w=Math.max(min,Math.min(max,w));
      document.documentElement.style.setProperty(cssVar,w+'px');
      target.style.width='var('+cssVar+')';
    });
    window.addEventListener('mouseup',()=>{
      if(!active) return;
      active=false; handle.classList.remove('active'); document.body.style.cursor='';
    });
  }
  makeResizable(sh,sidebar,'--sidebar-w',180,460,false);
  makeResizable(ph,editPanel,'--panel-w',240,520,true);

  // Multi-level focus dimming
  function relatedSet(id){
    const set=new Set();
    if(!id||!nodes[id]) return set;
    set.add(id);
    let cur=nodes[id];
    while(cur&&cur.parentId&&nodes[cur.parentId]){ set.add(cur.parentId); cur=nodes[cur.parentId]; }
    (function walk(pid){ Object.values(nodes).forEach(n=>{ if(n.parentId===pid && !set.has(n.id)){ set.add(n.id); walk(n.id); } }); })(id);
    return set;
  }
  function updateFocusDimming(){
    const ids=(multiSel&&multiSel.size)?[...multiSel]:(selectedId?[selectedId]:[]);
    const rel=new Set();
    ids.forEach(id=>relatedSet(id).forEach(v=>rel.add(v)));
    Object.keys(nodes).forEach(id=>{
      const el=document.getElementById('el-'+id); if(!el) return;
      el.classList.toggle('dimmed', !!ids.length && !rel.has(id));
    });
  }
  const _selectNode=window.selectNode||selectNode;
  const _deselectAll=window.deselectAll||deselectAll;
  window.selectNode=selectNode=function(id){ const r=_selectNode.call(this,id); updateFocusDimming(); return r; };
  window.deselectAll=deselectAll=function(){ const r=_deselectAll.call(this); updateFocusDimming(); return r; };
  const _updSelUI=window.updSelUI||updSelUI;
  window.updSelUI=updSelUI=function(){ const r=_updSelUI.call(this); updateFocusDimming(); return r; };

  // Auto-pan on drag near edge
  if(typeof onNMM==='function'){
    const prevOnNMM=onNMM;
    window.onNMM=onNMM=function(e){
      const rect=canvasWrap.getBoundingClientRect();
      const edge=34, panStep=18;
      let moved=false;
      if(dragId){
        if(e.clientX<rect.left+edge){ panX+=panStep; moved=true; }
        else if(e.clientX>rect.right-edge){ panX-=panStep; moved=true; }
        if(e.clientY<rect.top+edge){ panY+=panStep; moved=true; }
        else if(e.clientY>rect.bottom-edge){ panY-=panStep; moved=true; }
        if(moved) applyTransform();
      }
      return prevOnNMM.call(this,e);
    };
  }

  // Paste in place vs offset
  if(typeof pasteNodes==='function' && !window.__v9PasteWrapped){
    window.__v9PasteWrapped=true;
    const prevPaste=pasteNodes;
    window.pasteNodes=pasteNodes=function(atPoint, opts){
      if(opts && opts.offset===false && !atPoint){
        return prevPaste.call(this,{x:0,y:0});
      }
      return prevPaste.apply(this, arguments);
    };
    // No extra keydown listener here — the global keydown handler in the main script
    // block already calls pasteNodes() (= window.pasteNodes, the wrapped version) on
    // Ctrl+V. This extra capture-phase listener called prevPaste directly, bypassing
    // later wrappers, and fired alongside the global handler causing a double-paste.
  }

  // Node render enhancements: tooltip + truncated name tooltip
  const prevRenderNode=window.renderNode||renderNode;
  window.renderNode=renderNode=function(id){
    const r=prevRenderNode.call(this,id);
    const el=document.getElementById('el-'+id); const n=nodes[id];
    if(!el||!n) return r;
    if(!el.dataset.v9TooltipBound){
      el.dataset.v9TooltipBound='1';
      el.addEventListener('mousemove',ev=>{
        const nameEl=ev.target.closest('.node-name');
        const symbolEl=ev.target.closest('.node-symbol,.node-mod-badge,.node-status-badge');
        if(symbolEl){
          showTip(symbolTooltipText(n),ev.clientX,ev.clientY);
          return;
        }
        if(nameEl){
          const text=(nameEl.scrollWidth>nameEl.clientWidth)?(n.name||''):nodeTooltipText(n);
          showTip(text,ev.clientX,ev.clientY);
          return;
        }
        if(ev.target.closest('.node-card')) showTip(nodeTooltipText(n),ev.clientX,ev.clientY);
      });
      el.addEventListener('mouseleave',hideTip);
    }
    return r;
  };
  Object.keys(nodes||{}).forEach(id=>renderNode(id));
  bindSymbolAndModifierTips(document);

  // ep-tags injection is handled by injectPanelFields() earlier in the script.
  // No duplicate injection needed here.

  // Minimap hover preview
  function minimapNodeAt(clientX,clientY){
    if(!mmVisible || !minimap || !mmCanvas || minimap.style.display==='none') return null;
    const rect=minimap.getBoundingClientRect();
    if(clientX<rect.left||clientX>rect.right||clientY<rect.top||clientY>rect.bottom) return null;
    const all=Object.values(nodes);
    const els=all.map(n=>({n,el:document.getElementById('el-'+n.id)})).filter(x=>x.el&&x.el.style.display!=='none');
    if(!els.length) return null;
    let mnX=Infinity,mnY=Infinity,mxX=-Infinity,mxY=-Infinity;
    els.forEach(({n,el})=>{ mnX=Math.min(mnX,n.x); mnY=Math.min(mnY,n.y); mxX=Math.max(mxX,n.x+el.offsetWidth); mxY=Math.max(mxY,n.y+el.offsetHeight); });
    const sc=Math.min(144/(mxX-mnX+1),86/(mxY-mnY+1),1);
    const lx=clientX-rect.left, ly=clientY-rect.top;
    for(const {n,el} of els){
      const x=(n.x-mnX)*sc+5, y=(n.y-mnY)*sc+5, w=el.offsetWidth*sc, h=el.offsetHeight*sc;
      if(lx>=x&&lx<=x+w&&ly>=y&&ly<=y+h) return n;
    }
    return null;
  }
  minimap.addEventListener('mousemove',e=>{
    const n=minimapNodeAt(e.clientX,e.clientY);
    if(!n){ minimapPreview.style.display='none'; return; }
    minimapPreview.textContent=(n.designation? n.designation+' — ':'')+(n.name||'Unit');
    minimapPreview.style.display='block';
    minimapPreview.style.left=(e.clientX-canvasWrap.getBoundingClientRect().left+10)+'px';
    minimapPreview.style.top=(e.clientY-canvasWrap.getBoundingClientRect().top+10)+'px';
  });
  minimap.addEventListener('mouseleave',()=>{ minimapPreview.style.display='none'; });

  // Connector hover tooltip using hit svg overlay
  function bindConnectorHover(){
    const hit=document.getElementById('connector-hit-svg'); if(!hit) return;
    hit.querySelectorAll('path').forEach(path=>{
      if(path.dataset.v9HoverBound) return;
      path.dataset.v9HoverBound='1';
      path.addEventListener('mousemove',ev=>{
        const child=nodes[path.dataset.childId]; if(!child||!child.parentId||!nodes[child.parentId]) return;
        const parent=nodes[child.parentId];
        showTip((parent.name||parent.designation||parent.id)+' → '+(child.name||child.designation||child.id)+'\n'+String(child.reltype||'command').toUpperCase(), ev.clientX, ev.clientY);
      });
      path.addEventListener('mouseleave',hideTip);
    });
  }
  const prevDraw=window.drawConnectors||drawConnectors;
  window.drawConnectors=drawConnectors=function(){ const rr=prevDraw.apply(this,arguments); bindConnectorHover(); updateFocusDimming(); return rr; };
  // drawConnectors() deferred to normal render cycle — removed premature double-draw

  // Keep dimming/tooltip state fresh after autos
  updateFocusDimming();
  bindSymbolAndModifierTips(document);
})();
