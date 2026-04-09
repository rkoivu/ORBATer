(function(){
  const topbar=document.getElementById('topbar');
  const statusbar=document.getElementById('statusbar');
  const dangerBtn=topbar.querySelector('.tb-btn.danger');
  function showToastSafe(msg){ (window.showToast||window.toast||function(){})(msg); }
  function setMenuOpen(menu, open){
    if(!menu) return;
    const panel=document.getElementById(menu.dataset.panelId);
    menu.classList.toggle('open', open);
    if(panel){
      panel.style.display=open?'flex':'none';
      panel.style.flexDirection='column';
      panel.style.gap='8px';
    }
  }

  // Auto organise button
  if(!document.getElementById('btn-auto-organise')){
    const b=document.createElement('button');
    b.className='tb-btn'; b.id='btn-auto-organise'; b.textContent='Organise';
    b.title='Auto organise current ORBAT';
    b.onclick=()=>{
      try{
        if(window.stackSameTypeUnits) window.stackSameTypeUnits();
        if(window.autoLayout) window.autoLayout();
        if(window.drawConnectors) window.drawConnectors();
        if(window.saveState) window.saveState();
        showToastSafe('Auto organised ORBAT');
      }catch(err){ console.error(err); showToastSafe('Auto organise failed'); }
    };
    topbar.insertBefore(b, dangerBtn || topbar.lastElementChild);
  }

  // Bottom bar toggle
  if(!document.getElementById('btn-toggle-statusbar')){
    const b=document.createElement('button');
    b.className='tb-btn'; b.id='btn-toggle-statusbar'; b.textContent='Bar';
    b.title='Toggle bottom status bar';
    b.onclick=()=>{
      statusbar.classList.toggle('hidden-bar');
      try{ localStorage.setItem('orbat_statusbar_hidden', statusbar.classList.contains('hidden-bar') ? '1':'0'); }catch(e){}
      showToastSafe(statusbar.classList.contains('hidden-bar')?'Bottom bar hidden':'Bottom bar shown');
    };
    topbar.insertBefore(b, dangerBtn || topbar.lastElementChild);
    try{ if(localStorage.getItem('orbat_statusbar_hidden')==='1') statusbar.classList.add('hidden-bar'); }catch(e){}
  }

  // Stable chrome minimap toggle in addition to the floating canvas button.
  if(!document.getElementById('btn-toggle-minimap')){
    const b=document.createElement('button');
    b.className='tb-btn'; b.id='btn-toggle-minimap'; b.textContent='Map';
    b.title='Toggle minimap';
    b.onclick=()=>{ if(window.toggleMinimap) window.toggleMinimap(); };
    topbar.insertBefore(b, dangerBtn || topbar.lastElementChild);
  }

  // Group buttons into menus for easier navigation
  function makeMenu(id,label){
    let menu=document.getElementById(id); if(menu) return menu;
    menu=document.createElement('div'); menu.className='tb-menu'; menu.id=id;
    const panelId=id+'-panel';
    menu.dataset.panelId=panelId;
    menu.innerHTML='<button class="tb-btn tb-menu-btn" type="button">'+label+'</button>';
    const panel=document.createElement('div');
    panel.className='tb-menu-panel';
    panel.id=panelId;
    panel.dataset.ownerMenu=id;
    panel.style.display='none';
    panel.addEventListener('click',e=>e.stopPropagation());
    document.body.appendChild(panel);
    const btn=menu.querySelector('.tb-menu-btn');
    btn.onclick=(e)=>{
      e.stopPropagation();
      document.querySelectorAll('.tb-menu.open').forEach(m=>{ if(m!==menu) setMenuOpen(m,false); });
      const willOpen=!menu.classList.contains('open');
      setMenuOpen(menu, willOpen);
      if(willOpen){
        const panel=document.getElementById(menu.dataset.panelId);
        const r=btn.getBoundingClientRect();
        panel.style.left=Math.max(8, Math.min(r.left, window.innerWidth - Math.max(panel.offsetWidth||180,180) - 8))+'px';
        panel.style.top=(r.bottom + 6)+'px';
      }
    };
    return menu;
  }
  function moveToMenu(menu, selectors){
    const panel=document.getElementById(menu.dataset.panelId);
    selectors.forEach(sel=>{
      const el=typeof sel==='string' ? topbar.querySelector(sel) : sel;
      if(el && el!==menu && el.parentElement===topbar) panel.appendChild(el);
    });
  }
  if(!document.getElementById('menu-file')){
    const insertMenu=makeMenu('menu-insert','Insert');
    const viewMenu=makeMenu('menu-view','View');
    const toolsMenu=makeMenu('menu-tools','Tools');
    const fileMenu=makeMenu('menu-file','File');
    const searchMenu=makeMenu('menu-search','Search');
    const spacer=topbar.querySelector('.tb-spacer');
    [insertMenu,viewMenu,toolsMenu,searchMenu,fileMenu].forEach(m=> topbar.insertBefore(m, spacer || dangerBtn || topbar.lastElementChild));
    moveToMenu(insertMenu,['#btn-random-orbat','button[onclick="openTplModal()"]','#btn-outline-import','#btn-auto-organise']);
    moveToMenu(viewMenu,['#btn-zoom-out-2','#btn-zoom-in-2','#btn-fit-plus','#btn-focus','#btn-hostile-root','#btn-neutral-root','#btn-toggle-statusbar','#btn-toggle-minimap','#btn-tag-highlight','#btn-rel-labels']);
    moveToMenu(toolsMenu,['#btn-stack-same','#btn-conflicts','#btn-tour','button[onclick="openScModal()"]']);
    moveToMenu(searchMenu,['#unit-search-input','#tag-filter-input']);
    moveToMenu(fileMenu,['button[onclick="exportJSON()"]','button[onclick="importJSON()"]','button[onclick="exportSVG()"]','button[onclick="exportPNG()"]','button[onclick="window.print()"]']);
    document.addEventListener('click',()=>document.querySelectorAll('.tb-menu.open').forEach(m=>setMenuOpen(m,false)));
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.querySelectorAll('.tb-menu.open').forEach(m=>setMenuOpen(m,false)); });
    const repositionOpenMenus=()=>{
      document.querySelectorAll('.tb-menu.open').forEach(menu=>{
        const btn=menu.querySelector('.tb-menu-btn'); const panel=document.getElementById(menu.dataset.panelId);
        if(!btn||!panel) return; const r=btn.getBoundingClientRect();
        panel.style.left=Math.max(8, Math.min(r.left, window.innerWidth - Math.max(panel.offsetWidth||180,180) - 8))+'px';
        panel.style.top=(r.bottom + 6)+'px';
      });
    };
    window.addEventListener('resize', repositionOpenMenus);
    window.addEventListener('scroll', repositionOpenMenus, true);
  }

  // Improve outline import modal: tab insertion + clear-all option + prompt handling
  function patchOutlineModal(){
    const fn=window.openOutlineModal;
    if(!fn || fn._v11Patched) return;
    window.openOutlineModal=function(){
      fn.apply(this, arguments);
      const ov=document.getElementById('outline-modal');
      if(!ov) return;
      const box=ov.querySelector('.modal-box');
      const ta=ov.querySelector('#outline-text');
      if(box && !ov.querySelector('#outline-clear-existing')){
        const opts=document.createElement('div');
        opts.className='opt-row';
        opts.innerHTML='\
          <label><input type="checkbox" id="outline-clear-existing"> Clear existing ORBAT before import</label>\
          <label><input type="checkbox" id="outline-prompt-mode"> Input is prompt-style text</label>\
        ';
        const acts=ov.querySelector('.modal-acts');
        acts.parentNode.insertBefore(opts, acts);
        const note=document.createElement('div');
        note.className='subtle';
        note.textContent='Tip: press Tab inside the textbox to indent lines.';
        acts.parentNode.insertBefore(note, acts);
      }
      if(ta && !ta.dataset.v11TabBound){
        ta.dataset.v11TabBound='1';
        ta.addEventListener('keydown', function(e){
          if(e.key==='Tab'){
            e.preventDefault();
            const start=this.selectionStart, end=this.selectionEnd, val=this.value;
            if(start!==end && val.slice(start,end).includes('\n')){
              const selected=val.slice(start,end);
              const indented=selected.split('\n').map(line=>'  '+line).join('\n');
              this.value=val.slice(0,start)+indented+val.slice(end);
              this.selectionStart=start; this.selectionEnd=start+indented.length;
            } else {
              this.value=val.slice(0,start)+'  '+val.slice(end);
              this.selectionStart=this.selectionEnd=start+2;
            }
          }
        });
      }
      const importBtn=ov.querySelector('#outline-import-btn');
      if(importBtn && !importBtn.dataset.v11Bound){
        importBtn.dataset.v11Bound='1';
        importBtn.addEventListener('click', function(e){
          e.stopImmediatePropagation();
          e.preventDefault();
          const txt=(ta?.value||'').replace(/\r/g,'');
          if(!txt.trim()) return;
          const clearExisting=ov.querySelector('#outline-clear-existing')?.checked;
          const promptMode=ov.querySelector('#outline-prompt-mode')?.checked;
          try{
            if(clearExisting && Object.keys(window.nodes||{}).length){
              if(window.clearAll) window.clearAll(true);
              if(window.nodes && Object.keys(window.nodes).length){
                Object.keys(window.nodes).forEach(k=>delete window.nodes[k]);
                if(window.canvas) window.canvas.querySelectorAll('.orbat-node').forEach(n=>n.remove());
                if(window.drawConnectors) window.drawConnectors();
              }
            }
            let ids=[];
            if(promptMode && window.parseOutlineFromPrompt) ids=window.parseOutlineFromPrompt(txt);
            else if(window.parseOutline) ids=window.parseOutline(txt);
            else ids=[];
            if(window.autoLayout) window.autoLayout(ids);
            if(window.saveState) window.saveState();
            ov.classList.remove('open');
            showToastSafe(`Imported ${ids.length||0} units from text` + (clearExisting ? ' (cleared existing)' : ''));
          }catch(err){ console.error(err); showToastSafe('Text import failed'); }
        }, true);
      }
    };
    window.openOutlineModal._v11Patched=true;
  }
  patchOutlineModal();

  // Prompt-style parser wrapper
  if(!window.parseOutlineFromPrompt){
    window.parseOutlineFromPrompt=function(text){
      const lines=String(text).split(/\n/).map(l=>l.trim()).filter(Boolean);
      const cleaned=[];
      for(const line of lines){
        if(/^(create|build|generate|make)\b/i.test(line)) continue;
        const m=line.match(/^[-*\u2022]\s*(.+)$/); cleaned.push(m?m[1]:line);
      }
      return window.parseOutline ? window.parseOutline(cleaned.join('\n')) : [];
    };
  }

  // Diagonally stagger stacked units more clearly
  if(window.stackSameTypeUnits && !window.stackSameTypeUnits._v11Diag){
    const prev=window.stackSameTypeUnits;
    window.stackSameTypeUnits=function(){
      const r=prev.apply(this, arguments);
      try{
        const groups={};
        Object.values(window.nodes||{}).forEach(n=>{
          const key=`${n.parentId||'root'}|${n.typeId||''}|${n.echelon||''}`;
          (groups[key]||(groups[key]=[])).push(n);
        });
        Object.values(groups).forEach(arr=>{
          if(arr.length<2) return;
          arr.sort((a,b)=>(a.y-b.y)||(a.x-b.x));
          const lead=arr[0];
          arr.forEach((n,i)=>{ n.x=Math.round((lead.x||0)+(i*18)); n.y=Math.round((lead.y||0)+(i*12)); if(window.renderNode) window.renderNode(n.id); });
        });
        if(window.drawConnectors) window.drawConnectors();
      }catch(e){ console.error(e); }
      return r;
    };
    window.stackSameTypeUnits._v11Diag=true;
  }
})();
