---
title: Command Palette
order: 15
---
# Command Palette

Every action the launcher knows - splits, sessions, windows, appearance, clipboard, even launching Android apps - lives in one searchable list. Keybinds, keyboard gestures and the palette all run the same actions, so anything you can bind to a key you can also just type.

> ![](/termux-launcher-site/assets/uploads/command-palette-optimized.gif)

## Opening it

Any of these:

1. **Swipe up from the space bar** of the in-app keyboard.
2. **Ctrl + Alt + Shift + P** on a hardware keyboard.
3. **Ctrl + Alt + Space**, release, then **P** (two-stroke chord).
4. **Long press the terminal** and pick *Command palette* from the action sheet.

## Using it

* The palette opens with just a search box and a strip of six keycaps - your most used actions end up there over time.
* **Type to filter.** Matching is forgiving: titles, word starts, fuzzy letters, action ids ("split pane" finds *Split pane vertically*) and even keybinds (typing `ctrl+alt+v` finds whatever is bound to it) all work.
* **Press ↓** with nothing typed to browse the whole catalogue, grouped by category.
* **Enter** runs the focused action, **Esc** or a tap outside closes.
* If nothing matches, **Enter runs what you typed in the shell** instead - so a quick command doesn't need a round trip to the keyboard.

Some rows want more from you:

* Rows marked `›` open a small submenu of choices (like pane resize directions).
* Rows marked `args` ask you to type a value - rename a session, for example - then Enter applies it.
* Destructive actions (like *Kill focused pane*) ask for confirmation first.
* Rows that can't run right now stay visible but greyed out, with the reason ("no text selected", "no active session").

## What's inside

* **Pane** - splits, focus, resize, float/dock, layouts, scratchpad.
* **Window / Session** - create, close, switch, rename, session browser, save & load workspaces.
* **Terminal** - toggle keyboard and dock, font size, search scrollback, hints, share transcript, reset.
* **Clipboard** - copy selection, paste.
* **Appearance** - wallpaper, cursor trail, surface editor.
* **Apps** - every installed Android app appears as a row, ranked by how often you launch things. This is separate from the `%` app search in the terminal, but both use the same ranking.
* **Sessions** - every live session as a row, jump straight to it.

## Handy defaults

A few worth remembering (the full set, and how to change them, is on the [configs](#wiki/tmux) page):

| Keys                | Action                               |     |
| ------------------- | ------------------------------------ | --- |
| Ctrl + Alt + V / H  | Split pane vertically / horizontally |     |
| Ctrl + Alt + arrows | Move pane focus                      |     |
| Ctrl + Alt + F      | Float / dock the pane                |     |
| Ctrl + Alt + `      | Toggle scratchpad                    |     |
| Ctrl + Alt + K      | Toggle the keyboard                  |     |
| Ctrl + Alt + S      | Search scrollback                    |     |
| Ctrl + Alt + 1…9    | Jump to session by number            |     |

Tip: hold **Ctrl + Alt** on the in-app keyboard and the bound keys light up with a legend of what they do.

Every one of these can be remapped, and new keys bound to any palette action, from `~/.termux/termux-launcher-bindings.conf` - see [configs](#wiki/tmux).
