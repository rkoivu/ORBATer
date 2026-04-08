# ORBATer — NATO APP-6 ORBAT Diagram Builder

A modern, browser-based tool for creating and managing orders of battle (ORBATs) using NATO APP-6 military symbols. ORBATer combines visual diagram editing with powerful state management, collaboration features, and temporal navigation.

**Live Demo:** https://rkoivu.github.io/ORBATer/
**Project Docs:** [CHANGELOG.md](CHANGELOG.md) | [TODO.md](TODO.md)

---

## Table of Contents

ORBATer is a browser-based NATO APP-6 order of battle builder for military unit diagrams, command hierarchies, and force structure maps.

It is built for military planners, defense analysts, wargamers, scenario designers, and researchers who need a fast client-side ORBAT editor with drag-and-drop editing, saved views, snapshots, and export support.

Primary keywords: ORBAT builder, order of battle software, NATO APP-6, military symbols, force structure planner, unit hierarchy editor, command relationship diagram, wargaming tool.

Live app: https://rkoivu.github.io/ORBATer/

- [Features](#features)
- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
- [User Guide](#user-guide)
- [Advanced Features](#advanced-features)
- [Architecture](#architecture)
- [Changelog](#changelog)
- [Roadmap](#roadmap)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Features

### 🎯 Core Editing
- **NATO APP-6 Symbol Rendering** — Automatically renders proper military symbols with affiliation (friendly/hostile/neutral/unknown), echelon ranks, and status indicators
- **Drag-and-Drop Interface** — Intuitive node creation, repositioning, and hierarchy management
- **Flexible Hierarchy** — Build unlimited subordination levels with parent/child relationships
- **Multi-Select & Bulk Operations** — Select multiple units and apply bulk affiliation, status, and echelon changes
- **Undo/Redo System** — Full 120-step history with visual feedback

### 💾 State Management
- **Auto-Save** — Automatic saves to browser storage with 40-snapshot version history
- **Named Saved Views** — Quick save and restore complete diagram states (zoom, pan, selection)
- **Snapshot Timeline** — Navigate through diagram evolution with an interactive phase slider
- **Import/Export** — Full JSON import/export with schema versioning for compatibility

### 🔗 Collaboration & Sharing
- **Shareable Read-Only Links** — Generate URLs with `?view=<id>&readonly=1` parameter for sharing diagrams
- **Multiple Tabs/Canvases** — Work on multiple diagram versions independently (Main tab + custom tabs)
- **Layout Persistence** — Retained UI state, zoom levels, and view preferences

### 📐 Layout & Visualization
- **Four Layout Modes** — Tree (vertical hierarchy), Indented List (left spine with right-branching stubs), Radial (circular root distribution), Force (physics-based root spacing)
- **Smart Alignment Tools** — Align, distribute, and organize selected nodes
- **Minimap & Zoom** — Navigation mini-overview, zoom buttons, and fit-to-screen
- **Connector Visualization** — Visual lines showing parent-child relationships with relationship type indicators
- **Multi-Canvas Tabs** — Keep multiple ORBAT workspaces open with per-tab persistence and dirty-state indicators
- **Scrollable Side Panels** — Palette and properties panels scroll independently for large libraries and long forms

### 🎨 Customization
- **Custom Icons** — Upload and embed custom SVG/image icons for unit types
- **Tint Coloring** — Apply custom background tints to individual units
- **Affiliation Colors** — Auto-colored by friendly (blue), hostile (red), neutral (green), unknown (purple)
- **Theme Controls** — Toggle light/dark themes and legend display
- **Readability Modes** — Presentation mode, Clarity mode, and connector emphasis for dense briefing views
- **Canvas Backgrounds** — Apply a background image with adjustable opacity for briefing-map style layouts
- **Aesthetic UI Polish** — Styled tab bar, glassy menus, refined overlays, improved empty-state guidance, stronger focus states, clearer minimap chrome, and pill-based status readouts

### 🏷️ Unit Metadata
- **Rich Entity Data** — Name, designation, commander, strength, readiness, task, equipment, notes
- **Tags & Filtering** — Tag-based organization with tag highlighting and filtering
- **Relationship Types** — Support command, support, OPCON, TACON, coordination relationships
- **Status Indicators** — Planned, present, damaged, destroyed status badges
- **Echelon Display** — Automatic NATO echelon notation (·, ··, ···, |, ||, |||, X, XX, etc.)

### 🔧 Advanced Tools
- **Outline Import** — Import hierarchies from indented text with auto-hierarchy building
- **Subtree Statistics** — View size, depth, and composition of organizational branches
- **Stacking Analysis** — Identify overly deep or complex sub-hierarchies
- **Command Palette** — Quick access to all commands with Cmd/Ctrl+K
- **Print Mode** — Optimized printing with detailed unit information

---

## Getting Started

### Local Automation
This repo now includes a lightweight local automation setup based on plain Node scripts. No bundler or external test framework is required.

Requirements:
- Node.js 18+ recommended

Commands:
- `npm run lint` - validate `index.html` references and run syntax checks across app scripts
- `npm run test` - same validation pass, kept as a test entrypoint for local or CI use
- `npm run build` - validate first, then copy the static app into `dist/`
- `npm run serve` - serve the built `dist/` folder locally at `http://127.0.0.1:4173`
- `npm run serve:src` - serve the source tree directly without building
- `npm run check` - run validation and then build

Typical local flow:
1. Run `npm run check`
2. Run `npm run serve`
3. Open `http://127.0.0.1:4173`

### Quick Start
1. Open https://rkoivu.github.io/ORBATer/ in any modern browser
2. Click **＋ Root** to create first unit
3. Drag units from the palette (left sidebar) to add subordinates
4. Click ⊞ **Layout** to auto-arrange
5. Export as JSON, PNG, SVG, or PDF

### Loading Existing ORBAT
- **Import JSON:** Click **⤒ Import** and select a previously saved `.json` file
- **Auto-Restore:** Autosaved OrbBats restore automatically on page load
- **Restore Snapshot:** Open **🗂 Snaps** and select a previous version from the timeline

### Keyboard Shortcuts
- `Ctrl/Cmd+Z` — Undo
- `Ctrl/Cmd+Y` — Redo
- `Ctrl/Cmd+C` — Copy selected units
- `Ctrl/Cmd+V` — Paste units
- `Ctrl/Cmd+K` — Open command palette
- `Ctrl/Cmd+W` — Close current tab
- `Ctrl/Cmd+Shift+D` — Duplicate current tab
- `F2` — Rename current tab
- `Delete` — Remove selected unit(s)
- `Esc` (in search fields) — Clear search or tag filter
- `Shift+N` — Create a new root unit at the canvas center
- `Double-click canvas` — Create a root unit from empty space

---

## Core Concepts

### Affiliation
Units are classified by allegiance:
- **Friendly** — Blue, typically represents your forces
- **Hostile** — Red, enemy or opposing forces
- **Neutral** — Green, non-aligned or supporting organization
- **Unknown** — Purple, unidentified forces

Affiliation affects symbology, color, and filtering.

### Echelon (Size)
NATO standard rank indicators displayed above symbols:
- **·** (Team), **··** (Squad), **···** (Platoon)
- **|** (Company), **||** (Battalion), **|||** (Regiment)
- **X** (Brigade), **XX** (Division), **XXX** (Corps), **XXXX** (Army)

### Relationship Types
Define parent-child connections:
- **Command** — Direct command authority
- **Support** — Supporting unit (orange highlight)
- **OPCON** — Operational control
- **TACON** — Tactical control
- **Coordination** — Coordinating relationship

### Status Indicators
Unit operational conditions:
- **Planned** — Dashed border, scheduled
- **Present** — Normal solid rendering
- **Damaged** — Badge indicator
- **Destroyed** — Badge indicator

---

## User Guide

### Creating Units
1. Drag a unit type from sidebar palette onto canvas
2. Or click a unit's **+** button to add subordinate
3. Or press **＋ Root** to add new root-level unit

### Editing Unit Properties
1. Click a unit to select it
2. Edit panel on right shows all properties (Name, Designation, Commander, Strength, etc.)
3. Use **Affiliation**, **Status**, **Echelon** buttons in toolbar for quick changes
4. Changes auto-save after 2.5 seconds

### Organizing Units
- **Drag to reposition** — Click and drag units across canvas
- **Drag link button** (⤢) to **reassign parent** — Restructure hierarchy
- **Auto-Layout** — Press ⊞ **Layout** or select layout mode (Tree/Indented List/Radial/Force)
- **Align Selected** — Select multiple, use alignment buttons

### Saving & Sharing
- **Save as View** — Click 🔖 **Views** → "Save current view as" → enter name
- **Share View** — Click 🔖 **Views** → **Share** button → link copied to clipboard
- **Export Formats:**
  - **JSON** — Full editable file with all metadata
  - **PNG** — Raster image at high DPI
  - **SVG** — Scalable vector graphic
  - **PDF** — Formatted for printing

### Managing Tabs
- **New Tab** — Click **+** button on tab bar to create new workspace
- **Switch Tab** — Click tab name to load workspace
- **Close Tab** — Click ✕ on tab (Main/default cannot be closed)
- **Rename Tab** — Double-click a tab name to rename it inline
- **Tab Context Menu** — Right-click a tab for rename, duplicate, and close actions
- **Dirty Indicators** — Tabs show when a workspace has unsaved changes and now clear correctly after tab restores and saves

### Snapshots & Timeline
1. Snapshots auto-create on significant edits
2. Open 🗂 **Snaps** to see timeline
3. Drag phase slider to navigate historical states
4. Click **View** to restore camera position without losing current edits
5. Click **Restore** to fully revert to snapshot state

---

## Advanced Features

### Custom Icon Packs
1. Prepare SVG icons (50×30px recommended)
2. Add via edit panel when unit selected
3. Icons are embedded in saved JSON files
4. Toggle symbol pack with toolbar button 🖼

### Outline Import
1. Prepare indented text:
   ```
   Div HQ
     Bde 1
       Btn A
       Btn B
     Bde 2
   ```
2. Click **⤒ Import** → **Outline** tab
3. Set indentation level, auto-create affiliation/type
4. Option to clear existing ORBAT

### Admin vs Task-Organised Mode
- **Admin** — Default; sibling order by designation
- **Task** — Reorganizes by task type and task order
- Toggle with **≋ ORBAT** button

### Readability Toggles
- **Presentation** — Hides side panels and the status bar to maximize the canvas area
- **Clarity** — Increases text contrast and card readability for dense diagrams
- **Links** — Emphasizes connectors and relationship labels so branch structure reads faster
- These toggles persist with document state, so snapshots and restores keep the same viewing mode

### Read-Only Sharing
Shared links have `?readonly=1` which disables:
- Edit operations and drag-drop
- Add/delete buttons
- Direct property editing
Perfect for stakeholder review.

---

## Architecture

### Technology Stack
- **Vanilla JavaScript** — No external frameworks; ~4600 lines of browser-side code split across focused files
- **HTML5 Canvas** — For minimap rendering
- **SVG** — For connector rendering and symbol graphics
- **LocalStorage** — For persistence (views, snapshots, state)
- **Web APIs** — FileReader, Canvas, Blob for export

### Modular Structure

#### CSS Modules
- `css/base.css` — Layout, color scheme, component styling
- `css/interaction-overlays.css` — Connectors, tooltips, dimming, resize handles
- `css/toolbar-menus-import.css` — Toolbar groups, status bar, import UI
- `css/views-command-history.css` — Views, snapshots, command palette, animations

#### HTML / UI Shell
- **`index.html`** - Thin application loader; includes stylesheets, external libraries, and ordered script bootstrapping
- **`ui-shell.js`** - Generates the static application chrome (toolbar, workspace, panels, overlays, modals, and file inputs) at runtime

#### JavaScript Modules (by responsibility)
- **`symbols-data.js`** — APP-6 symbol definitions (60+ unit types), rendering engine, core node/state/history management
- **`symbols-data.js` layout helpers** — `autoLayoutTree()`, `autoLayoutIndented()`, `autoLayoutRadial()`, and `autoLayoutForce()` are the primary built-in layout entry points
- **`ui-shell.js`** — Static DOM shell assembly for the app UI
- **`views-snapshots-command-palette.js`** — Saved views, snapshots, tabs, timeline slider, command palette, layout modes
- **`identity-search-insignia.js`** — Tags, insignia, labels, search state
- **`custom-icon-pack.js`** — Custom icon upload/management
- **`selection-focus-highlights.js`** — Multi-select, focus mode, tag highlighting
- **`qol-zoom-status-rename.js`** — Zoom UI, inline rename, status bar
- **`dirty-state-navigation.js`** — Unsaved-state tracking, paste point
- **`history-search-connectors.js`** — Undo/redo history UI, search UI
- **`themes-locks-search-background.js`** — Theming, lock/fade, backgrounds
- **`stats-outline-tour-stacking.js`** — Statistics, text import, guided tour
- **`toolbar-menus-auto-organise.js`** — Toolbar grouping, auto-organize, bottom bar
- ...and 4 other specialized modules

### Boot Sequence
1. `index.html` loads the shared CSS and third-party dependencies
2. `js/ui-shell.js` creates the static DOM structure expected by the runtime
3. `js/symbols-data.js` binds the core application logic to that DOM and initializes the app
4. Feature modules loaded after `symbols-data.js` progressively extend or wrap the base behavior

This means script order matters: later modules patch or augment functions defined earlier.

When debugging, assume late-loaded files may intentionally wrap earlier globals such as `renderTabs`, `selectNode`, `updSelUI`, or `applyDocumentState` rather than replacing them from scratch.

### Current Loaded Files
- CSS load order: `css/base.css`, `css/interaction-overlays.css`, `css/toolbar-menus-import.css`, `css/views-command-history.css`
- Script load order after `js/symbols-data.js`: `js/identity-search-insignia.js`, `js/custom-icon-pack.js`, `js/selection-focus-highlights.js`, `js/qol-zoom-status-rename.js`, `js/dirty-state-navigation.js`, `js/print-tooltips-shortcuts.js`, `js/themes-locks-search-background.js`, `js/compat-fixes-statusbar.js`, `js/history-search-connectors.js`, `js/tooltips-resize-minimap.js`, `js/stats-outline-tour-stacking.js`, `js/toolbar-menus-auto-organise.js`, `js/outline-import-enhancements.js`, `js/views-snapshots-command-palette.js`, `js/qol-keyboard-feedback.js`
- Active responsibility split: `js/views-snapshots-command-palette.js` owns tabs, saved views, snapshots, the startup launcher, and command palette behavior; `js/outline-import-enhancements.js` owns outline validation and indentation helpers; `js/custom-icon-pack.js` owns structured notes, attachments, and doctrinal template extensions.

### Recent UI Evolution
1. The runtime shell is split between a thin `index.html`, generated UI markup in `js/ui-shell.js`, base layout in `css/base.css`, and late-stage enhancement modules that progressively refine menus, tabs, overlays, and interaction affordances.
2. Sidebar scrolling and minimap placement are enforced both structurally and at the final QOL layer so later feature modules do not break the workspace layout.
3. Current UI polish is concentrated in `css/base.css`, `css/toolbar-menus-import.css`, `js/themes-locks-search-background.js`, and `js/qol-keyboard-feedback.js`.
4. Recent polish work improved palette label readability, selected-node action discoverability, minimap labeling, and status-bar scanability without changing the no-build architecture.
5. Recent bug-fix work in the tab/view layer hardened dirty-state tracking, preserved valid zero-value pan coordinates in saved views, and restored multi-select state correctly across tab switches.
6. Recent layout work added the indented-list ORBAT view and a safer tree fallback path for force layout when the document has too few roots.

### Data Model
```javascript
node = {
  id: string,
  name: string,
  typeId: string,
  affil: 'friendly'|'hostile'|'neutral'|'unknown',
  echelon: string,
  parentId: string|null,
  x: number,
  y: number,
  designation: string,
  commander: string,
  strength: string,
  equipment: string,
  readiness: number,
  task: string,
  tags: string[],
  reltype: 'command'|'support'|'opcon'|'tacon'|'coord',
  status: 'planned'|'present'|'damaged'|'destroyed'|null,
  collapsed: boolean,
  customIcon: string|null,
  tint: string|null
}

view = {
  id: string,
  name: string,
  transform: { scale, panX, panY, selected, multi[], mode }
}

snapshot = {
  id: string,
  ts: number,
  reason: string,
  state: serializeDocument(),
  transform: { scale, panX, panY, ... },
  diff: { added, removed, changed }
}
```

### State Flow
1. **User Action** (click, drag, type) → triggers handler
2. **Handler updates** `nodes` object in memory
3. **Optional redraw** with `renderNode()` / `drawConnectors()`
4. **scheduler autosave** via `saveState()` (debounced 2.5s)
5. **History tracked** in `history[]` array
6. **localStorage persisted** as `orbat_v3` + views/snapshots/tabs

---

## Troubleshooting

### Units not appearing after import
- Check JSON schema matches `app/schemaVersion: 2`
- Inspect browser console (F12) for parse errors
- Try importing from the 40-snapshot history instead

### Snapshots not saving
- Check browser storage quota not exceeded (typically 5-10MB)
- Private browsing mode disables localStorage; switch to normal mode
- Check console for localStorage errors

### Slow performance with large ORBAT
- Try **⊞ Layout** to reset positions
- Switch to **Radial** or **Force** layout for cleaner spacing
- Hide minimap if unnecessary (**⊡ Map** toggle)
- Clear browser cache and reload

### Export not working
- Ensure ad blockers aren't interfering with file downloads
- Check browser console for errors (F12)
- Try different export format (PNG, SVG, PDF, JSON)

### Units disappearing after switching tabs
- All tab state auto-saves; tab data is NOT lost when switching
- If issue persists, check localStorage isn't full
- Restore from snapshot (🗂 **Snaps** → **Restore**)

---

## Roadmap

The working backlog for future features, UI/UX polish, QOL improvements, and bug-fix targets lives in [TODO.md](TODO.md).

---

## Contributing

ORBATer is built as a modular, progressive enhancement tool. To add features:

1. **Identify responsibility** — Which existing module owns this? (or create new)
2. **Add to appropriate file** — Encapsulate in IIFE or module pattern
3. **Hook with `window.*` namespacing** — Expose public functions via `window.functionName`
4. **Test with undo** — Ensure history tracking still works
5. **Test localStorage** — Verify auto-save functions in private mode fallback
6. **Document in README** — Update feature list and architecture sections

---

## License & Attribution

- **NATO APP-6** symbol specifications used under standard military reference
- **Icons** from various sources (see assets/icons directory for credits)
- Built for operational planning and military staff work

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history, bug fixes, and features.
