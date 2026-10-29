# Changelog

All notable changes to the `@adminuiux/masonry` plugin will be documented in this file.

## [1.0.0] - 2026-10-28

### Added
- Pure zero-dependency responsive masonry layout engine.
- Shortest-column bin-packing layout algorithm with nested parent container awareness.
- Multi-column spanning support (`data-span="2"`).
- Dynamic aspect-ratio height auto-alignment (`data-aspect-ratio="16/9"`).
- Interactive fullscreen photo slider lightbox with animated `.backdrop`.
- Detection and binding of on-page `#adminuiuxLightboxModal` for full frontend HTML/CSS customization.
- Touch-swipe gesture detection for mobile devices (`touchstart`, `touchmove`, `touchend`).
- Keyboard navigation (`ArrowLeft`, `ArrowRight`, `Escape`).
- Zoom in/out, photo download, and fullscreen theater modes.
- `data-thumb-preview` support (default `true`, hide when `false`).
- Aliases for column configuration: `data-columns`, `data-column`, `data-cols`, and `data-col`.
- JSON responsive breakpoint map via `data-responsive='{"768": 2, "1024": 3}'`.
- Dynamic programmatic methods: `setColumns(cols)`, `addItem(cardEl)`, `refresh()`, `layout()`, `destroy()`, `closeLightbox()`.
- Automatic layout recalculation on Bootstrap 5 tab switch (`shown.bs.tab`).
- UMD, ESM, and browser bundle distributions.

