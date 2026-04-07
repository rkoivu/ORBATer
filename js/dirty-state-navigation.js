(function(){
  const canvasWrap=document.getElementById('canvas-wrap');
  const canvasEl=document.getElementById('canvas');
  const topbar=document.getElementById('topbar');
  const origTitle=document.title.replace(/^\*\s*/, '');
  let unsavedDirty=false;
  let suppressAutoCenter=false;
  let dragCancelled=false;
  let dragSnapshot=null;
  let pendingPastePoint=null;

  function setDirty(v){
    unsavedDirty=!!v;
    document.title=(unsavedDirty?'* ':'')+origTitle;
  }
  function markSaved(){ setDirty(false); }
  function markDirty(){ setDirty(true); }
  window.addEventListener('beforeunload',e=>{
    if(!unsavedDirty) return;
    e.preventDefault();
    e.returnValue='';
  });

  const prevSaveState=saveState;
  saveState=function(){
    prevSaveState();
    markSaved();
  };
  const prevRestoreState=restoreState;
  restoreState=function(s){ prevRestoreState(s); markSaved(); };
  const prevApplyDocumentState=applyDocumentState;
  applyDocumentState=function(doc,opts){ prevApplyDocumentState(doc,opts); markSaved(); };

  const mutatingEvents=['input','change'];
  mutatingEvents.forEach(evt=>document.addEventListener(evt,e=>{
    if(e.target && (e.target.closest('#ep-inner') || e.target.id==='op-name-input' || e.target.id==='unit-search-input' || e.target.id==='tag-filter-input')){
      if(e.target.id!=='unit-search-input' && e.target.id!=='tag-filter-input') markDirty();
    }
  }, true));

  // Contextual cursors
  function syncCanvasCursor(){
    if(document.body.classList.contains('link-mode')){ canvasWrap.style.cursor='crosshair'; return; }
    if(typeof isPanning!=='undefined' && isPanning){ canvasWrap.style.cursor='grabbing'; return; }
    canvasWrap.style.cursor='default';
  }
  const prevApplyTransform=applyTransform;
  applyTransform=function(){ prevApplyTransform(); syncCanvasCursor(); };
  canvasWrap.addEventListener('mousedown',e=>{ if((e.target===canvasWrap||e.target===canvasEl||e.target===document.getElementById('connector-svg')) && e.button===0 && !document.body.classList.contains('link-mode')) canvasWrap.style.cursor='grabbing'; }, true);
  window.addEventListener('mouseup',()=>syncCanvasCursor(), true);
  syncCanvasCursor();

  // Better toast helper with queue reset
  const prevShowToast=showToast;
  let toastTimer=null;
  showToast=function(msg){
    clearTimeout(toastTimer);
    prevShowToast(msg);
    const t=document.getElementById('toast');
    toastTimer=setTimeout(()=>t.classList.remove('show'),2300);
  };

  // Add toasts to common actions lacking them
  const prevAddRoot=addRootUnit;
  addRootUnit=function(){ prevAddRoot(); markDirty(); showToast('Root unit added'); };
  const prevAddChild=addChildNode;
  addChildNode=function(e,pId){ prevAddChild(e,pId); markDirty(); showToast('Subordinate added'); };
  const prevClearIcon=clearNodeIcon;
  clearNodeIcon=function(){ if(!selectedId) return; prevClearIcon(); markDirty(); showToast('Custom icon removed'); };
  const prevSetAff=setAffil;
  setAffil=function(a){ prevSetAff(a); markDirty(); showToast('Affiliation set to '+a); };
  const prevSetStat=setStat;
  setStat=function(s){ prevSetStat(s); markDirty(); showToast('Combat status updated'); };
  const prevToggleCollapse=toggleCollapse;
  toggleCollapse=function(e,id){ prevToggleCollapse(e,id); markDirty(); };
  const prevToggleSnap=toggleSnap;
  function syncSnapState(){
    const btn=document.getElementById('btn-snap');
    if(!btn) return;
    const snapEnabled=(window.snapOn || typeof snapOn !== 'undefined' && snapOn);
    btn.classList.toggle('active', !!snapEnabled);
  }
  toggleSnap=function(){ prevToggleSnap(); syncSnapState(); showToast('Snap ' + ((window.snapOn || typeof snapOn !== 'undefined' && snapOn) ? 'enabled' : 'disabled')); };
  syncSnapState();
  const prevClearAll=clearAll;
  clearAll=function(silent=false){ prevClearAll(silent); if(!silent) showToast('ORBAT cleared'); markDirty(); };

  // Scroll/center selected when keyboard navigation or explicit jump uses suppress flag
  function centerOnNode(id, preserveZoom=true){
    const n=nodes[id], el=document.getElementById('el-'+id);
    if(!n||!el) return;
    const rect=canvasWrap.getBoundingClientRect();
    if(!preserveZoom) zoom=1;
    panX=rect.width/2 - (n.x + el.offsetWidth/2)*zoom;
    panY=rect.height/2 - (n.y + el.offsetHeight/2)*zoom;
    applyTransform();
  }
  const prevSelectNode=selectNode;
  selectNode=function(id){ prevSelectNode(id); if(!suppressAutoCenter) return; centerOnNode(id,true); suppressAutoCenter=false; };

  // Tab cycle nodes
  function visibleNodeIds(){
    return Object.values(nodes).filter(n=>{
      const el=document.getElementById('el-'+n.id);
      return el && el.style.display!=='none' && !el.classList.contains('filtered-out');
    }).sort((a,b)=> (a.y-b.y) || (a.x-b.x)).map(n=>n.id);
  }
  document.addEventListener('keydown',e=>{
    const ae=document.activeElement;
    if(ae && (ae.tagName==='INPUT'||ae.tagName==='TEXTAREA'||ae.tagName==='SELECT'||ae.isContentEditable)) return;
    if(e.key==='Tab'){
      const ids=visibleNodeIds();
      if(!ids.length) return;
      e.preventDefault();
      const current=(selectedId && ids.includes(selectedId))? ids.indexOf(selectedId): -1;
      const next=e.shiftKey ? ids[(current<=0?ids.length:current)-1] : ids[(current+1)%ids.length];
      suppressAutoCenter=true;
      selectNode(next);
      showToast('Selected '+(nodes[next]?.name||next));
      return;
    }
  }, true);

  // Escape cancels drag and link drag
  document.addEventListener('keydown',e=>{
    const ae=document.activeElement;
    if(ae && (ae.tagName==='INPUT'||ae.tagName==='TEXTAREA'||ae.tagName==='SELECT'||ae.isContentEditable)) return;
    if(e.key!=='Escape') return;
    if(dragId && dragSnapshot){
      Object.entries(dragSnapshot.positions).forEach(([id,pos])=>{
        if(!nodes[id]) return;
        nodes[id].x=pos.x; nodes[id].y=pos.y;
        const el=document.getElementById('el-'+id); if(el){ el.style.left=pos.x+'px'; el.style.top=pos.y+'px'; }
      });
      dragCancelled=true;
      drawConnectors();
      showToast('Drag cancelled');
      e.stopImmediatePropagation();
      e.preventDefault();
      return;
    }
    if(typeof linkDrag!=='undefined' && linkDrag){
      linkDrag=false;
      try{ document.getElementById('link-svg').innerHTML=''; }catch(err){}
      showToast('Link cancelled');
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);
  const prevOnNMD=onNMD;
  onNMD=function(e){
    prevOnNMD(e);
    if(dragId){
      const ids=(multiSel.has(dragId)&&multiSel.size>1)? [...multiSel] : [dragId];
      dragSnapshot={positions:Object.fromEntries(ids.map(id=>[id,{x:nodes[id].x,y:nodes[id].y}]))};
      dragCancelled=false;
    }
  };
  const prevOnNMU=onNMU;
  onNMU=function(e){
    const wasCancelled=dragCancelled;
    prevOnNMU(e);
    if(wasCancelled){ dragCancelled=false; dragSnapshot=null; return; }
    dragSnapshot=null;
  };

  // Right-click paste on empty canvas at cursor
  const prevPasteNodes=pasteNodes;
  pasteNodes=function(atPoint){
    const point=atPoint || pendingPastePoint;
    pendingPastePoint=null;
    if(point && clipboard && clipboard.length){
      const minX=Math.min(...clipboard.map(n=>+n.x||0));
      const minY=Math.min(...clipboard.map(n=>+n.y||0));
      const idMap={}, created=[];
      clipboard.forEach(n=>{
        const newId=createNode({...n,parentId:null,x:snapV(point.x + ((+n.x||0)-minX)),y:snapV(point.y + ((+n.y||0)-minY))});
        idMap[n._srcId||n.id]=newId; created.push(newId);
      });
      clipboard.forEach(n=>{ const newId=idMap[n._srcId||n.id]; const newParent=idMap[n.parentId]; if(newParent&&canSetParent(newId,newParent)){nodes[newId].parentId=newParent;} });
      drawConnectors(); multiSel=new Set(created); updSelUI(); saveState(); showToast('Pasted at cursor');
      return;
    }
    prevPasteNodes();
  };
  document.addEventListener('contextmenu',e=>{
    const base=e.target===canvasWrap||e.target===canvasEl||e.target===document.getElementById('connector-svg');
    if(!base) return;
    if(!clipboard || !clipboard.length) return;
    e.preventDefault();
    const rect=canvasWrap.getBoundingClientRect();
    pendingPastePoint={x:snapV((e.clientX-rect.left-panX)/zoom), y:snapV((e.clientY-rect.top-panY)/zoom)};
    pasteNodes(pendingPastePoint);
  }, true);

  // Fix F shortcut conflict: plain F fits, Alt+F focuses
  document.addEventListener('keydown',e=>{
    const ae=document.activeElement;
    if(ae && (ae.tagName==='INPUT'||ae.tagName==='TEXTAREA'||ae.tagName==='SELECT'||ae.isContentEditable)) return;
    if((e.key==='f'||e.key==='F') && !e.ctrlKey && !e.metaKey){
      e.preventDefault();
      e.stopImmediatePropagation();
      if(e.altKey) focusSelection();
      else fitScreen();
    }
    if(e.key==='Home'){
      e.preventDefault();
      if(e.shiftKey && window.centerOnHostileRoot) window.centerOnHostileRoot();
      else if(e.altKey && window.centerOnNeutralRoot) window.centerOnNeutralRoot();
      else if(window.centerOnRoot) window.centerOnRoot();
    }
  }, true);

  // More descriptive topbar tooltips
  const extraTitles={
    'btn-auto-layout':'Auto-layout current ORBAT (L)',
    'btn-focus':'Focus selection (Alt+F)',
    'btn-snap':'Cycle grid/snap (G)',
    'btn-link':'Toggle link mode (Esc to cancel)',
    'btn-hostile-root':'Center on first hostile root (Shift+Home)',
    'btn-neutral-root':'Center on first neutral root (Alt+Home)',
    'btn-zoom-in':'Zoom in',
    'btn-zoom-out':'Zoom out',
    'btn-collapse-all':'Collapse all subtrees',
    'btn-expand-all':'Expand all subtrees',
    'btn-tag-highlight':'Toggle tag highlight',
    'btn-smart-labels':'Toggle smart labels',
  };
  Object.entries(extraTitles).forEach(([id,title])=>{ const el=document.getElementById(id); if(el) el.title=title; });

  // Save/dirty state on operation name changes
  document.getElementById('op-name-input')?.addEventListener('input',()=>markDirty());
  document.getElementById('op-name-input')?.addEventListener('change',()=>{saveState(); showToast('Operation name updated');});

  updSB();
  markSaved();
})();
