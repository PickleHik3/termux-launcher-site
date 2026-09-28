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

## Ready to capture (feature shipped in v0.2.35)

| Target page | Future asset | Status |
| --- | --- | --- |
| Terminal | Android-widget pane screenshot | UNBLOCKED — the widget pane shipped in v0.2.35 (AppWidget host, pages, bind/configure flows). |
| Terminal | Android-widget add/move/resize recording | UNBLOCKED — long-press hand-off, snap ghost, per-axis resize handles and the page menu all shipped in v0.2.35. |

Capture a populated page with at least two ordinary Android widgets and a short edit-mode recording that adds, moves, resizes and moves a widget between pages. Provide MP4, WebM and a WebP poster for the recording.

## Docs rework (v1.0, 2026-09-28)

The widget captures above now target the Home screen & apps page (`#wiki/home-screen`), not Terminal.

| Target page | Future asset | Status |
| --- | --- | --- |
| Docs home | Tour infographic as inline SVG, dropped into `_includes/tour-infographic.html`, then set `infographic: true` in `_data/docs_home.yml` | From the Claude Design prompt in the docs spec. |
| Layout & full screen | Layout editor recording: drag a bar to another edge, keyboard on/off, minimal mode from the corner tab | Page is text-first. |
| Look & themes | Appearance editor versus Layout editor screenshots | `surface-editor` stands in today. |
| Keyboard | Docked, floating and split cycle recording; Look → Keyboard look screenshot | Page is text-first for these. |
| Terminal features | Clipboard history screenshot | Page is text-first for this. |
| On-device AI, Voice & speech, Linux display | Card posters for the docs home | Cards have no poster yet. |

## Capture rules

- Keep recordings silent, short and single-purpose. Avoid personal notifications, account names, tokens and device identifiers.
- Use the current dev build and default theme unless the capture specifically demonstrates customization.
- Provide MP4, WebM and a WebP poster for recordings; use WebP for screenshots.
- Verify autoplay/tap-to-play and layout at desktop and mobile widths before publishing.
