# Documentation media capture log

Captured from the current Android dev build on 2026-08-17. Public pages contain finished media only; no placeholder frames were added.

## Added in this pass

| Target page | Asset | Result |
| --- | --- | --- |
| Home Launcher | `assets/showcase/features/app-drawer-layouts.{mp4,webm}` and poster | Shows vertical, horizontal-paged and category layouts. |
| Home Launcher | `assets/showcase/features/landscape-launcher.{mp4,webm}` and poster | Shows the landscape dock rail and denser drawer. |
| Home Launcher | `assets/screenshots/drawer-category-sorting.webp` | Shows both on-device Gemma and copy/paste AI-chat choices. |
| Extra Keys recipes | `assets/showcase/features/extra-keys-editor.{mp4,webm}` and poster | Shows key actions, glyph selection, another page and another row. |
| Terminal | `assets/showcase/features/surface-editor.{mp4,webm}` and poster | Shows the implemented clock and live surface editor without implying Android-widget editing exists. |
| Terminal | `assets/screenshots/clock-status-pane.webp` | Shows the implemented expanded clock/status surface. |
| Essential notifications | `assets/screenshots/essential-notification-rule.webp` | Shows package, keyword and clear-on-dismiss controls. |
| Terminal fonts | `assets/screenshots/terminal-fonts-picker.webp` | Shows the managed setup and installed font-family cards. |
| Terminal fonts | `assets/screenshots/box-drawing-comparison.webp` | Compares synthesized box drawing with font-rendered seams. |
| Terminal fonts | `assets/screenshots/narrow-symbols-comparison.webp` | Compares default symbol expansion with a one-cell rule. |

## Capture after the feature is implemented

| Target page | Future asset | Blocker |
| --- | --- | --- |
| Terminal | Android-widget pane screenshot | `origin/dev` exposes a Widget pane setting, but the current terminal layout hosts the clock only. The layout source explicitly describes a later widget editor. |
| Terminal | Android-widget add/move/resize recording | There is no implemented AppWidget picker, grid/page editor, resize flow or long-press widget menu to record yet. Do not substitute the clock/surface editor as proof of this future workflow. |

When the feature lands, capture a populated page with at least two ordinary Android widgets and a short edit-mode recording that adds, moves, resizes and moves a widget between pages. Provide MP4, WebM and a WebP poster for the recording.

## Capture rules

- Keep recordings silent, short and single-purpose. Avoid personal notifications, account names, tokens and device identifiers.
- Use the current dev build and default theme unless the capture specifically demonstrates customization.
- Provide MP4, WebM and a WebP poster for recordings; use WebP for screenshots.
- Verify autoplay/tap-to-play and layout at desktop and mobile widths before publishing.
