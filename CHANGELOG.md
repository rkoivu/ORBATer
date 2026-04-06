# ORBATer Changelog

All notable changes to the ORBATer project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **Indented List Layout Mode** — Added a fourth ORBAT layout style optimized for outline-style reading
  - Parents anchor at the top-left of each branch
  - A vertical spine runs down the left edge with horizontal stubs branching into children
  - Gives dense hierarchies a cleaner top-down reading pattern

- **Readability View Toggles** — Added presentation-focused controls for dense briefing diagrams
  - **Presentation** hides side panels and status chrome to maximize canvas space
  - **Clarity** increases node-card and label readability
  - **Links** emphasizes connectors and relationship labels
  - These modes persist with document state alongside theme/background preferences

- **Tab Workflow QOL Controls** — Expanded tab management beyond simple add/close
  - Right-click context menu with rename, duplicate, and close actions
  - Keyboard shortcuts for rename (F2), duplicate (Ctrl/Cmd+Shift+D), and close (Ctrl/Cmd+W)
  - Command palette actions for renaming and duplicating the current tab

- **Root Unit Shortcut** — Added Shift+N to create a root unit directly from the canvas workflow
  - Reduces toolbar travel during fast ORBAT editing
  - Complements double-click-canvas root creation

- **Project Backlog Document** — Added `TODO.md` as a repo-level backlog for future work
  - Groups candidate features, UI/UX improvements, quality-of-life ideas, bug-fix targets, and technical cleanup items
  - Gives future work a maintained home inside the repository instead of leaving it implicit across commits

- **UI Shell Module** — Extracted the static page chrome out of `index.html` into `js/ui-shell.js`
  - Toolbar, workspace shell, panels, overlays, modals, and file inputs now come from a dedicated runtime UI module
  - Preserves existing DOM ids and inline handlers so the current no-build architecture continues to work
  - Makes the HTML entrypoint easier to scan and maintain

- **Workspace UI Polish Pass** — Added a broader visual refinement layer across the active shell
  - Styled tab bar with pill tabs, dirty markers, and a dedicated add-tab control
  - Refined toolbar surfaces, menu panels, modals, minimap framing, and status bar readability
  - Improved empty-state onboarding, keyboard focus visibility, and scrollbars across the app

- **Canvas Background & Aesthetic Controls** — Extended the briefing-style presentation tools
  - Background image overlay now works as a dedicated canvas layer
  - Search result counter is presented as a toolbar pill
  - Read-only mode now shows a visible badge in the top bar

- **Multiple Canvases/Tabs System** — Work on multiple independent diagram versions with persistent per-tab state
  - New tab bar below toolbar with active tab highlighting
  - Automatic state preservation when switching tabs (`nodes`, `selectedId`, `multiSel`, `nodeIdC`)
  - Add new tab with **+** button or `window.__newTab()`
  - Close tabs with ✕ button (default tab cannot be closed)
  - Tab data persists in localStorage under `orbat_tabs_v1`

- **Shareable View-Only Links** — Generate secure sharing URLs for stakeholder review
  - URL format: `?view=<viewId>&readonly=1` for read-only mode
  - Auto-loads specified view on page load
  - Disables all editing operations, add/delete buttons, direct modifications
  - Share button in Views modal copies link to clipboard
  - Perfect for collaboration without changing permissions

- **Timeline/Phase Slider** — Navigate through snapshot history interactively
  - Range slider in Snapshots modal
  - Displays timestamp and reason for each snapshot
  - Slider updates dynamically as snapshots created/deleted
  - Click **View** to restore camera without losing current edits
  - Click **Restore** to fully revert to snapshot state

- **Multi-Mode Layout System** — Three algorithmic layout options for diagram organization
  - **Tree Mode** (default) — Horizontal root distribution with vertical hierarchy
  - **Radial Mode** — Roots arranged in circle, children in tree hierarchy (physics-aware)
  - **Force Mode** — Particle-simulation-based repulsion for roots, tree children
  - Layout mode selector dropdown in toolbar (⊞ Layout button area)
  - Selected mode persists in localStorage under `orbat_layout_mode`
  - `window.setLayoutMode(mode)` for programmatic access

- **Friendly Unit Symbol Simplification** — Removed default blue rectangle background
  - Friendly units now render icon only without rectangular frame
  - Maintains backward compatibility with hostile (red diamond), neutral (green ellipse), unknown (purple ellipse)
  - Cleaner visual appearance, better icon visibility
  - Affects rendering of new units; existing diagrams unaffected until re-rendered

### Changed
- **README Refresh**
  - Updated the top-level documentation for the current layout modes, readability toggles, tab workflow, and release-tracking links
  - Added direct links to the roadmap and changelog from the main README

