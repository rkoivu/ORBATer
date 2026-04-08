(function(){
  const topbar=document.getElementById('topbar');
  const statusbar=document.getElementById('statusbar');
  const canvasWrap=document.getElementById('canvas-wrap');
  const RECENT_KEY='orbat_recent_types_v5';
  let recentTypes=[];
  try{ recentTypes=JSON.parse(localStorage.getItem(RECENT_KEY)||'[]'); if(!Array.isArray(recentTypes)) recentTypes=[]; }catch(e){ recentTypes=[]; }

  function saveRecentTypes(){ try{ localStorage.setItem(RECENT_KEY, JSON.stringify(recentTypes.slice(0,6))); }catch(e){} }
  function noteRecentType(typeId){
    if(!typeId) return;
    recentTypes=[typeId].concat(recentTypes.filter(v=>v!==typeId)).slice(0,6);
    saveRecentTypes();
    try{ buildPalette(); }catch(e){}
  }

  const style=document.createElement('style');
  style.textContent=`
    .rename-inline{width:100%;background:#0f172a;border:1px solid var(--accent);border-radius:4px;color:var(--text);font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;text-align:center;padding:2px 4px;outline:none}
    .pal-recent-badge{font-family:'Share Tech Mono',monospace;font-size:8px;color:var(--accent2);margin-left:4px}
  `;
  document.head.appendChild(style);

  function mkBtn(id, text, title, onclick){
    const btn=document.createElement('button');
    btn.className='tb-btn'; btn.id=id; btn.textContent=text; btn.title=title; btn.onclick=onclick;
    return btn;
  }
  const fitBtn=[...topbar.querySelectorAll('.tb-btn')].find(b=>b.textContent.includes('Fit'));
  if(fitBtn){
    const zoomOutBtn=mkBtn('btn-zoom-out','−','Zoom out',()=>window.zoomByStep(-1));
    const zoomInBtn=mkBtn('btn-zoom-in','＋','Zoom in',()=>window.zoomByStep(1));
    topbar.insertBefore(zoomOutBtn, fitBtn.nextSibling);
    topbar.insertBefore(zoomInBtn, zoomOutBtn.nextSibling);
  }
  const layoutBtn=[...topbar.querySelectorAll('.tb-btn')].find(b=>b.textContent.includes('Layout'));
  if(layoutBtn){
    const collapseAllBtn=mkBtn('btn-collapse-all','▾ All','Collapse all subtrees',()=>setAllCollapsed(true));
    const expandAllBtn=mkBtn('btn-expand-all','▸ All','Expand all subtrees',()=>setAllCollapsed(false));
    topbar.insertBefore(collapseAllBtn, layoutBtn.nextSibling);
    topbar.insertBefore(expandAllBtn, collapseAllBtn.nextSibling);
  }

  const hint=statusbar.querySelector('.hint');
  const selectedCount=document.createElement('span'); selectedCount.innerHTML='Selected Cnt: <b id="sb-selcount">0 of 0</b>';
  const echelonCount=document.createElement('span'); echelonCount.innerHTML='Mix: <b id="sb-echelons">—</b>';
  const breadcrumb=document.createElement('span'); breadcrumb.innerHTML='Path: <b id="sb-breadcrumb">—</b>';
  statusbar.insertBefore(selectedCount, hint);
  statusbar.insertBefore(echelonCount, hint);
  statusbar.insertBefore(breadcrumb, hint);

  function getSelectionIds(){
    if(typeof multiSel!=='undefined' && multiSel && multiSel.size) return [...multiSel];
    if(typeof selectedId!=='undefined' && selectedId) return [selectedId];
    return [];
  }
  function buildBreadcrumb(id){
    if(!id || !nodes[id]) return '—';
    const parts=[]; let cur=nodes[id]; const seen=new Set();
    while(cur && !seen.has(cur.id)){
      parts.unshift(cur.designation || cur.name || cur.id);
      seen.add(cur.id);
      cur=cur.parentId && nodes[cur.parentId] ? nodes[cur.parentId] : null;
    }
    return parts.join(' → ');
  }
  const prevUpdSB=updSB;
  updSB=function(){
    prevUpdSB();
    const ids=getSelectionIds();
    const total=Object.keys(nodes||{}).length;
    const selCountEl=document.getElementById('sb-selcount');
    if(selCountEl) selCountEl.textContent=`${ids.length} of ${total}`;
    const mix={};
    Object.values(nodes||{}).forEach(n=>{ mix[n.echelon]=(mix[n.echelon]||0)+1; });
    const order=['army_group','army','corps','division','brigade','regiment','battalion','company','platoon','squad','team','region'];
    const mixText=order.filter(k=>mix[k]).slice(0,4).map(k=>`${mix[k]}×${k.replace('_',' ')}`).join(', ') || '—';
    const echelonEl=document.getElementById('sb-echelons'); if(echelonEl) echelonEl.textContent=mixText;
    const bcEl=document.getElementById('sb-breadcrumb'); if(bcEl) bcEl.textContent=ids.length===1?buildBreadcrumb(ids[0]):(ids.length>1?'Multiple selected':'—');
  };

  window.zoomByStep=function(dir){
    const rect=canvasWrap.getBoundingClientRect();
    const mx=rect.width/2, my=rect.height/2;
    const factor=dir>0?1.15:1/1.15;
    const nz=Math.min(4,Math.max(0.1,zoom*factor));
    panX=mx-(mx-panX)*(nz/zoom); panY=my-(my-panY)*(nz/zoom); zoom=nz; applyTransform(); showToast(dir>0?'Zoomed in':'Zoomed out');
  };
  window.resetZoomView=function(mode){
    if(mode==='fit'){ fitScreen(); return; }
    zoom=1; panX=24; panY=24; applyTransform(); showToast('Zoom reset');
  };
  canvasWrap.addEventListener('dblclick',e=>{
    const base=e.target===canvasWrap||e.target===document.getElementById('canvas')||e.target===document.getElementById('connector-svg');
    if(base) window.resetZoomView('fit');
  });

  const prevBuildPalette=buildPalette;
  buildPalette=function(){
    prevBuildPalette();
    const scroll=document.getElementById('sidebar-scroll');
    if(!scroll || !recentTypes.length) return;
    const all=[...UT,...customTypes];
    const items=recentTypes.map(id=>all.find(u=>u.id===id)).filter(Boolean);
    if(!items.length) return;
    const sec=document.createElement('div'); sec.className='palette-section';
    const title=document.createElement('div'); title.className='palette-section-title'; title.innerHTML='Recent <span class="pal-recent-badge">last 6</span>';
    const grid=document.createElement('div'); grid.className='palette-grid';
    items.forEach(ut=>{
      const item=document.createElement('div'); item.className='pal-item'; item.draggable=true; item.dataset.typeId=ut.id;
      if(ut.tip) item.setAttribute('data-tip',ut.tip);
      item.innerHTML=ut.dataUrl?`<img class="pal-custom-icon" src="${ut.dataUrl}"><span>${ut.label}</span>`:`${(window.getSym||getSym)(ut.id,'friendly','battalion')}<span>${ut.label}</span>`;
      item.addEventListener('dragstart',onPalDrag); grid.appendChild(item);
    });
    sec.appendChild(title); sec.appendChild(grid); scroll.insertBefore(sec, scroll.firstChild);
  };

  const prevCreateNode=createNode;
  createNode=function(d={}){ const id=prevCreateNode(d); try{ noteRecentType((nodes[id]||{}).typeId || d.typeId); }catch(e){} return id; };

  function beginInlineRename(id){
    const el=document.getElementById('el-'+id); if(!el || !nodes[id]) return;
    const nameEl=el.querySelector('.node-name'); if(!nameEl || nameEl.querySelector('input')) return;
    const oldName=nodes[id].name||'';
    const input=document.createElement('input'); input.className='rename-inline'; input.value=oldName;
    nameEl.textContent=''; nameEl.appendChild(input); input.focus(); input.select();
    let _renameDone=false;
    const finish=(commit)=>{
      if(_renameDone) return; // Escape fires keydown→finish(false) which calls renderNode
      _renameDone=true;       // removing the input from DOM, which triggers blur→finish(true).
      if(commit){ nodes[id].name=input.value.trim()||oldName; if(typeof selectedId!=='undefined' && selectedId===id) populateEditPanel(id); saveState(); }
      (window.renderNode||renderNode)(id); drawConnectors(); updSB();
    };
    input.addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); finish(true); } if(ev.key==='Escape'){ ev.preventDefault(); finish(false); } });
    input.addEventListener('blur',()=>finish(true), {once:true});
  }

  const prevRenderNode=renderNode;
  renderNode=function(id){
    prevRenderNode(id);
    const el=document.getElementById('el-'+id); if(!el) return;
    if(!el.dataset.qolPatched){
      el.dataset.qolPatched='1';
      el.addEventListener('dblclick',ev=>{ if(ev.target.closest('.node-add-btn,.node-link-btn,.collapse-btn,.node-collapsed-badge')) return; ev.stopPropagation(); beginInlineRename(id); });
    }
  };

  document.addEventListener('keydown',e=>{
    const ae=document.activeElement;
    if(ae && (ae.tagName==='INPUT' || ae.tagName==='TEXTAREA' || ae.tagName==='SELECT' || ae.isContentEditable)) return;
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){
      const ids=getSelectionIds().filter(id=>nodes[id] && !nodes[id].locked); if(!ids.length) return;
      e.preventDefault();
      const step=(typeof SNAP!=='undefined' && snapOn)?SNAP:10;
      const mult=e.shiftKey?5:1;
      let dx=0,dy=0;
      if(e.key==='ArrowUp') dy=-step*mult;
      if(e.key==='ArrowDown') dy=step*mult;
      if(e.key==='ArrowLeft') dx=-step*mult;
      if(e.key==='ArrowRight') dx=step*mult;
      ids.forEach(id=>{ if(nodes[id]){ nodes[id].x=snapV(nodes[id].x+dx); nodes[id].y=snapV(nodes[id].y+dy); const el=document.getElementById('el-'+id); if(el){ el.style.left=nodes[id].x+'px'; el.style.top=nodes[id].y+'px'; } } });
      drawConnectors(); saveState(); updSB(); showToast('Nudged selection');
    }
  }, true);

  // richer tooltips for topbar buttons
  const mojibakeLeadRE=/[\u00C2\u00C3\u00E2]/;
  const tt={
    '\uFF0B Root':'Add root unit','\u229E Layout':'Auto-layout (L)','\u2317 Snap':'Cycle grid/snap (G)','\u2922 Link':'Toggle link mode','\u2194 Fit':'Fit to screen (F)',
    '\u21A9 Undo':'Undo (Ctrl+Z)','\u21AA Redo':'Redo (Ctrl+Y)','\u29C9 Copy':'Copy selected (Ctrl+C)','\u22A1 Paste':'Paste (Ctrl+V)',
    '\uD83D\uDDBC Icons':'Toggle image icons','\uD83C\uDFAF Focus':'Focus selection','\uD83C\uDFF7 Tags':'Toggle tag highlight','\uD83C\uDFB2 Random':'Random ORBAT','\u2295 Templates':'Load template','? Keys':'Keyboard shortcuts','\u2715 Clear':'Clear all'
  };
  topbar.querySelectorAll('.tb-btn').forEach(btn=>{ if(!btn.title) btn.title=tt[btn.textContent.trim()]||btn.textContent.trim(); });

  function normalizeZoomUiText(){
    const zoomOut=document.getElementById('btn-zoom-out'); if(zoomOut) zoomOut.textContent='Zoom -';
    const zoomIn=document.getElementById('btn-zoom-in'); if(zoomIn) zoomIn.textContent='Zoom +';
    const foldAll=document.getElementById('btn-collapse-all'); if(foldAll) foldAll.textContent='Fold All';
    const openAll=document.getElementById('btn-expand-all'); if(openAll) openAll.textContent='Open All';
    const echelons=document.getElementById('sb-echelons'); if(echelons && mojibakeLeadRE.test(echelons.textContent||'')) echelons.textContent='-';
    const breadcrumb=document.getElementById('sb-breadcrumb'); if(breadcrumb && mojibakeLeadRE.test(breadcrumb.textContent||'')) breadcrumb.textContent='-';
  }
  const prevReadableUpdSB=updSB;
  updSB=function(){
    prevReadableUpdSB();
    const echelons=document.getElementById('sb-echelons');
    if(echelons) echelons.textContent=(echelons.textContent||'').replaceAll('\u00C3\u0192\u00E2\u20AC\u201D','x ').replaceAll('\u00C3\u00A2\u00E2\u201A\u00AC\u00E2\u20AC\u009D','-');
    const breadcrumb=document.getElementById('sb-breadcrumb');
    if(breadcrumb) breadcrumb.textContent=(breadcrumb.textContent||'').replaceAll('\u00C3\u00A2\u00E2\u20AC\u00A0\u00E2\u20AC\u2122',' > ').replaceAll('\u00C3\u00A2\u00E2\u201A\u00AC\u00E2\u20AC\u009D','-');
    normalizeZoomUiText();
  };

  buildPalette();
  updSB();
  normalizeZoomUiText();
})();
