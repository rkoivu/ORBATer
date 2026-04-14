(function(){
  if(window.__orbatBootModule ? !window.__orbatBootModule('ui-flow-polish') : window.__orbatUiFlowPolishBooted) return;
  window.__orbatUiFlowPolishBooted = true;
  const q = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, match => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[match]));

  function readNodes(){
    try{
      if(typeof nodes !== 'undefined' && nodes) return nodes;
    }catch(_){}
    return window.nodes || {};
  }
  function readSelectedId(){
    try{
      if(typeof selectedId !== 'undefined') return selectedId;
    }catch(_){}
    return window.selectedId || null;
  }
  function readMultiSel(){
    try{
      if(typeof multiSel !== 'undefined' && multiSel instanceof Set) return [...multiSel];
    }catch(_){}
    if(window.multiSel instanceof Set) return [...window.multiSel];
    return Array.isArray(window.multiSel) ? [...window.multiSel] : [];
  }
  function getChildren(nodeId){
    return Object.values(readNodes()).filter(node => node && node.parentId === nodeId);
  }
  function getLineage(node){
    const nodeMap = readNodes();
    const chain = [];
    let cursor = node;
    let guard = 0;
    while(cursor && guard < 12){
      chain.unshift(cursor.designation || cursor.name || cursor.id || 'Unit');
      cursor = cursor.parentId ? nodeMap[cursor.parentId] : null;
      guard += 1;
    }
    return chain;
  }
  function statPill(label, value, tone=''){
    return `<span class="flow-pill ${tone}"><b>${esc(label)}</b>${esc(value)}</span>`;
  }

  function ensureSidebarPrimer(){
    const scroll = q('sidebar-scroll');
    if(!scroll || q('sidebar-primer')) return;
    const primer = document.createElement('section');
    primer.id = 'sidebar-primer';
    primer.className = 'sidebar-primer';
    primer.innerHTML = `
      <div class="sidebar-primer-head">
        <div>
          <div class="sidebar-primer-kicker">Quick start</div>
          <div class="sidebar-primer-title">Build in three moves</div>
        </div>
        <button class="tb-btn" type="button" id="sidebar-primer-launch">Open guide</button>
      </div>
      <ol class="sidebar-primer-steps">
        <li><span>1</span><div><strong>Start with a root</strong><p>Create the headquarters or first parent formation.</p></div></li>
        <li><span>2</span><div><strong>Drag unit types here</strong><p>Use the palette to add subordinates and support elements.</p></div></li>
        <li><span>3</span><div><strong>Run layout when the structure is stable</strong><p>Clean the diagram after adding or moving several units.</p></div></li>
      </ol>
      <div class="sidebar-primer-actions">
        <button class="pb" type="button" id="sidebar-primer-root">Add root</button>
        <button class="pb" type="button" id="sidebar-primer-template">Templates</button>
      </div>
    `;
    scroll.prepend(primer);
    q('sidebar-primer-launch')?.addEventListener('click', ()=>{
      if(typeof window.openModal === 'function' && q('startup-modal')){
        window.openModal('startup-modal');
        return;
      }
      if(q('btn-launcher')) q('btn-launcher').click();
    });
    q('sidebar-primer-root')?.addEventListener('click', ()=>window.addRootUnit && window.addRootUnit());
    q('sidebar-primer-template')?.addEventListener('click', ()=>window.openTplModal && window.openTplModal());
  }

  function enhanceEmptyState(){
    const hint = q('empty-hint');
    if(!hint || hint.dataset.flowPolished === '1') return;
    hint.dataset.flowPolished = '1';
    hint.style.pointerEvents = 'auto';
    hint.innerHTML = `
      <div class="eh-hero">+</div>
      <div class="eh-title">Start the ORBAT with a clean first move</div>
      <p class="eh-copy">Begin with a root headquarters, load a doctrinal template, or import an existing JSON export. The palette and properties panel stay visible once the first unit is on the canvas.</p>
      <div class="eh-action-row">
        <button class="pb" type="button" id="empty-add-root">Add root</button>
        <button class="pb" type="button" id="empty-open-template">Templates</button>
        <button class="pb" type="button" id="empty-import-json">Import JSON</button>
        <button class="pb" type="button" id="empty-open-launcher">Open guide</button>
      </div>
      <div class="eh-kbd-row">
        <span><kbd>/</kbd> Search units</span>
        <span><kbd>Shift</kbd> + <kbd>N</kbd> Root at center</span>
        <span><kbd>L</kbd> Auto-layout</span>
        <span><kbd>Ctrl</kbd> + <kbd>K</kbd> Commands</span>
      </div>
    `;
    q('empty-add-root')?.addEventListener('click', ()=>window.addRootUnit && window.addRootUnit());
    q('empty-open-template')?.addEventListener('click', ()=>window.openTplModal && window.openTplModal());
    q('empty-import-json')?.addEventListener('click', ()=>window.importJSON && window.importJSON());
    q('empty-open-launcher')?.addEventListener('click', ()=>{
      if(q('btn-launcher')) q('btn-launcher').click();
    });
  }

  function ensurePanelSummary(){
    const epInner = q('ep-inner');
    if(epInner && !q('flow-selection-summary')){
      const summary = document.createElement('section');
      summary.id = 'flow-selection-summary';
      summary.className = 'flow-summary-card';
      const heading = epInner.querySelector('h3');
      if(heading) heading.insertAdjacentElement('afterend', summary);
    }
    const mpInner = q('mp-inner');
    if(mpInner && !q('flow-multi-summary')){
      const summary = document.createElement('section');
      summary.id = 'flow-multi-summary';
      summary.className = 'flow-summary-card multi';
      const heading = mpInner.querySelector('h3');
      if(heading) heading.insertAdjacentElement('afterend', summary);
    }
  }

  function updateSelectionSummary(){
    const host = q('flow-selection-summary');
    if(!host) return;
    const nodeMap = readNodes();
    const node = nodeMap[readSelectedId()];
    if(!node){
      host.innerHTML = `
        <div class="flow-summary-kicker">Selection</div>
        <div class="flow-summary-title">Choose a unit to edit</div>
        <p class="flow-summary-copy">Select a node to edit its identity, relationships, readiness, and presentation details from one place.</p>
      `;
      return;
    }
    const parent = node.parentId ? nodeMap[node.parentId] : null;
    const children = getChildren(node.id);
    const lineage = getLineage(node).join(' / ');
    const readiness = node.readiness !== '' && node.readiness != null ? `${node.readiness}%` : 'Not set';
    host.innerHTML = `
      <div class="flow-summary-topline">
        <div class="flow-summary-kicker">Selected unit</div>
        <div class="flow-summary-badge">${esc(node.echelon || 'unit')}</div>
      </div>
      <div class="flow-summary-title">${esc(node.name || node.designation || 'Unnamed unit')}</div>
      <div class="flow-summary-lineage">${esc(lineage)}</div>
      <div class="flow-summary-pills">
        ${statPill('Parent', parent ? (parent.designation || parent.name || parent.id) : 'Root')}
        ${statPill('Children', children.length)}
        ${statPill('Status', node.status || 'Unknown', 'tone-warm')}
        ${statPill('Readiness', readiness)}
      </div>
      <p class="flow-summary-copy">${esc(node.task ? `Current task: ${node.task}.` : 'Set a task if this unit needs a mission label on the card.')} ${esc(node.reltype && node.reltype !== 'command' ? `Connection uses ${node.reltype.toUpperCase()}.` : 'Command relationship is currently direct.')}</p>
      <div class="flow-summary-actions">
        <button class="pb" type="button" id="flow-focus-unit">Focus</button>
        <button class="pb" type="button" id="flow-add-child">Add subordinate</button>
        <button class="pb" type="button" id="flow-jump-parent" ${parent ? '' : 'disabled'}>Select parent</button>
        <button class="pb" type="button" id="flow-duplicate-unit">Duplicate</button>
      </div>
    `;
    q('flow-focus-unit')?.addEventListener('click', ()=>window.focusSelection && window.focusSelection());
    q('flow-add-child')?.addEventListener('click', ()=>window.addChildToSelected && window.addChildToSelected());
    q('flow-jump-parent')?.addEventListener('click', ()=>parent && window.selectNode && window.selectNode(parent.id));
    q('flow-duplicate-unit')?.addEventListener('click', ()=>window.duplicateSelected && window.duplicateSelected());
  }

  function updateMultiSummary(){
    const host = q('flow-multi-summary');
    if(!host) return;
    const ids = readMultiSel();
    if(ids.length <= 1){
      host.innerHTML = `
        <div class="flow-summary-kicker">Bulk edit</div>
        <div class="flow-summary-title">Select multiple units</div>
        <p class="flow-summary-copy">Use Shift+click or lasso selection to update affiliation, status, frame, tint, and alignment in one pass.</p>
      `;
      return;
    }
    const nodeMap = readNodes();
    const selectedNodes = ids.map(id => nodeMap[id]).filter(Boolean);
    const roots = selectedNodes.filter(node => !node.parentId).length;
    const tasks = selectedNodes.filter(node => node.task).length;
    const hostile = selectedNodes.filter(node => node.affil === 'hostile').length;
    host.innerHTML = `
      <div class="flow-summary-topline">
        <div class="flow-summary-kicker">Bulk edit</div>
        <div class="flow-summary-badge">${ids.length} units</div>
      </div>
      <div class="flow-summary-title">Apply shared changes once</div>
      <div class="flow-summary-pills">
        ${statPill('Roots', roots)}
        ${statPill('With tasks', tasks)}
        ${statPill('Hostile', hostile, hostile ? 'tone-warm' : '')}
      </div>
      <p class="flow-summary-copy">Use the controls below when these units should share the same affiliation, status, frame, or layout treatment. Alignment stays available while multi-select is active.</p>
    `;
  }

  function refreshAll(){
    ensureSidebarPrimer();
    ensurePanelSummary();
    enhanceEmptyState();
    updateSelectionSummary();
    updateMultiSummary();
  }

  function wrapSelectionFns(){
    if(typeof window.selectNode === 'function' && !window.selectNode.__flowPolished){
      const prev = window.selectNode;
      const wrapped = function(){
        const result = prev.apply(this, arguments);
        setTimeout(refreshAll, 0);
        return result;
      };
      wrapped.__flowPolished = true;
      window.selectNode = wrapped;
      try{ selectNode = wrapped; }catch(_){}
    }
    if(typeof window.updSelUI === 'function' && !window.updSelUI.__flowPolished){
      const prev = window.updSelUI;
      const wrapped = function(){
        const result = prev.apply(this, arguments);
        setTimeout(refreshAll, 0);
        return result;
      };
      wrapped.__flowPolished = true;
      window.updSelUI = wrapped;
      try{ updSelUI = wrapped; }catch(_){}
    }
    if(typeof window.deselectAll === 'function' && !window.deselectAll.__flowPolished){
      const prev = window.deselectAll;
      const wrapped = function(){
        const result = prev.apply(this, arguments);
        setTimeout(refreshAll, 0);
        return result;
      };
      wrapped.__flowPolished = true;
      window.deselectAll = wrapped;
      try{ deselectAll = wrapped; }catch(_){}
    }
  }

  function bindLiveRefresh(){
    if(document.body.dataset.flowPolishBound === '1') return;
    document.body.dataset.flowPolishBound = '1';
    document.addEventListener('input', event => {
      if(event.target.closest('#ep-inner') || event.target.id === 'op-name-input') setTimeout(refreshAll, 0);
    }, true);
    document.addEventListener('change', event => {
      if(event.target.closest('#ep-inner') || event.target.closest('#mp-inner')) setTimeout(refreshAll, 0);
    }, true);
  }

  function init(){
    wrapSelectionFns();
    bindLiveRefresh();
    refreshAll();
    setTimeout(refreshAll, 180);
    setTimeout(refreshAll, 600);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else{
    init();
  }
})();
