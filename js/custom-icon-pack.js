(function(){
  const SYMBOL_PACK = {};
  const attachmentInput = document.getElementById('node-attachment-input');
  const insigniaInput = document.getElementById('node-insignia-input');
  const randomBtn = document.getElementById('btn-random-orbat');
  const epInner = document.getElementById('ep-inner');
  let epEquipList, epMissionNote, epIntelNote, epAdminNote, epAttachmentList;

  function ensureUnitFields(){
    if(document.getElementById('ep-equip-list')) return;
    const actionsPsec=[...epInner.querySelectorAll('.psec')].find(el=>el.textContent.trim()==='Actions');
    const wrap=document.createElement('div');
    wrap.innerHTML = `
      <div class="psec">Equipment Layer</div>
      <div class="fg">
        <label>Equipment List</label>
        <textarea id="ep-equip-list" placeholder="3 x Rifle Company\n8 x MBT\n6 x 155mm SPH"></textarea>
        <div class="panel-help">One item per line. Used for doctrine templates and future analysis tools.</div>
      </div>
      <div class="psec">Structured Notes</div>
      <div class="fg"><label>Mission</label><textarea id="ep-mission-note" placeholder="Defend phase line BRONZE"></textarea></div>
      <div class="fg"><label>Intel / Situation</label><textarea id="ep-intel-note" placeholder="Enemy armour sighted east of OBJ ALPHA"></textarea></div>
      <div class="fg"><label>Admin / Logistics</label><textarea id="ep-admin-note" placeholder="Fuel 70%, ammo state green"></textarea></div>
      <div class="psec">Attachments</div>
      <div class="fg">
        <div class="icon-row" style="margin-bottom:6px">
          <button class="pb" id="btn-attach-files" style="margin:0;flex:1">⤒ Add Attachment(s)</button>
          <button class="pb" id="btn-clear-attachments" style="margin:0;width:90px;padding:6px 4px" title="Remove all">Clear</button>
        </div>
        <div id="ep-attachment-list" class="panel-help">No attachments</div>
      </div>
    `;
    epInner.insertBefore(wrap, actionsPsec || epInner.lastElementChild);
    epEquipList=document.getElementById('ep-equip-list');
    epMissionNote=document.getElementById('ep-mission-note');
    epIntelNote=document.getElementById('ep-intel-note');
    epAdminNote=document.getElementById('ep-admin-note');
    epAttachmentList=document.getElementById('ep-attachment-list');
    [epEquipList,epMissionNote,epIntelNote,epAdminNote].forEach(el=>{ if(!el) return; el.addEventListener('input', ()=>{ try{ applyEP(); }catch(e){} }); });
    document.getElementById('btn-attach-files').addEventListener('click', ()=>attachmentInput.click());
    document.getElementById('btn-clear-attachments').addEventListener('click', ()=>{
      if(!selectedId||!nodes[selectedId]) return;
      nodes[selectedId].attachments=[];
      populateEditPanel(selectedId);
      saveState();
      showToast('Attachments cleared');
    });
  }
  ensureUnitFields();

  function renderAttachmentList(list){
    if(!epAttachmentList) return;
    const items=(list||[]);
    if(!items.length){ epAttachmentList.textContent='No attachments'; return; }
    epAttachmentList.innerHTML=items.map((a,i)=>`<div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:4px"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.name||('Attachment '+(i+1))}</span><button class="pb" style="width:auto;margin:0;padding:2px 8px" onclick="window.open('${(a.dataUrl||'').replace(/'/g,"&#39;")}','_blank')">Open</button></div>`).join('');
  }

  const oldGetSym = getSym;
  // Keep a single asset-backed renderer for built-in unit symbols.
  Object.keys(SYMBOL_PACK).forEach((key)=>delete SYMBOL_PACK[key]);
  useSymbolPackImages = false;
  window.getSym = getSym = function(typeId, affil='friendly', ech='battalion', planned=false){
    return oldGetSym(typeId, affil, ech, planned);
  };

  const oldNormalizeNode = normalizeNode;
  normalizeNode = function(id, raw={}){
    const n = oldNormalizeNode(id, raw);
    n.equipmentItems = Array.isArray(raw.equipmentItems) ? raw.equipmentItems : String(raw.equipmentItems||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    n.missionNote = raw.missionNote || '';
    n.intelNote = raw.intelNote || '';
    n.adminNote = raw.adminNote || '';
    n.attachments = Array.isArray(raw.attachments) ? raw.attachments : [];
    return n;
  };

  const oldPopulateEditPanel = populateEditPanel;
  populateEditPanel = function(id){
    oldPopulateEditPanel(id);
    ensureUnitFields();
    const n=nodes[id];
    if(epEquipList) epEquipList.value=(n.equipmentItems||[]).join('\n');
    if(epMissionNote) epMissionNote.value=n.missionNote||'';
    if(epIntelNote) epIntelNote.value=n.intelNote||'';
    if(epAdminNote) epAdminNote.value=n.adminNote||'';
    renderAttachmentList(n.attachments||[]);
  };

  const oldApplyEP = applyEP;
  applyEP = function(){
    oldApplyEP();
    if(!selectedId||!nodes[selectedId]) return;
    const n=nodes[selectedId];
    n.equipmentItems = (epEquipList?.value||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    n.missionNote = epMissionNote?.value || '';
    n.intelNote = epIntelNote?.value || '';
    n.adminNote = epAdminNote?.value || '';
    saveState();
  };

  const oldNodeSearchText = window.nodeSearchText || null;
  if(oldNodeSearchText){
    window.nodeSearchText=function(n){
      return [oldNodeSearchText(n), ...(n.equipmentItems||[]), n.missionNote||'', n.intelNote||'', n.adminNote||''].join(' ').toLowerCase();
    };
  }

  attachmentInput?.addEventListener('change', (e)=>{
    if(!selectedId||!nodes[selectedId]) return;
    const files=[...(e.target.files||[])].slice(0,8);
    if(!files.length) return;
    let pending=files.length;
    files.forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>{
        nodes[selectedId].attachments = nodes[selectedId].attachments || [];
        nodes[selectedId].attachments.push({name:file.name, type:file.type||'', dataUrl:ev.target.result});
        pending--;
        if(pending===0){ populateEditPanel(selectedId); saveState(); showToast('Attachment(s) added'); }
      };
      reader.readAsDataURL(file);
    });
    e.target.value='';
  });

  function addSubunits(parentId, specs){
    return specs.map(spec=>createNode({
      typeId: spec.typeId,
      name: spec.name,
      designation: spec.designation,
      echelon: spec.echelon,
      parentId,
      affil: spec.affil,
      reltype: spec.reltype,
      equipmentItems: spec.equipmentItems || []
    }));
  }

  function addLineCompanies(parentId, prefix, companyType, platoonType, count, affil){
    for(let i=0;i<count;i++){
      const label = String.fromCharCode(65 + i);
      const coyId = createNode({
        typeId: companyType,
        name: `${label} COY`,
        designation: `${label} COY`,
        echelon: 'company',
        parentId,
        affil,
        equipmentItems: ['3 x Rifle Platoon', '1 x Weapons Platoon']
      });
      addSubunits(coyId, [
        {typeId: platoonType, name:`${label} 1 PLT`, echelon:'platoon', affil},
        {typeId: platoonType, name:`${label} 2 PLT`, echelon:'platoon', affil},
        {typeId: platoonType, name:`${label} 3 PLT`, echelon:'platoon', affil},
        {typeId: 'infantry', name:`${label} WPNS PLT`, echelon:'platoon', affil, reltype:'support'}
      ]);
    }
  }

  function addTankBattalion(parentId, name, affil){
    const bnId = createNode({typeId:'armour',name,echelon:'battalion',parentId,affil,equipmentItems:['3 x Tank Company','1 x HQ / support company']});
    ['A','B','C'].forEach(label=>{
      const coyId = createNode({typeId:'armour',name:`${label} COY`,designation:`${label} COY`,echelon:'company',parentId:bnId,affil,equipmentItems:['3 x Tank Platoon']});
      addSubunits(coyId, [
        {typeId:'armour',name:`${label} 1 PLT`,echelon:'platoon',affil},
        {typeId:'armour',name:`${label} 2 PLT`,echelon:'platoon',affil},
        {typeId:'armour',name:`${label} 3 PLT`,echelon:'platoon',affil}
      ]);
    });
    const hqCoyId = createNode({typeId:'hq',name:'HQ COY',echelon:'company',parentId:bnId,affil,reltype:'support'});
    addSubunits(hqCoyId, [
      {typeId:'recon',name:'SCOUT PLT',echelon:'platoon',affil},
      {typeId:'engineer',name:'ENGR PLT',echelon:'platoon',affil,reltype:'support'},
      {typeId:'supply',name:'MAINT / SUPPLY PLT',echelon:'platoon',affil,reltype:'support'}
    ]);
    return bnId;
  }

  function addMechanizedBattalion(parentId, name, affil){
    const bnId = createNode({typeId:'mech_inf',name,echelon:'battalion',parentId,affil,equipmentItems:['3 x Mechanized company','1 x weapons company']});
    ['A','B','C'].forEach(label=>{
      const coyId = createNode({typeId:'mech_inf',name:`${label} COY`,designation:`${label} COY`,echelon:'company',parentId:bnId,affil,equipmentItems:['3 x Mechanized platoon']});
      addSubunits(coyId, [
        {typeId:'mech_inf',name:`${label} 1 PLT`,echelon:'platoon',affil},
        {typeId:'mech_inf',name:`${label} 2 PLT`,echelon:'platoon',affil},
        {typeId:'mech_inf',name:`${label} 3 PLT`,echelon:'platoon',affil}
      ]);
    });
    const weaponsCoyId = createNode({typeId:'infantry',name:'WPNS COY',echelon:'company',parentId:bnId,affil,reltype:'support'});
    addSubunits(weaponsCoyId, [
      {typeId:'mortar',name:'MORTAR PLT',echelon:'platoon',affil,reltype:'support'},
      {typeId:'anti_tank',name:'AT PLT',echelon:'platoon',affil,reltype:'support'},
      {typeId:'air_defense',name:'SHORAD PLT',echelon:'platoon',affil,reltype:'support'}
    ]);
    return bnId;
  }

  function addFiresBattalion(parentId, name, typeId, affil){
    const bnId = createNode({typeId,name,echelon:'battalion',parentId,affil});
    ['A','B','C'].forEach(label=>{
      const batteryId = createNode({typeId,name:`${label} BTRY`,designation:`${label} BTRY`,echelon:'company',parentId:bnId,affil});
      addSubunits(batteryId, [
        {typeId,name:`${label} 1 PLT`,echelon:'platoon',affil},
        {typeId,name:`${label} 2 PLT`,echelon:'platoon',affil},
        {typeId:'hq',name:`${label} FDC PLT`,echelon:'platoon',affil,reltype:'support'}
      ]);
    });
    return bnId;
  }

  function doctrinalTemplates(){
    return [
      {
        name:'NATO Infantry Battalion',
        desc:'HQ, 4 rifle companies, support company, mortars, logistics',
        fn:()=>{
          const hq=createNode({typeId:'hq',name:'1-22 IN',designation:'1-22 IN',echelon:'battalion',x:340,y:60,equipmentItems:['4 x Rifle Company','1 x Support Company','1 x Mortar Platoon']});
          addLineCompanies(hq, 'Rifle', 'infantry', 'infantry', 4);
          const mortarCoyId = createNode({typeId:'mortar',name:'MORTAR COY',echelon:'company',parentId:hq,reltype:'support'});
          addSubunits(mortarCoyId, [
            {typeId:'mortar',name:'1 MORTAR PLT',echelon:'platoon',reltype:'support'},
            {typeId:'mortar',name:'2 MORTAR PLT',echelon:'platoon',reltype:'support'},
            {typeId:'hq',name:'FDC PLT',echelon:'platoon',reltype:'support'}
          ]);
          const supportCoyId = createNode({typeId:'supply',name:'SUPPORT COY',echelon:'company',parentId:hq,reltype:'support'});
          addSubunits(supportCoyId, [
            {typeId:'engineer',name:'PIONEER PLT',echelon:'platoon',reltype:'support'},
            {typeId:'signals',name:'SIGNALS PLT',echelon:'platoon',reltype:'support'},
            {typeId:'supply',name:'LOG PLT',echelon:'platoon',reltype:'support'}
          ]);
          autoLayout();
        }
      },
      {
        name:'Armoured Brigade',
        desc:'HQ, tank battalions, mechanized infantry, artillery, engineers, logistics',
        fn:()=>{
          const hq=createNode({typeId:'hq',name:'1 ARMD BDE',designation:'1 ARMD BDE',echelon:'brigade',x:360,y:60,equipmentItems:['3 x Tank Battalion','2 x Mechanized Infantry Battalion']});
          addTankBattalion(hq, '1 TANK BN');
          addTankBattalion(hq, '2 TANK BN');
          addTankBattalion(hq, '3 TANK BN');
          addMechanizedBattalion(hq, '1 MECH BN');
          addMechanizedBattalion(hq, '2 MECH BN');
          addFiresBattalion(hq, 'BDE ARTY', 'artillery');
          const engrCoyId = createNode({typeId:'engineer',name:'ENGR COY',echelon:'company',parentId:hq,reltype:'support'});
          addSubunits(engrCoyId, [
            {typeId:'engineer',name:'MOBILITY PLT',echelon:'platoon',reltype:'support'},
            {typeId:'engineer',name:'COUNTERMOBILITY PLT',echelon:'platoon',reltype:'support'},
            {typeId:'engineer',name:'ASSAULT PLT',echelon:'platoon',reltype:'support'}
          ]);
          const sptBnId = createNode({typeId:'supply',name:'BDE SPT BN',echelon:'battalion',parentId:hq,reltype:'support'});
          addSubunits(sptBnId, [
            {typeId:'supply',name:'DIST COY',echelon:'company',reltype:'support'},
            {typeId:'supply',name:'MAINT COY',echelon:'company',reltype:'support'},
            {typeId:'medical',name:'MED COY',echelon:'company',reltype:'support'}
          ]).forEach(coyId=>{
            addSubunits(coyId, [
              {typeId:'supply',name:'1 PLT',echelon:'platoon',reltype:'support'},
              {typeId:'supply',name:'2 PLT',echelon:'platoon',reltype:'support'},
              {typeId:'hq',name:'HQ PLT',echelon:'platoon',reltype:'support'}
            ]);
          });
          autoLayout();
        }
      },
      {
        name:'Russian BTG',
        desc:'Motor rifle core with tanks, artillery, air defense and support',
        fn:()=>{
          const hq=createNode({typeId:'hq',name:'BTG',designation:'BTG',echelon:'battalion',affil:'hostile',x:340,y:60});
          ['A','B','C'].forEach(label=>{
            const coyId = createNode({typeId:'motorised',name:`MR COY ${label}`,echelon:'company',parentId:hq,affil:'hostile',equipmentItems:['3 x Motor rifle platoon']});
            addSubunits(coyId, [
              {typeId:'motorised',name:`${label} 1 PLT`,echelon:'platoon',affil:'hostile'},
              {typeId:'motorised',name:`${label} 2 PLT`,echelon:'platoon',affil:'hostile'},
              {typeId:'motorised',name:`${label} 3 PLT`,echelon:'platoon',affil:'hostile'}
            ]);
          });
          const tankCoyId = createNode({typeId:'armour',name:'TANK COY',echelon:'company',parentId:hq,affil:'hostile'});
          addSubunits(tankCoyId, [
            {typeId:'armour',name:'1 TK PLT',echelon:'platoon',affil:'hostile'},
            {typeId:'armour',name:'2 TK PLT',echelon:'platoon',affil:'hostile'},
            {typeId:'armour',name:'3 TK PLT',echelon:'platoon',affil:'hostile'}
          ]);
          const artyBtryId = createNode({typeId:'artillery',name:'ARTY BTRY',echelon:'company',parentId:hq,affil:'hostile'});
          addSubunits(artyBtryId, [
            {typeId:'artillery',name:'1 GUN PLT',echelon:'platoon',affil:'hostile'},
            {typeId:'artillery',name:'2 GUN PLT',echelon:'platoon',affil:'hostile'},
            {typeId:'hq',name:'FDC PLT',echelon:'platoon',affil:'hostile',reltype:'support'}
          ]);
          const mlrsId = createNode({typeId:'rockets',name:'MLRS BTRY',echelon:'company',parentId:hq,affil:'hostile',reltype:'support'});
          addSubunits(mlrsId, [
            {typeId:'rockets',name:'1 LAUNCHER PLT',echelon:'platoon',affil:'hostile',reltype:'support'},
            {typeId:'rockets',name:'2 LAUNCHER PLT',echelon:'platoon',affil:'hostile',reltype:'support'}
          ]);
          const shoradId = createNode({typeId:'air_defense',name:'SHORAD BTRY',echelon:'company',parentId:hq,affil:'hostile',reltype:'support'});
          addSubunits(shoradId, [
            {typeId:'air_defense',name:'1 AD PLT',echelon:'platoon',affil:'hostile',reltype:'support'},
            {typeId:'air_defense',name:'2 AD PLT',echelon:'platoon',affil:'hostile',reltype:'support'}
          ]);
          addSubunits(hq, [
            {typeId:'engineer',name:'ENGR PLT',echelon:'platoon',affil:'hostile',reltype:'support'},
            {typeId:'signals',name:'SIG PLT',echelon:'platoon',affil:'hostile',reltype:'support'}
          ]);
          autoLayout();
        }
      },
      {
        name:'US Brigade Combat Team',
        desc:'HQ, 3 maneuver battalions, cavalry, artillery, engineer, sustainment',
        fn:()=>{
          const hq=createNode({typeId:'hq',name:'1 BCT',designation:'1 BCT',echelon:'brigade',x:340,y:60});
          addLineCompanies(createNode({typeId:'infantry',name:'1-22 IN',echelon:'battalion',parentId:hq,equipmentItems:['3 x Rifle company','1 x weapons company']}), 'Rifle', 'infantry', 'infantry', 3);
          addLineCompanies(createNode({typeId:'infantry',name:'2-22 IN',echelon:'battalion',parentId:hq,equipmentItems:['3 x Rifle company','1 x weapons company']}), 'Rifle', 'infantry', 'infantry', 3);
          addTankBattalion(hq, '1-66 AR');
          const cavSqdnId = createNode({typeId:'recon',name:'SQDN',echelon:'battalion',parentId:hq});
          ['A','B','C'].forEach(label=>{
            const troopId = createNode({typeId:'recon',name:`${label} TRP`,echelon:'company',parentId:cavSqdnId});
            addSubunits(troopId, [
              {typeId:'recon',name:`${label} 1 PLT`,echelon:'platoon'},
              {typeId:'recon',name:`${label} 2 PLT`,echelon:'platoon'},
              {typeId:'recon',name:`${label} SCOUT PLT`,echelon:'platoon'}
            ]);
          });
          addFiresBattalion(hq, 'FA BN', 'artillery');
          const enBnId = createNode({typeId:'engineer',name:'EN BN',echelon:'battalion',parentId:hq});
          ['A','B','C'].forEach(label=>{
            const coyId = createNode({typeId:'engineer',name:`${label} COY`,echelon:'company',parentId:enBnId,reltype:'support'});
            addSubunits(coyId, [
              {typeId:'engineer',name:`${label} MOBILITY PLT`,echelon:'platoon',reltype:'support'},
              {typeId:'engineer',name:`${label} SAPR PLT`,echelon:'platoon',reltype:'support'},
              {typeId:'engineer',name:`${label} CLEARANCE PLT`,echelon:'platoon',reltype:'support'}
            ]);
          });
          const bsbId = createNode({typeId:'supply',name:'BSB',echelon:'battalion',parentId:hq,reltype:'support'});
          addSubunits(bsbId, [
            {typeId:'supply',name:'DIST COY',echelon:'company',reltype:'support'},
            {typeId:'supply',name:'FIELD MAINT COY',echelon:'company',reltype:'support'},
            {typeId:'medical',name:'MED COY',echelon:'company',reltype:'support'}
          ]).forEach(coyId=>{
            addSubunits(coyId, [
              {typeId:'supply',name:'1 PLT',echelon:'platoon',reltype:'support'},
              {typeId:'supply',name:'2 PLT',echelon:'platoon',reltype:'support'},
              {typeId:'hq',name:'HQ PLT',echelon:'platoon',reltype:'support'}
            ]);
          });
          autoLayout();
        }
      },
      {
        name:'PLA Combined Arms Brigade',
        desc:'HQ, combined arms battalions, artillery, air defense, service support',
        fn:()=>{
          const hq=createNode({typeId:'hq',name:'CA BDE',designation:'CA BDE',echelon:'brigade',x:340,y:60});
          ['1 CABN','2 CABN'].forEach(nm=>addMechanizedBattalion(hq, nm));
          ['3 CABN','4 CABN'].forEach(nm=>addTankBattalion(hq, nm));
          addFiresBattalion(hq, 'ARTY BN', 'artillery');
          const adBnId = createNode({typeId:'air_defense',name:'AD BN',echelon:'battalion',parentId:hq});
          ['1','2','3'].forEach(num=>{
            const btryId = createNode({typeId:'air_defense',name:`AD BTRY ${num}`,echelon:'company',parentId:adBnId,reltype:'support'});
            addSubunits(btryId, [
              {typeId:'air_defense',name:`${num} 1 PLT`,echelon:'platoon',reltype:'support'},
              {typeId:'air_defense',name:`${num} 2 PLT`,echelon:'platoon',reltype:'support'}
            ]);
          });
          const engrBnId = createNode({typeId:'engineer',name:'ENGR BN',echelon:'battalion',parentId:hq});
          ['1','2','3'].forEach(num=>{
            const coyId = createNode({typeId:'engineer',name:`ENGR COY ${num}`,echelon:'company',parentId:engrBnId,reltype:'support'});
            addSubunits(coyId, [
              {typeId:'engineer',name:`${num} 1 PLT`,echelon:'platoon',reltype:'support'},
              {typeId:'engineer',name:`${num} 2 PLT`,echelon:'platoon',reltype:'support'}
            ]);
          });
          const svcBnId = createNode({typeId:'supply',name:'SVC SPT BN',echelon:'battalion',parentId:hq,reltype:'support'});
          addSubunits(svcBnId, [
            {typeId:'supply',name:'SUPPLY COY',echelon:'company',reltype:'support'},
            {typeId:'supply',name:'REPAIR COY',echelon:'company',reltype:'support'},
            {typeId:'medical',name:'MED COY',echelon:'company',reltype:'support'}
          ]).forEach(coyId=>{
            addSubunits(coyId, [
              {typeId:'supply',name:'1 PLT',echelon:'platoon',reltype:'support'},
              {typeId:'supply',name:'2 PLT',echelon:'platoon',reltype:'support'}
            ]);
          });
          autoLayout();
        }
      }
    ];
  }

  // replace old template set with doctrinal templates
  TEMPLATES.splice(0, TEMPLATES.length, ...doctrinalTemplates());

  function randomOrbat(){
    if(Object.keys(nodes).length>0 && !confirm('Generate random doctrinal ORBAT? This clears the current ORBAT.')) return;
    clearAll(true);
    const pool=doctrinalTemplates();
    const tpl=pool[Math.floor(Math.random()*pool.length)];
    tpl.fn();
    document.getElementById('op-name-input').value='OPERATION '+['IRON LANCE','BLUE OAK','STEEL ECHO','SILENT DUNE','RED TALON'][Math.floor(Math.random()*5)];
    saveState();
    showToast('Random ORBAT: '+tpl.name);
  }

  randomBtn?.addEventListener('click', randomOrbat);

  syncIconModeBtn();
  buildPalette();
  Object.keys(nodes).forEach(id=>renderNode(id));
  if(selectedId) populateEditPanel(selectedId);
  showToast('Doctrinal templates loaded');
})();

