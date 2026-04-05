/* ══════════════════════════════════════
   NATO APP-6C SYMBOL ENGINE
══════════════════════════════════════ */
const AC={
  friendly:{fill:'#c6d7f5',stroke:'#003399'},
  hostile:{fill:'#ffc0cb',stroke:'#aa0000'},
  neutral:{fill:'#aaffaa',stroke:'#006600'},
  unknown:{fill:'#e8d0ff',stroke:'#6600aa'}
};
const EM={team:'·',squad:'··',platoon:'···',company:'|',battalion:'||',regiment:'|||',brigade:'X',division:'XX',corps:'XXX',army:'XXXX',army_group:'XXXXX',region:'XXXXXX'};

const UT=[
  // COMBAT - INFANTRY
  {cat:'Combat',subcat:'Infantry',id:'infantry',label:'Infantry',icon:c=>`<image href="assets/icons/types/infantry/infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'mech_inf',label:'Mechanised Infantry',icon:c=>`<image href="assets/icons/types/infantry/mechanised_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'armoured_inf',label:'Armoured Infantry',icon:c=>`<image href="assets/icons/types/infantry/armoured_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'motorised',label:'Motorised Infantry',icon:c=>`<image href="assets/icons/types/infantry/motorised_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'airborne',label:'Airborne Infantry',icon:c=>`<image href="assets/icons/types/infantry/airborne_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'air_assault',label:'Air Assault Infantry',icon:c=>`<image href="assets/icons/types/infantry/air_assault_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'airmobile_inf',label:'Airmobile Infantry',icon:c=>`<image href="assets/icons/types/infantry/airmobile_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'amphibious',label:'Amphibious Infantry',icon:c=>`<image href="assets/icons/types/infantry/amphibious_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'mountain',label:'Mountain Infantry',icon:c=>`<image href="assets/icons/types/infantry/mountain_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'ranger',label:'Ranger',icon:c=>`<image href="assets/icons/types/infantry/rangers.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'snipers',label:'Snipers',icon:c=>`<image href="assets/icons/types/infantry/snipers.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'special_forces',label:'Special Forces',icon:c=>`<image href="assets/icons/types/special_forces/special_forces.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'light_infantry',label:'Light Infantry',icon:c=>`<image href="assets/icons/types/infantry/light_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  // SPECIAL FORCES
  {cat:'Special Forces',subcat:'Special Forces',id:'aviation_special_forces',label:'Aviation Special Forces',icon:c=>`<image href="assets/icons/types/special_forces/aviation_special_forces.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Special Forces',subcat:'Special Forces',id:'naval_special_forces',label:'Naval Special Forces',icon:c=>`<image href="assets/icons/types/special_forces/naval_special_forces.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Special Forces',subcat:'Special Forces',id:'special_forces_cbrn',label:'Special Forces CBRN',icon:c=>`<image href="assets/icons/types/special_forces/special_forces_cbrn.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Special Forces',subcat:'Special Forces',id:'special_forces_engineers',label:'Special Forces Engineers',icon:c=>`<image href="assets/icons/types/special_forces/special_forces_engineers.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Special Forces',subcat:'Special Forces',id:'special_forces_recon',label:'Special Forces Reconnaissance',icon:c=>`<image href="assets/icons/types/special_forces/special_forces_reconnaissance.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'mounted_infantry',label:'Mounted Infantry',icon:c=>`<image href="assets/icons/types/infantry/mounted_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'arctic_infantry',label:'Arctic Infantry',icon:c=>`<image href="assets/icons/types/infantry/arctic_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Infantry',id:'amphibious_mechanised_infantry',label:'Amphibious Mechanised Infantry',icon:c=>`<image href="assets/icons/types/infantry/amphibious_mechanised_infantry.svg" x="0" y="0" width="50" height="30"/>`},
  // COMBAT - ARMOUR
  {cat:'Combat',subcat:'Armour',id:'armour',label:'Armour',icon:c=>`<image href="assets/icons/types/armour/armour.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Armour',id:'armoured_recon',label:'Armoured Reconnaissance',icon:c=>`<image href="assets/icons/types/armour/armoured_reconnaissance.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Armour',id:'reconnaissance',label:'Reconnaissance',icon:c=>`<image href="assets/icons/types/armour/reconnaissance.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Armour',id:'motorised_recon',label:'Motorised Reconnaissance',icon:c=>`<image href="assets/icons/types/armour/motorised_reconnaissance.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Armour',id:'airborne_recon',label:'Airborne Reconnaissance',icon:c=>`<image href="assets/icons/types/armour/airborne_reconnaissance.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Armour',id:'air_assault_recon',label:'Air Assault Reconnaissance',icon:c=>`<image href="assets/icons/types/armour/air_assault_reconnaissance.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Armour',id:'airmobile_recon',label:'Airmobile Reconnaissance',icon:c=>`<image href="assets/icons/types/armour/airmobile_reconnaissance.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Armour',id:'amphibious_armour',label:'Amphibious Armour',icon:c=>`<image href="assets/icons/types/armour/amphibious_armour.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Combat',subcat:'Armour',id:'amphibious_recon',label:'Amphibious Reconnaissance',icon:c=>`<image href="assets/icons/types/armour/amphibious_reconnaissance.svg" x="0" y="0" width="50" height="30"/>`},
  // FIRES - ARTILLERY
  {cat:'Fires',subcat:'Artillery',id:'artillery',label:'Artillery',icon:c=>`<image href="assets/icons/types/artillery/artillery.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Artillery',id:'mortar',label:'Mortar',icon:c=>`<image href="assets/icons/types/artillery/mortars.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Artillery',id:'rockets',label:'Rocket Artillery',icon:c=>`<image href="assets/icons/types/artillery/rocket_artillery.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Artillery',id:'mechanised_arty',label:'Mechanised Artillery',icon:c=>`<image href="assets/icons/types/artillery/mechanised_artillery.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Artillery',id:'mountain_arty',label:'Mountain Artillery',icon:c=>`<image href="assets/icons/types/artillery/mountain_artillery.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Artillery',id:'armoured_rocket_arty',label:'Armoured Rocket Artillery',icon:c=>`<image href="assets/icons/types/artillery/armoured_rocket_artillery.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Artillery',id:'wheeled_rocket_arty',label:'Wheeled Rocket Artillery',icon:c=>`<image href="assets/icons/types/artillery/wheeled_rocket_artillery.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Artillery',id:'air_assault_mortars',label:'Air Assault Mortars',icon:c=>`<image href="assets/icons/types/artillery/air_assault_mortars.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Artillery',id:'artillery_recon',label:'Artillery Reconnaissance',icon:c=>`<image href="assets/icons/types/artillery/artillery_reconnaissance.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Artillery',id:'ssm',label:'Surface-to-Surface Missiles',icon:c=>`<image href="assets/icons/types/artillery/surface-to-surface_missiles.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Artillery',id:'air_defence_artillery',label:'Air Defence Artillery',icon:c=>`<image href="assets/icons/types/artillery/air_defence_artillery.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Other Fires',id:'air_defense_guns',label:'Air Defence Guns',icon:c=>`<image href="assets/icons/types/artillery/air_defence_guns.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Other Fires',id:'air_defense_missiles',label:'Air Defence Missiles',icon:c=>`<image href="assets/icons/types/artillery/air_defence_missiles.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Other Fires',id:'anti_tank',label:'Anti-Tank',icon:c=>`<image href="assets/icons/types/artillery/anti-tank.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Other Fires',id:'anti_tank_artillery',label:'Anti-Tank Artillery',icon:c=>`<image href="assets/icons/types/artillery/anti-tank_artillery.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Other Fires',id:'anti_tank_missiles',label:'Anti-Tank Missiles',icon:c=>`<image href="assets/icons/types/artillery/anti-tank_missiles.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Other Fires',id:'armoured_anti_tank',label:'Armoured Anti-Tank',icon:c=>`<image href="assets/icons/types/artillery/armoured_anti-tank.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Other Fires',id:'motorised_anti_tank',label:'Motorised Anti-Tank',icon:c=>`<image href="assets/icons/types/artillery/motorised_anti-tank.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Other Fires',id:'ew',label:'Electronic Warfare',icon:c=>`<image href="assets/icons/types/support/electronic_warfare.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Fires',subcat:'Other Fires',id:'cyber',label:'Cyber',icon:c=>`<text x="25" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="${c.stroke}">CY</text>`},
  // SUPPORT - ENGINEERS
  {cat:'Support',subcat:'Engineers',id:'engineer',label:'Combat Engineer',icon:c=>`<image href="assets/icons/types/engineers/engineers.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Engineers',id:'armoured_eng',label:'Armoured Engineer',icon:c=>`<image href="assets/icons/types/engineers/armoured_engineers.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Engineers',id:'airborne_eng',label:'Airborne Engineer',icon:c=>`<image href="assets/icons/types/engineers/airborne_engineers.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Engineers',id:'motorised_eng',label:'Motorised Engineer',icon:c=>`<image href="assets/icons/types/engineers/motorised_engineers.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Engineers',id:'recon_eng',label:'Reconnaissance Engineer',icon:c=>`<image href="assets/icons/types/engineers/reconnaissance_engineers.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Engineers',id:'bridging',label:'Bridging Engineer',icon:c=>`<image href="assets/icons/types/engineers/bridging_engineers.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Engineers',id:'eod',label:'EOD/Ammunition Engineer',icon:c=>`<image href="assets/icons/types/engineers/eod_engineers.svg" x="0" y="0" width="50" height="30"/>`},
  // SUPPORT - OTHER
  {cat:'Support',subcat:'Communications',id:'signals',label:'Signals',icon:c=>`<image href="assets/icons/types/support/signals.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Intelligence',id:'intel',label:'Intelligence',icon:c=>`<text x="25" y="20" text-anchor="middle" font-size="16" font-weight="bold" fill="${c.stroke}">I</text>`},
  {cat:'Support',subcat:'Logistics',id:'supply_transport',label:'Supply & Transport',icon:c=>`<image href="assets/icons/types/service_support/supply_transport.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Logistics',id:'supply',label:'Supply',icon:c=>`<image href="assets/icons/types/service_support/supply.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Logistics',id:'transport',label:'Transport',icon:c=>`<image href="assets/icons/types/service_support/transport.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Medical',id:'medical',label:'Medical',icon:c=>`<image href="assets/icons/types/service_support/medical.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Medical',id:'hospital',label:'Hospital',icon:c=>`<image href="assets/icons/types/service_support/hospital.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Maintenance',id:'maintenance',label:'Maintenance',icon:c=>`<image href="assets/icons/types/service_support/maintenance.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Military Police',id:'mp',label:'Military Police',icon:c=>`<image href="assets/icons/types/support/military_police.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'CBRN',id:'cbrn',label:'CBRN',icon:c=>`<image href="assets/icons/types/support/cbrn.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Combat Support',id:'combat_support',label:'Combat Support',icon:c=>`<image href="assets/icons/types/support/combat_support.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Radar',id:'radar',label:'Radar',icon:c=>`<image href="assets/icons/types/support/radar.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Support',subcat:'Other Support',id:'psyops',label:'PSYOPS',icon:c=>`<text x="25" y="20" text-anchor="middle" font-size="9" font-weight="bold" fill="${c.stroke}">PO</text>`},
  {cat:'Support',subcat:'Other Support',id:'cimic',label:'CIMIC',icon:c=>`<text x="25" y="20" text-anchor="middle" font-size="9" font-weight="bold" fill="${c.stroke}">CI</text>`},
  // AVIATION
  {cat:'Aviation',subcat:'Aviation',id:'aviation',label:'Aviation',icon:c=>`<path d="M5,14 Q15,6 25,14 Q35,22 45,14" fill="none" stroke="${c.stroke}" stroke-width="2.5"/>`},
  {cat:'Aviation',subcat:'Aviation',id:'attack_helo',label:'Attack Helicopter',icon:c=>`<path d="M5,14 Q15,6 25,14 Q35,22 45,14" fill="none" stroke="${c.stroke}" stroke-width="2.5"/><circle cx="25" cy="21" r="4" fill="${c.stroke}"/>`},
  {cat:'Aviation',subcat:'Aviation',id:'fixed_wing',label:'Fixed Wing Aircraft',icon:c=>`<path d="M25,5 L25,23 M10,13 L40,13" stroke="${c.stroke}" stroke-width="2.5"/>`},
  {cat:'Aviation',subcat:'Aviation',id:'uav',label:'Unmanned Aerial Systems',icon:c=>`<image href="assets/icons/types/support/unmanned_aerial_systems.svg" x="0" y="0" width="50" height="30"/>`},
  {cat:'Aviation',subcat:'Aviation',id:'istar',label:'ISR/Surveillance',icon:c=>`<image href="assets/icons/types/support/unmanned_aerial_systems.svg" x="0" y="0" width="50" height="30"/>`},
  // COMMAND
  {cat:'Command',subcat:'Command',id:'hq',label:'Headquarters',icon:c=>`<line x1="5" y1="4" x2="45" y2="24" stroke="${c.stroke}" stroke-width="2"/><line x1="45" y1="4" x2="5" y2="24" stroke="${c.stroke}" stroke-width="2"/><line x1="5" y1="14" x2="45" y2="14" stroke="${c.stroke}" stroke-width="2"/>`},
  {cat:'Command',subcat:'Command',id:'joint_hq',label:'Joint Headquarters',icon:c=>`<text x="25" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="${c.stroke}">J</text><line x1="5" y1="14" x2="45" y2="14" stroke="${c.stroke}" stroke-width="1.5"/>`},
  {cat:'Command',subcat:'Command',id:'tac_cp',label:'Tactical CP',icon:c=>`<text x="25" y="20" text-anchor="middle" font-size="9" font-weight="bold" fill="${c.stroke}">TAC</text>`},
  {cat:'Command',subcat:'Command',id:'fire_coord',label:'Fire Coordination',icon:c=>`<text x="25" y="20" text-anchor="middle" font-size="9" font-weight="bold" fill="${c.stroke}">FC</text>`},
  // NAVAL
  {cat:'Naval',subcat:'Naval',id:'naval_surface',label:'Naval Surface',icon:c=>`<path d="M8,20 L20,8 L32,8 L44,20 Z" fill="none" stroke="${c.stroke}" stroke-width="2"/>`},
  {cat:'Naval',subcat:'Naval',id:'submarine',label:'Submarine',icon:c=>`<path d="M8,14 Q18,6 25,14 Q32,22 42,14" fill="none" stroke="${c.stroke}" stroke-width="2.5"/><line x1="25" y1="8" x2="25" y2="2" stroke="${c.stroke}" stroke-width="1.5"/>`},
  {cat:'Naval',subcat:'Naval',id:'maritime_patrol',label:'Maritime Patrol',icon:c=>`<path d="M25,5 L25,23 M10,13 L40,13" stroke="${c.stroke}" stroke-width="2"/><path d="M8,22 Q16,18 24,22" fill="none" stroke="${c.stroke}" stroke-width="1.5"/>`},
  // OTHER
  {cat:'Other',subcat:'Other',id:'space',label:'Space/Cyber',icon:c=>`<path d="M10,20 L26,5 L42,20" fill="none" stroke="${c.stroke}" stroke-width="2"/>`},
  {cat:'Other',subcat:'Other',id:'sigint',label:'SIGINT',icon:c=>`<text x="25" y="20" text-anchor="middle" font-size="8" font-weight="bold" fill="${c.stroke}">SIGINT</text>`},
  {cat:'Other',subcat:'Other',id:'port',label:'Port / Logistics Base',icon:c=>`<rect x="10" y="8" width="30" height="16" rx="2" fill="none" stroke="${c.stroke}" stroke-width="2"/><line x1="25" y1="8" x2="25" y2="24" stroke="${c.stroke}" stroke-width="1.5"/>`},
];
let customTypes=[];

function getSym(typeId,affil,echelon,planned=false){
  const c=AC[affil]||AC.friendly;const ech=EM[echelon]||'';
  const custom=customTypes.find(u=>u.id===typeId);
  const echSvg=ech?`<text x="26" y="6" text-anchor="middle" font-size="10" font-family="monospace" fill="${c.stroke}">${ech}</text>`:'';
  const dash=planned?'stroke-dasharray="4,2"':'';
  const bg=`<rect x="2" y="2" width="48" height="38" rx="6" ry="6" fill="#ffffffdd" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>`;
  if(custom)return`<svg viewBox="0 0 52 42" xmlns="http://www.w3.org/2000/svg">${bg}${echSvg}<image x="8" y="9" width="36" height="26" href="${custom.dataUrl}" preserveAspectRatio="xMidYMid meet"/></svg>`;
  const def=UT.find(u=>u.id===typeId)||UT[0];const inner=def.icon(c);
  if(affil==='hostile')return`<svg viewBox="0 0 52 42" xmlns="http://www.w3.org/2000/svg">${bg}${echSvg}<polygon points="26,8 51,22 26,36 1,22" fill="${c.fill}" stroke="${c.stroke}" stroke-width="2" ${dash}/><g transform="translate(1,8)">${inner}</g></svg>`;
  if(affil==='neutral'||affil==='unknown')return`<svg viewBox="0 0 52 42" xmlns="http://www.w3.org/2000/svg">${bg}${echSvg}<ellipse cx="26" cy="22" rx="23" ry="13" fill="${c.fill}" stroke="${c.stroke}" stroke-width="2" ${dash}/><g transform="translate(1,8)">${inner}</g></svg>`;
  return`<svg viewBox="0 0 52 42" xmlns="http://www.w3.org/2000/svg">${bg}${echSvg}<g transform="translate(1,8)">${inner}</g></svg>`;
}

/* ══════════════════════════════════════
   STATE & HISTORY
══════════════════════════════════════ */
const APP_SCHEMA_VERSION=2;
let nodes={},selectedId=null,multiSel=new Set(),nodeIdC=1;
let zoom=1,panX=0,panY=0,isPanning=false,panStart={x:0,y:0};
let snapOn=true;const SNAP=24;
let history=[],histIdx=-1;
let linkMode=false,linkSrc=null;
let ctxTarget=null,ciDataUrl=null;
let clipboard=[];
let showRelLabels=true;
let useSymbolPackImages=true;

function snapV(v){return snapOn?Math.round(v/SNAP)*SNAP:v}
function escXml(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
function getChildren(id,pool=null){const vals=pool?Object.values(pool):Object.values(nodes);return vals.filter(n=>n.parentId===id)}
function countSubtree(id,pool=null){let total=1;getChildren(id,pool).forEach(ch=>total+=countSubtree(ch.id,pool));return total}
function isDescendant(targetId,ancestorId,pool=null){const source=pool||nodes;let cur=source[targetId];const seen=new Set();while(cur&&cur.parentId&&!seen.has(cur.parentId)){if(cur.parentId===ancestorId)return true;seen.add(cur.parentId);cur=source[cur.parentId];}return false}
function canSetParent(childId,parentId,pool=null){if(!childId)return false;if(parentId==null)return true;const source=pool||nodes;if(!source[childId]||!source[parentId])return false;if(childId===parentId)return false;if(isDescendant(parentId,childId,source))return false;return true}
function getNodeCardSize(n){const el=document.getElementById('el-'+n.id);if(el)return{w:el.offsetWidth||130,h:el.offsetHeight||84};const size=n.size==='compact'?{w:92,h:64}:n.size==='expanded'?{w:156,h:104}:{w:118,h:84};return size}
function normalizeNode(id,raw={}){const fallbackX=200+Object.keys(nodes).length*16,fallbackY=100+Object.keys(nodes).length*12;return{
    id,
    name:raw.name||'New Unit',designation:raw.designation||'',commander:raw.commander||'',
    typeId:raw.typeId||'infantry',echelon:raw.echelon||'battalion',affil:raw.affil||'friendly',
    strength:raw.strength||'',equipment:raw.equipment||'',readiness:raw.readiness||'',
    location:raw.location||'',task:raw.task||'',higherHQ:raw.higherHQ||'',notes:raw.notes||'',
    parentId:raw.parentId||null,x:Number.isFinite(+raw.x)?snapV(+raw.x):snapV(fallbackX),y:Number.isFinite(+raw.y)?snapV(+raw.y):snapV(fallbackY),
    status:raw.status||null,tint:raw.tint||null,size:raw.size||'normal',
    customIcon:raw.customIcon||null,
    showDesig:raw.showDesig!==false,showCmd:raw.showCmd!==false,
    showStr:raw.showStr===true,showTask:raw.showTask===true,showRdy:raw.showRdy===true,
    reltype:raw.reltype||'command',frameStatus:raw.frameStatus||'present',
    mod:raw.mod||'none',collapsed:raw.collapsed===true,locked:raw.locked===true,
    taskOrder:raw.taskOrder??null,adminOrder:raw.adminOrder??null,
    relLabel:raw.relLabel||''
  }}
function serializeDocument(){return{schemaVersion:APP_SCHEMA_VERSION,opName:document.getElementById('op-name-input').value,nodeIdC,nodes,customTypes,showRelLabels,useSymbolPackImages}}
function validateOrbatData(d){
  if(!d||typeof d!=='object')throw new Error('Invalid ORBAT file');
  if(!d.nodes||typeof d.nodes!=='object')throw new Error('Invalid ORBAT file — missing nodes');
  const normalized={};
  Object.entries(d.nodes).forEach(([id,raw])=>{normalized[id]=normalizeNode(id,raw||{});});
  Object.values(normalized).forEach(n=>{if(n.parentId&&!normalized[n.parentId])n.parentId=null;});
  Object.values(normalized).forEach(n=>{if(n.parentId&&!canSetParent(n.id,n.parentId,normalized))n.parentId=null;});
  const maxId=Math.max(0,...Object.keys(normalized).map(id=>parseInt(String(id).replace(/^n/,''),10)).filter(Number.isFinite));
  return{
    schemaVersion:d.schemaVersion||1,
    opName:d.opName||'OPERATION',
    nodeIdC:Math.max(d.nodeIdC||d.nIdC||1,maxId+1),
    customTypes:Array.isArray(d.customTypes)?d.customTypes:[],
    nodes:normalized
  };
}
function applyDocumentState(doc,{trackHistory=true,preserveView=true}={}){
  const view={zoom,panX,panY};
  clearCanvas();nodes={};selectedId=null;multiSel.clear();
  const valid=validateOrbatData(doc);
  document.getElementById('op-name-input').value=valid.opName;
  nodeIdC=valid.nodeIdC;customTypes=valid.customTypes;nodes=valid.nodes;
  showRelLabels=doc.showRelLabels!==false;
  useSymbolPackImages=doc.useSymbolPackImages!==false;
  syncRelLabelBtn();
  syncIconModeBtn();
  buildPalette();buildTypeSelect();Object.keys(nodes).forEach(id=>renderNode(id));
  drawConnectors();updSB();updEmpty();deselectAll();
  if(preserveView){zoom=view.zoom;panX=view.panX;panY=view.panY;applyTransform();}
  if(trackHistory)saveState();
}

function saveState(){
  const s=JSON.stringify(serializeDocument());
  if(histIdx>=0&&history[histIdx]===s)return;
  history=history.slice(0,histIdx+1);history.push(s);
  if(history.length>120)history.shift();
  histIdx=history.length-1;updSB();scheduleAutosave();
}
function undo(){if(histIdx<=0)return;histIdx--;restoreState(history[histIdx]);flash('UNDO')}
function redo(){if(histIdx>=history.length-1)return;histIdx++;restoreState(history[histIdx]);flash('REDO')}
function restoreState(s){
  try{
    const d=JSON.parse(s);
    applyDocumentState(d,{trackHistory:false,preserveView:true});
  }catch(e){
    console.error('Failed to restore state:', e);
    showToast('Error restoring state');
  }
}
function clearCanvas(){
  Object.keys(nodes).forEach(id=>{const e=document.getElementById('el-'+id);if(e)e.remove()});
  document.getElementById('connector-svg').innerHTML='';
  const hit=document.getElementById('connector-hit-svg'); if(hit) hit.innerHTML='';
}
function flash(txt){
  const el=document.getElementById('undo-flash');el.textContent=txt;el.classList.add('on');
  setTimeout(()=>el.classList.remove('on'),600);updSB();
}

/* AUTOSAVE */
let asTimer=null;
function scheduleAutosave(){
  clearTimeout(asTimer);
  asTimer=setTimeout(()=>{
    try{
      localStorage.setItem('orbat_v3',JSON.stringify({...serializeDocument(),ts:Date.now()}));
      const el=document.getElementById('afsave');
      if(el){el.textContent='✓ SAVED '+new Date().toLocaleTimeString();
      el.classList.add('on');setTimeout(()=>el.classList.remove('on'),1800);}
    }catch(e){}
  },2500);
}
function loadAutosave(){
  try{
    const raw=localStorage.getItem('orbat_v3');if(!raw)return;
    const d=JSON.parse(raw);
    if(!d.nodes||Object.keys(d.nodes).length===0)return;
    const age=Math.round((Date.now()-d.ts)/60000);
    if(!confirm(`Restore autosaved ORBAT? (${age}min ago, ${Object.keys(d.nodes).length} units)`))return;
    applyDocumentState(d,{trackHistory:true,preserveView:false});showToast('Autosave restored');
  }catch(e){}
}
function getRelLabel(reltype){return({support:'SUPPORT',opcon:'OPCON',tacon:'TACON',coord:'COORD'})[reltype]||''}
function syncRelLabelBtn(){
  const btn=document.getElementById('btn-rel-labels');
  if(!btn)return;
  btn.classList.toggle('soft-active',showRelLabels);
}
function toggleRelLabels(){
  showRelLabels=!showRelLabels;
  syncRelLabelBtn();
  drawConnectors();
  saveState();
  showToast(showRelLabels?'Relationship labels ON':'Relationship labels OFF');
}

/* ══════════════════════════════════════
   SWATCHES
══════════════════════════════════════ */
const SWATCHES=['#1a2332','#1a2a1a','#2a1a1a','#2a1a2a','#1a222a','#2a2010','#102a2a','#0f172a','#1e1b2e','#1a1a10'];
function buildSwatches(containerId,cb){
  const row=document.getElementById(containerId);if(!row)return;row.innerHTML='';
  const rst=document.createElement('div');rst.className='sw rst';rst.textContent='✕';rst.title='Default';rst.onclick=()=>cb(null);row.appendChild(rst);
  SWATCHES.forEach(col=>{const s=document.createElement('div');s.className='sw';s.style.background=col;s.onclick=()=>cb(col);row.appendChild(s)});
}

/* ══════════════════════════════════════
   PALETTE
══════════════════════════════════════ */
function buildPalette(){
  const scroll=document.getElementById('sidebar-scroll');scroll.innerHTML='';
  const all=[...UT,...customTypes];
  const cats=[...new Set(all.map(u=>u.cat))];
  cats.forEach(cat=>{
    const sec=document.createElement('div');sec.className='palette-section';
    const title=document.createElement('div');title.className='palette-section-title';
    title.innerHTML=`${cat} <span class="caret">▾</span>`;
    const grid=document.createElement('div');grid.className='palette-grid';
    title.onclick=()=>{title.classList.toggle('collapsed');grid.classList.toggle('hidden')};
    
    // Group by subcategory
    const subcats=[...new Set(all.filter(u=>u.cat===cat).map(u=>u.subcat||u.cat))];
    subcats.forEach(subcat=>{
      const subItems=all.filter(u=>u.cat===cat&&(u.subcat||u.cat)===subcat);
      if(subcats.length>1){
        const subtitle=document.createElement('div');subtitle.className='palette-subcat-title';
        subtitle.textContent=subcat;grid.appendChild(subtitle);
      }
      subItems.forEach(ut=>{
        const item=document.createElement('div');item.className='pal-item';item.draggable=true;item.dataset.typeId=ut.id;
        if(ut.tip)item.setAttribute('data-tip',ut.tip);
        try{
          if(ut.dataUrl){
            const img=document.createElement('img');img.className='pal-custom-icon';img.src=ut.dataUrl;
            img.onerror=()=>{img.style.display='none'};item.appendChild(img);
          } else {
            const fullSym=(window.getSym||getSym)(ut.id,'friendly','battalion');
            item.innerHTML=fullSym;
          }
          const span=document.createElement('span');span.textContent=ut.label;item.appendChild(span);
        }catch(e){
          console.warn(`Failed to render palette item for ${ut.id}:`,e);
          item.innerHTML=`<div style="padding:8px;text-align:center;color:#999"><small>${ut.label}</small></div>`;
        }
        item.addEventListener('dragstart',onPalDrag);grid.appendChild(item);
      });
    });
    sec.appendChild(title);sec.appendChild(grid);scroll.appendChild(sec);
  });
}
function buildTypeSelect(){
  const sel=document.getElementById('ep-type');sel.innerHTML='';
  const all=[...UT,...customTypes];let lastCat='';
  all.forEach(ut=>{
    if(ut.cat!==lastCat){const og=document.createElement('optgroup');og.label=ut.cat;sel.appendChild(og);lastCat=ut.cat}
    const opt=document.createElement('option');opt.value=ut.id;opt.textContent=ut.label;sel.appendChild(opt);
  });
  sel.onchange=applyEP;
}

/* ══════════════════════════════════════
   NODE MANAGEMENT
══════════════════════════════════════ */
function createNode(d={}){
  const id='n'+(nodeIdC++);
  nodes[id]=normalizeNode(id,d);
  if(nodes[id].parentId&&!canSetParent(id,nodes[id].parentId))nodes[id].parentId=null;
  renderNode(id);if(nodes[id].parentId)drawConnectors();updSB();updEmpty();saveState();return id;
}

function renderNode(id){
  const n=nodes[id];const canvas=document.getElementById('canvas');
  let el=document.getElementById('el-'+id);
  if(!el){
    el=document.createElement('div');el.id='el-'+id;canvas.appendChild(el);
    el.addEventListener('mousedown',onNMD);
    el.addEventListener('click',e=>{e.stopPropagation();onNClick(e,id)});
    el.addEventListener('contextmenu',e=>{e.preventDefault();e.stopPropagation();showCtx(e,id)});
    el.addEventListener('mouseenter',()=>highlightChain(id,true));
    el.addEventListener('mouseleave',()=>highlightChain(id,false));
  }
  el.style.left=n.x+'px';el.style.top=n.y+'px';
  const szClass=n.size==='compact'?'sz-compact':n.size==='expanded'?'sz-expanded':'';
  el.className=`orbat-node ${szClass}${n.frameStatus==='planned'?' planned':''}`;
  if(selectedId===id)el.classList.add('selected');
  if(multiSel.has(id))el.classList.add('multi-selected');

  const afC={friendly:'#3b82f6',hostile:'#ef4444',neutral:'#f59e0b',unknown:'#a855f7'};
  const bc=afC[n.affil]||'#3b82f6';const bg=n.tint||'#1a2332';
  const stBadge=n.status?`<div class="node-status-badge ${n.status}" title="${n.status}"></div>`:'';
  const modMap={reinforced:'+',reduced:'−',hq:'⊕'};
  const modBadge=n.mod&&n.mod!=='none'?`<div class="node-mod-badge" title="${n.mod}">${modMap[n.mod]||''}</div>`:'';
  const stackedLead = n._stackCount>1 && n._stackLead;
  const iconInner = n.customIcon ? `<img class="node-custom-img" src="${n.customIcon}">` : (window.getSym||getSym)(n.typeId,n.affil,n.echelon,n.frameStatus==='planned');
  const iconHtml=`<div class="node-symbol${stackedLead?' stacked':''}"><div class="node-symbol-inner">${iconInner}</div></div>`;
  const childCount=Object.values(nodes).filter(c=>c.parentId===id).length;
  const colBtnHtml=childCount>0?`<div class="collapse-btn" onclick="toggleCollapse(event,'${id}')" title="${n.collapsed?'Expand subtree':'Collapse subtree'}">${n.collapsed?'▸':'▾'}</div>`:'';
  const colBadge=n.collapsed&&childCount>0?`<div class="node-collapsed-badge" onclick="toggleCollapse(event,'${id}')">▸ ${childCount} hidden</div>`:'';

  // Rel-type strip colour
  const relC={command:'transparent',support:'#f59e0b',opcon:'#3b82f6',tacon:'#f97316',coord:'#6b7280'};
  const stripCol=relC[n.reltype]||'transparent';
  const relStrip=n.parentId&&n.reltype!=='command'?`<div class="node-reltype-strip" style="background:${stripCol}"></div>`:'';

  el.innerHTML=`<div class="node-card" style="background:${bg};border-color:${bc}">
    ${stBadge}${modBadge}${relStrip}
    ${iconHtml}
    ${n.showDesig&&n.designation?`<div class="node-designation">${n.designation}</div>`:''}
    <div class="node-name">${escXml(n.name)}</div>
    ${n.showCmd&&n.commander?`<div class="node-commander">${escXml(n.commander)}</div>`:''}
    ${n.showStr&&n.strength?`<div class="node-strength-lbl">${escXml(n.strength)}${n.equipment?' · '+escXml(n.equipment):''}</div>`:''}
    ${n.showRdy&&n.readiness?`<div class="node-strength-lbl">Rdy: ${escXml(n.readiness)}%</div>`:''}
    ${n.showTask&&n.task?`<div class="node-task-lbl">${escXml(n.task)}</div>`:''}
    <div class="node-link-btn" onmousedown="startLink(event,'${id}')" title="Drag to set parent">⤢</div>
    <div class="node-add-btn" onclick="addChildNode(event,'${id}')" title="Add subordinate">+</div>
    ${colBtnHtml}
    ${colBadge}
  </div>`;
}

function deleteNode(id){
  if(window.__activeLinkCleanup && (linkSrc===id || !nodes[id])){ try{ window.__activeLinkCleanup(); }catch(_){} }
  Object.values(nodes).filter(n=>n.parentId===id).forEach(n=>deleteNode(n.id));
  const el=document.getElementById('el-'+id);if(el)el.remove();
  delete nodes[id];if(selectedId===id)deselectAll();multiSel.delete(id);
  drawConnectors();updSB();updEmpty();
}

/* COLLAPSE / EXPAND */
function toggleCollapse(e,id){
  e.stopPropagation();
  const n=nodes[id];if(!n)return;
  n.collapsed=!n.collapsed;
  setSubtreeVisible(id,!n.collapsed);
  renderNode(id);drawConnectors();saveState();
}
function setSubtreeVisible(pid,visible){
  Object.values(nodes).filter(n=>n.parentId===pid).forEach(n=>{
    const el=document.getElementById('el-'+n.id);
    if(el)el.style.display=visible?'':'none';
    if(!nodes[n.id].collapsed)setSubtreeVisible(n.id,visible);
  });
}
function setAllCollapsed(collapsed){
  const vals=Object.values(nodes);
  if(!vals.length)return;
  vals.forEach(n=>{n.collapsed=collapsed;renderNode(n.id);});
  const roots=vals.filter(n=>!n.parentId||!nodes[n.parentId]);
  roots.forEach(r=>setSubtreeVisible(r.id,!collapsed));
  drawConnectors();saveState();showToast(collapsed?'All subtrees collapsed':'All subtrees expanded');
}

/* HOVER CHAIN HIGHLIGHT */
function highlightChain(id,on){
  document.querySelectorAll('.chain-hi').forEach(e=>e.classList.remove('chain-hi'));
  if(!on)return;
  let cur=nodes[id];
  while(cur&&cur.parentId&&nodes[cur.parentId]){
    const anc=document.getElementById('el-'+cur.parentId);
    if(anc)anc.classList.add('chain-hi');
    cur=nodes[cur.parentId];
  }
  function hiDesc(pid){Object.values(nodes).filter(n=>n.parentId===pid).forEach(n=>{const e=document.getElementById('el-'+n.id);if(e)e.classList.add('chain-hi');hiDesc(n.id)})}
  hiDesc(id);
}

/* ══════════════════════════════════════
   SELECTION
══════════════════════════════════════ */
function onNClick(e,id){
  if(linkMode)return;
  if(e.shiftKey){
    if(multiSel.has(id))multiSel.delete(id);else multiSel.add(id);
    if(selectedId){multiSel.add(selectedId);selectedId=null;}
    updSelUI();
  }else{multiSel.clear();selectNode(id);}
}
function selectNode(id){
  if(!nodes[id]){console.warn('selectNode: node '+id+' not found');return;}
  document.querySelectorAll('.orbat-node').forEach(e=>e.classList.remove('selected','multi-selected'));
  selectedId=id;multiSel.clear();
  const el=document.getElementById('el-'+id);if(el)el.classList.add('selected');
  populateEditPanel(id);
  document.getElementById('edit-panel').classList.remove('hid');
  document.getElementById('ep-inner').style.display='';document.getElementById('mp-inner').style.display='none';
  document.getElementById('align-bar').style.display='none';
  updSB();
}
function deselectAll(){
  document.querySelectorAll('.orbat-node').forEach(e=>e.classList.remove('selected','multi-selected'));
  selectedId=null;multiSel.clear();
  document.getElementById('edit-panel').classList.add('hid');
  document.getElementById('align-bar').style.display='none';
  updSB();
}
function updSelUI(){
  document.querySelectorAll('.orbat-node').forEach(e=>{
    e.classList.remove('selected','multi-selected');
    const id=e.id.replace('el-','');
    if(multiSel.has(id))e.classList.add('multi-selected');
  });
  if(multiSel.size===0){deselectAll();return;}
  if(multiSel.size===1){selectNode([...multiSel][0]);return;}
  document.getElementById('edit-panel').classList.remove('hid');
  document.getElementById('ep-inner').style.display='none';document.getElementById('mp-inner').style.display='';
  document.getElementById('multi-count').textContent=multiSel.size+' units selected';
  document.getElementById('align-bar').style.display='flex';
  updSB();
}
function selSubtree(root){
  multiSel.add(root);
  Object.values(nodes).filter(n=>n.parentId===root).forEach(n=>selSubtree(n.id));
}

/* ══════════════════════════════════════
   EDIT PANEL
══════════════════════════════════════ */
function populateEditPanel(id){
  const n=nodes[id];
  if(!n){console.warn('populateEditPanel: node '+id+' not found');return;}
  document.getElementById('ep-name').value=n.name;
  document.getElementById('ep-desig').value=n.designation;
  document.getElementById('ep-cmd').value=n.commander;
  document.getElementById('ep-type').value=n.typeId;
  document.getElementById('ep-echelon').value=n.echelon;
  document.getElementById('ep-strength').value=n.strength;
  document.getElementById('ep-equip').value=n.equipment;
  document.getElementById('ep-rdy').value=n.readiness||'';
  document.getElementById('ep-loc').value=n.location;
  document.getElementById('ep-task').value=n.task;
  document.getElementById('ep-hhq').value=n.higherHQ||'';
  document.getElementById('ep-notes').value=n.notes;
  document.getElementById('ep-reltype').value=n.reltype||'command';
  document.getElementById('show-desig').checked=n.showDesig!==false;
  document.getElementById('show-cmd').checked=n.showCmd!==false;
  document.getElementById('show-str').checked=n.showStr===true;
  document.getElementById('show-task').checked=n.showTask===true;
  document.getElementById('show-rdy').checked=n.showRdy===true;
  updAffBtns(n.affil);updStatBtns(n.status);updSzBtns(n.size||'normal');
  updFSBtns(n.frameStatus||'present');updModBtns(n.mod||'none');
  const p=document.getElementById('ep-icon-prev');
  n.customIcon?(p.src=n.customIcon,p.style.display=''):(p.src='',p.style.display='none');
}
function applyEP(){
  if(!selectedId||!nodes[selectedId])return;
  const n=nodes[selectedId];
  n.name=document.getElementById('ep-name').value;
  n.designation=document.getElementById('ep-desig').value;
  n.commander=document.getElementById('ep-cmd').value;
  n.typeId=document.getElementById('ep-type').value;
  n.echelon=document.getElementById('ep-echelon').value;
  n.strength=document.getElementById('ep-strength').value;
  n.equipment=document.getElementById('ep-equip').value;
  n.readiness=document.getElementById('ep-rdy').value;
  n.location=document.getElementById('ep-loc').value;
  n.task=document.getElementById('ep-task').value;
  n.higherHQ=document.getElementById('ep-hhq').value;
  n.notes=document.getElementById('ep-notes').value;
  n.reltype=document.getElementById('ep-reltype').value;
  n.showDesig=document.getElementById('show-desig').checked;
  n.showCmd=document.getElementById('show-cmd').checked;
  n.showStr=document.getElementById('show-str').checked;
  n.showTask=document.getElementById('show-task').checked;
  n.showRdy=document.getElementById('show-rdy').checked;
  renderNode(selectedId);drawConnectors();
}
['ep-name','ep-desig','ep-cmd','ep-strength','ep-equip','ep-rdy','ep-loc','ep-task','ep-hhq','ep-notes'].forEach(id=>{
  const el=document.getElementById(id);if(el)el.addEventListener('input',applyEP);
});
['ep-echelon'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('change',applyEP)});

function setAffil(a){if(!selectedId)return;nodes[selectedId].affil=a;updAffBtns(a);renderNode(selectedId);drawConnectors();saveState()}
function updAffBtns(a){document.querySelectorAll('[data-aff]').forEach(b=>{b.className='aff-btn';if(b.dataset.aff===a)b.classList.add('a-'+a)})}
function setStat(s){if(!selectedId)return;const n=nodes[selectedId];n.status=n.status===s?null:s;updStatBtns(n.status);renderNode(selectedId);saveState()}
function updStatBtns(s){document.querySelectorAll('[data-st]').forEach(b=>{b.className='stat-btn';if(b.dataset.st===s)b.classList.add('s-'+s)})}
function setSize(sz){if(!selectedId)return;nodes[selectedId].size=sz;updSzBtns(sz);renderNode(selectedId);drawConnectors();saveState()}
function updSzBtns(sz){document.querySelectorAll('[data-sz]').forEach(b=>b.classList.toggle('on',b.dataset.sz===sz))}
function setFrameStatus(fs){if(!selectedId)return;nodes[selectedId].frameStatus=fs;updFSBtns(fs);renderNode(selectedId);drawConnectors();saveState()}
function updFSBtns(fs){document.querySelectorAll('[data-fs]').forEach(b=>{b.className='status-btn';if(b.dataset.fs===fs)b.classList.add('s-effective')})}
function setMod(m){if(!selectedId)return;nodes[selectedId].mod=m;updModBtns(m);renderNode(selectedId);saveState()}
function updModBtns(m){document.querySelectorAll('[data-mod]').forEach(b=>{b.className='status-btn';if(b.dataset.mod===m)b.classList.add('s-effective')})}

/* NODE ICON */
function triggerNodeIcon(){document.getElementById('node-icon-input').click()}
document.getElementById('node-icon-input').addEventListener('change',e=>{
  const f=e.target.files[0];if(!f||!selectedId)return;
  const r=new FileReader();r.onload=ev=>{
    nodes[selectedId].customIcon=ev.target.result;
    const p=document.getElementById('ep-icon-prev');p.src=ev.target.result;p.style.display='';
    renderNode(selectedId);drawConnectors();saveState();showToast('Icon applied');
  };r.readAsDataURL(f);e.target.value='';
});
function clearNodeIcon(){if(!selectedId)return;nodes[selectedId].customIcon=null;const p=document.getElementById('ep-icon-prev');p.src='';p.style.display='none';renderNode(selectedId);saveState()}

/* CUSTOM PALETTE ICONS */
document.getElementById('ci-file').addEventListener('change',e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();r.onload=ev=>{ciDataUrl=ev.target.result;document.getElementById('ci-prev').src=ev.target.result;document.getElementById('ci-pw').style.display=''};
  r.readAsDataURL(f);
});
function addCiToPalette(){
  const name=document.getElementById('ci-name').value.trim()||'Custom';
  const cat=document.getElementById('ci-cat').value.trim()||'Custom';
  if(!ciDataUrl){showToast('Please select an image file');return}
  customTypes.push({id:'ci_'+Date.now(),label:name,cat,dataUrl:ciDataUrl});
  buildPalette();buildTypeSelect();closeModal('ci-modal');saveState();showToast('Custom icon added to palette');
}

/* ══════════════════════════════════════
   CONNECTOR DRAWING
══════════════════════════════════════ */
const REL_STYLES={
  command:{color:'inherit',dash:'none',w:1.8},
  support:{color:'inherit',dash:'6,4',w:1.5},
  opcon:{color:'#3b82f6',dash:'3,3',w:1.8},
  tacon:{color:'#f97316',dash:'3,3',w:1.8},
  coord:{color:'#6b7280',dash:'4,2',w:1.2}
};
function getConnPath(x1,y1,x2,y2){
  const style=document.getElementById('conn-style-sel').value;
  const my=y1+(y2-y1)/2;
  if(style==='straight')return`M${x1},${y1} L${x2},${y2}`;
  if(style==='elbow')return`M${x1},${y1} L${x1},${my} L${x2},${my} L${x2},${y2}`;
  if(style==='ortho'){const g=16;return`M${x1},${y1} L${x1},${y1+g} L${x2},${y1+g} L${x2},${y2}`}
  return`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
}
const AFcolors={friendly:'#3b82f6',hostile:'#ef4444',neutral:'#f59e0b',unknown:'#a855f7'};
function drawConnectors(){
  const svg=document.getElementById('connector-svg');svg.innerHTML='';
  Object.values(nodes).forEach(n=>{
    if(!n.parentId||!nodes[n.parentId])return;
    const pEl=document.getElementById('el-'+n.parentId);
    const cEl=document.getElementById('el-'+n.id);
    if(!pEl||!cEl||pEl.style.display==='none'||cEl.style.display==='none')return;
    const parent=nodes[n.parentId];
    const x1=parent.x+pEl.offsetWidth/2,y1=parent.y+pEl.offsetHeight;
    const x2=n.x+cEl.offsetWidth/2,y2=n.y;
    const rel=REL_STYLES[n.reltype]||REL_STYLES.command;
    const color=rel.color==='inherit'?AFcolors[n.affil]||'#3b82f6':rel.color;
    const pathDef=getConnPath(x1,y1,x2,y2);
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',pathDef);
    path.setAttribute('stroke',color);path.setAttribute('stroke-width',rel.w);
    path.setAttribute('fill','none');path.setAttribute('stroke-opacity','1');
    if(rel.dash!=='none')path.setAttribute('stroke-dasharray',rel.dash);
    svg.appendChild(path);

    const label=getRelLabel(n.reltype);
    if(showRelLabels&&label){
      const text=document.createElementNS('http://www.w3.org/2000/svg','text');
      text.setAttribute('class','conn-label');
      text.setAttribute('fill',color);
      let lx=(x1+x2)/2,ly=(y1+y2)/2-8;
      const style=document.getElementById('conn-style-sel').value;
      if(style==='elbow'){ly=y1+(y2-y1)/2-6;}
      else if(style==='straight'){ly=Math.min(y1,y2)-8;}
      else if(style==='bezier'){ly=y1+(y2-y1)*0.45-6;}
      text.setAttribute('x',lx);
      text.setAttribute('y',ly);
      text.setAttribute('text-anchor','middle');
      text.textContent=label;
      svg.appendChild(text);
    }
  });
  updateMinimap();
}


/* ══════════════════════════════════════
   LINK MODE
══════════════════════════════════════ */
function toggleLinkMode(){
  linkMode=!linkMode;document.body.classList.toggle('link-mode',linkMode);
  document.getElementById('btn-link').classList.toggle('active',linkMode);
  showToast(linkMode?'Link mode ON — drag ⤢ from source to target':'Link mode OFF');
}
function startLink(e,id){
  if(!linkMode)return;e.stopPropagation();e.preventDefault();
  if(window.__activeLinkCleanup){ try{ window.__activeLinkCleanup(); }catch(_){} }
  linkSrc=id;
  const svg=document.getElementById('link-svg');svg.style.width='9999px';svg.style.height='9999px';
  const wrap=document.getElementById('canvas-wrap').getBoundingClientRect();
  const srcNodeEl=document.getElementById('el-'+id); if(!srcNodeEl){ linkSrc=null; return; }
  const srcEl=srcNodeEl.getBoundingClientRect();
  const sx=(srcEl.left+srcEl.width/2-wrap.left-panX)/zoom;
  const sy=(srcEl.top+srcEl.height/2-wrap.top-panY)/zoom;
  const line=document.createElementNS('http://www.w3.org/2000/svg','line');
  line.setAttribute('stroke','#22c55e');line.setAttribute('stroke-width','2');line.setAttribute('stroke-dasharray','6,3');
  svg.appendChild(line);
  function cleanup(){
    svg.innerHTML='';svg.style.width='1px';svg.style.height='1px';
    document.querySelectorAll('.link-tgt').forEach(el=>el.classList.remove('link-tgt'));
    document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);
    if(window.__activeLinkCleanup===cleanup) window.__activeLinkCleanup=null;
    linkSrc=null;
  }
  function mv(ev){
    if(!linkSrc || !nodes[linkSrc]){ cleanup(); return; }
    const mx=(ev.clientX-wrap.left-panX)/zoom,my=(ev.clientY-wrap.top-panY)/zoom;
    line.setAttribute('x1',sx);line.setAttribute('y1',sy);line.setAttribute('x2',mx);line.setAttribute('y2',my);
    document.querySelectorAll('.orbat-node').forEach(el=>{
      const r=el.getBoundingClientRect();
      el.classList.toggle('link-tgt',ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom&&el.id!=='el-'+linkSrc);
    });
  }
  function up(ev){
    if(linkSrc && nodes[linkSrc]){
      document.querySelectorAll('.orbat-node').forEach(el=>{
        const r=el.getBoundingClientRect();
        if(ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom){
          const tid=el.id.replace('el-','');
          if(tid!==linkSrc&&nodes[tid]){
            if(!canSetParent(linkSrc,tid)){showToast('Invalid link: would create a cycle');}
            else{ nodes[linkSrc].parentId=tid;drawConnectors();saveState();showToast('Linked!'); }
          }
        }
      });
    }
    cleanup();
  }
  window.__activeLinkCleanup=cleanup;
  document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);
}

/* ══════════════════════════════════════
   NODE DRAGGING (multi + reparent on Shift)
══════════════════════════════════════ */
let dragId=null,dragNS={x:0,y:0},dragMS={x:0,y:0},mDragStarts={},dragMoved=false;
function onNMD(e){
  const targetElement = e.target instanceof Element ? e.target : e.target.parentElement;
  if(targetElement && ['node-add-btn','node-link-btn','collapse-btn','node-collapsed-badge','node-reltype-strip'].some(c=>targetElement.closest(`.${c}`))) return;
  if(e.button!==0)return;e.stopPropagation();
  dragId=e.currentTarget.id.replace('el-','');
  const n=nodes[dragId];dragNS={x:n.x,y:n.y};dragMS={x:e.clientX,y:e.clientY};
  dragMoved=false;
  mDragStarts={};multiSel.forEach(id=>{mDragStarts[id]={x:nodes[id].x,y:nodes[id].y}});
  document.addEventListener('mousemove',onNMM);document.addEventListener('mouseup',onNMU);
}
function onNMM(e){
  if(!dragId)return;
  const dx=(e.clientX-dragMS.x)/zoom,dy=(e.clientY-dragMS.y)/zoom;
  if(multiSel.has(dragId)&&multiSel.size>1){
    multiSel.forEach(id=>{
      const s=mDragStarts[id]||{x:nodes[id].x,y:nodes[id].y};
      nodes[id].x=snapV(s.x+dx);nodes[id].y=snapV(s.y+dy);
      const el=document.getElementById('el-'+id);if(el){el.style.left=nodes[id].x+'px';el.style.top=nodes[id].y+'px';}
    });
  }else{
    nodes[dragId].x=snapV(dragNS.x+dx);nodes[dragId].y=snapV(dragNS.y+dy);
    const el=document.getElementById('el-'+dragId);el.style.left=nodes[dragId].x+'px';el.style.top=nodes[dragId].y+'px';
    if(dx||dy) dragMoved=true;
  }
  // Reparent preview (Shift held)
  if(e.shiftKey){
    document.querySelectorAll('.orbat-node').forEach(el=>{
      const r=el.getBoundingClientRect();
      const over=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom&&el.id!=='el-'+dragId;
      el.classList.toggle('rp-target',over);
    });
  }
  drawConnectors();
}
function onNMU(e){
  if(dragId&&e.shiftKey){
    document.querySelectorAll('.rp-target').forEach(el=>{
      const tid=el.id.replace('el-','');
      if(tid!==dragId&&nodes[tid]){
        if(nodes[dragId]?.locked){ showToast('Node is locked'); }
        else if(!canSetParent(dragId,tid)){showToast('Invalid parent: cycle prevented');}
        else{nodes[dragId].parentId=tid;drawConnectors();showToast('Reparented → '+nodes[tid].name);}
      }
      el.classList.remove('rp-target');
    });
  }
  const _moved=dragMoved; dragId=null; dragMoved=false;
  document.removeEventListener('mousemove',onNMM);document.removeEventListener('mouseup',onNMU);
  if(_moved) saveState(); // skip saveState for plain clicks that didn't move anything
}

/* ══════════════════════════════════════
   LASSO + PAN
══════════════════════════════════════ */
let lassoActive=false,lassoStart={x:0,y:0};
const lassoEl=document.getElementById('lasso');
const canvasWrap=document.getElementById('canvas-wrap');
canvasWrap.addEventListener('mousedown',e=>{
  const isBase=e.target===canvasWrap||e.target===document.getElementById('canvas')||e.target===document.getElementById('connector-svg');
  if(!isBase)return;
  if(linkMode)return;
  if(e.button===0){
    const rect=canvasWrap.getBoundingClientRect();
    lassoStart={x:e.clientX-rect.left,y:e.clientY-rect.top};
    lassoActive=true;lassoEl.style.left=lassoStart.x+'px';lassoEl.style.top=lassoStart.y+'px';
    lassoEl.style.width='0';lassoEl.style.height='0';lassoEl.style.display='block';
    if(!e.shiftKey){multiSel.clear();selectedId=null;deselectAll();}
  }
});
window.addEventListener('mousemove',e=>{
  if(isPanning){panX=e.clientX-panStart.x;panY=e.clientY-panStart.y;applyTransform();}
  if(!lassoActive)return;
  const rect=canvasWrap.getBoundingClientRect();
  const cx=e.clientX-rect.left,cy=e.clientY-rect.top;
  const lx=Math.min(lassoStart.x,cx),ly=Math.min(lassoStart.y,cy),lw=Math.abs(cx-lassoStart.x),lh=Math.abs(cy-lassoStart.y);
  lassoEl.style.left=lx+'px';lassoEl.style.top=ly+'px';lassoEl.style.width=lw+'px';lassoEl.style.height=lh+'px';
  if(lw>5||lh>5){
    const nlx=(lx-panX)/zoom,nly=(ly-panY)/zoom,nlw=lw/zoom,nlh=lh/zoom;
    Object.values(nodes).forEach(n=>{
      const el=document.getElementById('el-'+n.id);if(!el)return;
      const ins=n.x+el.offsetWidth/2>=nlx&&n.x+el.offsetWidth/2<=nlx+nlw&&n.y+el.offsetHeight/2>=nly&&n.y+el.offsetHeight/2<=nly+nlh;
      if(ins)multiSel.add(n.id);else if(!e.shiftKey)multiSel.delete(n.id);
    });
    updSelUI();
  }
});
window.addEventListener('mouseup',()=>{isPanning=false;if(lassoActive){lassoActive=false;lassoEl.style.display='none';}});
canvasWrap.addEventListener('wheel',e=>{
  e.preventDefault();
  const d=e.deltaY>0?.9:1.1;
  const nz=Math.min(4,Math.max(0.1,zoom*d));
  const rect=canvasWrap.getBoundingClientRect();
  const mx=e.clientX-rect.left,my=e.clientY-rect.top;
  panX=mx-(mx-panX)*(nz/zoom);panY=my-(my-panY)*(nz/zoom);zoom=nz;
  applyTransform();
},{passive:false});
function applyTransform(){
  const viewTransform=`translate(${panX}px,${panY}px) scale(${zoom})`;
  document.getElementById('canvas').style.transform=viewTransform;
  document.getElementById('connector-svg').style.transform=viewTransform;
  document.getElementById('sb-zoom').textContent=Math.round(zoom*100)+'%';
  drawConnectors();
}

/* ══════════════════════════════════════
   SNAP / GRID CYCLE
══════════════════════════════════════ */
let gridMode=0;const gridModes=['snap-on','snap-off','snap-none'];const gridLabels=['Dot Grid','Line Grid','No Grid'];
function toggleSnap(){
  gridMode=(gridMode+1)%3;snapOn=gridMode===0;
  canvasWrap.className=gridModes[gridMode];
  document.getElementById('btn-snap').textContent='⌗ '+gridLabels[gridMode];
  showToast('Grid: '+gridLabels[gridMode]);
}
// css for grid modes
const gridStyle=document.createElement('style');
gridStyle.textContent=`
  .snap-on{background-image:radial-gradient(circle,#1e2d3d 1px,transparent 1px);background-size:24px 24px}
  .snap-off{background-image:linear-gradient(rgba(30,45,61,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(30,45,61,.25) 1px,transparent 1px);background-size:24px 24px}
  .snap-none{background-image:none}
`;
document.head.appendChild(gridStyle);

/* ══════════════════════════════════════
   FIT TO SCREEN
══════════════════════════════════════ */
function fitScreen(){
  const all=Object.values(nodes);if(!all.length)return;
  const els=all.map(n=>({n,el:document.getElementById('el-'+n.id)})).filter(x=>x.el&&x.el.style.display!=='none');
  if(!els.length){showToast('No visible units to fit');return;}
  let mnX=Infinity,mnY=Infinity,mxX=-Infinity,mxY=-Infinity;
  els.forEach(({n,el})=>{mnX=Math.min(mnX,n.x);mnY=Math.min(mnY,n.y);mxX=Math.max(mxX,n.x+el.offsetWidth);mxY=Math.max(mxY,n.y+el.offsetHeight)});
  const wrap=canvasWrap.getBoundingClientRect(),pad=60;
  zoom=Math.min((wrap.width-pad*2)/(mxX-mnX||1),(wrap.height-pad*2)/(mxY-mnY||1),2);
  panX=pad-mnX*zoom;panY=pad-mnY*zoom;applyTransform();showToast('Fit to screen');
}

/* ══════════════════════════════════════
   MINIMAP
══════════════════════════════════════ */
let mmVisible=true;
function toggleMinimap(){mmVisible=!mmVisible;document.getElementById('minimap').style.display=mmVisible?'block':'none';if(mmVisible)updateMinimap();}
function updateMinimap(){
  if(!mmVisible)return;
  const canvas=document.getElementById('mm-canvas');const ctx=canvas.getContext('2d');ctx.clearRect(0,0,154,96);
  const all=Object.values(nodes);if(!all.length)return;
  const els=all.map(n=>({n,el:document.getElementById('el-'+n.id)})).filter(x=>x.el&&x.el.style.display!=='none');
  if(!els.length)return;
  let mnX=Infinity,mnY=Infinity,mxX=-Infinity,mxY=-Infinity;
  els.forEach(({n,el})=>{mnX=Math.min(mnX,n.x);mnY=Math.min(mnY,n.y);mxX=Math.max(mxX,n.x+el.offsetWidth);mxY=Math.max(mxY,n.y+el.offsetHeight)});
  const sc=Math.min(144/(mxX-mnX+1),86/(mxY-mnY+1),1);
  const afC={friendly:'#3b82f6',hostile:'#ef4444',neutral:'#f59e0b',unknown:'#a855f7'};
  els.forEach(({n,el})=>{ctx.fillStyle=afC[n.affil]||'#3b82f6';ctx.fillRect((n.x-mnX)*sc+5,(n.y-mnY)*sc+5,el.offsetWidth*sc,el.offsetHeight*sc)});
}

/* ══════════════════════════════════════
   CONTEXT MENU
══════════════════════════════════════ */
function showCtx(e,id){
  ctxTarget=id;if(!multiSel.has(id)&&multiSel.size===0)selectNode(id);
  const m=document.getElementById('ctx-menu');m.style.left=e.clientX+'px';m.style.top=e.clientY+'px';m.style.display='block';
}
function hideCtx(){document.getElementById('ctx-menu').style.display='none';}
function ctxAct(act){
  hideCtx();
  if(act==='add-child'&&ctxTarget)addChildNode({stopPropagation:()=>{}},ctxTarget);
  if(act==='dup')duplicateSelected();
  if(act==='del')deleteSelected();
  if(act==='detach')detachNode();
  if(act==='sel-tree'&&ctxTarget){multiSel.clear();selSubtree(ctxTarget);updSelUI();}
  if(act==='collapse'&&ctxTarget)toggleCollapse({stopPropagation:()=>{}},ctxTarget);
  if(act==='promote')promoteNode();
  if(act==='demote')demoteNode();
  if(act==='copy-subtree')copySubtree();
}
document.addEventListener('click',hideCtx);
document.addEventListener('contextmenu',e=>{if(e.target===canvasWrap||e.target===document.getElementById('canvas'))e.preventDefault()});

/* ══════════════════════════════════════
   PALETTE DRAG/DROP
══════════════════════════════════════ */
let palDragId=null;
function onPalDrag(e){palDragId=e.currentTarget.dataset.typeId;e.dataTransfer.effectAllowed='copy';}
canvasWrap.addEventListener('dragover',e=>e.preventDefault());
canvasWrap.addEventListener('drop',e=>{
  e.preventDefault();if(!palDragId)return;
  const rect=canvasWrap.getBoundingClientRect();
  createNode({typeId:palDragId,x:snapV((e.clientX-rect.left-panX)/zoom),y:snapV((e.clientY-rect.top-panY)/zoom)});
  palDragId=null;
});

/* ══════════════════════════════════════
   AUTO LAYOUT
══════════════════════════════════════ */
function autoLayout(onlyIds=null){
  const mode = window.layoutMode || 'tree';
  if(mode === 'radial') return autoLayoutRadial(onlyIds);
  if(mode === 'force') return autoLayoutForce(onlyIds);
  // default tree
  const HG=26,VG=72,ROOT_PAD=90,COLLAPSED_STACK=18;
  const pool=onlyIds?Object.values(nodes).filter(n=>onlyIds.has(n.id)):Object.values(nodes);
  if(!pool.length)return;
  const poolMap=Object.fromEntries(pool.map(n=>[n.id,n]));
  const roots=pool.filter(n=>!n.parentId||!poolMap[n.parentId]);
  if(!roots.length)return;
  const childMap={};pool.forEach(n=>{(childMap[n.parentId||'root']||(childMap[n.parentId||'root']=[])).push(n)});
  const widths=new Map();
  function hiddenDescCount(id){
    let total=0;
    (childMap[id]||[]).forEach(ch=>{total+=1+hiddenDescCount(ch.id)});
    return total;
  }
  function meas(id){
    if(widths.has(id))return widths.get(id);
    const n=poolMap[id];
    const size=getNodeCardSize(n);
    const visibleKids=(childMap[id]||[]).filter(ch=>!ch.locked);
    let w=size.w;
    if(n.collapsed){
      w=Math.max(size.w, size.w + Math.min(hiddenDescCount(id),6)*COLLAPSED_STACK);
    }else if(visibleKids.length){
      w=Math.max(size.w,visibleKids.reduce((sum,ch)=>sum+meas(ch.id),0)+HG*(visibleKids.length-1));
    }
    widths.set(id,w);
    return w;
  }
  function place(id,left,top){
    const n=poolMap[id];
    const size=getNodeCardSize(n);
    const span=meas(id);
    if(!n.locked){n.x=snapV(left+span/2-size.w/2);n.y=snapV(top);}
    const visibleKids=(childMap[id]||[]).filter(ch=>!ch.locked);
    if(!visibleKids.length||n.collapsed)return;
    let cursor=left;
    const childTop=(n.locked?n.y:top)+size.h+VG;
    visibleKids.forEach(ch=>{const cw=meas(ch.id);place(ch.id,cursor,childTop);cursor+=cw+HG;});
  }
  let ox=60;roots.forEach(r=>{const w=meas(r.id);place(r.id,ox,60);ox+=w+ROOT_PAD;});
  pool.forEach(n=>{const el=document.getElementById('el-'+n.id);if(el){el.style.left=n.x+'px';el.style.top=n.y+'px';}});
  drawConnectors();saveState();showToast(onlyIds?'Selection layout applied':'Layout applied');
}

function autoLayoutRadial(onlyIds=null){
  const pool=onlyIds?Object.values(nodes).filter(n=>onlyIds.has(n.id)):Object.values(nodes);
  if(!pool.length)return;
  const poolMap=Object.fromEntries(pool.map(n=>[n.id,n]));
  const roots=pool.filter(n=>!n.parentId||!poolMap[n.parentId]);
  if(!roots.length)return;
  const centerX = 400, centerY = 300, radius = 200;
  roots.forEach((r, i) => {
    const angle = (i / roots.length) * 2 * Math.PI;
    r.x = snapV(centerX + radius * Math.cos(angle));
    r.y = snapV(centerY + radius * Math.sin(angle));
  });
  // Then layout children as tree
  const childMap={};pool.forEach(n=>{(childMap[n.parentId||'root']||(childMap[n.parentId||'root']=[])).push(n)});
  const widths=new Map();
  function meas(id){
    if(widths.has(id))return widths.get(id);
    const n=poolMap[id];
    const size=getNodeCardSize(n);
    const visibleKids=(childMap[id]||[]).filter(ch=>!ch.locked);
    let w=size.w;
    if(visibleKids.length){
      w=Math.max(size.w,visibleKids.reduce((sum,ch)=>sum+meas(ch.id),0)+26*(visibleKids.length-1));
    }
    widths.set(id,w);
    return w;
  }
  function place(id,left,top){
    const n=poolMap[id];
    const size=getNodeCardSize(n);
    const span=meas(id);
    if(!n.locked){n.x=snapV(left+span/2-size.w/2);n.y=snapV(top);}
    const visibleKids=(childMap[id]||[]).filter(ch=>!ch.locked);
    if(!visibleKids.length||n.collapsed)return;
    let cursor=left;
    const childTop=top+size.h+72;
    visibleKids.forEach(ch=>{const cw=meas(ch.id);place(ch.id,cursor,childTop);cursor+=cw+26;});
  }
  roots.forEach(r=>{place(r.id, r.x - meas(r.id)/2, r.y + 50);});
  pool.forEach(n=>{const el=document.getElementById('el-'+n.id);if(el){el.style.left=n.x+'px';el.style.top=n.y+'px';}});
  drawConnectors();saveState();showToast('Radial layout applied');
}

function autoLayoutForce(onlyIds=null){
  // Simple force-directed for roots only
  const pool=onlyIds?Object.values(nodes).filter(n=>onlyIds.has(n.id)):Object.values(nodes);
  if(!pool.length)return;
  const poolMap=Object.fromEntries(pool.map(n=>[n.id,n]));
  const roots=pool.filter(n=>!n.parentId||!poolMap[n.parentId]);
  if(roots.length < 2) return autoLayout(onlyIds); // fallback to tree
  // Simple repulsion
  const iterations = 50, k = 100;
  roots.forEach(r => { if(!r.x) r.x = Math.random()*800; if(!r.y) r.y = Math.random()*600; });
  for(let it=0; it<iterations; it++){
    roots.forEach(a => {
      let fx=0, fy=0;
      roots.forEach(b => {
        if(a.id === b.id) return;
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const force = k / dist;
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      });
      a.x += fx * 0.1;
      a.y += fy * 0.1;
    });
  }
  roots.forEach(r => { r.x = snapV(r.x); r.y = snapV(r.y); });
  // Then layout children
  const childMap={};pool.forEach(n=>{(childMap[n.parentId||'root']||(childMap[n.parentId||'root']=[])).push(n)});
  roots.forEach(r=>{ 
    const visibleKids=(childMap[r.id]||[]).filter(ch=>!ch.locked);
    if(visibleKids.length){
      visibleKids.forEach((ch, i) => {
        ch.x = snapV(r.x + (i - (visibleKids.length-1)/2) * 150);
        ch.y = snapV(r.y + 100);
      });
    }
  });
  pool.forEach(n=>{const el=document.getElementById('el-'+n.id);if(el){el.style.left=n.x+'px';el.style.top=n.y+'px';}});
  drawConnectors();saveState();showToast('Force layout applied');
}

/* ══════════════════════════════════════
   ALIGN TOOLS
══════════════════════════════════════ */
function alignNodes(dir){
  const ids=[...multiSel];if(ids.length<2)return;
  const pos=ids.map(id=>({id,n:nodes[id],el:document.getElementById('el-'+id)})).filter(x=>x.el);
  if(dir==='left'){const ref=Math.min(...pos.map(p=>p.n.x));pos.forEach(p=>{p.n.x=snapV(ref);document.getElementById('el-'+p.id).style.left=p.n.x+'px';});}
  if(dir==='right'){const ref=Math.max(...pos.map(p=>p.n.x+p.el.offsetWidth));pos.forEach(p=>{p.n.x=snapV(ref-p.el.offsetWidth);document.getElementById('el-'+p.id).style.left=p.n.x+'px';});}
  if(dir==='top'){const ref=Math.min(...pos.map(p=>p.n.y));pos.forEach(p=>{p.n.y=snapV(ref);document.getElementById('el-'+p.id).style.top=p.n.y+'px';});}
  if(dir==='bottom'){const ref=Math.max(...pos.map(p=>p.n.y+p.el.offsetHeight));pos.forEach(p=>{p.n.y=snapV(ref-p.el.offsetHeight);document.getElementById('el-'+p.id).style.top=p.n.y+'px';});}
  if(dir==='hcenter'){const ref=(Math.min(...pos.map(p=>p.n.x))+Math.max(...pos.map(p=>p.n.x+p.el.offsetWidth)))/2;pos.forEach(p=>{p.n.x=snapV(ref-p.el.offsetWidth/2);document.getElementById('el-'+p.id).style.left=p.n.x+'px';});}
  drawConnectors();saveState();showToast('Aligned: '+dir);
}
function distributeH(){
  const ids=[...multiSel];if(ids.length<3)return;
  const pos=ids.map(id=>({id,n:nodes[id],el:document.getElementById('el-'+id)})).filter(x=>x.el).sort((a,b)=>a.n.x-b.n.x);
  const minX=pos[0].n.x,maxX=pos[pos.length-1].n.x,step=(maxX-minX)/(pos.length-1);
  pos.forEach((p,i)=>{p.n.x=snapV(minX+i*step);document.getElementById('el-'+p.id).style.left=p.n.x+'px';});
  drawConnectors();saveState();showToast('Distributed horizontally');
}
function distributeV(){
  const ids=[...multiSel];if(ids.length<3)return;
  const pos=ids.map(id=>({id,n:nodes[id],el:document.getElementById('el-'+id)})).filter(x=>x.el).sort((a,b)=>a.n.y-b.n.y);
  const minY=pos[0].n.y,maxY=pos[pos.length-1].n.y,step=(maxY-minY)/(pos.length-1);
  pos.forEach((p,i)=>{p.n.y=snapV(minY+i*step);document.getElementById('el-'+p.id).style.top=p.n.y+'px';});
  drawConnectors();saveState();showToast('Distributed vertically');
}

/* ══════════════════════════════════════
   COPY / PASTE / SUBTREE
══════════════════════════════════════ */
function buildClipboardFromIds(ids){
  const selectedSet=new Set(ids);
  return ids.map(id=>{
    const cloned=JSON.parse(JSON.stringify(nodes[id]));
    cloned._srcId=id;
    cloned.parentId=selectedSet.has(cloned.parentId)?cloned.parentId:null;
    return cloned;
  });
}
function copySelected(){
  const ids=multiSel.size>0?[...multiSel]:(selectedId?[selectedId]:[]);
  clipboard=buildClipboardFromIds(ids);
  showToast(`${clipboard.length} unit(s) copied`);
}
function pasteNodes(){
  if(!clipboard.length)return;
  const idMap={};
  const created=[];
  clipboard.forEach(n=>{
    const newId=createNode({...n,parentId:null,x:snapV(n.x+40),y:snapV(n.y+40)});
    idMap[n._srcId||n.id]=newId;
    created.push(newId);
  });
  clipboard.forEach(n=>{
    const newId=idMap[n._srcId||n.id];
    const newParent=idMap[n.parentId];
    if(newParent&&canSetParent(newId,newParent)){nodes[newId].parentId=newParent;}
  });
  drawConnectors();
  multiSel=new Set(created);updSelUI();saveState();showToast('Pasted');
}
function copySubtree(){
  const id=selectedId||ctxTarget;if(!id)return;
  const ids=[];
  (function collect(srcId){ids.push(srcId);getChildren(srcId).forEach(ch=>collect(ch.id));})(id);
  clipboard=buildClipboardFromIds(ids);
  pasteNodes();
  showToast('Subtree copied');
}


/* ══════════════════════════════════════
   ADD / DELETE / PROMOTE / DEMOTE
══════════════════════════════════════ */
function addRootUnit(){const id=createNode({x:snapV(200+Math.random()*200),y:80});selectNode(id);}
function addChildNode(e,pId){
  e.stopPropagation();const p=nodes[pId];
  const id=createNode({parentId:pId,x:snapV(p.x+20),y:snapV(p.y+140),affil:p.affil});selectNode(id);
}
function addChildToSelected(){if(!selectedId)return;addChildNode({stopPropagation:()=>{}},selectedId);}

function duplicateSelected(){
  const ids=multiSel.size>1?[...multiSel]:(selectedId?[selectedId]:[]);if(!ids.length)return;
  const newIds=ids.map(id=>createNode({...nodes[id],x:snapV(nodes[id].x+32),y:snapV(nodes[id].y+32),parentId:nodes[id].parentId}));
  if(newIds.length===1)selectNode(newIds[0]);saveState();showToast('Duplicated');
}

function deleteSelected(){
  if(multiSel.size>1){deleteMultiSel();return;}
  if(!selectedId)return;
  const total=countSubtree(selectedId);
  if(!confirm(`Delete ${nodes[selectedId].name} and ${total-1} subordinate unit(s)?`))return;
  deleteNode(selectedId);saveState();
}
function deleteMultiSel(){
  const ids=[...multiSel];if(!ids.length)return;
  const rootIds=ids.filter(id=>!ids.includes(nodes[id]?.parentId));
  const total=rootIds.reduce((sum,id)=>sum+countSubtree(id),0);
  if(!confirm(`Delete ${rootIds.length} selected root item(s), affecting ${total} total unit(s)?`))return;
  rootIds.forEach(id=>deleteNode(id));saveState();
}

function detachNode(){
  const ids=multiSel.size>0?[...multiSel]:(selectedId?[selectedId]:[]);
  ids.forEach(id=>{if(nodes[id])nodes[id].parentId=null;});
  drawConnectors();saveState();showToast('Detached from parent');
}
function unlinkSel(){detachNode();}

function promoteNode(){
  if(!selectedId)return;const n=nodes[selectedId];
  if(!n.parentId||!nodes[n.parentId])return;
  const oldParentId=n.parentId;
  const grandpId=nodes[oldParentId].parentId;
  const movedChildren=getChildren(selectedId);
  movedChildren.forEach(c=>c.parentId=oldParentId);
  n.parentId=grandpId;
  // Re-render all affected nodes: the promoted node AND its children
  // (their reltype strips / connector colours changed parent reference)
  const _rn=window.renderNode||renderNode;
  _rn(selectedId);
  movedChildren.forEach(c=>_rn(c.id));
  drawConnectors();saveState();showToast('Promoted up one level');
}
function demoteNode(){
  if(!selectedId)return;const n=nodes[selectedId];
  const siblings=Object.values(nodes).filter(s=>s.parentId===n.parentId&&s.id!==selectedId&&!isDescendant(s.id,selectedId));
  if(!siblings.length){showToast('No valid sibling to demote under');return;}
  const target=siblings[0];
  if(!canSetParent(selectedId,target.id)){showToast('Cannot demote into descendant');return;}
  n.parentId=target.id;drawConnectors();renderNode(selectedId);saveState();showToast('Demoted under '+nodes[target.id].name);
}

/* ══════════════════════════════════════
   BULK OPS
══════════════════════════════════════ */
function bulkAffil(a){multiSel.forEach(id=>{nodes[id].affil=a;renderNode(id);});drawConnectors();saveState();showToast('Affiliation: '+a);}
function bulkStatus(s){multiSel.forEach(id=>{nodes[id].status=s;renderNode(id);});saveState();showToast('Status set');}
function bulkEchelon(v){if(!v)return;multiSel.forEach(id=>{nodes[id].echelon=v;renderNode(id);});drawConnectors();saveState();document.getElementById('bulk-echelon').value='';}
function bulkFrame(fs){multiSel.forEach(id=>{nodes[id].frameStatus=fs;renderNode(id);});drawConnectors();saveState();showToast('Frame status set');}

/* ══════════════════════════════════════
   SIDEBAR TOGGLE
══════════════════════════════════════ */
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('sb-collapsed');}

/* ══════════════════════════════════════
   TEMPLATES
══════════════════════════════════════ */
const TEMPLATES=[
  {name:'Brigade Combat Team',desc:'HQ + 3 inf bns + arty + engr + log',fn:()=>{
    const hq=createNode({typeId:'hq',name:'1 BCT',designation:'1 BCT',echelon:'brigade',x:340,y:60});
    ['1 BN','2 BN','3 BN'].forEach((nm,i)=>createNode({typeId:'infantry',name:nm,designation:nm,echelon:'battalion',parentId:hq,x:100+i*160,y:220}));
    createNode({typeId:'artillery',name:'1 FA BN',designation:'1 FA',echelon:'battalion',parentId:hq,x:580,y:220});
    createNode({typeId:'engineer',name:'1 EN BN',designation:'1 EN',echelon:'battalion',parentId:hq,x:740,y:220});
    createNode({typeId:'supply',name:'BSB',designation:'BSB',echelon:'battalion',parentId:hq,x:460,y:220});
    autoLayout();
  }},
  {name:'Division',desc:'HQ + 3 brigades + div troops',fn:()=>{
    const hq=createNode({typeId:'hq',name:'1st Division',designation:'1 DIV',echelon:'division',x:400,y:60});
    ['1 BDE','2 BDE','3 BDE'].forEach((nm,i)=>createNode({typeId:'infantry',name:nm,echelon:'brigade',parentId:hq,x:80+i*260,y:220}));
    createNode({typeId:'artillery',name:'DIV ARTY',echelon:'regiment',parentId:hq,x:860,y:220});
    createNode({typeId:'aviation',name:'DIV AVN',echelon:'battalion',parentId:hq,x:1040,y:220});
    autoLayout();
  }},
  {name:'Joint Task Force',desc:'JTF HQ + land / maritime / air',fn:()=>{
    const hq=createNode({typeId:'joint_hq',name:'JTF IRONGATE',designation:'JTF-IG',echelon:'corps',x:380,y:60});
    createNode({typeId:'infantry',name:'Land Component',echelon:'division',parentId:hq,x:100,y:220});
    createNode({typeId:'naval_surface',name:'Maritime Component',echelon:'division',parentId:hq,x:360,y:220});
    createNode({typeId:'fixed_wing',name:'Air Component',echelon:'division',parentId:hq,x:620,y:220});
    createNode({typeId:'supply',name:'Joint Log Cmd',echelon:'brigade',parentId:hq,x:880,y:220,reltype:'support'});
    autoLayout();
  }},
  {name:'Infantry Battalion',desc:'HQ + 4 rifle coys + spt coy',fn:()=>{
    const hq=createNode({typeId:'hq',name:'1 INF BN',designation:'1 INF',echelon:'battalion',x:340,y:60});
    ['A COY','B COY','C COY','D COY'].forEach((nm,i)=>createNode({typeId:'infantry',name:nm,echelon:'company',parentId:hq,x:60+i*160,y:220}));
    createNode({typeId:'supply',name:'SPT COY',echelon:'company',parentId:hq,x:700,y:220});
    autoLayout();
  }},
  {name:'Blue vs Red',desc:'Friendly + hostile forces facing off',fn:()=>{
    const bHQ=createNode({typeId:'hq',name:'BLUFOR HQ',echelon:'division',affil:'friendly',x:200,y:60});
    ['1 BDE','2 BDE'].forEach((nm,i)=>createNode({typeId:'infantry',name:nm,echelon:'brigade',parentId:bHQ,affil:'friendly',x:60+i*200,y:220}));
    const rHQ=createNode({typeId:'hq',name:'OPFOR HQ',echelon:'division',affil:'hostile',x:700,y:60});
    ['1 GD','2 GD'].forEach((nm,i)=>createNode({typeId:'armour',name:nm,echelon:'brigade',parentId:rHQ,affil:'hostile',x:580+i*200,y:220}));
    autoLayout();
  }},
  {name:'Special Operations TG',desc:'SOF HQ + SF, ranger, SOAR, ISR',fn:()=>{
    const hq=createNode({typeId:'hq',name:'TG ALPHA',designation:'TGA',echelon:'regiment',x:340,y:60});
    createNode({typeId:'special_ops',name:'SFG ALPHA',echelon:'company',parentId:hq,x:80,y:220});
    createNode({typeId:'ranger',name:'RANGER PLT',echelon:'platoon',parentId:hq,x:260,y:220});
    createNode({typeId:'attack_helo',name:'SOAR DET',echelon:'company',parentId:hq,x:440,y:220});
    createNode({typeId:'istar',name:'ISR DET',echelon:'platoon',parentId:hq,x:620,y:220,reltype:'support'});
    createNode({typeId:'signals',name:'SIGINT',echelon:'platoon',parentId:hq,x:800,y:220,reltype:'support'});
    autoLayout();
  }},
];

function openTplModal(){
  const grid=document.getElementById('tpl-grid');grid.innerHTML='';
  TEMPLATES.forEach(tpl=>{
    const card=document.createElement('div');card.className='tpl-card';
    card.innerHTML=`<div class="tpl-name">${tpl.name}</div><div class="tpl-desc">${tpl.desc}</div>`;
    card.onclick=()=>{
      if(Object.keys(nodes).length>0&&!confirm('Load template? This clears the current ORBAT.'))return;
      clearAll(true);tpl.fn();closeModal('tpl-modal');
    };
    grid.appendChild(card);
  });
  openModal('tpl-modal');
}

/* ══════════════════════════════════════
   MODALS
══════════════════════════════════════ */
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function openScModal(){openModal('sc-modal');}

/* ══════════════════════════════════════
   SVG EXPORT
══════════════════════════════════════ */
function exportSVG(){
  const allN=Object.values(nodes);if(!allN.length){showToast('Nothing to export');return;}
  const els=allN.map(n=>({n,el:document.getElementById('el-'+n.id)})).filter(x=>x.el&&x.el.style.display!=='none');
  if(!els.length){showToast('No visible units to export');return;}
  let mnX=Infinity,mnY=Infinity,mxX=-Infinity,mxY=-Infinity;
  els.forEach(({n,el})=>{mnX=Math.min(mnX,n.x-16);mnY=Math.min(mnY,n.y-16);mxX=Math.max(mxX,n.x+el.offsetWidth+16);mxY=Math.max(mxY,n.y+el.offsetHeight+16);});
  const w=mxX-mnX,h=mxY-mnY;
  const connSvg=document.getElementById('connector-svg').innerHTML;
  const afC={friendly:'#3b82f6',hostile:'#ef4444',neutral:'#f59e0b',unknown:'#a855f7'};
  let out=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="${mnX} ${mnY} ${w} ${h}" style="background:#0d1117;font-family:Barlow,Arial,sans-serif">`;
  out+=`<rect width="${w}" height="${h}" x="${mnX}" y="${mnY}" fill="#0d1117"/>`;
  out+=`<g>${connSvg}</g>`;
  els.forEach(({n,el})=>{
    const bc=afC[n.affil]||'#3b82f6';const bg=n.tint||'#1a2332';
    const ew=el.offsetWidth,eh=el.offsetHeight;
    const symStr=(window.getSym||getSym)(n.typeId,n.affil,n.echelon,n.frameStatus==='planned').replace(/<svg[^>]*>/,'').replace('</svg>','');
    out+=`<g transform="translate(${n.x},${n.y})">`;
    out+=`<rect width="${ew}" height="${eh}" rx="6" fill="${bg}" stroke="${bc}" stroke-width="1.5"${n.frameStatus==='planned'?' stroke-dasharray="4,2"':''}/>`;
    if(n.status){const statusFill={effective:'#22c55e',degraded:'#f59e0b','not-operational':'#ef4444','unknown-status':'#6b7280'}[n.status]||'#6b7280';out+=`<circle cx="${ew-6}" cy="6" r="5" fill="${statusFill}" stroke="#0d1117" stroke-width="1.5"/>`;}
    if(n.mod&&n.mod!=='none'){const modMap={reinforced:'+',reduced:'−',hq:'⊕'};out+=`<circle cx="8" cy="8" r="7" fill="#0d1117" stroke="#30363d" stroke-width="1"/><text x="8" y="11" text-anchor="middle" font-size="10" fill="#8b949e" font-family="monospace">${modMap[n.mod]||''}</text>`;}
    out+=`<g transform="translate(${(ew-52)/2},2)">${symStr}</g>`;
    let textY=eh-8;
    out+=`<text x="${ew/2}" y="${textY}" text-anchor="middle" font-size="11" fill="#e6edf3" font-weight="600">${escXml(n.name)}</text>`;
    textY-=12;
    if(n.showDesig&&n.designation){out+=`<text x="${ew/2}" y="${textY}" text-anchor="middle" font-size="9" fill="#f59e0b" font-family="monospace">${escXml(n.designation)}</text>`;textY-=10;}
    if(n.showCmd&&n.commander){out+=`<text x="${ew/2}" y="${textY}" text-anchor="middle" font-size="8" fill="#8b949e">${escXml(n.commander)}</text>`;textY-=10;}
    if(n.showStr&&(n.strength||n.equipment)){out+=`<text x="${ew/2}" y="${textY}" text-anchor="middle" font-size="8" fill="#8b949e">${escXml(n.strength+(n.equipment&&n.strength?' · ':'')+(n.equipment||''))}</text>`;textY-=10;}
    if(n.showTask&&n.task){out+=`<text x="${ew/2}" y="${textY}" text-anchor="middle" font-size="8" fill="#f97316" font-weight="700">${escXml(n.task)}</text>`;}
    out+=`</g>`;
  });
  out+=`</svg>`;
  const blob=new Blob([out],{type:'image/svg+xml'});
  const _svgUrl=URL.createObjectURL(blob);const a=document.createElement('a');a.href=_svgUrl;a.download='orbat.svg';a.click();setTimeout(()=>URL.revokeObjectURL(_svgUrl),1000);
  showToast('SVG exported');
}

/* ══════════════════════════════════════
   EXPORT / IMPORT / CLEAR
══════════════════════════════════════ */
function exportJSON(){
  const d=serializeDocument();
  const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});
  const _jsonUrl=URL.createObjectURL(blob);const a=document.createElement('a');a.href=_jsonUrl;a.download='orbat.json';a.click();setTimeout(()=>URL.revokeObjectURL(_jsonUrl),1000);showToast('JSON exported');
}
function importJSON(){document.getElementById('file-input').click();}
document.getElementById('file-input').addEventListener('change',e=>{
  const file=e.target.files[0];if(!file)return;
  const r=new FileReader();r.onload=ev=>{
    try{
      const d=JSON.parse(ev.target.result);
      applyDocumentState(d,{trackHistory:true,preserveView:false});
      showToast(`ORBAT imported successfully${d.schemaVersion?` · schema v${d.schemaVersion}`:''}`);
    }catch(err){showToast('⚠ Import error: '+err.message);}
  };r.readAsText(file);e.target.value='';
});

function exportPNG(){
  showToast('Generating PNG…');if(!Object.keys(nodes).length){showToast('Nothing to export');return;}
  const wrap=document.getElementById('canvas-wrap');
  const canvas=document.getElementById('canvas');
  const connectorSvg=document.getElementById('connector-svg');
  const linkSvg=document.getElementById('link-svg');
  const prev={canvasTransform:canvas.style.transform,connTransform:connectorSvg.style.transform,linkTransform:linkSvg.style.transform,left:canvas.style.left,top:canvas.style.top,connLeft:connectorSvg.style.left,connTop:connectorSvg.style.top};
  const visible=Object.values(nodes).map(n=>({n,el:document.getElementById('el-'+n.id)})).filter(x=>x.el&&x.el.style.display!=='none');
  let mnX=Infinity,mnY=Infinity,mxX=-Infinity,mxY=-Infinity;
  visible.forEach(({n,el})=>{mnX=Math.min(mnX,n.x-24);mnY=Math.min(mnY,n.y-24);mxX=Math.max(mxX,n.x+el.offsetWidth+24);mxY=Math.max(mxY,n.y+el.offsetHeight+24);});
  const width=Math.max(1,mxX-mnX),height=Math.max(1,mxY-mnY);
  canvas.style.transform='translate(0px,0px) scale(1)';
  connectorSvg.style.transform='translate(0px,0px) scale(1)';
  linkSvg.style.transform='translate(0px,0px) scale(1)';
  canvas.style.left=(-mnX)+'px';canvas.style.top=(-mnY)+'px';
  connectorSvg.style.left=(-mnX)+'px';connectorSvg.style.top=(-mnY)+'px';
  const restoreExportState=()=>{
    Object.assign(canvas.style,{transform:prev.canvasTransform,left:prev.left,top:prev.top});
    Object.assign(connectorSvg.style,{transform:prev.connTransform,left:prev.connLeft,top:prev.connTop});
    Object.assign(linkSvg.style,{transform:prev.linkTransform});
  };
  try{
    Promise.resolve(html2canvas(wrap,{backgroundColor:'#0d1117',scale:2,useCORS:true,logging:false,width, height, x:0, y:0, scrollX:0, scrollY:0})).then(c=>{
      restoreExportState();
      const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='orbat.png';a.click();showToast('PNG saved');
    }).catch(()=>{
      restoreExportState();
      showToast('PNG export failed');
    });
  }catch(_){
    restoreExportState();
    showToast('PNG export failed');
  }
}
function clearAll(silent=false){
  if(!silent&&Object.keys(nodes).length>0&&!confirm('Clear entire ORBAT?'))return;
  clearCanvas();nodes={};nodeIdC=1;deselectAll();updSB();updEmpty();saveState();
}

/* ══════════════════════════════════════
   HELPERS & STATUS BAR
══════════════════════════════════════ */
function updSB(){
  document.getElementById('sb-units').textContent=Object.keys(nodes).length;
  const selN=multiSel.size>0?multiSel.size:(selectedId?1:0);
  document.getElementById('sb-sel').textContent=selN>1?selN+' units':(selectedId?nodes[selectedId]?.name||'—':'—');
  document.getElementById('sb-hist').textContent=histIdx+'/'+(history.length-1);
}
function updEmpty(){document.getElementById('empty-hint').style.display=Object.keys(nodes).length===0?'block':'none';}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}

/* ══════════════════════════════════════
   KEYBOARD SHORTCUTS
══════════════════════════════════════ */
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;
  if(e.key==='Delete'||e.key==='Backspace'){if(multiSel.size>1)deleteMultiSel();else if(selectedId)deleteSelected();}
  if(e.key==='Escape'){deselectAll();if(linkMode)toggleLinkMode();}
  if(e.key==='l'||e.key==='L')autoLayout();
  if(e.key==='f'||e.key==='F')fitScreen();
  if(e.key==='g'||e.key==='G')toggleSnap();
  if(e.key==='m'||e.key==='M')toggleMinimap();
  if(e.key==='/' ){e.preventDefault();document.getElementById('unit-search-input')?.focus();}
  if(e.shiftKey&&(e.key==='+'||e.key==='=')){setAllCollapsed(false);}
  if(e.shiftKey&&e.key==='_'){setAllCollapsed(true);}
  if(e.ctrlKey&&e.key==='z'){e.preventDefault();undo();}
  if(e.ctrlKey&&(e.key==='y'||e.key==='Z')){e.preventDefault();redo();}
  if(e.ctrlKey&&e.key==='d'){e.preventDefault();duplicateSelected();}
  if(e.ctrlKey&&e.key==='c'){e.preventDefault();copySelected();}
  if(e.ctrlKey&&e.key==='v'){e.preventDefault();pasteNodes();}
  if(e.ctrlKey&&e.key==='a'){e.preventDefault();multiSel=new Set(Object.keys(nodes));updSelUI();}
});

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
buildPalette();
buildTypeSelect();
buildSwatches('ep-swatches',col=>{if(!selectedId)return;nodes[selectedId].tint=col;renderNode(selectedId);saveState();});
buildSwatches('mp-swatches',col=>{multiSel.forEach(id=>{nodes[id].tint=col;renderNode(id);});saveState();});
updEmpty();updSB();syncRelLabelBtn();
// Init grid
canvasWrap.className='snap-on';document.getElementById('btn-snap').textContent='⌗ Dot Grid';

document.getElementById('minimap').style.display='block';
updateMinimap();

// Restore autosave or seed starter
setTimeout(()=>{
  loadAutosave();
  if(Object.keys(nodes).length===0){
    createNode({typeId:'hq',name:'1st Division',designation:'1 DIV',echelon:'division',x:snapV(300),y:snapV(72)});
  }
},150);

