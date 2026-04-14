# ORBATer To-Do

This backlog is grouped by estimated implementation effort so the next work can be chosen by cost, not by category.

## Recently Completed

- Added a visible `Guide` button and startup-launcher tour card so onboarding is easier to discover after first use.
- Added persistent palette favorites with pin buttons, while keeping recent symbols surfaced for fast repeated placement.
- Added command-palette aliases and shorthand matching so common military/search terms find actions more reliably.
- Added outline export so the current ORBAT or selected branch can be copied/downloaded as indented text.
- Added grouped keyboard-shortcuts help by workflow instead of keeping a flat reference list.
- Improved tab overflow handling with a tab-list dropdown and overflow fade cues.
- Added stronger visual distinction between selected, multi-selected, locked, and faded nodes.
- Replaced toolbar/button mojibake, aligned control wording, and cleaned more visible labels to read consistently across the shell and patch modules.
- Added a startup launcher with recent diagrams, plus stronger saved-view, snapshot, and command-palette guidance when those lists are empty.
- Added import preflight review for JSON files and inline validation hints for outline imports before apply.
- Added clearer empty-state guidance for attachments, templates, outline import, and recent/startup recovery flows.
- Added grouped command-palette sections with arrow-key navigation and cleaner action labels.
- Added more palette-ready unit variants including cyber, deception, rail transport, and drone swarm options.
- Refreshed README architecture notes with the current CSS/script load order and module ownership.
- Added visible always-on toolbar state for layout mode, snap mode, link mode, and focus availability.
- Added quick duplicate-as-sibling and duplicate-as-child actions in the properties panel and context menu.
- Added toolbar actions and keyboard shortcuts for centering on the first hostile or neutral root.
- Improved control labels, action toasts, and empty states so common actions read more clearly across the UI.
- Fixed tab switching and new-tab restore paths to use full document state instead of drifting `window.*` tab snapshots.
- Cleaned up more visible action labels and empty-state copy in the link and attachments UI.
- Improved tabs and saved-view access with cleaner labels, Enter-to-save support, and clearer feedback toasts.
- Added a zero-dependency local automation setup with `npm` scripts for validation, static builds, and local serving.
- Tightened the local serve flow and tab/view text cleanup so common commands fail more clearly and render with cleaner labels.
- Added clearer first-use guidance and feedback in history, templates, and outline import flows.
- Persisted grid mode in document state so tabs and restores keep the selected grid style.
- Added a readonly/share banner, recent diagram restore list, paste target preview, minimap viewport framing, and drag/reparent preview ghosting.
- Improved storage failure feedback for autosave, tabs, views, and snapshots, with clearer import recovery hints and stronger command palette ranking.

## Tier 1

- Tier 1 backlog is currently clear.

## Tier 2

- Replace remaining `||` fallback patterns where valid `0`, `false`, or empty-string values can be lost.
- Add a recovery modal when storage quota is close to being exceeded.
- Add NATO symbol and modifier tooltips so users can understand icons without leaving the app.
- Harden localStorage failure paths so views, tabs, snapshots, and autosave fail consistently and visibly across every module.
- Check for duplicate event listeners created by repeated modal or enhancement initialization.
- Review export code paths for large canvases and large embedded images.
- Verify readonly mode actually blocks drag, delete, paste, and panel mutation paths end-to-end.
- Remove or integrate dead / unloaded modules so repo structure matches runtime reality.
- Review all late-loaded monkey patches for order-dependent breakage after future refactors.
- Standardize modal creation and button wiring helpers so patches do not clone logic.
- Refine mobile and narrow-width handling for the toolbar, tab strip, and side panels.
- Add explicit connector style controls for Bezier, elbow, and straight routing in the main toolbar.
- Add search-by-path and search-by-parent queries for large ORBATs.
- Extend templates into reusable subtree presets that can be inserted under an existing parent, not only as full ORBAT starters.
- Add export presets for briefing slide, A4 print, and wide-screen command post formats.
- Add connector labels that can be edited directly on-canvas instead of only through panel state.
- Add bulk rename patterns for selected nodes, such as prefix, suffix, and sequential numbering.
- Add a dedicated diagnostics modal for storage usage, schema version, feature flags, and autosave health.
- Add bulk tag management and saved filters for recurring analytic views.
- Add smoke-test coverage for tab switching, snapshot restore, import/export, and minimap visibility.
- Add per-node pinning or anchoring so selected units stay fixed during auto-layout passes.
- Add UI customization controls for line thickness, symbol size, font choice, and theme presets.
- Add smart labels that auto-format unit names and optionally toggle between abbreviated and expanded military naming.
- Add a data panel with tabs for general, structure, equipment, logistics, and notes.
- Add richer connector semantics and styling for command, support, attached, OPCON, and TACON relationships.
- Add branch collapse/expand controls so large formations can be hidden without changing the underlying structure.
- Add full keyboard-only navigation across the canvas, palette, modals, and edit panel.
- Add geospatial coordinate fields and coordinate-format helpers for units that need map-reference metadata without full map sync.
- Add a text-to-ORBAT parser that can turn freeform structured text into an initial hierarchy, beyond the current indented outline import.
- Add a doctrine validator that warns when a formation looks structurally unrealistic for the selected doctrine.
- Add strength/composition aggregation so parent units can show rolled-up personnel, equipment, and readiness from subordinates.
- Add duplicate-subtree and mirror-layout actions for faster ORBAT construction.
- Add alternate views such as flat table view, equipment summary view, and command-chain view.
- Add layer visibility system so users can toggle structure, equipment, logistics, and relationship overlays independently.
- Add map overlay mode for placing units against a reference map without fully georeferenced behavior.
- Add import support for ORBAT Mapper exports and ORBAT XML interchange formats.
- Add smarter connector routing so lines avoid overlapping nodes and stay readable in dense layouts.
- Add richer relationship modeling so units can carry multiple relationship types, not only a single parent/edge meaning.

