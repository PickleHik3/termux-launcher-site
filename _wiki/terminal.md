---
title: Terminal features
group: Terminal
order: 80
---
The terminal core is upstream Termux, with a lot built on top. This page covers what's different. Panes, windows, sessions and workspaces have their own page: [Panes & sessions](#wiki/panes).

## Copy, paste and mouse mode

Holding text to copy is one of the tour's moves - a quick reminder here, then the rest:

* **Drag scrolls, always** - one or two fingers. Inside mouse-aware apps the drag is translated to scroll-wheel events, so lists in `htop`, lazygit or vim scroll naturally.
* **Tap sends a click** when the running app tracks the mouse.
* **Press and hold, then drag** to hold the mouse button down - a small haptic marks the handoff. From there you can select text in vim, drag tmux-style splits, or resize TUI panes exactly like a desktop mouse. A quick long-press without moving still opens ordinary text selection with the copy toolbar, and a drag before either haptic just scrolls.
* **In a plain shell** there's no mouse for an app to take, so the same hold always starts text selection.
* **Mouse mode** turns every touch into the mouse, for a program that wants one without you holding first: a finger down clicks at that cell, held and dragged it drags, two fingers turn the wheel. It's the Keyboard key's swipe-up on the shipped extra-keys row, or `tool:mouse.toggle` on any key or chord; a small mouse icon at the end of the status bar shows it's on.
* **Pinch to zoom** changes the focused pane's font size, with jitter filtering so two-finger scrolling doesn't zoom by accident. A new split or window inherits the size of the pane it came from; panes you've never zoomed keep following the global terminal size.

## Find text

**Ctrl + Alt + S** searches the focused pane's history and screen, case-insensitively, and jumps straight to a result.

## Images, GIFs and graphics

Three graphics protocols are supported out of the box - nothing to enable:

* **Sixel** and **iTerm2 inline images** - so `img2sixel`, `chafa` and friends just work.
* **Kitty graphics protocol** - the full modern set: PNG and raw pixel data, placements, z-index, and **animation**. Send an animated GIF through it and it keeps playing on the terminal's own clock, even after the program that sent it exits.

```clip
src: assets/showcase/raw/fetch
title: Graphics in a pane
formats: mp4
caption: fastfetch drawing its logo through the kitty graphics protocol, over a wallpaper-themed prompt.
```

```clip
name: kew
title: Album art in the terminal
caption: kew, a terminal music player, drawing cover art through the same graphics protocol.
```

Tested clients: `timg -pk`, `chafa -f kitty`, and **yazi**'s image previews all work. One caveat: `kitten icat` itself isn't usable - kitty's `kitten` binary isn't packaged for Android and crashes before reaching the terminal. Use `timg` or `chafa` instead.

## Big and small text

A program can draw a word or a line at any size it likes, not just the one cell every other character gets - kitty's text-sizing protocol (`OSC 66`), which this terminal implements. A heading can print twice as tall and twice as wide as body text, or a status glyph can shrink to a fraction of a cell, without leaving text mode. Selecting any part of an enlarged block selects and copies all of it as one piece of text.

If a pane gets too narrow for a block already on screen, it drops back to normal size on its own row and grows again once the pane is wide enough - rotating the phone keeps a block whole either way.

## Links in TUIs

Programs that emit proper OSC 8 hyperlinks are reliable: the link is underlined, and tapping it shows you the full target before anything opens. Only `http`, `https`, `mailto`, `tel`, `sms`, `geo`, `ftp` and `ftps` schemes can be opened this way; anything else, `file` links included, can only be copied.

Plain-text URLs picked out of ordinary output are still a bit hit-or-miss, especially with a program that redraws its own chrome around the text - a workspace manager like herdr with its sidebar open is the case that trips it up most. If an underline doesn't look right, try scrolling a little; the detection re-runs on the visible screen.

**Ctrl + Alt + U** pulls up keyboard-labelled hints instead, extracted straight from what's on screen: URLs, absolute and relative paths, and `path:line[:column]` references. Pick a label to open a URL or copy anything else; hold Shift while picking a URL to copy it instead of opening it.

## Clipboard history

Swipe down-left on the Ctrl key (the clipboard corner) to open the keyboard's clipboard history in place of the keys. It lists what you've copied **in the launcher** - a terminal selection, the keyboard's copy/cut keys, a link or a hint you copied from a sheet, a yank in find mode, and anything a program copies with `launcherctl clipboard copy` or an OSC 52 escape. What you copy in other apps isn't collected; the paste key still pastes whatever's on the phone's clipboard, as always.

Tap an item to paste it and put it back on the clipboard. Pin an item to keep it above the rest and across restarts - recent items live in memory only, about thirty of them, and the panel keeps up to twenty pins; anything over 16 KB still reaches the clipboard but isn't listed. **Clear** asks twice and never touches pins.

Whether a program can *read back* what you've copied is a separate switch: **Settings → Terminal → Clipboard → Let programs read the clipboard**.

## Status and notifications from programs

* A window whose foreground program is actively using CPU shows a breathing rim; a background window that rings the terminal bell gets a pulsing rim until you focus it. A silent but busy build can look active, and a sleeping or idle TUI doesn't count as work just because it's open.
* Every window pill also picks up a small mark in the icon's corner: a tick or a cross once a command finishes unseen, or a bell once the window rings.
* A program with no terminal to write an escape into - a coding agent's tool runner, say - can still post a real Android notification (`launcherctl notify`, the same thing an `OSC 99` request does: named, replaceable, with an urgency level) or set a progress ring on its window's pill (`launcherctl progress`, the same as `OSC 9;4`).
* There's also a subtle **cursor trail** - a short streak when the cursor jumps, so you never lose it in a full-screen app. On by default, toggleable from the palette (*Toggle cursor trail*), and it turns itself off in battery-saver mode.

## Small but nice

* **Prompt jumping** - jump between shell prompts from the palette. Works out of the box in fish; bash/zsh need one `source` line ([config files](#wiki/config)).
* **Kitty keyboard protocol** - modern TUIs get full key disambiguation (all five enhancement levels).
* **Key inspector** - a palette action that shows exactly what any key press produces: the Android event, which keybind claimed it, and the bytes sent to the shell. Great for debugging a custom layout or binding.
* Fonts, ligatures and gap-free box drawing have their own page: [Terminal fonts](#wiki/fonts).
