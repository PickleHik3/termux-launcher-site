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
5. **Keyboard:** the built-in keyboard by default, an Android IME, or none.

## Terminal workspace

Long-press the terminal and open **Command palette** to search terminal actions. The palette places search, result count, and breadcrumb in its top row, with six frequent-action keycaps below.

Split a window into tiled panes, then choose **Float / dock pane** or press `Ctrl+Alt+F` to lift the focused pane above the layout. Drag its top handle to move it and its bottom-right grip to resize it. Dragging inside the terminal remains mouse input for the running program. Toggle the action again to dock the pane. The last tiled pane cannot float.

Floating panes keep their position and size through activity recreation and workspace save and restore. The sessions panel and browser shorten working directories inside the Termux home to `~` or `~/subdirectory`. The session-switch chip uses launcher session numbers and appears only when the session changes.

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

With notification-listener access, the launcher can show notification dots, controlled notification popups and replies, and current media. Without that permission, the dock and app launching still work normally.

Never grant notification access just because a setup guide mentions it; grant it only if you want those features.

## Settings map

Open Settings by long-pressing the terminal and choosing **More → Settings**.

| Section | What it controls |
| --- | --- |
| **Quick start tour** | Replay the beginner walkthrough |
| **TAI · Termux AI** | Model catalog/imports, roles, runtime, and local API |
| **Shizuku** | Backend status, permission, privileged helpers |
| **Termux** | Core terminal I/O, view, and debugging preferences |
| **Appearance** | Theme, wallpaper, terminal, dock, icons, sessions menu |
| **Apps & Access** | Launcher rows, search, ranking, Home selection, Android access |
| **Keyboard** | Built-in keyboard themes, sizing, color editor, feedback, keys |

![Current launcher settings map](assets/onboarding/screenshots/03-settings-hub.webp)

Fresh installs use the built-in keyboard. Existing installs keep their input method. Change it under **Keyboard → Input method**.

The edit-surface popup remembers whether Dock, Keyboard, Status, or Other was open and returns to that section the next time you open it.

> Live wallpapers can prevent reliable blur capture. Set blur to zero for clear glass, or use a static/launcher-managed wallpaper when tuning the frosted dock.
