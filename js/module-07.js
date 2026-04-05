(function(){
  const style=document.createElement('style');
  style.textContent=`
    @page{size:auto;margin:14mm}
    @media print{
      html,body{background:#fff!important;color:#000!important}
      #canvas-wrap{padding:8mm!important}
      #connector-svg path,#connector-svg line,#connector-svg polyline{stroke:#333!important;stroke-opacity:1!important}
      .node-status-badge,.node-readiness-pill,.node-tags,.node-reltype-strip{print-color-adjust:exact;-webkit-print-color-adjust:exact}
    }
  `;
  document.head.appendChild(style);

  const topbarTitles={
    'btn-sb':'Toggle palette sidebar',
    'btn-snap':'Toggle snap/grid',
    'btn-link':'Link mode — drag connector handle',
    'btn-rel-labels':'Toggle relationship labels',
    'btn-smart-labels':'Toggle smart labels',
    'btn-icon-mode':'Toggle image icons',
    'btn-focus':'Focus selection (Alt+F)',
    'btn-tag-highlight':'Toggle tag highlight',
    'btn-random-orbat':'Generate random ORBAT',
    'btn-zoom-in':'Zoom in',
    'btn-zoom-out':'Zoom out',
    'btn-collapse-all':'Collapse all subtrees',
    'btn-expand-all':'Expand all subtrees'
  };
  const textTitles={
    '＋ Root':'Add root unit',
    '⊞ Layout':'Auto-layout canvas (L)',
    '↔ Fit':'Fit canvas to screen (F)',
    '↩ Undo':'Undo (Ctrl+Z)',
    '↪ Redo':'Redo (Ctrl+Y)',
    '⧉ Copy':'Copy selection (Ctrl+C)',
    '⊡ Paste':'Paste (Ctrl+V)',
    '⤓ JSON':'Export JSON',
    '⤒ Import':'Import JSON',
    '⤓ SVG':'Export SVG',
    '⤓ PNG':'Export PNG',
    '⎙ Print':'Print view',
    '⊕ Templates':'Load doctrinal template',
    '? Keys':'Show keyboard shortcuts',
    '✕ Clear':'Clear ORBAT'
  };
  document.querySelectorAll('#topbar .tb-btn').forEach(btn=>{
    if(btn.id && topbarTitles[btn.id]) btn.title=topbarTitles[btn.id];
    else if(!btn.title && textTitles[btn.textContent.trim()]) btn.title=textTitles[btn.textContent.trim()];
  });
  const connSel=document.getElementById('conn-style-sel');
  if(connSel) connSel.title='Connector style';
  const search=document.getElementById('unit-search-input');
  if(search) search.title='Search units (Enter to jump, / to focus)';
  const tagFilter=document.getElementById('tag-filter-input');
  if(tagFilter) tagFilter.title='Filter units by tag';
  const opName=document.getElementById('op-name-input');
  if(opName) opName.title='Operation name';

  if(typeof showToast==='function'){
    const wrap=(name,msgBuilder)=>{
      const prev=window[name];
      if(typeof prev!=='function' || prev.__toastWrapped) return;
      const fn=function(...args){ const res=prev.apply(this,args); try{ const msg=msgBuilder(...args); if(msg) showToast(msg);}catch(e){} return res; };
      fn.__toastWrapped=true; window[name]=fn;
    };
    wrap('undo',()=> 'Undo applied');
    wrap('redo',()=> 'Redo applied');
    wrap('copySelected',()=> 'Selection copied');
    wrap('toggleIconMode',()=> document.getElementById('btn-icon-mode')?.classList.contains('active') ? 'Image icons on' : 'Image icons off');
    wrap('toggleTagHighlight',()=> document.getElementById('btn-tag-highlight')?.classList.contains('soft-active') ? 'Tag highlight on' : 'Tag highlight off');
    wrap('toggleSidebar',()=> document.getElementById('sidebar')?.classList.contains('sb-collapsed') ? 'Palette hidden' : 'Palette shown');
  }

  if(typeof jumpToNode==='function'){
    const prevJump=jumpToNode;
    window.jumpToNode=function(id,...rest){ const r=prevJump.call(this,id,...rest); try{ if(id&&nodes[id]) showToast('Jumped to '+(nodes[id].name||id)); }catch(e){} return r; };
  }

  if(typeof updSB==='function'){
    const prevUpd=updSB;
    window.updSB=function(){
      prevUpd();
      const sel=document.getElementById('sb-sel');
      const cnt=document.getElementById('sb-selcount');
      if(sel && cnt && /^\d+ of \d+$/.test(cnt.textContent||'')) sel.textContent=cnt.textContent;
    };
    updSB();
  }
})();
