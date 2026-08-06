---
title: Terminal
order: 20
---
# Terminal

The terminal core is upstream Termux, with a lot built on top. This page covers what's different.

## Images, GIFs and graphics

Three graphics protocols are supported out of the box - nothing to enable:

* **Sixel** and **iTerm2 inline images** - so `img2sixel`, `chafa` and friends just work.
* **Kitty graphics protocol** - the full modern set: PNG and raw pixel data, placements, z-index, and **animation**. Send an animated GIF through it and it keeps playing on the terminal's own clock, even after the program that sent it exits.

Tested clients: `timg -pk`, `chafa -f kitty`, and **yazi**'s image previews all work. One caveat: `kitten icat` itself isn't usable - kitty's `kitten` binary isn't packaged for Android and crashes before reaching the terminal. Use `timg` or `chafa` instead.

> 🖼️ *Screenshot placeholder: yazi previewing a photo in a pane, or `timg` showing a GIF mid-animation.*

## Fonts and text rendering

Font handling is ported from kitty: per-style fonts (regular/bold/italic/bold italic), **nerd-font symbol mapping** that never breaks cell widths, an ordered fallback chain, ligature control, variable-font axes and cell-metric tweaks. There is an in-app picker for all of it (**Settings → Appearance → Terminal fonts**) and a `~/.termux/fonts.conf` for hand-editing - the whole system is documented in [Fonts](#wiki/fonts). The old `~/.termux/font.ttf` and Termux:Styling still work if you never touch either.

Box drawing doesn't come from the font at all: box-drawing, block, shade, braille and sextant glyphs are computed as geometry snapped to the integer pixel edges neighbouring cells share, so TUI frames, block ramps and braille graphs join with no hairline gaps at any font size. On by default, and `box_drawing font` hands the glyphs back to your font.

Text shaping is real: ZWJ emoji, flags, Arabic, Indic conjuncts and programming ligatures render correctly, and selection/copy/resize don't mangle them.

There's also a subtle **cursor trail** - a short streak when the cursor jumps, so you never lose it in a full-screen app. On by default, toggleable from the palette (*Toggle cursor trail*), and it turns itself off in battery-saver mode.

## Touch

Touch is tuned for TUIs rather than plain shells:

* **Drag scrolls, always** - one or two fingers. Inside mouse-aware apps the drag is translated to scroll-wheel events, so lists in `htop`, lazygit or vim scroll naturally.
* **Tap = mouse click** when the app tracks the mouse.
* **Press-and-hold, then drag** to send a real mouse drag (select text in vim, resize tmux panes). You'll feel a small haptic when it engages. A quick long-press without moving still gives you normal text selection with the copy toolbar.
* **Pinch to zoom** changes font size - with jitter filtering so two-finger scrolling doesn't accidentally zoom.
* Scrolled up reading something? Live output no longer yanks you to the bottom - the view stays put until you scroll back down.

## The multiplexer

No tmux needed - the app is one natively. The hierarchy is **sessions → windows → panes**, and everything below is reachable from the [Command Palette](#wiki/tour), keybinds, extra keys, or the space-bar swipes on the built-in keyboard.

```clip
name: window-splitting
title: Window splitting
caption: One pane split in two, focus moved, then reshaped - no tmux running.
```

* **Splits** - vertical/horizontal, arrow-key focus movement, keyboard resize, drag the dividers.
* **Layouts** - six presets (grid, tall, fat, horizontal, vertical, stack); *Next pane layout* (`Ctrl+Alt+L`) cycles them and the window keeps re-tiling new panes to match until you hand-shape it.
* **Floating panes** - pop any pane out with `Ctrl+Alt+F`. Drag the top handle to move, the corner grip to resize; tap its pill for close/dock buttons. Positions survive app restarts.
* **Scratchpad** - `Ctrl+Alt+` ` (backtick) summons a dedicated floating shell above whatever you're doing; toggle again and it hides, **but the shell keeps running** and follows you across windows and sessions. Perfect for a music player or a quick calculation.
* **Windows** - like tmux windows: `Ctrl+Alt+C` new, `Ctrl+Alt+[` / `]` to switch, pills in the status row to tap. Pills label themselves after the file open in your editor, or the running process.
* **Sessions** - fully separate workspaces of windows. `Ctrl+Alt+N` / `P` step through them, `Ctrl+Alt+Shift+S` (or a tap on the chip at the left of the status row) opens the sessions panel, and the **Session browser** gives you a searchable tree of every session, window and pane (it searches working directories and running programs too).
* **Workspaces** - save the whole arrangement (windows, panes, floats, working directories) to a named file and load it later or after a reboot. *Save workspace* / *Load workspace* in the palette; files live in `~/.termux/workspaces/` as JSON. Layout comes back with fresh shells in the right directories - running programs are not resurrected.

If you want none of this, **Settings → Terminal IO → Single-pane compatibility mode** returns the terminal to plain Termux behaviour.

## Status bar

The glass strip at the top is two tiers:

* The **widget area**: a clock (six styles - flip, LCD, LED and more), up to three **pinned notifications**, and a **media / now-playing widget** with controls. Swipe right on it to expand, left to collapse.
* The **status row**: the session chip, window pills, then **CPU**, **RAM** and **weather** widgets - tap any of them for a detail card (per-core load and top processes, or the hourly/weekly forecast).

Everything is toggleable in **Settings → Terminal Status**, and the glass itself (blur, opacity, grain, corner radius) is edited live on your real wallpaper via the surface editor. CPU stats need [Shizuku](#wiki/launcherctl); weather needs location.

```clip
name: statusbar-modes
title: Status bar modes
caption: The widget area cycling through clock, media and pinned-notification modes, then the CPU detail card.
```

## Small but nice

* **Hints** (`Ctrl+Alt+U`) - keyboard-labelled overlays for URLs, paths and `file:line` references on screen; pick one to open or insert it.
* **Scrollback search** (`Ctrl+Alt+S`).
* **Clickable links** - OSC 8 hyperlinks are underlined; tapping shows you the full target before opening.
* **Prompt jumping** - jump between shell prompts from the palette. Works out of the box in fish; bash/zsh need one `source` line ([configs](#wiki/tmux)).
* **Kitty keyboard protocol** - modern TUIs get full key disambiguation (all five enhancement levels).
* **Key inspector** - a palette action that shows exactly what any key press produces: the Android event, which keybind claimed it, and the bytes sent to the shell. Great for debugging a custom layout or binding.
