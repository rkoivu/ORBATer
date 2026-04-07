# ORBATer To-Do

This backlog is grouped by estimated implementation effort so the next work can be chosen by cost, not by category.

## Recently Completed

- Added visible always-on toolbar state for layout mode, snap mode, link mode, and focus availability.
- Added quick duplicate-as-sibling and duplicate-as-child actions in the properties panel and context menu.
- Added toolbar actions and keyboard shortcuts for centering on the first hostile or neutral root.
- Improved control labels, action toasts, and empty states so common actions read more clearly across the UI.
- Fixed tab switching and new-tab restore paths to use full document state instead of drifting `window.*` tab snapshots.
- Cleaned up more visible action labels and empty-state copy in the link and attachments UI.
- Improved tabs and saved-view access with cleaner labels, Enter-to-save support, and clearer feedback toasts.

## Small

- Replace remaining text-encoding artifacts in labels and button copy with clean ASCII or intentional symbols.
- Unify toolbar iconography and wording so controls read consistently across core and patch modules.
- Improve command palette ranking, keyboard navigation, and grouping.
- Add empty states for more modals and panels so blank views explain what to do next.
- Persist grid mode per document/tab instead of resetting to the default on reload.
- Add a clearer readonly/share banner so exported readonly links are harder to mistake for editable views.
- Add recent files / recent diagrams support on top of current localStorage persistence.
- Add a clipboard preview or paste target indicator before large paste operations.
- Add inline validation hints for malformed imports and unsupported schemas before apply.
- Add optional autosave status details showing last saved time and storage pressure.
- Add minimap viewport framing so users can see the current camera bounds inside the overview.
- Replace remaining `||` fallback patterns where valid `0`, `false`, or empty-string values can be lost.
- Harden localStorage failure paths so views, tabs, snapshots, and autosave fail consistently and visibly.
- Check for duplicate event listeners created by repeated modal or enhancement initialization.
- Fix stale documentation references whenever architecture or loaded files change.
- Add a simple local automated `npm` check setup with lint and smoke-test scripts.
- Add smoke-test coverage for tab switching, snapshot restore, import/export, and minimap visibility.
- Add clearer empty-state guidance to attachments, templates, and outline import flows.
- Add success/error toasts for view save, tab duplicate, and tab close actions where feedback is currently silent.

## Medium

- Add stronger visual distinction between selected, multi-selected, locked, and faded nodes.
- Refine mobile and narrow-width handling for the toolbar, tab strip, and side panels.
- Improve tab overflow handling with scrolling cues or a tab list dropdown.
- Add connector labels that can be edited directly on-canvas instead of only through panel state.
- Extend templates into reusable subtree presets that can be inserted under an existing parent, not only as full ORBAT starters.
- Add bulk tag management and saved filters for recurring analytic views.
- Add search-by-path and search-by-parent queries for large ORBATs.
- Add a recovery modal when storage quota is close to being exceeded.
- Review export code paths for large canvases and large embedded images.
- Verify readonly mode actually blocks drag, delete, paste, and panel mutation paths end-to-end.
- Remove or integrate dead / unloaded modules so repo structure matches runtime reality.
- Review all late-loaded monkey patches for order-dependent breakage after future refactors.
- Standardize modal creation and button wiring helpers so patches do not clone logic.
- Add export presets for briefing slide, A4 print, and wide-screen command post formats.
- Add a dedicated diagnostics modal for storage usage, schema version, feature flags, and autosave health.
- Add keyboard shortcuts help grouped by workflow instead of a flat reference list.
- Add bulk rename patterns for selected nodes, such as prefix, suffix, and sequential numbering.
- Add duplicate-subtree and mirror-layout actions for faster ORBAT construction.

## Large

- Audit all modules for `window.*` state writes that can drift from closure-owned state in `symbols-data.js`.
- Introduce a small central state adapter so feature modules stop patching raw globals directly.
- Split large enhancement files into narrower responsibility modules with explicit boot order.
- Add collapsible task groups or lane regions so users can organize branches by phase, mission, or functional area.
- Add an assumptions / notes layer for briefing annotations, arrows, and map callouts.
- Add optional background map georeferencing so units can be placed against a scaled operational map.
- Add a proper readonly presentation mode with hard-disabled editing paths, not just visual cues.
- Add multi-user import/merge tools so two JSON diagrams can be compared and selectively merged.
- Add a documented convention for CSS ownership to reduce style overrides across multiple files.
- Add unit/integration test seams for core document state, selection state, and import/export validation.
- Migrate storage, tabs, views, and snapshots behind a single document/session service.
- Add undo/redo diff summaries so history navigation is easier to trust before restoring state.