## Tier 3

- Audit all modules for `window.*` state writes that can drift from closure-owned state in `symbols-data.js`.
- Add loading/skeleton UI for heavy imports, restores, and large template loads.
- Add documented convention for CSS ownership to reduce style overrides across multiple files.
- Add proper readonly presentation mode with hard-disabled editing paths, not just visual cues.
- Improve mobile compatibility beyond layout tweaks, including touch interactions, panel behavior, and narrow-screen workflows.
- Add undo/redo diff summaries so history navigation is easier to trust before restoring state.
- Add collapsible task groups or lane regions so users can organize branches by phase, mission, or functional area.
- Add assumptions / notes layer for briefing annotations, arrows, and map callouts.
- Add more configurable random ORBAT generator with nation, doctrine, era, and output-size parameters.
- Add richer mode switching across structure, task organization, analysis, and logistics workflows.
- Add unit/integration test seams for core document state, selection state, and import/export validation.
- Add user-defined formula fields so derived readiness, combat-power, or sustainment scores can be customized per project.
- Introduce a small central state adapter so feature modules stop patching raw globals directly.
- Split large enhancement files into narrower responsibility modules with explicit boot order.
- Add optional background map georeferencing so units can be placed against a scaled operational map.
- Add timeline-aware phased views so users can compare planned, current, and follow-on task organizations side by side.
- Add a combat-power calculator with weighted scoring by subunit type and an overall effectiveness rating.
- Add a logistics layer covering supply state, ammo, fuel, and sustainment readiness.
- Add a scenario builder for objectives, axes of advance, task links, and mission overlays.
- Add force comparison tools to compare two ORBATs by strength, equipment balance, and combat-power estimate.
- Add casualty and attrition simulation across phases so combat losses change strength and effectiveness over time.
- Add multi-user import/merge tools so two JSON diagrams can be compared and selectively merged.
- Add plugin or custom-rule hooks so doctrine validators, importers, and derived metrics can be extended without patching core files.
- Add performance optimizations for very large ORBATs, including render throttling, connector batching, and viewport culling.
- Migrate storage, tabs, views, and snapshots behind a single document/session service.
- Add full map integration with map-aware overlays, unit placement workflows, and shared map state across views.
- Add an AI-assisted builder that can draft an ORBAT from user prompting and then hand the result back for manual refinement.
- Add campaign mode to track units over time, including reinforcements, losses, and changing readiness across phases.

## Tier 4

- Integrate real `milsymbol.js` rendering instead of maintaining the current custom symbology approximation layer.
- Add a full milsymbol modifier UI for symbol sets, amplifiers, HQ/task-force modifiers, mobility, and status options.
- Add broader APP-6 / MIL-STD-2525 coverage for equipment, installations, tactical graphics, and advanced text/graphic modifiers.
- Add server-backed document sync with accounts, revision history, and cross-device restore.
- Add collaborative real-time editing with shared document state, conflict handling, and presence.
