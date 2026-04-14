(function () {
  function topbarHtml() {
    return `
<div id="topbar">
  <div class="tb-group tb-group-brand">
    <button class="tb-btn" id="btn-sb" onclick="toggleSidebar()">&#9776;</button>
    <div class="logo"><span class="logo-mark">&#9672;</span><span class="logo-word">ORBATer</span></div>
  </div>
  <div class="tb-meta">
    <div class="tb-kicker">Operational diagram</div>
    <input id="op-name-input" value="OPERATION IRONGATE" title="Click to rename">
  </div>
  <div class="tb-sep"></div>
  <div class="tb-group">
    <button class="tb-btn accent" onclick="addRootUnit()">Add Root</button>
    <button class="tb-btn accent" id="btn-auto-layout" onclick="autoLayout()">Layout</button>
    <select id="layout-mode-sel" onchange="setLayoutMode(this.value)" title="Layout mode">
      <option value="tree">Tree</option>
      <option value="indented">Indented List</option>
      <option value="radial">Radial</option>
      <option value="force">Force</option>
    </select>
    <button class="tb-btn" id="btn-snap" onclick="toggleSnap()">Grid</button>
    <button class="tb-btn" id="btn-link" onclick="toggleLinkMode()">Link</button>
    <button class="tb-btn" id="btn-hostile-root" onclick="centerOnHostileRoot()">Hostile</button>
    <button class="tb-btn" id="btn-neutral-root" onclick="centerOnNeutralRoot()">Neutral</button>
    <button class="tb-btn" onclick="fitScreen()">Fit</button>
  </div>
  <div class="tb-sep"></div>
  <div class="tb-group">
    <button class="tb-btn" onclick="undo()" title="Ctrl+Z">Undo</button>
    <button class="tb-btn" onclick="redo()" title="Ctrl+Y">Redo</button>
    <button class="tb-btn" onclick="copySelected()" title="Ctrl+C - copy node(s)">Copy</button>
    <button class="tb-btn" onclick="pasteNodes()" title="Ctrl+V - paste">Paste</button>
  </div>
  <div class="tb-sep"></div>
  <div class="tb-group">
    <select id="conn-style-sel" onchange="drawConnectors()" title="Connector style">
      <option value="bezier">Bezier</option>
      <option value="elbow" selected="selected">Elbow</option>
      <option value="straight">Straight</option>
    </select>
    <button class="tb-btn" id="btn-rel-labels" onclick="toggleRelLabels()">Rel Labels</button>
    <button class="tb-btn" id="btn-smart-labels">Smart Labels</button>
    <button class="tb-btn" id="btn-focus" onclick="focusSelection()">Focus</button>
    <button class="tb-btn" id="btn-tag-highlight" onclick="toggleTagHighlight()">Tags</button>
    <input id="unit-search-input" placeholder="Search /" title="Search units">
    <input id="tag-filter-input" placeholder="Tag filter" title="Filter by tag">
  </div>
  <div class="tb-sep"></div>
  <div class="tb-group">
    <button class="tb-btn" onclick="exportJSON()">Export JSON</button>
    <button class="tb-btn" onclick="importJSON()">Import</button>
    <button class="tb-btn" onclick="exportSVG()">Export SVG</button>
    <button class="tb-btn" onclick="exportPNG()">Export PNG</button>
    <button class="tb-btn" onclick="window.print()">Print</button>
  </div>
  <div class="tb-sep"></div>
  <div class="tb-group">
    <button class="tb-btn" id="btn-random-orbat">Random</button>
    <button class="tb-btn accent" onclick="openTplModal()">Templates</button>
    <button class="tb-btn" id="btn-guide">Guide</button>
    <button class="tb-btn" onclick="openScModal()">Shortcuts</button>
  </div>
  <div class="tb-spacer"></div>
  <button class="tb-btn danger" onclick="clearAll()">Clear</button>
</div>
<div id="tab-bar"></div>`;
  }

  function workspaceHtml() {
    return `
<div id="main">
  <div id="sidebar">
    <div id="sidebar-header">
      <div class="sidebar-heading">
        <span>Unit palette</span>
        <small>Drag symbols into the workspace to shape the structure.</small>
      </div>
      <button class="tb-btn" style="padding:2px 7px;font-size:9px" onclick="openModal('ci-modal')">Add Custom</button>
    </div>
    <div id="sidebar-scroll"></div>
  </div>
  <div id="canvas-wrap" class="snap-on">
    <svg id="connector-svg"></svg>
    <svg id="link-svg"></svg>
    <div id="canvas">
      <div id="empty-hint" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none">
        <div class="eh-hero">+</div>
        <div class="eh-title">Shape the first formation</div>
        <p class="eh-copy">Drag a unit from the palette, use <b>Add Root</b>, or double-click the canvas to establish the opening headquarters and build downward from there.</p>
        <div class="eh-kbd-row">
          <span><kbd>/</kbd> Search</span>
          <span><kbd>L</kbd> Layout</span>
          <span><kbd>Ctrl</kbd> + <kbd>K</kbd> Commands</span>
        </div>
      </div>
    </div>
    <div id="lasso"></div>
    <div id="drag-preview-ghost" style="display:none"></div>
    <button class="tb-btn" id="mm-toggle" style="font-size:9px;padding:3px 8px" onclick="toggleMinimap()">Map</button>
    <div id="minimap">
      <canvas id="mm-canvas" width="158" height="98"></canvas>
      <div class="mm-label">OVERVIEW</div>
    </div>
    <div id="undo-flash">UNDO</div>
    <div id="afsave">&#10003; SAVED</div>
    <div id="readonly-banner" style="display:none"></div>
    <div id="align-bar">
      <span style="font-family:var(--font-display);font-size:9px;color:var(--text2);letter-spacing:1px">ALIGN:</span>
      <button class="tb-btn" onclick="alignNodes('left')" title="Align left edges">L</button>
      <button class="tb-btn" onclick="alignNodes('right')" title="Align right edges">R</button>
      <button class="tb-btn" onclick="alignNodes('top')" title="Align tops">T</button>
      <button class="tb-btn" onclick="alignNodes('bottom')" title="Align bottoms">B</button>
      <button class="tb-btn" onclick="alignNodes('hcenter')" title="Center horizontally">HC</button>
      <button class="tb-btn" onclick="distributeH()" title="Distribute evenly (horizontal)">DH</button>
      <button class="tb-btn" onclick="distributeV()" title="Distribute evenly (vertical)">DV</button>
    </div>
  </div>
  <div id="edit-panel" class="hid">
    <div id="ep-inner">
      <h3>UNIT PROPERTIES <span style="cursor:pointer;color:var(--text2);font-size:14px" onclick="deselectAll()">&#10005;</span></h3>
      <div class="psec">Identity</div>
      <div class="fg"><label>Unit Name</label><input id="ep-name" type="text" placeholder="1st Armoured Brigade"></div>
      <div class="fr">
        <div class="fg"><label>Designation</label><input id="ep-desig" type="text" placeholder="1 ABDE"></div>
        <div class="fg"><label>Commander</label><input id="ep-cmd" type="text" placeholder="COL Smith"></div>
      </div>
      <div class="psec">Classification</div>
      <div class="fg"><label>Unit Type</label><select id="ep-type"></select></div>
      <div class="fg"><label>Echelon</label>
        <select id="ep-echelon">
          <option value="team">Team / Crew</option><option value="squad">Squad / Section</option>
          <option value="platoon">Platoon</option><option value="company">Company / Battery</option>
          <option value="battalion">Battalion / Sqn</option><option value="regiment">Regiment</option>
          <option value="brigade">Brigade</option><option value="division">Division</option>
          <option value="corps">Corps</option><option value="army">Army</option>
          <option value="army_group">Army Group</option><option value="region">Region</option>
        </select>
      </div>
      <div class="fg"><label>Affiliation</label>
        <div class="aff-row">
          <div class="aff-btn a-friendly" data-aff="friendly" onclick="setAffil('friendly')">Friend</div>
          <div class="aff-btn" data-aff="hostile" onclick="setAffil('hostile')">Hostile</div>
          <div class="aff-btn" data-aff="neutral" onclick="setAffil('neutral')">Neutral</div>
          <div class="aff-btn" data-aff="unknown" onclick="setAffil('unknown')">Unknown</div>
        </div>
      </div>
      <div class="psec">Status &amp; Tasking</div>
      <div class="fg"><label>Combat Status</label>
        <div class="stat-row">
          <div class="stat-btn" data-st="effective" onclick="setStat('effective')">Effective</div>
          <div class="stat-btn" data-st="degraded" onclick="setStat('degraded')">Degraded</div>
          <div class="stat-btn" data-st="not-operational" onclick="setStat('not-operational')">Non-Op</div>
          <div class="stat-btn" data-st="unknown-status" onclick="setStat('unknown-status')">Unknown</div>
        </div>
      </div>
      <div class="fr">
        <div class="fg"><label>Strength (PAX)</label><input id="ep-strength" type="text" placeholder="3,200"></div>
        <div class="fg"><label>Equipment</label><input id="ep-equip" type="text" placeholder="62 MBT"></div>
      </div>
      <div class="fr">
        <div class="fg"><label>Readiness %</label><input id="ep-rdy" type="number" min="0" max="100" placeholder="85"></div>
        <div class="fg"><label>Task / Mission</label><input id="ep-task" type="text" placeholder="ATTACK"></div>
      </div>
      <div class="fr">
        <div class="fg"><label>Location / Grid</label><input id="ep-loc" type="text" placeholder="YD 4521"></div>
        <div class="fg"><label>Higher HQ</label><input id="ep-hhq" type="text" placeholder="III Corps"></div>
      </div>
      <div class="fg"><label>Notes</label><textarea id="ep-notes" placeholder="Attachments, status, remarks..."></textarea></div>
      <div class="psec">Relationships</div>
      <div class="fg"><label>Connection to Parent</label>
        <select id="ep-reltype" onchange="applyEP()">
          <option value="command">Command - solid line</option>
          <option value="support">Support / Attached - dashed</option>
          <option value="opcon">OPCON - blue dotted</option>
          <option value="tacon">TACON - orange dotted</option>
          <option value="coord">Coordination - grey dotted</option>
        </select>
      </div>
      <div class="psec">Frame &amp; Modifier</div>
      <div class="fg"><label id="ep-frame-status-label">Frame Status</label>
        <div class="stat-row">
          <div class="stat-btn" data-fs="present" onclick="setFrameStatus('present')">Present (solid)</div>
          <div class="stat-btn" data-fs="planned" onclick="setFrameStatus('planned')">Planned (dashed)</div>
        </div>
      </div>
      <div class="fg"><label id="ep-modifier-label">Unit Modifier</label>
        <div class="stat-row">
          <div class="stat-btn" data-mod="none" onclick="setMod('none')">None</div>
          <div class="stat-btn" data-mod="reinforced" onclick="setMod('reinforced')">+ Reinforced</div>
          <div class="stat-btn" data-mod="reduced" onclick="setMod('reduced')">- Reduced</div>
          <div class="stat-btn" data-mod="hq" onclick="setMod('hq')">HQ</div>
        </div>
      </div>
      <div class="psec">Appearance</div>
      <div class="fg"><label>Card Size</label>
        <div class="sz-row">
          <div class="sz-btn" data-sz="compact" onclick="setSize('compact')">Compact</div>
          <div class="sz-btn active" data-sz="normal" onclick="setSize('normal')">Normal</div>
          <div class="sz-btn" data-sz="expanded" onclick="setSize('expanded')">Expanded</div>
        </div>
      </div>
      <div class="fg"><label>Card Colour Tint</label><div class="swatch-row" id="ep-swatches"></div></div>
      <div class="fg"><label>Custom Icon (per-node)</label>
        <div class="icon-row">
          <img id="ep-icon-prev" class="icon-preview" src="" style="display:none">
          <button class="pb" style="margin:0;flex:1" onclick="triggerNodeIcon()">&#10514; Upload Image</button>
          <button class="pb" style="margin:0;width:32px;padding:6px 4px" onclick="clearNodeIcon()" title="Remove">&#10005;</button>
        </div>
      </div>
      <div class="fg"><label>Show Fields</label>
        <div class="chk-row">
          <label><input type="checkbox" id="show-desig" checked onchange="applyEP()"> Desig.</label>
          <label><input type="checkbox" id="show-cmd" checked onchange="applyEP()"> Cmd.</label>
          <label><input type="checkbox" id="show-str" onchange="applyEP()"> Strength</label>
          <label><input type="checkbox" id="show-task" onchange="applyEP()"> Task</label>
          <label><input type="checkbox" id="show-rdy" onchange="applyEP()"> Readiness %</label>
        </div>
      </div>
      <div class="psec">Actions</div>
      <button class="panel-btn" onclick="addChildToSelected()">Add Subordinate</button>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:4px">
        <button class="panel-btn" onclick="duplicateSelected()">Duplicate</button>
        <button class="panel-btn" onclick="duplicateAsSibling()">Sibling Copy</button>
      </div>
      <button class="panel-btn" onclick="duplicateAsChild()">Child Copy</button>
      <button class="panel-btn" onclick="copySubtree()">Copy Subtree</button>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:4px">
        <button class="panel-btn" onclick="promoteNode()">Promote</button>
        <button class="panel-btn" onclick="demoteNode()">Demote</button>
      </div>
      <button class="panel-btn warn" onclick="detachNode()">Detach from Parent</button>
      <button class="panel-btn delete" onclick="deleteSelected()">Delete Unit</button>
    </div>
    <div id="mp-inner" style="display:none">
      <h3>MULTI-SELECT <span style="cursor:pointer;color:var(--text2);font-size:14px" onclick="deselectAll()">&#10005;</span></h3>
      <div class="multi-count" id="multi-count">0 selected</div>
      <div class="psec">Bulk: Affiliation</div>
      <div class="aff-row" style="margin-bottom:10px">
        <div class="aff-btn" onclick="bulkAffil('friendly')" style="border-color:var(--friendly);color:var(--friendly)">Friend</div>
        <div class="aff-btn" onclick="bulkAffil('hostile')" style="border-color:var(--hostile);color:var(--hostile)">Hostile</div>
        <div class="aff-btn" onclick="bulkAffil('neutral')" style="border-color:var(--neutral);color:var(--neutral)">Neutral</div>
        <div class="aff-btn" onclick="bulkAffil('unknown')" style="border-color:var(--unknown);color:var(--unknown)">Unknown</div>
      </div>
      <div class="psec">Bulk: Status</div>
      <div class="stat-row" style="margin-bottom:10px">
        <div class="stat-btn" onclick="bulkStatus('effective')" style="border-color:#22c55e;color:#22c55e">Effective</div>
        <div class="stat-btn" onclick="bulkStatus('degraded')" style="border-color:#f59e0b;color:#f59e0b">Degraded</div>
        <div class="stat-btn" onclick="bulkStatus('not-operational')" style="border-color:#ef4444;color:#ef4444">Non-Op</div>
        <div class="stat-btn" onclick="bulkStatus('unknown-status')" style="border-color:#6b7280;color:#6b7280">Unknown</div>
      </div>
      <div class="fg"><label>Bulk: Echelon</label>
        <select id="bulk-echelon" onchange="bulkEchelon(this.value)">
          <option value="">- no change -</option>
          <option value="team">Team</option><option value="squad">Squad</option>
          <option value="platoon">Platoon</option><option value="company">Company</option>
          <option value="battalion">Battalion</option><option value="regiment">Regiment</option>
          <option value="brigade">Brigade</option><option value="division">Division</option>
        </select>
      </div>
      <div class="fg"><label>Bulk: Colour Tint</label><div class="swatch-row" id="mp-swatches"></div></div>
      <div class="psec">Actions</div>
      <button class="pb" onclick="autoLayoutSel()">Layout Selection</button>
      <button class="pb warn" onclick="unlinkSel()">Unlink from Parents</button>
      <button class="pb del" onclick="deleteMultiSel()">Delete Selected</button>
      <div class="psec">Bulk: Frame Status</div>
      <div class="status-row" style="margin-bottom:10px">
        <div class="status-btn" onclick="bulkFrame('present')">Present (solid)</div>
        <div class="status-btn" onclick="bulkFrame('planned')">Planned (dashed)</div>
      </div>
      <div class="psec">Alignment</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-bottom:4px">
        <button class="pb" style="margin:0;font-size:10px" onclick="alignNodes('left')">Left</button>
        <button class="pb" style="margin:0;font-size:10px" onclick="alignNodes('hcenter')">Center</button>
        <button class="pb" style="margin:0;font-size:10px" onclick="alignNodes('right')">Right</button>
        <button class="pb" style="margin:0;font-size:10px" onclick="alignNodes('top')">Top</button>
        <button class="pb" style="margin:0;font-size:10px" onclick="distributeH()">Space H</button>
        <button class="pb" style="margin:0;font-size:10px" onclick="distributeV()">Space V</button>
      </div>
    </div>
  </div>
</div>
<div id="statusbar">
  <span>Units: <b id="sb-units">0</b></span>
  <span>Selected: <b id="sb-sel">&#8212;</b></span>
  <span>Zoom: <b id="sb-zoom">100%</b></span>
  <span>History: <b id="sb-hist">0/0</b></span>
  <span class="hint">Drag canvas to pan | Shift+drag for lasso | Shift+click multi-select | Ctrl+Z/Y undo/redo | Ctrl+D duplicate | Del delete</span>
</div>`;
  }

  function overlaysHtml() {
    return `
<div id="ctx-menu" style="position:fixed;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:3px 0;z-index:9999;display:none;min-width:160px;box-shadow:0 8px 24px rgba(0,0,0,.55)">
  <div class="ctx-item" onclick="ctxAct('add-child')">Add Subordinate</div>
  <div class="ctx-item" onclick="ctxAct('add-textbox-left')">Text Box Left</div>
  <div class="ctx-item" onclick="ctxAct('add-textbox-right')">Text Box Right</div>
  <div class="ctx-item" onclick="ctxAct('add-textbox-above')">Text Box Above</div>
  <div class="ctx-item" onclick="ctxAct('add-textbox-below')">Text Box Below</div>
  <div class="ctx-item" onclick="ctxAct('qa-inf')">Infantry Child</div>
  <div class="ctx-item" onclick="ctxAct('qa-arm')">Armour Child</div>
  <div class="ctx-item" onclick="ctxAct('qa-arty')">Artillery Child</div>
  <div class="ctx-item" onclick="ctxAct('dup')">Duplicate</div>
  <div class="ctx-item" onclick="ctxAct('dup-sibling')">Sibling Copy</div>
  <div class="ctx-item" onclick="ctxAct('dup-child')">Child Copy</div>
  <div class="ctx-item" onclick="ctxAct('copy-subtree')">Copy Subtree</div>
  <div class="ctx-item" onclick="ctxAct('sel-tree')">Select Subtree</div>
  <div class="ctx-item" onclick="ctxAct('collapse')">Collapse / Expand</div>
  <div class="ctx-sep" style="height:1px;background:var(--border);margin:2px 0"></div>
  <div class="ctx-item" onclick="ctxAct('promote')">Promote</div>
  <div class="ctx-item" onclick="ctxAct('demote')">Demote</div>
  <div class="ctx-item" onclick="ctxAct('detach')">Detach from Parent</div>
  <div class="ctx-sep" style="height:1px;background:var(--border);margin:2px 0"></div>
  <div class="ctx-item danger" onclick="ctxAct('del')">Delete Unit</div>
</div>
<div class="modal-ov" id="tpl-modal">
  <div class="modal-box" style="min-width:420px">
    <h2>Load Template <span class="modal-x" onclick="closeModal('tpl-modal')">&#10005;</span></h2>
    <p style="font-size:11px;color:var(--text2);margin-bottom:10px" id="tpl-help">Load a pre-built ORBAT structure. Clears the current canvas.</p>
    <div class="tpl-grid" id="tpl-grid"></div>
  </div>
</div>
<div class="modal-ov" id="sc-modal">
  <div class="modal-box">
    <h2>Keyboard Shortcuts <span class="modal-x" onclick="closeModal('sc-modal')">&#10005;</span></h2>
    <table class="sc-table">
      <tr><td><kbd>Ctrl+Z</kbd></td><td>Undo</td></tr>
      <tr><td><kbd>Ctrl+Y</kbd></td><td>Redo</td></tr>
      <tr><td><kbd>Ctrl+D</kbd></td><td>Duplicate selected</td></tr>
      <tr><td><kbd>Ctrl+C</kbd></td><td>Copy selected nodes</td></tr>
      <tr><td><kbd>Ctrl+V</kbd></td><td>Paste copied nodes</td></tr>
      <tr><td><kbd>Ctrl+A</kbd></td><td>Select all units</td></tr>
      <tr><td><kbd>Del / Backspace</kbd></td><td>Delete selected</td></tr>
      <tr><td><kbd>Escape</kbd></td><td>Deselect / exit link mode</td></tr>
      <tr><td><kbd>L</kbd></td><td>Auto-layout</td></tr>
      <tr><td><kbd>F</kbd></td><td>Fit to screen</td></tr>
      <tr><td><kbd>G</kbd></td><td>Cycle grid style</td></tr>
      <tr><td><kbd>M</kbd></td><td>Toggle minimap</td></tr>
      <tr><td><kbd>Home</kbd></td><td>Center on first root</td></tr>
      <tr><td><kbd>Shift+Home</kbd></td><td>Center on first hostile root</td></tr>
      <tr><td><kbd>Alt+Home</kbd></td><td>Center on first neutral root</td></tr>
      <tr><td><kbd>Shift+Click</kbd></td><td>Add/remove from multi-select</td></tr>
      <tr><td><kbd>Drag on canvas</kbd></td><td>Pan the canvas view</td></tr>
      <tr><td><kbd>Shift + Drag on canvas</kbd></td><td>Lasso / rubber-band select</td></tr>
      <tr><td><kbd>Shift+Drag node</kbd></td><td>Reparent (drop onto new parent)</td></tr>
      <tr><td><kbd>Scroll</kbd></td><td>Zoom in/out</td></tr>
      <tr><td><kbd>Right-click node</kbd></td><td>Context menu</td></tr>
      <tr><td><kbd>Drag Link button</kbd></td><td>Draw link to parent (in Link mode)</td></tr>
    </table>
  </div>
</div>
<div class="modal-ov" id="ci-modal">
  <div class="modal-box">
    <h2>Add Custom Icon to Palette <span class="modal-x" onclick="closeModal('ci-modal')">&#10005;</span></h2>
    <div class="fg"><label>Name</label><input id="ci-name" type="text" placeholder="e.g. Cyber Unit"></div>
    <div class="fg"><label>Category</label><input id="ci-cat" type="text" value="Custom" placeholder="Custom"></div>
    <div class="fg"><label>Image File (PNG / SVG / JPG)</label>
      <input type="file" id="ci-file" accept="image/*" style="color:var(--text);background:var(--surface2);border:1px solid var(--border);border-radius:5px;padding:5px;width:100%;cursor:pointer">
    </div>
    <div id="ci-pw" style="margin-top:8px;text-align:center;display:none">
      <img id="ci-prev" style="max-height:70px;border:1px solid var(--border);border-radius:5px;padding:4px">
    </div>
    <div class="modal-acts">
      <button class="pb" style="width:auto;margin:0" onclick="closeModal('ci-modal')">Cancel</button>
      <button class="pb" style="width:auto;margin:0;border-color:var(--accent);color:var(--accent)" onclick="addCiToPalette()">Add to Palette</button>
    </div>
  </div>
</div>
<input type="file" id="file-input" accept=".json" style="display:none">
<input type="file" id="node-icon-input" accept="image/*" style="display:none">
<input type="file" id="node-insignia-input" accept="image/*" style="display:none">
<input type="file" id="node-attachment-input" multiple style="display:none">
<div id="toast"></div>`;
  }

  const root = document.getElementById("app-root");
  if (!root) return;

  root.innerHTML = [topbarHtml(), workspaceHtml(), overlaysHtml()].join("\n");
})();
