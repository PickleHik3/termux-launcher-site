---
title: The launcher surface
order: 20
---

The terminal is Home. Launcher controls sit around it and disappear back into the same Material surface instead of replacing your shell with a separate app drawer.

![Home surface showing tmux, prompt, dock, A–Z row, navigation keys, and keyboard](assets/onboarding/screenshots/01-home-terminal.webp)

## Read the screen from top to bottom

1. **Status and terminal:** your Termux or tmux session.
2. **Apps row:** pinned, ranked, or filtered launch targets.
3. **A–Z row:** direct catalog filtering and launch gestures.
4. **Navigation/Extra Keys row:** configurable terminal and tmux controls.
5. **Keyboard:** Android IME or the optional built-in keyboard.

## Apps row

Tap an icon to launch it. Swipe between dock pages when more icons are available.

Long-press an icon for the actions Android and the current item support:

- pin or unpin;
- move within the dock;
- move into or out of a folder;
- launch an app shortcut;
- change or reset its icon;
- open app info;
- uninstall.

Long-press empty dock space to open list-based pin and folder management. Your explicit pins stay under your control even when usage ranking is enabled.

## A–Z row

- Drag horizontally to filter by initial letter.
- Keep dragging to preview the focused result.
- Swipe upward from a letter to launch the highlighted app.
- Double-tap the row to lock only after choosing a lock method under Apps & Access.

The lock method can be off, accessibility-backed, or Shizuku-backed depending on your setup. Normal launcher use does not need either privileged option.

## Search from terminal input

The default split character is `%`. Type it before an app name without pressing Enter:

```text
%maps
```

![Live percent search filtering the dock](assets/onboarding/screenshots/02-terminal-app-search.webp)

Backspace clears the query. Change the split character under **Settings → Apps & Access** if `%` conflicts with your shell habits.

## Notifications and media

With notification-listener access, the launcher can show notification dots, controlled notification popups/replies, current media, and the corresponding LauncherCtl data. Without that permission, the dock and app launching still work normally.

Never grant notification access just because a setup guide mentions it; grant it only if you want those features.

## Settings map

Open Settings by long-pressing the terminal and choosing **More → Settings**.

| Section | What it controls |
| --- | --- |
| **Quick start tour** | Replay the beginner walkthrough |
| **TAI · Termux AI** | Model catalog/imports, roles, runtime, API and MCP integration |
| **Shizuku** | Backend status, permission, privileged helpers |
| **Termux** | Core terminal I/O, view, and debugging preferences |
| **Appearance** | Theme, wallpaper, terminal, dock, icons, sessions menu |
| **Apps & Access** | Launcher rows, search, ranking, Home selection, Android access |
| **Keyboard** | Built-in keyboard themes, sizing, color editor, feedback, keys |

![Current launcher settings map](assets/onboarding/screenshots/03-settings-hub.webp)

> Live wallpapers can prevent reliable blur capture. Set blur to zero for clear glass, or use a static/launcher-managed wallpaper when tuning the frosted dock.