- **Control System Visual Alignment**
  - Buttons, dropdowns, inputs, menus, and supporting panels now share a more unified type, color, radius, and interaction system
  - Reduces the visual mismatch between toolbar controls, flyouts, and view/history surfaces

- **Sleeker Application Shell Pass**
  - Refined the app background, top bar, tab strip, node cards, overlays, minimap, status surfaces, and panel treatments
  - Pushes the interface toward a cleaner briefing-product feel without changing the no-build architecture

- **Palette and Node Affordance Polish**
  - Palette tiles now keep a more consistent height and clamp longer labels cleanly across two lines
  - Selected and multi-selected nodes now expose add, link, and collapse controls without requiring hover
  - Minimap chrome and status-bar readouts were refined for faster scanning

- **Documentation Refresh**
  - README now links to the new backlog in `TODO.md`
  - The repository now keeps planned features and cleanup work alongside the main docs

- **Entry Point Simplification** — `index.html` now acts as a thin loader instead of containing the full application markup
  - Loads stylesheets, external libraries, `js/ui-shell.js`, and the ordered runtime module chain
  - Reduces the maintenance burden of the monolithic HTML file

- **UI Layout Refinement** — The main shell now presents a more cohesive visual system
  - Toolbar and tab strip use shared gradients, depth, and clearer grouping
  - Toolbar menus now render as larger glass-like flyouts instead of bare utility popups
  - Sidebar, properties panel, legend overlay, and empty-state card are visually aligned with the newer shell

- **Documentation Refresh**
  - README now documents the updated side-panel scrolling, multi-canvas tabs, canvas backgrounds, and recent UI evolution
  - Changelog now records the recent shell split, scrolling/minimap stabilization, and the two polish passes

- **Improved Error Handling** — Robust null-check and exception handling throughout
  - Added try-catch to `restoreState()` JSON.parse to prevent crash on corrupted history
  - Tab switching now uses proper `window.__` scope to avoid reference errors
  - Tab lifecycle functions properly catch undefined references
  - Added fallback `window.nodes||{}` for safe iteration
  - All localStorage operations wrapped in try-catch for private browsing/quota exceeded scenarios

- **Symbol Data Modular Updates** — Restructured `autoLayout()` function
  - Primary function now dispatches to layout-mode-specific implementations
  - New functions: `autoLayoutRadial()`, `autoLayoutForce()`
  - Cleaner separation of layout algorithms
  - Maintains existing `autoLayoutSel()` for multi-select layout

- **Bug Fixes in Tab & Snapshot Features**
  - Fixed stale snapshot array reference in slider handler (was causing index out-of-bounds)
  - Fixed `__closeTab()` and `__newTab()` undefined function calls (now use `window.__switchTab()`)
  - Fixed null reference when iterating `window.nodes` on tab switch
  - Fixed localStorage quota handling for all persistence functions

### Fixed
- **Bug: Force Layout Recursive Fallback**
  - Force layout no longer routes back into itself when the document has fewer than two roots
  - The fallback now goes through the tree layout path directly

- **Bug: Tab Selection Restore Regression**
  - Switching tabs now restores multi-select state correctly instead of collapsing the saved selection into a single selected node
  - Keeps downstream selection wrappers synchronized through the normal selection UI path

- **Bug: Presentation Mode Layout Refresh**
  - Toggling presentation/readability modes now immediately refreshes transform, minimap, and status-bar sizing
  - Prevents stale shell geometry after panels are hidden or restored

- **Bug: Tab Dirty State and View Transform Drift**
  - Dirty markers now initialize and clear reliably for newly created and restored tabs
  - Tab switching now clears the correct tab after document restore instead of relying on the previous active id
  - Saved views and snapshots now preserve valid `0` pan values instead of losing them through `||` fallback logic

- **Workspace Stability: Sidebar Scrolling & Minimap Placement**
  - Re-established the flex height chain after the UI shell split
  - Forced palette and properties panels into reliable scroll regions
  - Anchored the minimap and its toggle consistently at the bottom-right corner

- **Critical: Undo/Redo History Corruption** — JSON.parse errors no longer crash app
  - Previously: Corrupted history entry could crash during undo/redo
  - Now: Wrapped in try-catch with user feedback toast
  - Logs error to console for debugging

- **Critical: localStorage Errors in Private Browsing** — All storage operations now graceful
  - Previously: Private browsing mode would throw uncaught `QuotaExceededError`
  - Now: All `localStorage.setItem()` wrapped in try-catch
  - Affected: `saveTabs()`, `setLayoutMode()`, `setViews()`, `setSnaps()`, view/mode persistence
  - Silently continues if storage unavailable; console warning for debugging

