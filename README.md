# ORBATer
ORBAT maker app
https://rkoivu.github.io/ORBATer/

# ORBATer modular structure by purpose

## CSS
- `css/base.css` — base layout, components, app shell styling
- `css/interaction-overlays.css` — connector hit areas, tooltips, dimming, resize handles
- `css/toolbar-menus-import.css` — grouped toolbar menus, status bar toggle, outline import UI
- `css/views-command-history.css` — animated layout, saved views, snapshots, command palette styling

## JavaScript
- `js/symbols-data.js` — APP-6 symbol definitions and core unit type data
- `js/identity-search-insignia.js` — tags, insignia, smart labels, search/filter helpers
- `js/custom-icon-pack.js` — embedded custom icon pack support
- `js/selection-focus-highlights.js` — focus selection, tag highlight, node tooltip helpers
- `js/qol-zoom-status-rename.js` — zoom buttons, status helpers, inline rename, recent types
- `js/dirty-state-navigation.js` — unsaved state tracking, navigation warnings, paste point handling
- `js/print-tooltips-shortcuts.js` — print CSS, toolbar titles, user guidance
- `js/themes-locks-search-background.js` — theme controls, legend, lock/fade, background image, search extras
- `js/compat-fixes-statusbar.js` — compatibility fixes, global exposures, status bar enhancements
- `js/history-search-connectors.js` — history modal, search counter consolidation, connector interactions
- `js/tooltips-resize-minimap.js` — node/connector/minimap tooltips and resize interactions
- `js/stats-outline-tour-stacking.js` — subtree stats, outline import, guided tour, stacking support
- `js/toolbar-menus-auto-organise.js` — toolbar grouping menus, auto organise, bottom bar toggle
- `js/outline-import-enhancements.js` — tab indent/outdent and clear-existing for text import
- `js/views-snapshots-command-palette.js` — saved views, snapshots, ORBAT mode toggle, command palette