(function(){
  const topbar=document.getElementById('topbar');
  const epInner=document.getElementById('ep-inner');
  const searchInput=document.getElementById('unit-search-input');
  const tagFilterInput=document.getElementById('tag-filter-input');
  const smartBtn=document.getElementById('btn-smart-labels');
  const insigniaInput=document.getElementById('node-insignia-input');
  let smartLabelsEnabled=false;
  let searchQuery='';
  let tagFilter='';
  let epTags, epInsigniaPrev;
  let patchSaveTimer=null;

  function injectPanelFields(){
    if(document.getElementById('ep-tags')) return;
    const showFields=document.querySelector('#ep-inner .fg label[for="show-desig"]')?.closest('.fg') || document.querySelector('#ep-inner .chk-row')?.closest('.fg');
    const target = showFields || epInner.querySelector('.psec:last-of-type');
    const wrap=document.createElement('div');
    wrap.innerHTML=`
      <div class="psec">Identity Aids</div>
      <div class="fg"><label>Tags</label><input id="ep-tags" type="text" placeholder="airborne, reserve, lead"></div>
      <div class="fg"><label>Unit Insignia</label>
        <div class="icon-row" style="margin-bottom:6px">
          <button class="pb" id="btn-insignia-upload" style="margin:0;flex:1">⤒ Upload Insignia</button>
          <button class="pb" id="btn-insignia-clear" style="margin:0;width:32px;padding:6px 4px" title="Remove">✕</button>
        </div>
        <img id="ep-insignia-prev" alt="Insignia preview">
      </div>
      <div class="fg"><label>Condition Display</label><div class="panel-help">Readiness now shows as a percent badge and border tint on the unit card.</div></div>
    `;
    const actionsPsec=[...epInner.querySelectorAll('.psec')].find(el=>el.textContent.trim()==='Actions');
    epInner.insertBefore(wrap, actionsPsec || epInner.lastElementChild);
    epTags=document.getElementById('ep-tags');
    epInsigniaPrev=document.getElementById('ep-insignia-prev');
    epTags.addEventListener('input', applyEP);
    document.getElementById('btn-insignia-upload').addEventListener('click', ()=>insigniaInput.click());
    document.getElementById('btn-insignia-clear').addEventListener('click', ()=>{ if(!selectedId||!nodes[selectedId]) return; nodes[selectedId].insignia=null; renderNode(selectedId); populateEditPanel(selectedId); drawConnectors(); saveState(); });
  }
  injectPanelFields();

  function parseTags(v){ return String(v||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,12); }
  function tagColor(tag){
    const colors=['#3b82f6','#22c55e','#f59e0b','#ef4444','#a855f7','#06b6d4','#e11d48','#84cc16'];
    let h=0; for(const ch of String(tag)) h=(h*31+ch.charCodeAt(0))>>>0;
    return colors[h % colors.length];
  }
  function ordinal(n){ n=+n; const s=['th','st','nd','rd']; const v=n%100; return `${n}${s[(v-20)%10]||s[v]||s[0]}`; }
  function expandType(t){
    const m={IN:'Infantry',INF:'Infantry',ARM:'Armour',AR:'Armour',CAV:'Cavalry',ART:'Artillery',ENG:'Engineer',ADA:'Air Defence Artillery',AV:'Aviation',SIG:'Signals',LOG:'Logistics',MED:'Medical',MP:'Military Police'};
    return m[String(t||'').toUpperCase()] || t;
  }
  function formatSmartLabel(raw){
    raw=String(raw||'').trim();
    const m=raw.match(/^(\d+)[-\/](\d+)\s+([A-Za-z][A-Za-z0-9-]*)$/);
    if(!m) return raw;
    return `${ordinal(m[1])} Battalion, ${ordinal(m[2])} ${expandType(m[3])}`;
  }
  function schedulePatchSave(){ clearTimeout(patchSaveTimer); patchSaveTimer=setTimeout(()=>{ try{ saveState(); }catch(e){} }, 350); }

  const oldNormalizeNode=normalizeNode;
  normalizeNode=function(id,raw={}){
    const n=oldNormalizeNode(id,raw);
    n.tags=Array.isArray(raw.tags)?raw.tags.map(v=>String(v).trim()).filter(Boolean).slice(0,12):parseTags(raw.tags);
    n.insignia=raw.insignia||null;
    return n;
  };

  const oldSerializeDocument=serializeDocument;
  serializeDocument=function(){
    const d=oldSerializeDocument();
    d.smartLabelsEnabled=smartLabelsEnabled;
    return d;
  };

  const oldApplyDocumentState=applyDocumentState;
  applyDocumentState=function(doc,opts){
    oldApplyDocumentState(doc,opts);
    smartLabelsEnabled=doc.smartLabelsEnabled===true;
    syncSmartLabelBtn();
    refreshSearchAndFilter();
  };

  const oldCreateNode=createNode;
  createNode=function(d={}){ return oldCreateNode({...d,tags:d.tags||[],insignia:d.insignia||null}); };

  const oldPopulateEditPanel=populateEditPanel;
  populateEditPanel=function(id){
    oldPopulateEditPanel(id);
    injectPanelFields();
    const n=nodes[id];
    if(epTags) epTags.value=(n.tags||[]).join(', ');
    if(epInsigniaPrev){
      if(n.insignia){ epInsigniaPrev.src=n.insignia; epInsigniaPrev.style.display='block'; }
      else { epInsigniaPrev.src=''; epInsigniaPrev.style.display='none'; }
    }
  };

  const oldApplyEP=applyEP;
  applyEP=function(){
    oldApplyEP();
    if(!selectedId||!nodes[selectedId]) return;
    const n=nodes[selectedId];
    if(epTags) n.tags=parseTags(epTags.value);
    renderNode(selectedId);
    drawConnectors();
    schedulePatchSave();
  };

  const oldRenderNode=renderNode;
  renderNode=function(id){
    oldRenderNode(id);
    const n=nodes[id];
    const el=document.getElementById('el-'+id); if(!el) return;
    const card=el.querySelector('.node-card'); if(!card) return;
    const nameEl=el.querySelector('.node-name');
    if(nameEl){ nameEl.textContent=smartLabelsEnabled ? formatSmartLabel(n.name) : n.name; nameEl.title=n.name; }
    const existingPill=el.querySelector('.node-readiness-pill'); if(existingPill) existingPill.remove();
    const r=parseFloat(n.readiness);
    if(Number.isFinite(r)){
      const clamped=Math.max(0,Math.min(100,r));
      const pill=document.createElement('div'); pill.className='node-readiness-pill'; pill.textContent=`${Math.round(clamped)}%`;
      pill.style.background=clamped>=75?'#166534':clamped>=50?'#92400e':'#991b1b';
      pill.title=`Readiness ${Math.round(clamped)}%`;
      card.appendChild(pill);
      card.style.boxShadow=`0 0 0 2px rgba(${clamped>=75?'34,197,94':clamped>=50?'245,158,11':'239,68,68'},0.24)`;
    }
    const existingTags=el.querySelector('.node-tags'); if(existingTags) existingTags.remove();
    if(n.tags && n.tags.length){
      const tagsWrap=document.createElement('div'); tagsWrap.className='node-tags';
      n.tags.slice(0,3).forEach(tag=>{ const chip=document.createElement('span'); chip.className='node-tag-chip'; chip.textContent=tag; chip.style.background=tagColor(tag); tagsWrap.appendChild(chip); });
      card.appendChild(tagsWrap);
      card.style.borderColor=tagColor(n.tags[0]);
    }
    if(n.insignia){
      let ins=el.querySelector('.node-insignia-mini');
      if(!ins){ ins=document.createElement('img'); ins.className='node-insignia-mini'; ins.style.width='22px'; ins.style.height='22px'; ins.style.objectFit='contain'; ins.style.position='absolute'; ins.style.bottom='-10px'; ins.style.right='-10px'; ins.style.border='2px solid var(--bg)'; ins.style.borderRadius='50%'; ins.style.background='var(--surface2)'; card.appendChild(ins); }
      ins.src=n.insignia;
      ins.title='Unit insignia';
    } else { el.querySelector('.node-insignia-mini')?.remove(); }
    refreshSearchAndFilter();
  };

  // bugfix: subtree copy should not auto-paste
  copySubtree=function(){
    const id=selectedId||ctxTarget; if(!id) return;
    const ids=[]; (function collect(srcId){ ids.push(srcId); getChildren(srcId).forEach(ch=>collect(ch.id)); })(id);
    clipboard=buildClipboardFromIds(ids);
    showToast(`Subtree copied (${ids.length} units)`);
  };

  function nodeSearchText(n){
    const type=(UT.find(t=>t.id===n.typeId)||customTypes.find(t=>t.id===n.typeId)||{}).label||n.typeId||'';
    return [n.name, formatSmartLabel(n.name), n.designation, n.commander, n.equipment, n.task, n.higherHQ, n.location, type, ...(n.tags||[])].join(' ').toLowerCase();
  }
  function nodeParentSearchText(n){
    if(!n?.parentId || !nodes[n.parentId]) return 'root';
    const parent=nodes[n.parentId];
    return [parent.name, formatSmartLabel(parent.name), parent.designation, parent.commander].join(' ').toLowerCase();
  }
  function nodePathSearchText(n){
    const seen=new Set();
    const parts=[];
    let cur=n;
    while(cur && !seen.has(cur.id)){
      seen.add(cur.id);
      parts.unshift([cur.name, formatSmartLabel(cur.name), cur.designation].filter(Boolean).join(' '));
      cur=cur.parentId && nodes[cur.parentId] ? nodes[cur.parentId] : null;
    }
    return parts.join(' / ').toLowerCase();
  }
  function tokenizeSearchQuery(raw){
    return String(raw||'').match(/(?:[^\s"]+:"[^"]*"|[^\s"]+|'[^']*'|"[^"]*")+/g) || [];
  }
  function stripSearchQuotes(v){
    const text=String(v||'').trim();
    if((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))){
      return text.slice(1,-1);
    }
    return text;
  }
  function parseSearchQuery(raw){
    const terms={text:[],parent:[],path:[]};
    tokenizeSearchQuery(raw).forEach(token=>{
      const match=token.match(/^(parent|path):(.*)$/i);
      if(!match){
        const value=stripSearchQuotes(token).toLowerCase();
        if(value) terms.text.push(value);
        return;
      }
      const bucket=match[1].toLowerCase();
      const value=stripSearchQuotes(match[2]).toLowerCase();
      if(value) terms[bucket].push(value);
    });
    return terms;
  }
  function refreshSearchAndFilter(){
    const parsed=parseSearchQuery(searchQuery);
    const q=parsed.text.join(' ').trim();
    const tag=tagFilter.trim().toLowerCase();
    let firstHit=null;
    Object.keys(nodes).forEach(id=>{
      const el=document.getElementById('el-'+id); if(!el) return;
      const n=nodes[id];
      const text=nodeSearchText(n);
      const parentText=nodeParentSearchText(n);
      const pathText=nodePathSearchText(n);
      const qMatch=!q || text.includes(q);
      const parentMatch=!parsed.parent.length || parsed.parent.every(term=>parentText.includes(term));
      const pathMatch=!parsed.path.length || parsed.path.every(term=>pathText.includes(term));
      const tMatch=!tag || (n.tags||[]).some(t=>String(t).toLowerCase().includes(tag));
      const match=qMatch && parentMatch && pathMatch && tMatch;
      el.classList.toggle('filtered-out', !match);
      el.classList.toggle('search-hit', !!(q || parsed.parent.length || parsed.path.length) && match);
      if(!firstHit && match) firstHit=id;
    });
    drawConnectors();
    return firstHit;
  }
  function jumpToNode(id){
    const n=nodes[id]; if(!n) return;
    const rect=canvasWrap.getBoundingClientRect();
    panX = rect.width/2 - (n.x+70)*zoom;
    panY = rect.height/2 - (n.y+30)*zoom;
    applyTransform();
    selectNode(id);
  }
  searchInput?.addEventListener('input', ()=>{ searchQuery=searchInput.value; const first=refreshSearchAndFilter(); if(first && searchQuery.trim()) jumpToNode(first); });
  searchInput?.addEventListener('keydown', e=>{ if(e.key==='Enter'){ const first=refreshSearchAndFilter(); if(first) jumpToNode(first); } });
  tagFilterInput?.addEventListener('input', ()=>{ tagFilter=tagFilterInput.value; refreshSearchAndFilter(); });
  function syncSmartLabelBtn(){ smartBtn?.classList.toggle('soft-active', smartLabelsEnabled); }
  smartBtn?.addEventListener('click', ()=>{ smartLabelsEnabled=!smartLabelsEnabled; syncSmartLabelBtn(); Object.keys(nodes).forEach(renderNode); schedulePatchSave(); });
  syncSmartLabelBtn();

  // upload insignia
  insigniaInput?.addEventListener('change', e=>{
    const file=e.target.files && e.target.files[0]; if(!file || !selectedId || !nodes[selectedId]) return;
    const reader=new FileReader();
    reader.onload=ev=>{ nodes[selectedId].insignia=ev.target.result; renderNode(selectedId); populateEditPanel(selectedId); drawConnectors(); saveState(); };
    reader.readAsDataURL(file); e.target.value='';
  });

  // patch keyboard search focus if slash pressed outside inputs
  document.addEventListener('keydown', e=>{
    if(e.key==='/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName||'')){
      e.preventDefault(); searchInput?.focus(); searchInput?.select();
    }
  }, true);

  // rerender after actions/imports
  const oldRestoreState=restoreState;
  restoreState=function(i){ oldRestoreState(i); syncSmartLabelBtn(); refreshSearchAndFilter(); };
  const oldClearAll=clearAll;
  clearAll=function(){ oldClearAll(); searchQuery=''; tagFilter=''; if(searchInput) searchInput.value=''; if(tagFilterInput) tagFilterInput.value=''; refreshSearchAndFilter(); };

  // ensure initial state
  refreshSearchAndFilter();
})();
