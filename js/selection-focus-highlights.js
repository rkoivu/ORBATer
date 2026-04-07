(function(){
  const focusBtn=document.getElementById('btn-focus');
  const tagBtn=document.getElementById('btn-tag-highlight');
  const hostileRootBtn=document.getElementById('btn-hostile-root');
  const neutralRootBtn=document.getElementById('btn-neutral-root');
  let tagHighlightEnabled=false;

  function affBorder(n){
    const afC={friendly:'#3b82f6',hostile:'#ef4444',neutral:'#f59e0b',unknown:'#a855f7'};
    return afC[n.affil]||'#3b82f6';
  }
  function tooltipText(n){
    const parts=[];
    parts.push((n.designation? n.designation+' — ' : '') + (n.name||'Unit'));
    if(n.commander) parts.push('Cmdr: '+n.commander);
    if(n.equipment) parts.push('Equip: '+n.equipment);
    if(n.readiness!==undefined && n.readiness!==null && String(n.readiness).trim()!=='') parts.push('Readiness: '+n.readiness+'%');
    if(n.task) parts.push('Task: '+n.task);
    if(n.notes) parts.push('Notes: '+String(n.notes).replace(/\s+/g,' ').slice(0,160));
    return parts.join('\n');
  }
  function syncTagBtn(){ tagBtn?.classList.toggle('soft-active', tagHighlightEnabled); }
  function hasSelection(){ return !!selectedId || ((multiSel?.size||0)>0); }
  function rootForAffiliations(affils){
    const wanted=new Set(affils);
    return Object.values(nodes||{})
      .filter(n=>!n.parentId && wanted.has(n.affil))
      .sort((a,b)=>(a.y-b.y)||(a.x-b.x))[0] || null;
  }
  function centerOnNodeData(node, label){
    if(!node) return false;
    const el=document.getElementById('el-'+node.id);
    if(!el) return false;
    const rect=canvasWrap.getBoundingClientRect();
    panX=rect.width/2 - (node.x + el.offsetWidth/2)*zoom;
    panY=rect.height/2 - (node.y + el.offsetHeight/2)*zoom;
    applyTransform();
    if(label) showToast(label);
    return true;
  }
  function syncFocusBtn(){
    const enabled=hasSelection();
    focusBtn?.classList.toggle('soft-active', enabled);
    if(focusBtn){
      focusBtn.title=enabled?'Focus selection (Alt+F)':'Select a unit to focus';
      focusBtn.setAttribute('aria-disabled', enabled?'false':'true');
    }
  }
  function syncRootButtons(){
    const hostileReady=!!rootForAffiliations(['hostile']);
    const neutralReady=!!rootForAffiliations(['neutral']);
    hostileRootBtn?.classList.toggle('soft-active', hostileReady);
    neutralRootBtn?.classList.toggle('soft-active', neutralReady);
    if(hostileRootBtn) hostileRootBtn.title=hostileReady?'Center on first hostile root (Shift+Home)':'No hostile root';
    if(neutralRootBtn) neutralRootBtn.title=neutralReady?'Center on first neutral root (Alt+Home)':'No neutral root';
  }
  function syncToolbarState(){
    syncTagBtn();
    syncFocusBtn();
    syncRootButtons();
  }
  window.toggleTagHighlight=function(){ tagHighlightEnabled=!tagHighlightEnabled; syncTagBtn(); Object.keys(nodes).forEach(renderNode); try{saveState();}catch(e){} };
  window.focusSelection=function(){
    const ids=selectedId?[selectedId]:Array.from(multiSel||[]);
    if(!ids.length) return;
    const rect=canvasWrap.getBoundingClientRect();
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    ids.forEach(id=>{
      const n=nodes[id]; const el=document.getElementById('el-'+id); if(!n||!el) return;
      minX=Math.min(minX,n.x); minY=Math.min(minY,n.y);
      maxX=Math.max(maxX,n.x+el.offsetWidth); maxY=Math.max(maxY,n.y+el.offsetHeight);
    });
    if(!isFinite(minX)) return;
    const pad=40;
    const bw=Math.max(80,maxX-minX+pad*2), bh=Math.max(60,maxY-minY+pad*2);
    const zx=rect.width/bw, zy=rect.height/bh;
    zoom=Math.max(0.35,Math.min(1.6,Math.min(zx,zy)));
    panX=rect.width/2 - ((minX+maxX)/2)*zoom;
    panY=rect.height/2 - ((minY+maxY)/2)*zoom;
    applyTransform();
  };
  window.centerOnRoot=function(){
    const roots=Object.values(nodes||{}).filter(n=>!n.parentId);
    if(!roots.length) return;
    roots.sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const root=roots[0];
    const el=document.getElementById('el-'+root.id);
    if(!el) return;
    const rect=canvasWrap.getBoundingClientRect();
    panX=rect.width/2 - (root.x + el.offsetWidth/2)*zoom;
    panY=rect.height/2 - (root.y + el.offsetHeight/2)*zoom;
    applyTransform();
    showToast('Centered on root');
  };
  window.centerOnHostileRoot=function(){
    if(centerOnNodeData(rootForAffiliations(['hostile']),'Centered on hostile root')) return;
    showToast('No hostile root found');
  };
  window.centerOnNeutralRoot=function(){
    if(centerOnNodeData(rootForAffiliations(['neutral']),'Centered on neutral root')) return;
    showToast('No neutral root found');
  };

  const prevSerialize=serializeDocument;
  serializeDocument=function(){ const d=prevSerialize(); d.tagHighlightEnabled=tagHighlightEnabled; return d; };
  const prevApplyDoc=applyDocumentState;
  applyDocumentState=function(doc,opts){ prevApplyDoc(doc,opts); tagHighlightEnabled=doc.tagHighlightEnabled===true; syncToolbarState(); /* renderNode loop removed: applyDocumentState already renders all nodes */ };

  const prevRender=renderNode;
  renderNode=function(id){
    prevRender(id);
    const n=nodes[id]; const el=document.getElementById('el-'+id); if(!n||!el) return;
    const card=el.querySelector('.node-card'); if(!card) return;
    card.title=tooltipText(n);
    if(tagHighlightEnabled && n.tags && n.tags.length){
      card.style.borderColor=tagColor(n.tags[0]);
    } else {
      card.style.borderColor=affBorder(n);
    }
  };

  const prevCtx=ctxAct;
  ctxAct=function(act){
    if(act==='qa-inf' && ctxTarget){ hideCtx(); createNode({parentId:ctxTarget,typeId:'infantry',name:'Infantry',echelon:'company',x:nodes[ctxTarget].x,y:nodes[ctxTarget].y+120}); drawConnectors(); saveState(); return; }
    if(act==='qa-arm' && ctxTarget){ hideCtx(); createNode({parentId:ctxTarget,typeId:'armour',name:'Armour',echelon:'company',x:nodes[ctxTarget].x,y:nodes[ctxTarget].y+120}); drawConnectors(); saveState(); return; }
    if(act==='qa-arty' && ctxTarget){ hideCtx(); createNode({parentId:ctxTarget,typeId:'artillery',name:'Artillery',echelon:'company',x:nodes[ctxTarget].x,y:nodes[ctxTarget].y+120}); drawConnectors(); saveState(); return; }
    if(act==='dup-sibling' && ctxTarget){ hideCtx(); selectNode(ctxTarget); duplicateAsSibling(); return; }
    if(act==='dup-child' && ctxTarget){ hideCtx(); selectNode(ctxTarget); duplicateAsChild(); return; }
    return prevCtx(act);
  };

  const prevUpdSelUI=updSelUI;
  updSelUI=function(){ const r=prevUpdSelUI.apply(this, arguments); syncToolbarState(); return r; };

  document.addEventListener('keydown',e=>{
    const tag=(e.target&&e.target.tagName)||'';
    if(tag==='INPUT'||tag==='TEXTAREA'||e.target?.isContentEditable) return;
    // F key handled by capture-phase listener (fitScreen / Alt+F=focusSelection)
  });

  syncToolbarState();
  Object.keys(nodes).forEach(renderNode);
})();
