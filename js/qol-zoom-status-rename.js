(function(){
  const topbar=document.getElementById('topbar');
  const statusbar=document.getElementById('statusbar');
  const canvasWrap=document.getElementById('canvas-wrap');
  const RECENT_KEY='orbat_recent_types_v5';
  const FAVORITES_KEY='orbat_favorite_types_v1';
  let recentTypes=[];
  let favoriteTypes=[];
  try{ recentTypes=JSON.parse(localStorage.getItem(RECENT_KEY)||'[]'); if(!Array.isArray(recentTypes)) recentTypes=[]; }catch(e){ recentTypes=[]; }
  try{ favoriteTypes=JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]'); if(!Array.isArray(favoriteTypes)) favoriteTypes=[]; }catch(e){ favoriteTypes=[]; }

  function saveRecentTypes(){ try{ localStorage.setItem(RECENT_KEY, JSON.stringify(recentTypes.slice(0,6))); }catch(e){} }
  function saveFavoriteTypes(){ try{ localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteTypes.slice(0,12))); return true; }catch(e){ return false; } }
  function noteRecentType(typeId){
    if(!typeId) return;
    recentTypes=[typeId].concat(recentTypes.filter(v=>v!==typeId)).slice(0,6);
    saveRecentTypes();
    try{ buildPalette(); }catch(e){}
  }
  function isFavoriteType(typeId){ return !!typeId && favoriteTypes.includes(typeId); }
  function toggleFavoriteType(typeId){
    if(!typeId) return;
    const next=isFavoriteType(typeId)
      ? favoriteTypes.filter(v=>v!==typeId)
      : [typeId].concat(favoriteTypes.filter(v=>v!==typeId)).slice(0,12);
    favoriteTypes=next;
    if(!saveFavoriteTypes()){
      showToast('Favorites could not be saved');
      return;
    }
    try{ buildPalette(); }catch(e){}
    showToast(isFavoriteType(typeId)?'Added to palette favorites':'Removed from palette favorites');
  }
  function getAllPaletteTypes(){ return [...UT,...customTypes]; }
  function findPaletteType(typeId){ return getAllPaletteTypes().find(u=>u.id===typeId)||null; }
  function makePaletteItem(ut){
    const item=document.createElement('div'); item.className='pal-item'; item.draggable=true; item.dataset.typeId=ut.id;
    if(ut.tip) item.setAttribute('data-tip',ut.tip);
    item.innerHTML=ut.dataUrl?`<img class="pal-custom-icon" src="${ut.dataUrl}"><span>${ut.label}</span>`:`${(window.getSym||getSym)(ut.id,'friendly','battalion')}<span>${ut.label}</span>`;
    item.addEventListener('dragstart',onPalDrag);
    decoratePaletteItem(item);
    return item;
  }
  function decoratePaletteItem(item){
    if(!item || item.dataset.favoriteBound==='1') return item;
    item.dataset.favoriteBound='1';
    const typeId=item.dataset.typeId;
    if(!typeId) return item;
    let btn=item.querySelector('.pal-favorite-btn');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='pal-favorite-btn';
      btn.setAttribute('aria-label','Toggle palette favorite');
      btn.title='Pin to favorites';
      btn.addEventListener('click',ev=>{ ev.preventDefault(); ev.stopPropagation(); toggleFavoriteType(typeId); });
      btn.addEventListener('mousedown',ev=>{ ev.preventDefault(); ev.stopPropagation(); });
      item.appendChild(btn);
    }
    const active=isFavoriteType(typeId);
    btn.classList.toggle('active',active);
    btn.textContent=active?'★':'☆';
    btn.title=active?'Remove from favorites':'Pin to favorites';
    return item;
  }
  function makePaletteSection(titleText, badgeText, items){
    if(!items.length) return null;
    const sec=document.createElement('div'); sec.className='palette-section';
    const title=document.createElement('div'); title.className='palette-section-title';
    title.innerHTML=badgeText?`${titleText} <span class="pal-recent-badge">${badgeText}</span>`:titleText;
    const grid=document.createElement('div'); grid.className='palette-grid';
    title.onclick=()=>{ title.classList.toggle('collapsed'); grid.classList.toggle('hidden'); };
    items.forEach(ut=>grid.appendChild(makePaletteItem(ut)));
    sec.appendChild(title); sec.appendChild(grid);
    return sec;
  }
  let syncingPinnedSections=false;
  function renderPinnedPaletteSections(){
    if(syncingPinnedSections) return;
    const scroll=document.getElementById('sidebar-scroll');
    if(!scroll) return;
    syncingPinnedSections=true;
    scroll.querySelectorAll('[data-palette-pinned="1"]').forEach(el=>el.remove());
    const favorites=favoriteTypes.map(findPaletteType).filter(Boolean);
    const recents=recentTypes.map(findPaletteType).filter(Boolean);
    const fragments=[];
    const favoriteSection=makePaletteSection('Favorites','up to 12',favorites);
    const recentSection=makePaletteSection('Recent','last 6',recents);
    if(favoriteSection){ favoriteSection.dataset.palettePinned='1'; fragments.push(favoriteSection); }
    if(recentSection){ recentSection.dataset.palettePinned='1'; fragments.push(recentSection); }
    if(fragments.length){
      const frag=document.createDocumentFragment();
      fragments.reverse().forEach(sec=>frag.insertBefore(sec, frag.firstChild));
      scroll.insertBefore(frag, scroll.firstChild);
    }
    syncingPinnedSections=false;
  }

  const style=document.createElement('style');
  style.textContent=`
    .rename-inline{width:100%;background:#0f172a;border:1px solid var(--accent);border-radius:4px;color:var(--text);font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;text-align:center;padding:2px 4px;outline:none}
    .pal-recent-badge{font-family:'Share Tech Mono',monospace;font-size:8px;color:var(--accent2);margin-left:4px}
    .pal-favorite-btn{position:absolute;top:5px;right:5px;width:20px;height:20px;border:1px solid rgba(148,163,184,.24);border-radius:999px;background:rgba(15,23,42,.82);color:rgba(203,213,225,.9);font-size:11px;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transform:translateY(-1px);transition:opacity .15s ease,border-color .15s ease,color .15s ease,background .15s ease}
    .pal-item:hover .pal-favorite-btn,.pal-item:focus-within .pal-favorite-btn,.pal-favorite-btn.active{opacity:1}
    .pal-favorite-btn:hover,.pal-favorite-btn:focus-visible{border-color:rgba(245,158,11,.55);color:#fbbf24;background:rgba(36,26,5,.92);outline:none}
    .pal-favorite-btn.active{border-color:rgba(245,158,11,.58);color:#fbbf24;background:rgba(54,39,9,.95)}
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
    renderPinnedPaletteSections();
    const scroll=document.getElementById('sidebar-scroll');
    if(scroll) scroll.querySelectorAll('.pal-item').forEach(decoratePaletteItem);
  };

  const paletteObserver=new MutationObserver(mutations=>{
    if(syncingPinnedSections) return;
    let needsPinnedRefresh=false;
    mutations.forEach(mutation=>{
      mutation.addedNodes.forEach(node=>{
        if(!(node instanceof HTMLElement)) return;
        if(node.matches('.pal-item')) decoratePaletteItem(node);
        node.querySelectorAll?.('.pal-item').forEach(decoratePaletteItem);
        if(!node.dataset.palettePinned && node.matches('.palette-section,.panel-help')) needsPinnedRefresh=true;
      });
    });
    if(needsPinnedRefresh) renderPinnedPaletteSections();
  });
  const sidebarScroll=document.getElementById('sidebar-scroll');
  if(sidebarScroll) paletteObserver.observe(sidebarScroll,{childList:true,subtree:true});

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
