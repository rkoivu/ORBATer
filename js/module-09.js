(function(){
  const style=document.createElement('style');
  style.textContent=`
  body.theme-dark .node-card{background:var(--surface2)!important;border-color:var(--accent)!important}
  body.theme-light .node-card, body.theme-briefing .node-card{background:var(--surface)!important;border-color:var(--accent)!important}
  body.theme-light .node-custom-img, body.theme-briefing .node-custom-img{background:transparent}
  body.theme-light .node-designation, body.theme-briefing .node-designation{color:var(--accent2)!important}
  body.theme-light .node-name, body.theme-light .node-commander, body.theme-light .node-strength-lbl,
  body.theme-briefing .node-name, body.theme-briefing .node-commander, body.theme-briefing .node-strength-lbl{color:var(--text)!important}
  body.theme-light .node-commander, body.theme-light .node-strength-lbl,
  body.theme-briefing .node-commander, body.theme-briefing .node-strength-lbl{color:var(--text2)!important}
  #connector-svg path,#connector-svg line,#connector-svg polyline{mix-blend-mode:normal}
  `;
  document.head.appendChild(style);

  if(typeof undo==='function') window.undo=undo;
  if(typeof redo==='function') window.redo=redo;
  if(typeof copySelected==='function') window.copySelected=copySelected;
  if(typeof duplicateSelected==='function') window.duplicateSelected=duplicateSelected;
  if(typeof deleteSelected==='function') window.deleteSelected=deleteSelected;
  if(typeof deleteMultiSel==='function') window.deleteMultiSel=deleteMultiSel;

  window.getSelectionIds = function(){
    try{
      if(typeof multiSel!=='undefined' && multiSel && multiSel.size) return [...multiSel];
      if(typeof selectedId!=='undefined' && selectedId) return [selectedId];
    }catch(e){}
    return [];
  };

  if(typeof updSB==='function'){
    const prevUpdSB = updSB;
    updSB = window.updSB = function(){
      prevUpdSB();
      try{
        const total = Object.keys(nodes||{}).length;
        const ids = window.getSelectionIds();
        const sel = document.getElementById('sb-sel');
        if(sel) sel.textContent = ids.length ? `${ids.length} of ${total}` : '—';
        let ec = document.getElementById('sb-echelon-count');
        if(!ec){
          ec = document.createElement('span');
          ec.id = 'sb-echelon-count';
          const sb = document.getElementById('statusbar');
          sb && sb.insertBefore(ec, document.getElementById('sb-zoom')?.parentElement?.nextSibling || sb.lastChild);
        }
        const counts={};
        Object.values(nodes||{}).forEach(n=>{ const e=(n.echelon||'unknown'); counts[e]=(counts[e]||0)+1; });
        const labelMap={team:'Team',squad:'Squad',platoon:'Platoon',company:'Company',battalion:'Battalion',regiment:'Regiment',brigade:'Brigade',division:'Division',corps:'Corps',army:'Army',army_group:'Army Group',region:'Region'};
        const parts=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([k,v])=>`${v} × ${labelMap[k]||k}`);
        ec.innerHTML = `Mix: <b>${parts.join(', ') || '—'}</b>`;
        let bc = document.getElementById('sb-breadcrumb');
        if(!bc){
          bc = document.createElement('span'); bc.id='sb-breadcrumb';
          const sb=document.getElementById('statusbar'); sb && sb.insertBefore(bc, sb.querySelector('.hint'));
        }
        let cur = ids[0] && nodes[ids[0]];
        const crumbs=[];
        const seen=new Set();
        while(cur && !seen.has(cur.id)) { seen.add(cur.id); crumbs.unshift(cur.name||cur.designation||cur.id); cur = cur.parentId && nodes[cur.parentId] ? nodes[cur.parentId] : null; }
        bc.innerHTML = `Path: <b>${crumbs.join(' → ') || '—'}</b>`;
      }catch(e){}
    };
  }

  if(typeof scheduleAutosave==='function'){
    scheduleAutosave = function(){
      clearTimeout(asTimer);
      asTimer=setTimeout(()=>{
        try{
          localStorage.setItem('orbat_v3',JSON.stringify({...serializeDocument(),ts:Date.now()}));
          const el=document.getElementById('afsave');
          if(el){ el.textContent='✓ SAVED '+new Date().toLocaleTimeString(); el.classList.add('on'); setTimeout(()=>el.classList.remove('on'),1800); }
          if(typeof markSaved==='function') markSaved();
        }catch(e){}
      },2500);
    };
  }

  if(typeof applyTheme==='function'){
    const prevApplyTheme=applyTheme;
    applyTheme = window.applyTheme = function(...args){
      const r=prevApplyTheme.apply(this,args);
      if(!document.body.classList.contains('theme-'+(window.currentTheme||'dark'))){
        document.body.classList.remove('theme-dark','theme-light','theme-briefing');
        document.body.classList.add('theme-'+(window.currentTheme||'dark'));
      }
      return r;
    };
    applyTheme();
  }

  if(typeof startLink==='function'){
    startLink = window.startLink = function(e,id){
      e.stopPropagation();
      linkSrc=id;
      const svg=document.getElementById('link-svg');svg.innerHTML='';svg.style.width='100%';svg.style.height='100%';
      const wrap=document.getElementById('canvas-wrap').getBoundingClientRect();
      const srcEl=document.getElementById('el-'+id)?.getBoundingClientRect();
      if(!srcEl){ linkSrc=null; return; }
      const sx=(srcEl.left+srcEl.width/2-wrap.left-panX)/zoom;
      const sy=(srcEl.top+srcEl.height/2-wrap.top-panY)/zoom;
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('stroke','#22c55e');line.setAttribute('stroke-width','2');line.setAttribute('stroke-dasharray','6,3');
      svg.appendChild(line);
      const cleanup=()=>{
        svg.innerHTML='';svg.style.width='1px';svg.style.height='1px';
        document.querySelectorAll('.link-tgt').forEach(el=>el.classList.remove('link-tgt'));
        document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);
        linkSrc=null;
      };
      function mv(ev){
        const mx=(ev.clientX-wrap.left-panX)/zoom,my=(ev.clientY-wrap.top-panY)/zoom;
        line.setAttribute('x1',sx);line.setAttribute('y1',sy);line.setAttribute('x2',mx);line.setAttribute('y2',my);
        document.querySelectorAll('.orbat-node').forEach(el=>{
          const r=el.getBoundingClientRect();
          el.classList.toggle('link-tgt',ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom&&el.id!=='el-'+linkSrc);
        });
      }
      function up(ev){
        try{
          const hit=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('.orbat-node');
          if(hit){
            const tid=hit.id.replace('el-','');
            if(tid!==linkSrc&&nodes[tid]){
              if(!canSetParent(linkSrc,tid)){ showToast('Invalid link: would create a cycle'); }
              else { nodes[linkSrc].parentId=tid; drawConnectors(); saveState(); showToast('Parent set → '+(nodes[tid].name||tid)); }
            }
          }
        } finally { cleanup(); }
      }
      document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);
    };
  }

  if(typeof onNMM==='function' && typeof onNMU==='function'){
    onNMM = function(e){
      if(!dragId)return;
      const dx=(e.clientX-dragMS.x)/zoom,dy=(e.clientY-dragMS.y)/zoom;
      if(multiSel.has(dragId)&&multiSel.size>1){
        multiSel.forEach(id=>{
          const s=mDragStarts[id]||{x:nodes[id].x,y:nodes[id].y};
          nodes[id].x=snapV(s.x+dx);nodes[id].y=snapV(s.y+dy);
          const el=document.getElementById('el-'+id);if(el){el.style.left=nodes[id].x+'px';el.style.top=nodes[id].y+'px';}
        });
      }else if(nodes[dragId]){
        nodes[dragId].x=snapV(dragNS.x+dx);nodes[dragId].y=snapV(dragNS.y+dy);
        const el=document.getElementById('el-'+dragId);if(el){el.style.left=nodes[dragId].x+'px';el.style.top=nodes[dragId].y+'px';}
      }
      if(e.shiftKey){
        const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest('.orbat-node');
        document.querySelectorAll('.orbat-node').forEach(el=>el.classList.toggle('rp-target', !!hit && el===hit && el.id!=='el-'+dragId));
      } else {
        document.querySelectorAll('.rp-target').forEach(el=>el.classList.remove('rp-target'));
      }
      drawConnectors();
    };
    onNMU = function(e){
      try{
        if(dragId && e.shiftKey){
          const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest('.orbat-node');
          if(hit){
            const tid=hit.id.replace('el-','');
            if(tid!==dragId&&nodes[tid]){
              if(!canSetParent(dragId,tid)) showToast('Invalid parent: cycle prevented');
              else { nodes[dragId].parentId=tid; drawConnectors(); showToast('Reparented → '+nodes[tid].name); }
            }
          }
        }
      } finally {
        document.querySelectorAll('.rp-target').forEach(el=>el.classList.remove('rp-target'));
        dragId=null;document.removeEventListener('mousemove',onNMM);document.removeEventListener('mouseup',onNMU);saveState();
      }
    };
  }

  // direct enhanced wrappers so lexical/global calls both work
  function wrapDirect(name, builder){
    try{
      let prev = (typeof globalThis[name]==='function') ? globalThis[name] : null;
      if(typeof prev!=='function' || prev.__toastWrapped) return;
      const fn = function(...args){ const res=prev.apply(this,args); try{ const msg=builder(...args); if(msg) showToast(msg); }catch(e){} return res; };
      fn.__toastWrapped=true;
      globalThis[name]=window[name]=fn;
    }catch(e){}
  }
  if(typeof showToast==='function'){
    wrapDirect('undo',()=> 'Undo applied');
    wrapDirect('redo',()=> 'Redo applied');
    wrapDirect('copySelected',()=> 'Selection copied');
    wrapDirect('duplicateSelected',()=> 'Selection duplicated');
    wrapDirect('deleteSelected',()=> 'Unit deleted');
  }

  window.addEventListener('load',()=>{ try{ applyTheme && applyTheme(); updSB && updSB(); }catch(e){} });
})();
