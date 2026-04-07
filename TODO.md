# ORBATer To-Do

This backlog collects high-value ideas for future work across product features, UI/UX, quality-of-life improvements, and bug-fix hardening.

## Recently Completed

- Added visible always-on toolbar state for layout mode, snap mode, link mode, and focus availability.
- Added quick duplicate-as-sibling and duplicate-as-child actions in the properties panel and context menu.
- Added toolbar actions and keyboard shortcuts for centering on the first hostile or neutral root.
- Improved control labels, action toasts, and empty states so common actions read more clearly across the UI.

## Features

- Add connector labels that can be edited directly on-canvas instead of only through panel state.
- Add collapsible task groups or lane regions so users can organize branches by phase, mission, or functional area.
- Extend templates into reusable subtree presets that can be inserted under an existing parent, not only as full ORBAT starters.
- Add multi-user import/merge tools so two JSON diagrams can be compared and selectively merged.
- Add an assumptions / notes layer for briefing annotations, arrows, and map callouts.
- Add optional background map georeferencing so units can be placed against a scaled operational map.
- Add export presets for briefing slide, A4 print, and wide-screen command post formats.
- Add a proper readonly presentation mode with hard-disabled editing paths, not just visual cues.
- Add bulk tag management and saved filters for recurring analytic views.
- Add search-by-path and search-by-parent queries for large ORBATs.

## UI/UX

- Replace remaining text-encoding artifacts in labels and button copy with clean ASCII or intentional symbols.
- Unify toolbar iconography and wording so controls read consistently across core and patch modules.
- Improve command palette ranking, keyboard navigation, and grouping.
- Refine mobile and narrow-width handling for the toolbar, tab strip, and side panels.
- Improve tab overflow handling with scrolling cues or a tab list dropdown.
- Add stronger visual distinction between selected, multi-selected, locked, and faded nodes.
- Persist grid mode per document/tab instead of resetting to the default on reload.
- Add a clearer readonly/share banner so exported readonly links are harder to mistake for editable views.

## Quality of Life

- Add recent files / recent diagrams support on top of current localStorage persistence.
- Add a clipboard preview or paste target indicator before large paste operations.
- Add inline validation hints for malformed imports and unsupported schemas before apply.
- Add optional autosave status details showing last saved time and storage pressure.
- Add a recovery modal when storage quota is close to being exceeded.
- Add minimap viewport framing so users can see the current camera bounds inside the overview.

## Bug Fixes

- Audit all modules for `window.*` state writes that can drift from closure-owned state in `symbols-data.js`.
- Replace remaining `||` fallback patterns where valid `0`, `false`, or empty-string values can be lost.
- Review all late-loaded monkey patches for order-dependent breakage after future refactors.
- Harden localStorage failure paths so views, tabs, snapshots, and autosave fail consistently and visibly.
- Verify readonly mode actually blocks drag, delete, paste, and panel mutation paths end-to-end.
- Remove or integrate dead / unloaded modules so repo structure matches runtime reality.
- Add smoke-test coverage for tab switching, snapshot restore, import/export, and minimap visibility.
- Check for duplicate event listeners created by repeated modal or enhancement initialization.
- Review export code paths for large canvases and large embedded images.
- Fix stale documentation references whenever architecture or loaded files change.

## Technical Cleanup

- Introduce a small central state adapter so feature modules stop patching raw globals directly.
- Split large enhancement files into narrower responsibility modules with explicit boot order.
- Standardize modal creation and button wiring helpers so patches do not clone logic.
- Add a single diagnostics panel for storage usage, schema version, and feature flags.
- Add a documented convention for CSS ownership to reduce style overrides across multiple files.
