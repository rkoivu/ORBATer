(function(){
  const topbar=document.getElementById('topbar');
  const canvasWrap=document.getElementById('canvas-wrap');
  const connectorSvg=document.getElementById('connector-svg');
  const sidebar=document.getElementById('sidebar');
  const editPanel=document.getElementById('edit-panel');
  const epInner=document.getElementById('ep-inner');
  const mpInner=document.getElementById('mp-inner');
  const NS='http://www.w3.org/2000/svg';

  function mkBtn(id, txt, title, fn, beforeDanger=false){
    if(document.getElementById(id)) return document.getElementById(id);
    const b=document.createElement('button');
    b.className='tb-btn'; b.id=id; b.textContent=txt; b.title=title; b.onclick=fn;
    const danger=topbar.querySelector('.tb-btn.danger');
    if(beforeDanger && danger) topbar.insertBefore(b,danger); else topbar.appendChild(b);
    return b;
  }

  // Extra styles
  if(!document.getElementById('v10-style')){
    const st=document.createElement('style'); st.id='v10-style'; st.textContent=`
      #subtree-stats-box{margin-top:10px;padding:8px;border:1px solid var(--border);border-radius:6px;background:var(--surface2)}
      #subtree-stats-box .row{display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin:2px 0}
      #subtree-stats-box .row b{color:var(--text)}
      .stack-badge{position:absolute;top:-8px;left:-8px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:rgba(59,130,246,.95);color:#fff;font:700 10px/18px 'Share Tech Mono',monospace;text-align:center;border:2px solid var(--bg)}
      #outline-modal textarea{width:100%;min-height:260px;background:var(--surface2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:10px;font-family:'Share Tech Mono',monospace;font-size:12px}
      .node-symbol.stacked{position:relative;overflow:visible}
      .node-symbol.stacked::before,.node-symbol.stacked::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;background:rgba(255,255,255,.92);border:1px solid rgba(0,0,0,.12);pointer-events:none}
      .node-symbol.stacked::before{transform:translate(-8px,8px)}
      .node-symbol.stacked::after{transform:translate(-4px,4px)}
      .node-symbol.stacked .node-symbol-inner{position:relative;z-index:1}
      #tour-ov{position:fixed;inset:0;background:rgba(0,0,0,.52);z-index:12000;display:none}
      #tour-ov.open{display:block}
      #tour-box{position:fixed;max-width:320px;background:var(--surface);border:1px solid var(--accent);border-radius:10px;padding:14px;z-index:12001;display:none;box-shadow:0 10px 30px rgba(0,0,0,.45)}
      #tour-box.open{display:block}
      #tour-box h3{font:700 13px 'Barlow Condensed',sans-serif;letter-spacing:1px;margin-bottom:8px}
      #tour-box p{font-size:12px;color:var(--text2);line-height:1.35}
      #tour-box .acts{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}
      .tour-hl{position:relative;z-index:12002;box-shadow:0 0 0 3px rgba(245,158,11,.85)!important;border-radius:8px}
      .resize-handle{position:absolute;top:0;bottom:0;width:6px;cursor:ew-resize;z-index:90;background:transparent}
      #sidebar-resize{right:-3px} #panel-resize{left:-3px}
      .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
    `; document.head.appendChild(st);
  }

  // Buttons
  mkBtn('btn-zoom-out-2','−','Zoom out',()=>window.zoomByStep&&window.zoomByStep(-1));
  mkBtn('btn-zoom-in-2','＋','Zoom in',()=>window.zoomByStep&&window.zoomByStep(1));
  mkBtn('btn-fit-plus','⤢ Fit+','Zoom to fit current ORBAT',()=>window.fitScreen&&window.fitScreen());
  mkBtn('btn-stack-same','▤ Stack','Stack same-type siblings',()=>{ stackSameTypeUnits(); saveState(); showToast('Stacked same-type units'); }, true);
  mkBtn('btn-conflicts','⚠ Check','Detect structure conflicts',()=>openConflictModal(), true);
  mkBtn('btn-outline-import','☰ Import','Import from text outline',()=>openOutlineModal(), true);
  mkBtn('btn-tour','◎ Tour','Guided onboarding tour',()=>startTour(), true);

  // Panel fields: relation label + tags + stats
  function ensurePanelExtras(){
    if(!document.getElementById('ep-rel-label')){
      const relFg=document.createElement('div'); relFg.className='fg'; relFg.innerHTML='<label>Connection Label</label><input id="ep-rel-label" type="text" placeholder="e.g. OPCON / DS / GS">';
      const relSel=document.getElementById('ep-reltype')?.closest('.fg'); if(relSel) relSel.parentNode.insertBefore(relFg, relSel.nextSibling);
      document.getElementById('ep-rel-label').addEventListener('input',function(){ if(selectedId&&nodes[selectedId]){ nodes[selectedId].relLabel=this.value; }});
    }
    // ep-tags is injected by injectPanelFields(); no duplicate needed here.
    if(!document.getElementById('subtree-stats-box')){
      const box=document.createElement('div'); box.id='subtree-stats-box'; box.innerHTML='<div class="psec" style="margin-top:0">Subtree Statistics</div><div id="subtree-stats-content" class="stats-grid"></div>';
      epInner.appendChild(box);
    }
  }
  ensurePanelExtras();

  // Helper functions
  function parseStrengthVal(v){
    if(v==null) return 0;
    const s=String(v).replace(/,/g,' ').trim();
    const m=s.match(/-?\d+(?:\.\d+)?/);
    return m?Math.round(parseFloat(m[0])):0;
  }
  function sumSubtree(id, seen){
    seen=seen||new Set(); if(seen.has(id)||!nodes[id]) return 0; seen.add(id);
    let total=parseStrengthVal(nodes[id].strength);
    Object.values(nodes).forEach(n=>{ if(n.parentId===id) total += sumSubtree(n.id, seen); });
    return total;
  }
  function subtreeStats(id){
    const stats={units:0,strength:0,byType:{},byEchelon:{},readinessTotal:0,readinessCount:0};
    (function walk(nid, seen){ if(!nid||seen.has(nid)||!nodes[nid]) return; seen.add(nid); const n=nodes[nid];
      stats.units++; stats.strength += parseStrengthVal(n.strength); stats.byType[n.typeId]=(stats.byType[n.typeId]||0)+1; stats.byEchelon[n.echelon]=(stats.byEchelon[n.echelon]||0)+1;
      if(n.readiness!==''&&n.readiness!=null&&!isNaN(+n.readiness)){ stats.readinessTotal += +n.readiness; stats.readinessCount++; }
      Object.values(nodes).forEach(ch=>{ if(ch.parentId===nid) walk(ch.id, seen); });
    })(id, new Set());
    stats.aggregatedStrength=sumSubtree(id);
    stats.avgReadiness=stats.readinessCount?Math.round(stats.readinessTotal/stats.readinessCount):0;
    return stats;
  }
  function refreshSubtreeStats(){
    const host=document.getElementById('subtree-stats-content'); if(!host) return;
    if(!selectedId||!nodes[selectedId]){ host.innerHTML='<div class="row"><span>No unit selected</span></div>'; return; }
    const s=subtreeStats(selectedId);
    const topType=Object.entries(s.byType).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k}:${v}`).join(', ');
    const topEch=Object.entries(s.byEchelon).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k}:${v}`).join(', ');
    host.innerHTML=`
      <div class="row"><span>Units</span><b>${s.units}</b></div>
      <div class="row"><span>Own strength</span><b>${s.strength}</b></div>
      <div class="row"><span>Aggregated</span><b>${s.aggregatedStrength}</b></div>
      <div class="row"><span>Avg readiness</span><b>${s.avgReadiness||0}%</b></div>
      <div class="row" style="grid-column:1/-1"><span>Types</span><b>${topType||'—'}</b></div>
      <div class="row" style="grid-column:1/-1"><span>Echelons</span><b>${topEch||'—'}</b></div>`;
  }
  window.refreshSubtreeStats=refreshSubtreeStats;

  // Stacking same-type siblings
  function stackSameTypeUnits(){
    const groups={};
    Object.values(nodes).forEach(n=>{ const key=`${n.parentId||'root'}|${n.typeId||''}|${n.echelon||''}`; (groups[key]||(groups[key]=[])).push(n); });
    Object.values(groups).forEach(arr=>{
      if(arr.length<2) return;
      arr.sort((a,b)=>a.y-b.y||a.x-b.x);
      const baseX=Math.round(arr.reduce((s,n)=>s+n.x,0)/arr.length), baseY=Math.round(arr.reduce((s,n)=>s+n.y,0)/arr.length);
      arr.forEach((n,i)=>{ n.x=snapV(baseX+i*10); n.y=snapV(baseY+i*10); n._stackCount=arr.length; n._stackLead=(i===0); renderNode(n.id); });
    });
    drawConnectors();
    refreshDerivedDisplays();
  }
  window.stackSameTypeUnits=stackSameTypeUnits;

  // Conflict detection
  function detectConflicts(){
    const out=[];
    const seenDes={};
    const echelonRank={team:1,squad:2,platoon:3,company:4,battalion:5,regiment:6,brigade:7,division:8,corps:9,army:10,army_group:11,region:12};

    // ── Human-readable label for a type ID ──────────────────────
    function typeLabel(id){
      const ut=(typeof UT!=='undefined'?UT:[]).find(u=>u.id===id);
      return ut?ut.label:id;
    }

    // ── Name vs icon mismatch check ──────────────────────────────
    // Returns the inferred type if it conflicts with the assigned type,
    // or null if they are consistent.
    // "Consistent" means: inferred type === assigned type, OR the inferred
    // type is in the same conceptual family (e.g. mech_inf ~ infantry).
    const FAMILY = {
      infantry:  ['infantry','mech_inf','glider_infantry','bicycle_infantry','machine_gun','mech_inf_tracked_ifv','mech_inf_wheeled_ifv','wheeled_mech_inf','motorised','airborne','air_assault',
                  'amphibious','marines','naval_infantry','mountain','arctic','special_ops','special_forces','ranger'],
      armour:     ['armour','light_armour','tank_destroyers','armoured_car','armd_recon','armoured_recon','cavalry_recon','recce_motorcycle','wheeled_armoured_recon','half_tracks'],
      fires:     ['artillery','field_artillery','heavy_artillery','super_heavy_artillery','railway_artillery','rocket_mortar','anti_aircraft_artillery','coastal_artillery','rockets','mortar','self_propelled_aaa','wheeled_anti_tank','infantry_assault_guns','air_defense_guns','air_defense_missiles','shorad','manpads','sam_long_range','electronic_attack','target_acquisition','counter_battery_radar','loitering_munitions','coastal_defense_missiles'],
      aviation:  ['aviation','air_cavalry','attack_helo','attack_recon_helo','utility_helo','transport_helo','fixed_wing','airlift','fighter','bomber','cas','tanker','airborne_c2','uav','recon_uav','strike_uav','istar'],
      engineer:  ['engineer','pioneers','bridging','mobility_support','route_clearance','construction_engineers','air_defense_engineers','railway_troops'],
      support:   ['log','supply','supply_transport','transport','movement_control','ammunition','fuel','water_supply','pipeline',
                  'rations','ordnance','laundry_sanitation','administration_sustainment','postal','replacement','replacement_pool','amphibious_transport','motorised_support','mechanised_support','medical','medevac','field_hospital','hospital','meteorological',
                  'signals','signals_intelligence','intel','geospatial_intelligence','surveillance','maintenance','recovery','mp','chem','cbrn','eod','psyops','cimic','decontamination','civil_affairs'],
      command:   ['hq','joint_hq','tac_cp','fire_coord'],
      naval:     ['naval_surface','submarine','maritime_patrol','riverine','landing_craft','mine_warfare','amphibious_assault_ship'],
      other:     ['ew','cyber','recon','space','sigint','port','air_defense','training','garrison','security_force_assistance','information_operations'],
    };
    // Build a reverse map: typeId → familyKey
    const typeFamily={};
    Object.entries(FAMILY).forEach(([fam,ids])=>ids.forEach(id=>typeFamily[id]=fam));

    function typesCompatible(assignedId, inferredId){
      if(assignedId===inferredId) return true;
      // Same family is always compatible
      if(typeFamily[assignedId] && typeFamily[assignedId]===typeFamily[inferredId]) return true;
      // Some cross-family pairs that are genuinely ambiguous in naming
      const OK_PAIRS=[
        ['infantry','mech_inf'],['infantry','motorised'],
        ['recon','armd_recon'],['recon','cavalry'],
        ['artillery','fire_coord'],['hq','joint_hq'],
        ['log','medical'],['log','maintenance'],['log','supply'],
        ['supply','ammunition'],['supply','fuel'],['supply','rations'],
        ['supply_transport','motorised_support'],['supply_transport','mechanised_support'],
      ];
      return OK_PAIRS.some(([a,b])=>(assignedId===a&&inferredId===b)||(assignedId===b&&inferredId===a));
    }

    function checkNameTypeMismatch(n){
      if(!n.name && !n.designation) return null;
      // Skip nodes that are clearly just numbered/coded (e.g. "A", "1", "HQ Elm")
      const raw=(n.name||n.designation||'').trim();
      if(raw.length<4) return null;
      // Use the same inference engine on the node name
      const inferred=inferTypeAndEchelon(raw);
      // Only flag if the inferred type is NOT compatible with the assigned type
      if(!typesCompatible(n.typeId||'infantry', inferred.typeId)){
        return {name:raw, assigned:n.typeId||'infantry', inferred:inferred.typeId};
      }
      return null;
    }

    // Valid typeIds
    const validTypeIds = new Set([...(typeof UT!=='undefined'?UT:[]).map(u => u.id), ...(typeof customTypes!=='undefined'?customTypes:[]).map(u => u.id)]);

    // Valid affiliations and relationship types
    const validAffils = ['friendly', 'hostile', 'neutral', 'unknown'];
    const validRelTypes = ['organic', 'attached', 'support', 'reinforced', 'command', 'opcon', 'tacon', 'coord'];

    Object.values(nodes).forEach(n=>{
      const nodeId = n.id || 'unknown';
      const nodeName = n.name || nodeId;

      // 1. Invalid typeId
      if (!validTypeIds.has(n.typeId)) {
        out.push(`⚠ Invalid unit type: "${n.typeId}" for <b>${nodeName}</b>`);
      }

      // 2. Missing required fields
      if (!n.name || n.name.trim() === '') {
        out.push(`⚠ Missing name for node <b>${nodeId}</b>`);
      }

      // 3. Orphaned nodes
      if (n.parentId && !nodes[n.parentId]) {
        out.push(`⚠ Orphaned node: <b>${nodeName}</b> references non-existent parent "${n.parentId}"`);
      }

      // 4. Structural checks (original)
      if(n.parentId===n.id) out.push(`⚠ Self-parent: <b>${nodeName}</b>`);
      if(n.designation){
        const k=n.designation.trim().toLowerCase();
        if(k){ if(seenDes[k]) out.push(`⚠ Duplicate designation: <b>${n.designation}</b>`); else seenDes[k]=1; }
      }
      const seen=new Set([n.id]); let cur=n;
      while(cur&&cur.parentId){
        if(seen.has(cur.parentId)){ out.push(`⚠ Circular chain involving <b>${nodeName}</b>`); break; }
        seen.add(cur.parentId); cur=nodes[cur.parentId];
      }
      if(n.parentId&&nodes[n.parentId]){
        const p=nodes[n.parentId];
        if((echelonRank[p.echelon]||0)<=(echelonRank[n.echelon]||0))
          out.push(`⚠ Echelon mismatch: <b>${nodeName}</b> (${n.echelon}) is under <b>${p.name||p.id}</b> (${p.echelon})`);
      }

      // 5. Affiliation validity
      if (n.affil && !validAffils.includes(n.affil)) {
        out.push(`⚠ Invalid affiliation: "${n.affil}" for <b>${nodeName}</b>`);
      }

      // 6. Relationship type validity
      if (n.reltype && !validRelTypes.includes(n.reltype)) {
        out.push(`⚠ Invalid relationship type: "${n.reltype}" for <b>${nodeName}</b>`);
      }

      // 7. Equipment consistency (basic check)
      if (n.equipmentItems && Array.isArray(n.equipmentItems)) {
        const emptyItems = n.equipmentItems.filter(item => !item || item.trim() === '');
        if (emptyItems.length > 0) {
          out.push(`⚠ Empty equipment items in <b>${nodeName}</b>`);
        }
      }

      // 8. Name/icon mismatch check (original)
      if(!n.customIcon){   // skip custom-icon nodes — user chose those deliberately
        const mm=checkNameTypeMismatch(n);
        if(mm){
          out.push(
            `🔀 Icon mismatch: <b>${mm.name}</b> is labelled as `+
            `<i>${typeLabel(mm.inferred)}</i> but uses the `+
            `<i>${typeLabel(mm.assigned)}</i> icon — `+
            `<a href="#" style="color:var(--accent)" onclick="(function(){`+
              `if(nodes['${n.id}']){nodes['${n.id}'].typeId='${mm.inferred}';`+
              `(window.renderNode||renderNode)('${n.id}');drawConnectors();saveState();`+
              `showToast('Icon updated to ${typeLabel(mm.inferred)}');}})();return false;">Fix</a>`
          );
        }
      }
    });
    return out;
  }
  function openConflictModal(){
    let ov=document.getElementById('conflict-modal');
    if(!ov){
      ov=document.createElement('div'); ov.className='modal-ov'; ov.id='conflict-modal';
      ov.innerHTML=`<div class="modal-box" style="min-width:480px">
        <h2>Conflict Detection <span id="conflict-count" style="font-size:11px;color:var(--text2);font-weight:400"></span>
            <span class="modal-x">✕</span></h2>
        <div id="conflict-list" style="font-size:12px;line-height:1.7"></div>
        <div class="modal-acts" style="margin-top:12px">
          <button class="pb" id="conflict-fix-all" style="width:auto;margin:0;border-color:var(--accent);color:var(--accent);display:none">⚡ Fix All Icon Mismatches</button>
          <button class="pb" id="conflict-close-btn" style="width:auto;margin:0">Close</button>
        </div>
      </div>`;
      document.body.appendChild(ov);
      ov.querySelector('.modal-x').onclick=()=>ov.classList.remove('open');
      ov.querySelector('#conflict-close-btn').onclick=()=>ov.classList.remove('open');
      ov.addEventListener('click',e=>{ if(e.target===ov) ov.classList.remove('open'); });
    }
    const issues=detectConflicts();
    const mismatches=issues.filter(x=>x.startsWith('🔀'));
    const structural=issues.filter(x=>!x.startsWith('🔀'));

    let html='';
    if(!issues.length){
      html='<div style="color:var(--green);padding:8px 0">✓ No conflicts found.</div>';
    } else {
      if(structural.length){
        html+=`<div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:var(--text2);text-transform:uppercase;margin-bottom:4px">Structural</div>`;
        html+='<ul style="padding-left:18px;margin-bottom:12px">'+structural.map(x=>`<li style="margin:5px 0;color:var(--text)">${x}</li>`).join('')+'</ul>';
      }
      if(mismatches.length){
        html+=`<div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:var(--text2);text-transform:uppercase;margin-bottom:4px">Icon / Name Mismatches</div>`;
        html+='<ul style="padding-left:18px">'+mismatches.map(x=>`<li style="margin:5px 0;color:var(--text)">${x}</li>`).join('')+'</ul>';
      }
    }

    const list=ov.querySelector('#conflict-list');
    list.innerHTML=html;
    const countEl=ov.querySelector('#conflict-count');
    if(countEl) countEl.textContent=issues.length?`(${issues.length} issue${issues.length>1?'s':''} found)`:'';

    // "Fix All" button: applies inferred type to every mismatched node at once
    const fixAllBtn=ov.querySelector('#conflict-fix-all');
    if(fixAllBtn){
      fixAllBtn.style.display=mismatches.length?'':'none';
      fixAllBtn.onclick=()=>{
        let fixed=0;
        Object.values(nodes).forEach(n=>{
          if(n.customIcon) return;
          const raw=(n.name||n.designation||'').trim();
          if(raw.length<4) return;
          const inf=inferTypeAndEchelon(raw);
          if(inf.typeId!==n.typeId){
            const FAMILY2={infantry:['infantry','mech_inf','glider_infantry','bicycle_infantry','machine_gun','mech_inf_tracked_ifv','mech_inf_wheeled_ifv','wheeled_mech_inf','motorised','airborne','air_assault','amphibious','marines','naval_infantry','mountain','arctic','special_ops','special_forces','ranger'],armour:['armour','light_armour','tank_destroyers','armoured_car','armd_recon','armoured_recon','cavalry_recon','recce_motorcycle','wheeled_armoured_recon','half_tracks'],fires:['artillery','field_artillery','heavy_artillery','super_heavy_artillery','railway_artillery','rocket_mortar','anti_aircraft_artillery','coastal_artillery','rockets','mortar','self_propelled_aaa','wheeled_anti_tank','infantry_assault_guns','air_defense_guns','air_defense_missiles','shorad','manpads','sam_long_range','electronic_attack','target_acquisition','counter_battery_radar','loitering_munitions','coastal_defense_missiles'],aviation:['aviation','air_cavalry','attack_helo','attack_recon_helo','utility_helo','transport_helo','fixed_wing','airlift','fighter','bomber','cas','tanker','airborne_c2','uav','recon_uav','strike_uav','istar'],engineer:['engineer','pioneers','bridging','mobility_support','route_clearance','construction_engineers','air_defense_engineers','railway_troops'],support:['log','supply','supply_transport','transport','movement_control','ammunition','fuel','water_supply','pipeline','rations','ordnance','laundry_sanitation','administration_sustainment','postal','replacement','replacement_pool','amphibious_transport','motorised_support','mechanised_support','medical','medevac','field_hospital','hospital','meteorological','signals','signals_intelligence','intel','geospatial_intelligence','surveillance','maintenance','recovery','mp','chem','cbrn','eod','psyops','cimic','decontamination','civil_affairs'],command:['hq','joint_hq','tac_cp','fire_coord'],naval:['naval_surface','submarine','maritime_patrol','riverine','landing_craft','mine_warfare','amphibious_assault_ship'],other:['ew','cyber','recon','space','sigint','port','air_defense','training','garrison','security_force_assistance','information_operations']};
            const tf2={};Object.entries(FAMILY2).forEach(([fm,ids])=>ids.forEach(id=>tf2[id]=fm));
            if(!(tf2[n.typeId]&&tf2[n.typeId]===tf2[inf.typeId])){
              n.typeId=inf.typeId; (window.renderNode||renderNode)(n.id); fixed++;
            }
          }
        });
        if(fixed){drawConnectors();saveState();showToast(`Fixed ${fixed} icon mismatch${fixed>1?'es':''}`);}
        ov.classList.remove('open');
      };
    }
    ov.classList.add('open');
  }

  // Outline import
  // ── Type inference engine ─────────────────────────────────────────
  // Covers every unit type in the UT array.  Rules are checked in
  // priority order so more-specific terms win over generic ones
  // (e.g. "mech inf" → mech_inf before the generic "inf" → infantry).
  // Ordinal/numeric prefixes ("1st", "2nd", "4th", "III", "VII") are
  // stripped so they don't confuse matching.
  const TYPE_RULES = [
    // ── Command ──────────────────────────────────────────────────
    { type:'hq',           rx:/hq|headquarters|head\s*quarter/ },
    { type:'joint_hq',     rx:/joint\s*(hq|headquarters)|jhq/ },
    { type:'tac_cp',       rx:/tac.*cp|cp.*tac|tactical\s*command\s*post|tac cp/ },
    { type:'fire_coord',   rx:/fire\s*coord|fce|fires?\s*coord/ },
    // ── Fires ────────────────────────────────────────────────────
    { type:'railway_artillery', rx:/railway\s*artillery|rail\s*gun/ },
    { type:'super_heavy_artillery', rx:/super[\s-]*heavy\s*artillery|siege\s*artillery/ },
    { type:'heavy_artillery', rx:/heavy\s*artillery|corps\s*artillery|army\s*artillery/ },
    { type:'field_artillery', rx:/field\s*artillery|towed\s*(gun|howitzer|artillery)/ },
    { type:'self_propelled_aaa', rx:/self[\s-]*propelled\s*anti[\s-]*air|self[\s-]*propelled\s*anti[\s-]*aircraft|spaa|spaag|zsu[\s-]?\d*|shilka|gepard/ },
    { type:'sam_long_range', rx:/long[\s-]*range\s*sam|strategic\s*sam|theatre\s*air\s*def/ },
    { type:'shorad',      rx:/shorad|short[\s-]*range\s*air\s*def/ },
    { type:'manpads',     rx:/manpads?|shoulder[\s-]*fired\s*air\s*def/ },
    { type:'anti_aircraft_artillery', rx:/anti[\s-]*aircraft\s*artillery|anti[\s-]*aircraft|aa\s*artillery|flak/ },
    { type:'coastal_artillery', rx:/coastal\s*artillery|coast\s*artillery|shore\s*battery/ },
    { type:'wheeled_anti_tank', rx:/wheeled\s*anti[\s-]*tank|anti[\s-]*tank.*wheeled/ },
    { type:'tank_destroyers', rx:/tank\s*destroyers?|td\b|jagdpanzer|self[\s-]*propelled\s*anti[\s-]*tank/ },
    { type:'infantry_assault_guns', rx:/infantry\s*guns?|assault\s*guns?/ },
    { type:'rocket_mortar', rx:/rocket\s*mortar|nebelwerfer|katyusha/ },
    { type:'rockets',      rx:/rocket|mlrs|himars|multiple\s*launch/ },
    { type:'mortar',       rx:/mortar/ },
    { type:'air_defense',  rx:/air\s*def(en[cs]e)?|ada|sam|shorad|patriot|hawk|manpad/ },
    { type:'artillery',    rx:/artil+ery|arty|ra(?=\s)|field\s*gun|howitzer|sph|gun\s*regiment|fires/ },
    { type:'electronic_attack', rx:/electronic\s*attack|ea\b/ },
    { type:'ew',           rx:/electr\w*\s*war|sigwar|ew(?!s)/ },
    { type:'cyber',        rx:/cyber/ },
    { type:'target_acquisition', rx:/target\s*acquisition|ta\b/ },
    { type:'counter_battery_radar', rx:/counter[\s-]*battery\s*radar|counter[\s-]*fire\s*radar/ },
    { type:'loitering_munitions', rx:/loitering\s*munition|loitering\s*munitions|kamikaze\s*drone/ },
    // ── Aviation ─────────────────────────────────────────────────
    { type:'air_cavalry',  rx:/air\s*cavalry/ },
    { type:'attack_recon_helo', rx:/attack\s*recon\s*helo|armed\s*reconnaissance\s*helicopter/ },
    { type:'attack_helo',  rx:/attack\s*helo|gunship|apache|tiger|ah-/ },
    { type:'utility_helo', rx:/utility\s*helo|utility\s*helicopter/ },
    { type:'transport_helo', rx:/transport\s*helo|transport\s*helicopter|lift\s*helo/ },
    { type:'aviation',     rx:/aviation|helicopter|helo|avn|rotary/ },
    { type:'airlift',      rx:/airlift|transport\s*aircraft|air\s*transport/ },
    { type:'fighter',      rx:/fighter\s*(sqn|squadron|wing)?|interceptor/ },
    { type:'bomber',       rx:/bomber|strike\s*wing/ },
    { type:'cas',          rx:/close\s*air\s*support|\bcas\b/ },
    { type:'tanker',       rx:/air\s*refuelling|air\s*refueling|tanker\s*aircraft/ },
    { type:'airborne_c2',  rx:/airborne\s*c2|aew&c|awacs|airborne\s*warning|battle\s*management/ },
    { type:'fixed_wing',   rx:/fixed.wing|jet|f-\d|tornado|typhoon|strike/ },
    { type:'recon_uav',    rx:/recon\s*(uav|uas)|surveillance\s*(uav|uas)|isr\s*(uav|uas)/ },
    { type:'strike_uav',   rx:/strike\s*(uav|uas)|armed\s*(uav|uas)/ },
    { type:'uav',          rx:/uav|drone|unmanned\s*aerial|rpas/ },
    { type:'istar',        rx:/istar|isrg?|reconnaissance\s*squadron|intel.*surv/ },
    // ── Naval ────────────────────────────────────────────────────
    { type:'submarine',    rx:/submarine|ssn|ssbn/ },
    { type:'maritime_patrol', rx:/maritime\s*patrol|mpa/ },
    { type:'riverine',     rx:/riverine|patrol\s*boat|gunboat/ },
    { type:'landing_craft', rx:/landing\s*craft|landing\s*ship|amphibious\s*craft/ },
    { type:'mine_warfare', rx:/mine\s*warfare|mine\s*countermeasures|mcm\b/ },
    { type:'amphibious_assault_ship', rx:/amphibious\s*assault\s*ship|lhd\b|lha\b|lpd\b/ },
    { type:'naval_surface',rx:/naval|frigate|destroyer|corvette|warship/ },
    // ── Other ────────────────────────────────────────────────────
    { type:'space',        rx:/space|satellite|orbital/ },
    { type:'sigint',       rx:/sigint/ },
    { type:'port',         rx:/port|log(istic)?\s*base|log\s*hub/ },
    { type:'training',     rx:/training\s*unit|training\s*center|school\s*troops/ },
    { type:'garrison',     rx:/garrison/ },
    { type:'security_force_assistance', rx:/security\s*force\s*assistance|\bsfa\b/ },
    { type:'civil_affairs', rx:/civil\s*affairs/ },
    { type:'information_operations', rx:/information\s*operations?|\bio\b/ },
    // ── Combat (specific before generic infantry) ─────────────────
    { type:'special_ops',  rx:/spec(ial)?\s*op|sof|sfg|ranger|green\s*beret|seal|sas|jsoc/ },
    { type:'ranger',       rx:/ranger/ },
    { type:'airborne',     rx:/airborne|para(troop)?|abb|parachute/ },
    { type:'air_assault',  rx:/air\s*assault|aaslt|airmobile/ },
    { type:'glider_infantry', rx:/glider|air[\s-]*landing|airlanding/ },
    { type:'bicycle_infantry', rx:/bicycle\s*inf|cyclist|bicycle\s*troops?/ },
    { type:'machine_gun',  rx:/machine[\s-]*gun|mg\s*(battalion|company|bn|coy)/ },
    { type:'marines',      rx:/marines?\b|marine\s*corps/ },
    { type:'naval_infantry', rx:/naval\s*infantry/ },
    { type:'marine_raiders', rx:/marine\s*raiders?/ },
    { type:'amphibious',   rx:/amphib|rmb?|marine\s*inf|landing\s*force/ },
    { type:'arctic',       rx:/arctic|winter|cold\s*weather|mountain\s*arctic/ },
    { type:'mountain',     rx:/mountain|alpine|highland/ },
    { type:'mech_inf_tracked_ifv', rx:/tracked\s*ifv|ifv.*tracked|mechani[sz](ed|e?d)?\s*inf.*tracked|tracked.*mechani[sz](ed|e?d)?\s*inf/ },
    { type:'mech_inf_wheeled_ifv', rx:/wheeled\s*ifv|ifv.*wheeled|mechani[sz](ed|e?d)?\s*inf.*wheeled\s*ifv|wheeled\s*ifv.*mechani[sz](ed|e?d)?\s*inf/ },
    { type:'wheeled_mech_inf', rx:/wheeled\s*mechani[sz](ed|e?d)?\s*inf|mechani[sz](ed|e?d)?\s*inf.*wheeled|stryker/ },
    { type:'mech_inf',     rx:/mech(anize[d]?|anise[d]?|anised)?\s*inf|mechanize[d]?\s*inf|m(ech)?\s*inf|ifv|bradley|warrior|puma|cv90/ },
    { type:'motorised',    rx:/motori[sz]ed\s*inf|motori[sz]ed|mot\s*inf|wheeled\s*inf/ },
    { type:'cavalry_recon', rx:/cavalry\s*recon|horse\s*recon|mounted\s*recon/ },
    { type:'recon',        rx:/recon|cav(alry)?|scout|household\s*cavalry|light\s*dragoon|hussars?|lancers?/ },
    { type:'armoured_car', rx:/armou?red\s*car/ },
    { type:'recce_motorcycle', rx:/recce\s*motorcycle|motorcycle\s*recon|motorcycle\s*dispatch/ },
    { type:'wheeled_armoured_recon', rx:/wheeled\s*armou?red\s*recon|armou?red\s*recon.*wheeled|wheeled\s*armou?red\s*cav/ },
    { type:'armd_recon',   rx:/armou?red\s*recon|armou?red\s*cav/ },
    { type:'half_tracks',  rx:/half[\s-]*tracks?/ },
    // ── Armour (before generic infantry) ─────────────────────────
    { type:'light_armour',  rx:/light\s*armou?r|light\s*tank|tankette/ },
    { type:'armour',        rx:/armou?r(ed)?|tank\b|tanks\b|cavalry\s*tank|\brtrs?\b|dragoons?\s*(regiment)?|royal\s*tank|hussars?\s*regiment/ },
    // ── Support ──────────────────────────────────────────────────
    { type:'railway_troops', rx:/railway\s*troops|railway\s*engineers?|rail\s*troops/ },
    { type:'construction_engineers', rx:/construction\s*engineers?|works?\s*engineers?/ },
    { type:'mobility_support', rx:/mobility\s*support/ },
    { type:'route_clearance', rx:/route\s*clearance/ },
    { type:'air_defense_engineers', rx:/airfield\s*engineers?|air\s*defen[cs]e\s*engineers?/ },
    { type:'pioneers',     rx:/pioneers?\b|assault\s*pioneers?/ },
    { type:'bridging',     rx:/bridg(e|ing)|assault\s*crossing|close\s*support\s*eng/ },
    { type:'engineer',     rx:/engineer|engr?|sapper|combat\s*support\s*eng|royal\s*eng/ },
    { type:'signals_intelligence', rx:/signals\s*intelligence/ },
    { type:'signals',      rx:/signal|comms?|communication|r\s*?signals|signa?l/ },
    { type:'field_hospital', rx:/field\s*hosp|field\s*hospital|casualty\s*clearing/ },
    { type:'medevac',      rx:/medevac|medical\s*evac/ },
    { type:'medical',      rx:/medical|medic|field\s*hosp|ambulance|casualty|rdmc/ },
    { type:'geospatial_intelligence', rx:/geospatial\s*intelligence|geoint/ },
    { type:'surveillance', rx:/surveillance/ },
    { type:'intel',        rx:/intellig(ence)?|int(?!\s*arty)|mi\s*(battalion|company|corps)/ },
    { type:'ordnance',     rx:/ordnance/ },
    { type:'laundry_sanitation', rx:/laundry|sanitation|bath\b|shower|decontamination\s*(support|services?)?/ },
    { type:'administration_sustainment', rx:/administration\s*(and|&)?\s*sustainment|admin\s*(and|&)?\s*sustainment/ },
    { type:'amphibious_transport', rx:/amphibious\s*transport/ },
    { type:'ammunition',   rx:/ammunition|ammo|ordnance\s*supply|munitions?/ },
    { type:'fuel',         rx:/fuel|petrol|diesel|pol|farp/ },
    { type:'water_supply', rx:/water\s*supply|water\s*point|bulk\s*water/ },
    { type:'pipeline',     rx:/pipeline|bulk\s*fuel\s*distribution/ },
    { type:'rations',      rx:/rations?|food\s*services?|subsistence|field\s*feeding|catering/ },
    { type:'motorised_support', rx:/motori[sz]ed\s*support|motori[sz]ed\s*log|wheeled\s*support/ },
    { type:'mechanised_support', rx:/mechani[sz](ed|e?d)?\s*support|mechani[sz](ed|e?d)?\s*log|tracked\s*support/ },
    { type:'log',          rx:/logistic|supply|sustainment|service\s*support|admin\s*log|cssg|dssg|lsp|movement\s*con/ },
    { type:'postal',       rx:/postal|mail/ },
    { type:'replacement_pool', rx:/replacement\s*pool/ },
    { type:'replacement',  rx:/personnel\s*replacement|replacement\s*(company|battalion|unit)/ },
    { type:'maintenance',  rx:/maintenance|repair|reme/ },
    { type:'recovery',     rx:/recovery/ },
    { type:'meteorological', rx:/meteorolog|weather|met\s*(section|det|team|unit)/ },
    { type:'mp',           rx:/military\s*police|mp(?!s)|rmp|provost/ },
    { type:'decontamination', rx:/decontamination/ },
    { type:'chem',         rx:/cbrn|nbc|chemical|biological|radiological|nuclear\s*def/ },
    { type:'eod',          rx:/eod|explosive\s*ordnance|bomb\s*disposal/ },
    { type:'psyops',       rx:/psyop|psycol?ogical\s*op|information\s*op|info\s*op/ },
    { type:'cimic',        rx:/cimic|civil.military|civil\s*affairs/ },
    // ── Generic infantry last ─────────────────────────────────────
    { type:'infantry',     rx:/infantry|inf|rifles?|fusilier|grenadier|light\s*inf|guards|paras?/ },
  ];

  const ECHELON_RULES = [
    { echelon:'army_group', rx:/army\s*group/ },
    { echelon:'army',       rx:/army(?!\s*group)/ },
    { echelon:'corps',      rx:/corps/ },
    { echelon:'division',   rx:/div(ision)?/ },
    { echelon:'brigade',    rx:/bde|brigade/ },
    { echelon:'regiment',   rx:/regt|regiment/ },
    { echelon:'battalion',  rx:/bn|battalion|battalions/ },
    { echelon:'company',    rx:/coy|company|battery|sqn|squadron(?!.*regiment)/ },
    { echelon:'platoon',    rx:/plt|platoon|troop/ },
    { echelon:'squad',      rx:/squad|section/ },
    { echelon:'team',       rx:/team/ },
  ];

  // Strip leading ordinals / numbers so "4th Armoured Brigade" → "armoured brigade"
  function _stripOrdinal(s){
    return s.replace(/^\s*(\d+\s*(?:st|nd|rd|th)?|[ivxlcdm]+\s*)\s*/i,'');
  }

  function inferTypeAndEchelon(line){
    const raw = String(line||'').toLowerCase();
    const t = _stripOrdinal(raw);  // strip ordinals for type matching

    let typeId = 'infantry';
    for(const rule of TYPE_RULES){
      if(rule.rx.test(t) || rule.rx.test(raw)){
        typeId = rule.type;
        break;
      }
    }

    let echelon = 'battalion';
    for(const rule of ECHELON_RULES){
      if(rule.rx.test(raw)){  // echelon: use raw (ordinals don't interfere here)
        echelon = rule.echelon;
        break;
      }
    }

    return {typeId, echelon};
  }
  function inferAffiliation(line){
    const t=String(line||'').toLowerCase();
    if(/\benemy\b|\bhostile\b|\bopfor\b|\badversary\b|\bopposition\b/.test(t)) return 'hostile';
    if(/\bneutral\b|\bpartner\b|\bhost\s*nation\b/.test(t)) return 'neutral';
    if(/\bunknown\b|\bunident/.test(t)) return 'unknown';
    return 'friendly';
  }

  function parseOutline(text){
    const lines=String(text).replace(/\r/g,'').split(/\n/).filter(l=>l.trim());
    const created=[]; const stack=[]; let baseX=120, baseY=120;
    lines.forEach((raw, idx)=>{
      const indent=(raw.match(/^\s*/)[0]||'').replace(/\t/g,'    ').length;
      const level=Math.floor(indent/2);
      const line=raw.trim().replace(/:$/,'');
      while(stack.length>level) stack.pop();
      const info=inferTypeAndEchelon(line);
      const affil=inferAffiliation(line);
      // Use full line as name; strip leading ordinal for a cleaner designation
      const desig=line.replace(/^(\d+\s*(?:st|nd|rd|th)?|[ivxlcdm]+\s*)\s+/i,'').trim()||line;
      const id=createNode({
        name: line,
        designation: desig,
        typeId: info.typeId,
        echelon: info.echelon,
        affil: affil,
        parentId: stack.length? stack[stack.length-1].id : null,
        x: baseX + level*180,
        y: baseY + idx*90
      });
      created.push(id);
      stack[level]={id, level};
    });
    return created;
  }
  function openOutlineModal(){
    let ov=document.getElementById('outline-modal');
    if(!ov){
      ov=document.createElement('div'); ov.className='modal-ov'; ov.id='outline-modal';
      ov.innerHTML=`<div class="modal-box" style="min-width:560px"><h2>Import From Text Outline <span class="modal-x">✕</span></h2><p style="font-size:12px;color:var(--text2);margin-bottom:10px">Use indentation for hierarchy. Example:<br><code>1 DIV<br>&nbsp;&nbsp;1 BDE<br>&nbsp;&nbsp;2 BDE<br>&nbsp;&nbsp;3 ARTY REGT</code></p><textarea id="outline-text"></textarea><div class="modal-acts"><button class="pb" id="outline-cancel" style="width:auto;margin:0">Cancel</button><button class="pb" id="outline-import-btn" style="width:auto;margin:0;border-color:var(--accent);color:var(--accent)">Import</button></div></div>`;
      document.body.appendChild(ov);
      ov.querySelector('.modal-x').onclick=()=>ov.classList.remove('open');
      ov.querySelector('#outline-cancel').onclick=()=>ov.classList.remove('open');
      ov.querySelector('#outline-import-btn').onclick=()=>{
        const txt=ov.querySelector('#outline-text').value;
        if(!txt.trim()) return;
        const ids=parseOutline(txt);
        autoLayout(ids); saveState(); ov.classList.remove('open'); showToast(`Imported ${ids.length} units from outline`);
      };
      ov.addEventListener('click',e=>{ if(e.target===ov) ov.classList.remove('open'); });
    }
    ov.classList.add('open');
  }

  // Guided tour
  let tourIdx=0;
  // Tour steps — each step can have an optional 'setup' callback
  const tourSteps=[
    {el:'#topbar',      title:'Toolbar',    text:'Core actions live here: add units, auto-layout, zoom, export, and templates. Hover any button to see its keyboard shortcut.'},
    {el:'#sidebar',     title:'Unit Palette', text:'Drag any unit type from the palette onto the canvas to place it. Recently used types appear at the top.'},
    {el:'#canvas-wrap', title:'Canvas',     text:'Build your ORBAT here. Drag units to move them, hold Shift+drag to reparent, scroll to zoom, and draw lasso boxes to multi-select.'},
    {el:'#edit-panel',  title:'Edit Panel', text:'Select any unit to edit its name, echelon, status, tags, and more. All changes save automatically.', setup:()=>{
      // Ensure the edit panel is visible for this step
      const ep=document.getElementById('edit-panel');
      if(ep && ep.classList.contains('hid')){
        // Temporarily reveal it for the tour highlight
        ep.classList.remove('hid'); ep.dataset.tourOpened='1';
      }
    }},
    {el:'#statusbar',   title:'Status Bar', text:'Track total unit count, current selection, zoom level, and undo history depth at a glance.'},
    {el:'#btn-link',    title:'Link Mode',  text:'Toggle Link Mode to manually draw command relationships between units. Drag the ⤢ handle on any node to connect it to a parent.'},
    {el:'#btn-snap',    title:'Grid & Snap', text:'Cycle through dot grid, line grid, and no-grid modes. Units snap to the grid when moved.'},
  ];

  function ensureTourEls(){
    if(document.getElementById('tour-ov')) return;
    const ov=document.createElement('div'); ov.id='tour-ov';
    const box=document.createElement('div'); box.id='tour-box';
    box.innerHTML=`<div class="tour-counter" id="tour-counter" style="font-size:9px;color:var(--text2);letter-spacing:1px;margin-bottom:6px;font-family:'Share Tech Mono',monospace"></div><h3 id="tour-h3"></h3><p id="tour-p"></p><div class="acts"><button class="pb" id="tour-skip" style="width:auto;margin:0">✕ End Tour</button><button class="pb" id="tour-next" style="width:auto;margin:0;border-color:var(--accent);color:var(--accent)">Next →</button></div>`;
    document.body.appendChild(ov);
    document.body.appendChild(box);
    ov.addEventListener('click', endTour);
    document.getElementById('tour-skip').onclick=endTour;
    document.getElementById('tour-next').onclick=()=>showTourStep(tourIdx+1);
  }

  function positionTourBox(r){
    const box=document.getElementById('tour-box');
    if(!box) return;
    const BW=330, BH=box.offsetHeight||160, VP_W=window.innerWidth, VP_H=window.innerHeight;
    const PAD=14;
    // Prefer: below target
    let top=r.bottom+PAD, left=r.left;
    if(top+BH > VP_H-PAD){
      // Try above
      top=r.top-BH-PAD;
    }
    if(top < PAD) top=PAD;
    // Clamp horizontal
    left=Math.max(PAD, Math.min(left, VP_W-BW-PAD));
    box.style.left=left+'px'; box.style.top=top+'px'; box.style.width=BW+'px';
  }

  function showTourStep(i){
    ensureTourEls();
    document.querySelectorAll('.tour-hl').forEach(el=>el.classList.remove('tour-hl'));
    // Clean up any panel the tour opened
    document.querySelectorAll('[data-tour-opened]').forEach(el=>{
      el.classList.add('hid'); delete el.dataset.tourOpened;
    });
    if(i<0||i>=tourSteps.length) return endTour();
    tourIdx=i;
    const step=tourSteps[i];
    // Run setup callback if provided (e.g. show hidden panel)
    if(typeof step.setup==='function') step.setup();
    const target=document.querySelector(step.el);
    if(!target||!target.getBoundingClientRect().width) {
      // Skip invisible targets
      return showTourStep(i+1);
    }
    target.classList.add('tour-hl');
    const r=target.getBoundingClientRect();
    const box=document.getElementById('tour-box');
    if(!box) return;
    const counter=document.getElementById('tour-counter');
    const h3=document.getElementById('tour-h3');
    const p=document.getElementById('tour-p');
    const nextBtn=document.getElementById('tour-next');
    if(counter) counter.textContent=`STEP ${i+1} OF ${tourSteps.length}`;
    if(h3) h3.textContent=step.title;
    if(p) p.textContent=step.text;
    const isLast=(i===tourSteps.length-1);
    if(nextBtn){
      nextBtn.textContent=isLast?'✓ Finish':'Next →';
      nextBtn.style.borderColor=isLast?'var(--green)':'var(--accent)';
      nextBtn.style.color=isLast?'var(--green)':'var(--accent)';
    }
    document.getElementById('tour-ov')?.classList.add('open');
    box.classList.add('open');
    // Position after making visible (so offsetHeight is correct)
    requestAnimationFrame(()=>positionTourBox(r));
  }

  function startTour(){
    tourIdx=0;
    // Clean up any leftover state
    document.querySelectorAll('.tour-hl').forEach(el=>el.classList.remove('tour-hl'));
    document.querySelectorAll('[data-tour-opened]').forEach(el=>{
      el.classList.add('hid'); delete el.dataset.tourOpened;
    });
    showTourStep(0);
  }

  function endTour(){
    tourIdx=0;
    document.querySelectorAll('.tour-hl').forEach(el=>el.classList.remove('tour-hl'));
    // Restore any panels the tour opened
    document.querySelectorAll('[data-tour-opened]').forEach(el=>{
      el.classList.add('hid'); delete el.dataset.tourOpened;
    });
    document.getElementById('tour-ov')?.classList.remove('open');
    document.getElementById('tour-box')?.classList.remove('open');
    localStorage.setItem('orbat_tour_done','1');
  }

  window.startTour=startTour;

  // Resize handles
  function addResizeHandle(parent,id,onMove){
    if(document.getElementById(id)) return;
    parent.style.position='relative';
    const h=document.createElement('div'); h.id=id; h.className='resize-handle'; parent.appendChild(h);
    let active=false,startX=0,startW=0;
    h.addEventListener('mousedown',e=>{ active=true; startX=e.clientX; startW=parent.getBoundingClientRect().width; e.preventDefault(); });
    window.addEventListener('mousemove',e=>{ if(!active) return; onMove(startW, e.clientX-startX); });
    window.addEventListener('mouseup',()=>active=false);
  }
  addResizeHandle(sidebar,'sidebar-resize',(startW,dx)=>{ document.documentElement.style.setProperty('--sidebar-w', Math.max(180, Math.min(460, startW+dx))+'px'); });
  addResizeHandle(editPanel,'panel-resize',(startW,dx)=>{ document.documentElement.style.setProperty('--panel-w', Math.max(240, Math.min(520, startW-dx))+'px'); });

  // Trackpad pinch-to-zoom support
  canvasWrap.addEventListener('wheel',function(e){
    // Guard: only handle pinch-to-zoom (ctrlKey) — normal scroll already handled by primary listener
    if(!e.ctrlKey) return;
    e.preventDefault();
    const rect=canvasWrap.getBoundingClientRect();
    const mx=e.clientX-rect.left, my=e.clientY-rect.top;
    const factor=Math.exp(-e.deltaY*0.0025);
    const nz=Math.max(0.15, Math.min(3, zoom*factor));
    panX=mx-(mx-panX)*(nz/zoom); panY=my-(my-panY)*(nz/zoom); zoom=nz; applyTransform(); updSB&&updSB();
  }, {passive:false});

  // Zoom-to-fit explicit plus keep buttons synced
  if(!window.zoomToFitCurrent){ window.zoomToFitCurrent=()=>{ fitScreen(); }; }

  // Derived display refresh wrappers
  function drawRelLabelsExtra(){
    if(!connectorSvg) return;
    connectorSvg.querySelectorAll('.v10-rel-label').forEach(n=>n.remove());
    Object.values(nodes).forEach(n=>{
      if(!n.parentId || !n.relLabel || !nodes[n.parentId]) return;
      const p=nodes[n.parentId]; const pe=document.getElementById('el-'+p.id), ce=document.getElementById('el-'+n.id); if(!pe||!ce) return;
      const x1=p.x+pe.offsetWidth/2, y1=p.y+pe.offsetHeight/2, x2=n.x+ce.offsetWidth/2, y2=n.y+ce.offsetHeight/2;
      const t=document.createElementNS(NS,'text'); t.setAttribute('class','conn-label v10-rel-label'); t.setAttribute('x', ((x1+x2)/2).toFixed(1)); t.setAttribute('y', ((y1+y2)/2 - 4).toFixed(1)); t.setAttribute('text-anchor','middle'); t.textContent=n.relLabel; connectorSvg.appendChild(t);
    });
  }
  function refreshStrengthAgg(){
    Object.values(nodes).forEach(n=>n._aggStrength=sumSubtree(n.id));
    Object.values(nodes).forEach(n=>{
      const el=document.getElementById('el-'+n.id); if(!el) return;
      let lbl=el.querySelector('.node-agg-lbl');
      if(!lbl){ lbl=document.createElement('div'); lbl.className='node-strength-lbl node-agg-lbl'; el.querySelector('.node-card')?.appendChild(lbl); }
      lbl.textContent=n._aggStrength>parseStrengthVal(n.strength)?`Σ ${n._aggStrength}`:'';
      let badge=el.querySelector('.stack-badge');
      if(n._stackCount>1 && n._stackLead){ if(!badge){ badge=document.createElement('div'); badge.className='stack-badge'; el.querySelector('.node-card')?.appendChild(badge);} badge.textContent='×'+n._stackCount; }
      else if(badge) badge.remove();
      if(n.tags && n.tags.length){
        let box=el.querySelector('.node-tags'); if(!box){ box=document.createElement('div'); box.className='node-tags'; el.querySelector('.node-card')?.appendChild(box); }
        box.innerHTML=n.tags.slice(0,4).map(tag=>`<span class="node-tag-chip" style="background:${tagColor(tag)}">${tag}</span>`).join('');
      }
    });
  }
  function tagColor(tag){ const colors=['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4']; let h=0; for(let i=0;i<tag.length;i++) h=(h+tag.charCodeAt(i))%colors.length; return colors[h]; }
  function refreshDerivedDisplays(){ refreshStrengthAgg(); refreshSubtreeStats(); drawRelLabelsExtra(); }

  // Debounced strength aggregation — prevents O(n²) recalculation on every renderNode call.
  // A single render batches all DOM updates; the agg runs once after the batch settles.
  let _strengthAggTimer=null;
  function scheduleStrengthAgg(){ clearTimeout(_strengthAggTimer); _strengthAggTimer=setTimeout(refreshStrengthAgg, 60); }

  const _populate=window.populateEditPanel||populateEditPanel;
  window.populateEditPanel=populateEditPanel=function(id){ const r=_populate.apply(this,arguments); ensurePanelExtras(); if(id&&nodes[id]){ const rl=document.getElementById('ep-rel-label'); if(rl) rl.value=nodes[id].relLabel||''; const tg=document.getElementById('ep-tags'); if(tg) tg.value=(nodes[id].tags||[]).join(', ');} refreshSubtreeStats(); return r; };
  const _renderNode=window.renderNode||renderNode;
  window.renderNode=renderNode=function(id){ const r=_renderNode.apply(this,arguments); scheduleStrengthAgg(); return r; };
  const _draw=window.drawConnectors||drawConnectors;
  window.drawConnectors=drawConnectors=function(){ const r=_draw.apply(this,arguments); drawRelLabelsExtra(); return r; };
  const _updSel=window.updSelUI||updSelUI;
  window.updSelUI=updSelUI=function(){ const r=_updSel.apply(this,arguments); refreshSubtreeStats(); return r; };

  // Focus dimming stronger for subtree relations
  function refreshFocusDimmingV2(){
    const focusIds=new Set();
    if(selectedId && nodes[selectedId]){
      focusIds.add(selectedId);
      let cur=nodes[selectedId]; while(cur&&cur.parentId){ focusIds.add(cur.parentId); cur=nodes[cur.parentId]; }
      (function walk(id){ Object.values(nodes).forEach(n=>{ if(n.parentId===id){ focusIds.add(n.id); walk(n.id); } }); })(selectedId);
    }
    Object.values(nodes).forEach(n=>{ const el=document.getElementById('el-'+n.id); if(el) el.style.opacity=(selectedId && !focusIds.has(n.id))?'0.28':(n.faded?'0.42':'1'); });
  }
  window.updateFocusDimming=refreshFocusDimmingV2;

  // Override applyEP to capture labels/tags
  const _applyEP=window.applyEP||applyEP;
  window.applyEP=applyEP=function(){
    if(selectedId&&nodes[selectedId]){
      const rl=document.getElementById('ep-rel-label'); if(rl) nodes[selectedId].relLabel=rl.value||'';
      const tg=document.getElementById('ep-tags'); if(tg) nodes[selectedId].tags=String(tg.value||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,12);
    }
    const r=_applyEP.apply(this,arguments); refreshDerivedDisplays(); return r;
  };

  // Clipboard paste variants
  const _paste=window.pasteNodes||pasteNodes;
  window.pasteNodes=pasteNodes=function(mode){ return _paste.apply(this, arguments); };
  window.addEventListener('keydown',e=>{ if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='v'&&e.shiftKey){ if(window.pasteNodesAtCursor){ e.preventDefault(); window.pasteNodesAtCursor(true); } } });
  if(!window.pasteNodesAtCursor){
    window.pasteNodesAtCursor=function(offset){
      if(!clipboard||!clipboard.length) return;
      const pt={x:(canvasWrap.clientWidth/2-panX)/zoom,y:(canvasWrap.clientHeight/2-panY)/zoom};
      const ids=[]; const map={};
      clipboard.forEach((c,i)=>{ const id='n'+(nodeIdC++); map[c.id]=id; nodes[id]=normalizeNode(id,{...c,parentId:c.parentId&&map[c.parentId]?map[c.parentId]:null,x:snapV((offset?c.x+24:pt.x+i*18)),y:snapV((offset?c.y+24:pt.y+i*18))}); ids.push(id); renderNode(id); });
      drawConnectors(); saveState(); showToast(offset?'Pasted offset':'Pasted in place');
    }
  }

  // Minimap hover preview enhancement if not present
  const minimap=document.getElementById('minimap');
  const preview=document.createElement('div'); preview.id='minimap-preview-v10'; preview.style.cssText='position:absolute;display:none;padding:4px 8px;border:1px solid var(--border);border-radius:4px;background:var(--surface2);font-size:10px;z-index:95;pointer-events:none'; canvasWrap.appendChild(preview);
  minimap?.addEventListener('mousemove',function(e){ const rect=minimap.getBoundingClientRect(); const lx=e.clientX-rect.left, ly=e.clientY-rect.top; const els=Object.values(nodes).map(n=>({n,el:document.getElementById('el-'+n.id)})).filter(x=>x.el); if(!els.length) return; let mnX=Infinity,mnY=Infinity,mxX=-Infinity,mxY=-Infinity; els.forEach(({n,el})=>{mnX=Math.min(mnX,n.x);mnY=Math.min(mnY,n.y);mxX=Math.max(mxX,n.x+el.offsetWidth);mxY=Math.max(mxY,n.y+el.offsetHeight);}); const sc=Math.min(144/(mxX-mnX+1),86/(mxY-mnY+1),1); let found=null; els.forEach(({n,el})=>{const x=(n.x-mnX)*sc+5,y=(n.y-mnY)*sc+5,w=el.offsetWidth*sc,h=el.offsetHeight*sc;if(lx>=x&&lx<=x+w&&ly>=y&&ly<=y+h) found=n;}); if(found){preview.style.display='block';preview.textContent=(found.designation?found.designation+' — ':'')+(found.name||'Unit'); preview.style.left=(e.clientX-canvasWrap.getBoundingClientRect().left+12)+'px'; preview.style.top=(e.clientY-canvasWrap.getBoundingClientRect().top+12)+'px';} else preview.style.display='none'; });
  minimap?.addEventListener('mouseleave',()=>preview.style.display='none');

  // Onboarding first-run prompt (non-invasive)
  if(!localStorage.getItem('orbat_v10_tour_seen')){ setTimeout(()=>{ showToast('New tools added: Outline import, conflict check, subtree stats, stacking, and tour'); localStorage.setItem('orbat_v10_tour_seen','1'); }, 1200); }

  refreshDerivedDisplays();
})();
