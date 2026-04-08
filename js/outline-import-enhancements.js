(function(){
  function showToastSafe(msg){ try{ (window.showToast||window.showToastSafe||function(){})(msg); }catch(e){} }

  function enhanceOutlineModal(){
    const orig=window.openOutlineModal;
    if(!orig || orig._v12Enhanced) return;
    function analyseOutlineText(text, promptMode){
      if(promptMode) return {errors:[], warnings:[]};
      const raw=String(text||'').replace(/\r/g,'');
      const lines=raw.split('\n').filter(line=>line.trim());
      const errors=[];
      const warnings=[];
      if(!lines.length) return {errors:['Paste an indented outline first.'], warnings};
      if(lines[0].match(/^\s+/)) errors.push('The first non-empty line cannot be indented.');
      let prevDepth=0;
      let sawTabs=false;
      let sawSpaces=false;
      lines.forEach((line, idx)=>{
        const indent=(line.match(/^\s*/) || [''])[0];
        if(indent.includes('\t')) sawTabs=true;
        if(indent.includes(' ')) sawSpaces=true;
        if(/ \t|\t /.test(indent)) warnings.push(`Line ${idx+1} mixes tabs and spaces in the same indent.`);
        if(indent.length % 2 !== 0 && !indent.includes('\t')) warnings.push(`Line ${idx+1} uses an odd number of spaces; two spaces per level reads best.`);
        const depth=indent.includes('\t') ? indent.length : Math.floor(indent.length/2);
        if(depth > prevDepth + 1) errors.push(`Line ${idx+1} jumps from depth ${prevDepth} to ${depth}. Add the missing parent level.`);
        prevDepth=depth;
      });
      if(sawTabs && sawSpaces) warnings.push('Both tabs and spaces are present. Pick one indentation style to avoid surprises.');
      return {errors:[...new Set(errors)], warnings:[...new Set(warnings)]};
    }
    function bindModal(ov){
      if(!ov) return;
      const ta=ov.querySelector('#outline-text');
      const acts=ov.querySelector('.modal-acts');
      const importBtn=ov.querySelector('#outline-import-btn');
      if(acts && !ov.querySelector('#outline-clear-existing')){
        const opts=document.createElement('div');
        opts.className='opt-row';
        opts.innerHTML='          <label><input type="checkbox" id="outline-clear-existing"> Clear existing ORBAT before import</label>          <label><input type="checkbox" id="outline-prompt-mode"> Input is prompt-style text</label>        ';
        acts.parentNode.insertBefore(opts, acts);
        const note=document.createElement('div');
        note.className='subtle';
        note.textContent='Tip: Tab indents, Shift+Tab outdents selected lines.';
        acts.parentNode.insertBefore(note, acts);
        const validation=document.createElement('div');
        validation.id='outline-validation';
        validation.className='panel-help';
        validation.style.margin='8px 0 10px';
        validation.textContent='Paste an indented outline. Validation notes will appear here before import.';
        acts.parentNode.insertBefore(validation, acts);
      }
      const validationBox=ov.querySelector('#outline-validation');
      const syncValidation=()=>{
        if(!validationBox) return;
        const promptMode=ov.querySelector('#outline-prompt-mode')?.checked;
        const result=analyseOutlineText(ta?.value||'', promptMode);
        if(!String(ta?.value||'').trim()){
          validationBox.textContent='Paste an indented outline. Validation notes will appear here before import.';
        } else if(result.errors.length){
          validationBox.innerHTML=result.errors.map(msg=>`<div>Error: ${msg}</div>`).join('') + result.warnings.map(msg=>`<div>Note: ${msg}</div>`).join('');
        } else if(result.warnings.length){
          validationBox.innerHTML=result.warnings.map(msg=>`<div>Note: ${msg}</div>`).join('');
        } else {
          validationBox.textContent='Outline looks valid. Import will create units from the current indentation levels.';
        }
        if(importBtn) importBtn.disabled=result.errors.length>0;
      };
      if(ta && !ta.dataset.v12TabBound){
        ta.dataset.v12TabBound='1';
        ta.addEventListener('keydown', function(e){
          if(e.key!=='Tab') return;
          e.preventDefault();
          const start=this.selectionStart||0, end=this.selectionEnd||0, val=this.value||'';
          const selected=val.slice(start,end);
          const hasMulti=start!==end && selected.includes('\n');
          const lineStart=val.lastIndexOf('\n', start-1)+1;
          if(e.shiftKey){
            if(hasMulti){
              const block=val.slice(lineStart,end);
              const outdented=block.split('\n').map(line=>line.startsWith('  ')?line.slice(2):line.startsWith('\t')?line.slice(1):line).join('\n');
              this.value=val.slice(0,lineStart)+outdented+val.slice(end);
              this.selectionStart=lineStart;
              this.selectionEnd=lineStart+outdented.length;
            } else {
              const before=val.slice(0,start);
              if(before.endsWith('  ')){
                this.value=val.slice(0,start-2)+val.slice(end);
                this.selectionStart=this.selectionEnd=Math.max(lineStart,start-2);
              } else if(before.endsWith('	')) {
                this.value=val.slice(0,start-1)+val.slice(end);
                this.selectionStart=this.selectionEnd=Math.max(lineStart,start-1);
              }
            }
            return;
          }
          if(hasMulti){
            const block=val.slice(lineStart,end);
            const indented=block.split('\n').map(line=>'  '+line).join('\n');
            this.value=val.slice(0,lineStart)+indented+val.slice(end);
            this.selectionStart=lineStart;
            this.selectionEnd=lineStart+indented.length;
          } else {
            this.value=val.slice(0,start)+'  '+val.slice(end);
            this.selectionStart=this.selectionEnd=start+2;
          }
        });
        ta.addEventListener('input', syncValidation);
      }
      ov.querySelector('#outline-prompt-mode')?.addEventListener('change', syncValidation);
      if(importBtn && !importBtn.dataset.v12Bound){
        importBtn.dataset.v12Bound='1';
        importBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopImmediatePropagation();
          const txt=(ta?.value||'').replace(/\r/g,'');
          if(!txt.trim()){ showToastSafe('Paste an indented outline first'); return; }
          const clearExisting=ov.querySelector('#outline-clear-existing')?.checked;
          const promptMode=ov.querySelector('#outline-prompt-mode')?.checked;
          const validation=analyseOutlineText(txt, promptMode);
          if(validation.errors.length){
            syncValidation();
            showToastSafe('Outline import blocked until the validation errors are fixed');
            return;
          }
          try{
            if(clearExisting && window.nodes){
              Object.keys(window.nodes).forEach(id=>{
                const el=document.getElementById('el-'+id); if(el) el.remove();
                delete window.nodes[id];
              });
              if(Array.isArray(window.selectedIds)) window.selectedIds.length=0;
              if(window.drawConnectors) window.drawConnectors();
              if(window.updSB) window.updSB();
            }
            let ids=[];
            if(promptMode && window.parseOutlineFromPrompt) ids=window.parseOutlineFromPrompt(txt) || [];
            else if(window.parseOutline) ids=window.parseOutline(txt) || [];
            if(window.autoLayout) window.autoLayout(ids);
            if(window.saveState) window.saveState();
            ov.classList.remove('open');
            showToastSafe(`Imported ${ids.length} units${clearExisting ? ' after clearing existing ORBAT' : ''}`);
          }catch(err){ console.error(err); showToastSafe('Text import failed'); }
        }, true);
      }
      syncValidation();
    }
    window.openOutlineModal=function(){
      const r=orig.apply(this, arguments);
      bindModal(document.getElementById('outline-modal'));
      return r;
    };
    window.openOutlineModal._v12Enhanced=true;
  }
  enhanceOutlineModal();

  function recomputeStacks(){
    const ns=Object.values(window.nodes||{});
    ns.forEach(n=>{ delete n._stackCount; delete n._stackLead; });
    const groups={};
    ns.forEach(n=>{
      const key=`${n.parentId||'root'}|${n.typeId||''}|${n.echelon||''}`;
      (groups[key]||(groups[key]=[])).push(n);
    });
    Object.values(groups).forEach(arr=>{
      arr.sort((a,b)=>(a.y-b.y)||(a.x-b.x));
      let cluster=[];
      function flush(){
        if(cluster.length>1){
          cluster.forEach((n,i)=>{ n._stackCount=cluster.length; n._stackLead=(i===0); });
        }
        cluster=[];
      }
      arr.forEach(n=>{
        if(!cluster.length){ cluster=[n]; return; }
        const prev=cluster[cluster.length-1];
        const dx=Math.abs((n.x||0)-(prev.x||0)), dy=Math.abs((n.y||0)-(prev.y||0));
        if(dx<=34 && dy<=26) cluster.push(n); else { flush(); cluster=[n]; }
      });
      flush();
    });
    ns.forEach(n=>{
      const el=document.getElementById('el-'+n.id); if(!el) return;
      const badge=el.querySelector('.stack-badge');
      if(n._stackCount>1 && n._stackLead){
        if(badge) badge.textContent='×'+n._stackCount;
      } else if(badge) badge.remove();
    });
  }

  let stackTick=0;
  function scheduleRecompute(){
    if(stackTick) cancelAnimationFrame(stackTick);
    stackTick=requestAnimationFrame(()=>{ stackTick=0; recomputeStacks(); });
  }

  if(window.renderNode && !window.renderNode._v12StackWatch){
    const prev=window.renderNode;
    window.renderNode=function(){ const r=prev.apply(this, arguments); scheduleRecompute(); return r; };
    window.renderNode._v12StackWatch=true;
  }
  if(window.autoLayout && !window.autoLayout._v12StackWatch){
    const prev=window.autoLayout;
    window.autoLayout=function(){ const r=prev.apply(this, arguments); scheduleRecompute(); return r; };
    window.autoLayout._v12StackWatch=true;
  }
  if(window.stackSameTypeUnits){
    const _prevStack=window.stackSameTypeUnits;
    window.stackSameTypeUnits=function(){
      const groups={};
      Object.values(window.nodes||{}).forEach(n=>{
        const key=`${n.parentId||'root'}|${n.typeId||''}|${n.echelon||''}`;
        (groups[key]||(groups[key]=[])).push(n);
      });
      Object.values(groups).forEach(arr=>{
        if(arr.length<2) return;
        arr.sort((a,b)=>(a.y-b.y)||(a.x-b.x));
        const lead=arr[0], bx=Math.round(lead.x||0), by=Math.round(lead.y||0);
        arr.forEach((n,i)=>{
          n.x=bx + i*22;
          n.y=by + i*16;
          n._stackCount=arr.length;
          n._stackLead=(i===0);
          if(window.renderNode) window.renderNode(n.id);
        });
      });
      if(window.drawConnectors) window.drawConnectors();
      scheduleRecompute();
      return true;
    };
  }

  scheduleRecompute();
})();