- **Bug: Snapshot Phase Slider Index Out-of-Bounds**
  - Previously: Slider maintained stale reference to snapshot array; mutations caused wrong snapshot to load
  - Now: Array refetched on each slider input event via `getSnaps()`
  - Prevents loading incorrect or deleted snapshots

- **Bug: Tab Switching Silent Failures**
  - Previously: Tab close and new tab functions called undefined `__switchTab`; threw errors
  - Now: Properly scoped as `window.__switchTab()` 
  - Maintains consistent namespace convention

- **Bug: Null References on Tab Switch**
  - Previously: Iterating `window.nodes` without null check caused crash
  - Now: Safe fallback to empty object `window.nodes||{}`

---

## [v16.0.0] — 2026-04-05 — Collaboration & Multi-Canvas Era

### Added
- **UI Improvements**
  - Tab bar component with CSS styling for active/hover states
  - Layout mode selector dropdown integrated in toolbar
  - Timeline slider UI in snapshots modal
  - Share button in views list

### Changed
- **Architecture**
  - Modular layout functions allow future layout algorithms
  - Snapshot data model extended with phase/timeline support

### Technical Details
- Lines added: ~400 (new features)
- Lines modified: ~50 (refactoring)
- Files changed: `js/symbols-data.js`, `js/views-snapshots-command-palette.js`, `index.html`, `css/main.css`
- Breaking changes: None (backward compatible)
- Schema version: Still v2

---

## [v15.3.0] — 2026-04-04 — Symbol Rendering Refinement

### Changed
- **Visual Design**
  - Friendly unit rectangles removed for cleaner appearance
  - Icon-only rendering for friendly units
  - Maintains geometric distinction between affiliations (diamond=hostile, ellipse=neutral/unknown)

### Technical
- Modified `getSym()` return statement for friendly affiliation path
- No data model changes; visual only

---

## [v15.2.0] — 2026-04-02 — Bug Fix Release

### Fixed
- Multiple localStorage quota exceeded scenarios
- Corrupt history handling
- Navigation scope issues

---

## [v15.0.0] — 2026-03-20 — Modular Feature Expansion

### Added
- Custom icon pack support with embedded dataUrls
- Outline import with hierarchy auto-creation
- Guided tour system with version-based display
- Subtree statistics and stacking analysis
- Enhanced command palette with quick actions
- Tag-based filtering and highlighting
- Advanced relationship type visualization
- Print optimization and PDF export
- Admin vs Task-Organised ORBAT modes

### Changed
- Restructured codebase into 15+ modular files
- CSS split into semantic feature files
- JavaScript organized by responsibility (not by UI component)

### Technical Details
- Modular structure enables independent feature development
- 3000+ lines of JavaScript organized into focused modules
- 5 CSS files + patches for progressive enhancement

---

## [v14.0.0] — 2026-02-15 — Saved Views & Snapshots

### Added
- Save/load named diagram states (views)
- Auto-snapshot version history (40-snapshot limit)
- View diff summary (added/removed/changed unit counts)
- Snapshot modal with list and management

### Changed
- State serialization with transform (zoom, pan, selection) preservation
- localStorage schema version 1 for views and snapshots

---

## [v13.0.0] — 2026-01-30 — Undo/Redo & History

### Added
- 120-step undo/redo history stack
- Visual history modal with indexed entries
- Flash indicator on undo/redo
- Dirty-state tracking for navigation warnings

### Technical
- `history[]` array with `histIdx` pointer
- `saveState()` / `restoreState()` pair for state management

---

## [v12.0.0] — 2026-01-10 — Multi-Select & Bulk Operations

### Added
- Multi-unit selection with Shift/Ctrl+Click
- Bulk affiliation, status, echelon, frame status changes
- Alignment tools (left, right, top, bottom, h-center)
- Distribution tools (horizontal, vertical even spacing)
- Lasso selection on canvas

### Technical
- `multiSel` Set for efficient selection tracking
- Bulk operation functions with forEach patterns

---

## [v11.0.0] — 2025-12-20 — Relationship Types & Connectors

### Added
- Command, Support, OPCON, TACON, Coordination relationship types
- Relationship-type-specific connector styling (colors, dashes)
- Parent-child visual connectors
- Connector hit detection for interaction

### Technical
- SVG connector rendering engine
- Bezier, Elbow, Straight connector style options

---

## [v10.0.0] — 2025-12-01 — Core Unit Metadata & Editing

### Added
- Rich unit properties: designation, commander, strength, readiness, task, equipment
- Checkbox toggles for property display (showDesig, showCmd, showStr, showRdy, showTask)
- Inline rename and property editing
- Status badges (planned, present, damaged, destroyed)
- Modifier badges (reinforced, reduced, HQ)
- Edit panel with organized property sections

### Technical
- Node properties expanded from 5 to 20+ attributes
- localStorage autosave with serialize/deserialize

---

## [v9.0.0] — 2025-11-15 — Echelon & NATO Symbols

### Added
- NATO APP-6 echelon notation (·, ··, ···, |, ||, |||, X, XX, XXX, XXXX)
- 60+ unit type definitions with proper symbology
- Affiliation colors (friendly=blue, hostile=red, neutral=green, unknown=purple)
- Planned unit rendering (dashed borders)

### Technical
- `EM` (echelon map) constant with NATO codes
- `AC` (affiliation colors) constant
- `UT` (unit types) array with icon generators
- `getSym()` core rendering function (APP-6 spec implementation)

---

## [v8.0.0] — 2025-11-01 — Drag & Drop Hierarchy

### Added
- Drag units from palette to canvas
- Drag units to reposition on canvas
- Drag link icon (⤢) to change parent
- Parent-child constraint validation
- Circular dependency prevention

### Technical
- Drag-start/drag-over/drop event handlers
- `canSetParent()` validation function
- Parent assignment with `isDescendant()` check

---

## [v7.0.0] — 2025-10-20 — Snap Grid & Zoom

### Added
- 24px snap grid (toggleable with Snap button)
- Zoom in/out buttons
- Fit-to-screen layout
- Pan with middle-mouse or spacebar+drag
- Minimap visualization

### Technical
- Grid snapping with `snapV()` function
- Canvas zoom/pan via `zoom`, `panX`, `panY` state
- Minimap rendered to HTML5 Canvas

---

## [v6.0.0] — 2025-10-05 — Unit Palette & Sidebar

### Added
- Categorized unit type palette (Combat, Support, HQ, Other)
- Searchable palette with fuzzy matching
- Recent types carousel
- Custom unit type creation
- Sidebar collapse/expand

### Technical
- Unit categories in `UT` array with `cat` property
- Search state in `window.unitSearch`

---

## [v5.0.0] — 2025-09-20 — Core ORBAT Diagram Editing

### Added
- Create root units with "＋ Root" button
- Add subordinate units with + button on nodes
- Delete units with Delete key or context menu
- Copy/Paste units
- Auto-layout algorithm (tree layout)
- Node selection and affiliation assignment

### Technical
- Core `nodes` object dictionary
- `addRootUnit()`, `addChildNode()`, `deleteNode()` functions
- `selectedId` for single selection
- Tree layout algorithm with caching

---

## [v4.0.0] — 2025-09-05 — Toolbar & Controls

### Added
- Toolbar with grouped buttons
- Export options (JSON, PNG, SVG, PDF)
- Import dialog
- Print support
- Settings and options panel

### Technical
- Toolbar button factory function `ensureBtn()`
- SVG/Canvas export functions

---

## [v3.0.0] — 2025-08-20 — Visualization & Rendering

### Added
- SVG symbol rendering engine
- Node HTML element generation
- CSS styling for nodes and connectors
- Interactive hover and selection states

### Technical
- `renderNode()` function for DOM creation
- SVG viewBox scaling
- CSS class-based theming

---

## [v2.0.0] — 2025-08-05 — Persistence & Storage

### Added
- localStorage-based persistence
- Auto-save every 2.5 seconds
- ORBAT schema version 2
- Document serialization/deserialization

### Technical
- `serializeDocument()` / `deserializeDocument()` pair
- Schema versioning for forward compatibility
- `saveState()` debounced timer

---

## [v1.0.0] — 2025-07-15 — Initial Release

### Added
- Basic ORBAT diagram creation interface
- Unit creation, editing, deletion
- Simple tree layout
- Browser-based web app
- NATO APP-6 symbol proof-of-concept

### Technical Foundation
- Vanilla JavaScript with no external dependencies
- HTML5 Canvas and SVG rendering
- localStorage for persistence
- Modular IIFE pattern for code organization

---

## Navigation

- **[README.md](README.md)** — User guide and feature overview
- **[GitHub](https://github.com/rkoivu/ORBATer)** — Source code repository
- **[Live Demo](https://rkoivu.github.io/ORBATer/)** — Try it now

---

## Versioning

ORBATer uses semantic versioning:
- **MAJOR** — Breaking API/UI changes, significant architectural shifts
- **MINOR** — New features, backward-compatible
- **PATCH** — Bug fixes, performance improvements

---

## Reporting Issues

Found a bug or have a feature request?
1. Check existing issues on [GitHub Issues](https://github.com/rkoivu/ORBATer/issues)
2. Provide steps to reproduce for bugs
3. Include browser and OS information
4. Attach ORBAT JSON files if relevant
