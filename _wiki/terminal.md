---
title: Terminal features
group: Terminal
order: 80
---
The terminal core is upstream Termux, with a lot built on top. This page covers what is different: touch and mouse, links, the clipboard, graphics, effects and status from programs. Panes, windows, sessions and workspaces have their own page: [Panes & sessions](#wiki/panes).

## Touch, copy and mouse mode

* **Drag scrolls, always**, with one or two fingers. Inside mouse-aware apps the drag becomes scroll-wheel events, so lists in `htop`, lazygit or vim scroll naturally.
* **Tap sends a click** when the running app tracks the mouse.
* **Press and hold, then drag** to hold the mouse button down; a small haptic marks the handoff. From there you can select text in vim, drag tmux-style splits, or resize TUI panes like a desktop mouse. A quick long-press without moving still opens ordinary text selection with the copy toolbar, and a drag before either haptic just scrolls.
* **In a plain shell** there is no mouse for an app to take, so the same hold always starts text selection.
* **Modifiers ride along**: Ctrl, Alt and Shift from the extra-keys row or a hardware keyboard are sent with a mouse click, xterm style. A latched Ctrl covers one click, so **Ctrl+tap** lets a TUI open its own links.
* **Mouse mode** turns every touch into the mouse, for a program that wants one without you holding first: a finger down clicks at that cell, held and dragged it drags, two fingers turn the wheel. Tap the **Mouse** key on the shipped extra-keys row, run **Mouse mode** from the palette, or bind `tool:mouse.toggle` to any key. A small mouse icon at the end of the status bar shows it is on.
* **Two-finger flick** on a split pane swaps it with the pane across the edge the fingers moved towards. See [Panes & sessions](#wiki/panes).
* **Pinch to zoom** changes the focused pane's font size, with jitter filtering so two-finger scrolling doesn't zoom by accident. A new split or window inherits the size of the pane it came from; panes you have never zoomed keep following the global terminal size.

## Find text

**Ctrl + Alt + S** searches the focused pane's history and screen, case-insensitively, and jumps straight to a result.

## Links

Tap a link and a **Copy / Open** strip appears with the full target, for OSC 8 hyperlinks and plain-text URLs alike. The link is read when your finger lifts, so a TUI that redraws while you tap does not move it.

* Over a program that tracks the mouse, the click still goes to the program and the strip follows.
* Hold or latch **Shift** for the tap to send nothing to the program; only the strip appears.
* Only `http`, `https`, `mailto`, `tel`, `sms`, `geo`, `ftp` and `ftps` links can be opened; anything else, `file` links included, can only be copied.
* Plain-text URLs that a program wrapped by hand are joined back together within one pane, including an address wrapped inside a padded box such as herdr's sidebar. A symbol printed after the host, like fish's `⏎`, is not taken as part of it.

**Ctrl + Alt + U** opens **Quick select**: keyboard labels on what is on screen, such as URLs, absolute and relative paths, `path:line[:column]` references and hashes. Pick a label to open a URL or copy anything else; hold Shift while picking a URL to copy it instead.

## Clipboard

Swipe up-right (NE) on the keyboard's **Ctrl** key to open **Clipboard history** in place of the keys. It lists what you copied **in the launcher**: a terminal selection, the keyboard's copy and cut keys, a link or a hint you copied from a sheet, a yank in find mode, and anything a program copies with `launcherctl clipboard copy` or an OSC 52 escape. What you copy in other apps isn't collected; the paste key still pastes whatever is on the phone's clipboard.

Tap an item to paste it and put it back on the clipboard. Pin an item to keep it above the rest and across restarts. Recent items live in memory only, about thirty of them, and the panel keeps up to twenty pins; anything over 16 KB still reaches the clipboard but isn't listed. **Clear** asks twice and never touches pins.

**Settings → Terminal → Clipboard** has two switches:

* **Let programs read the clipboard**: "Programs in the terminal can paste what you copied."
* **Clean up clipboard text**: "Trim trailing spaces and single-line paste newlines." On by default.

`launcherctl clipboard copy` works even when the launcher is not on screen; OSC 52 from a pane keeps the on-screen rule. Programs can also use kitty's extended clipboard escape (OSC 5522, `kitten clipboard`), text only, under the same rules as OSC 52.

## Images, GIFs and graphics

Three graphics protocols are supported out of the box:

* **Sixel** and **iTerm2 inline images**, so `img2sixel`, `chafa` and friends work.
* **Kitty graphics protocol**: PNG and raw pixel data, placements, z-index, and **animation**. Send an animated GIF through it and it keeps playing on the terminal's own clock, even after the program that sent it exits.

```clip
src: assets/showcase/raw/fetch
size: 576x1296
crop: 0 0.06 1 0.34
title: Graphics in a pane
formats: mp4
caption: fastfetch drawing its logo through the kitty graphics protocol, over a wallpaper-themed prompt.
```

```clip
name: kew
crop: 0.13 0.28 0.74 0.46
title: Album art in the terminal
caption: kew, a terminal music player, drawing cover art through the same graphics protocol.
```

Tested clients: `timg -pk`, `chafa -f kitty`, and **yazi**'s image previews. kitty's `kitten` is installable from [tlstore](#wiki/tlstore): `kitten icat` works (it warns that it cannot create shared memory and falls back to sending the image in-band), `kitten clipboard` works, and `kitten @` remote control does nothing.

## Big and small text

A program can draw a word or a line at any size, not just one cell per character, with kitty's text-sizing protocol (`OSC 66`). A heading can print twice as tall and twice as wide as body text, or a status glyph can shrink to a fraction of a cell. Selecting any part of an enlarged block selects and copies all of it.

If a pane gets too narrow for a block already on screen, it drops back to normal size on its own row and grows again once the pane is wide enough; rotating the phone keeps a block whole either way.

## Cursor trail and effects

**Settings → Terminal → Terminal display** holds the visual extras. **Cursor trail** and **Terminal effect** also appear when you choose **Custom** in **Appearance → Look** and tap the terminal.

* **Cursor trail**: a streak when the cursor jumps. Styles: **Default** (kitty's shearing trail), **Motion blur** (a soft lagging smear), **Railgun** (a thin white-hot beam with sparks, gone in a blink), **Torpedo** (a tapered body travelling nose first with a faint wake), **Pixie dust** (falling glitter) and **Comet** (a tapered streak with a glowing head). The palette's **Toggle cursor trail** switches it on or off. It is off in power-save mode and under reduce-motion, and never drawn while you are scrolled back.
* **Terminal effect**: **None**, **CRT**, **CRT (green)**, **CRT (amber)** or **TFT grid**, on Android 13 and later. It covers the whole home screen, scanlines stay locked to the screen, and only panes curve like a tube.
* **Extend edge colors**: "Match pane padding to nearby terminal colors." On by default.

kitty users can set the trail in `~/.config/kitty/kitty.conf` with `cursor_trail`, `cursor_trail_decay`, `cursor_trail_start_threshold` and `cursor_trail_color`; a `custom_shaders` line naming `cursor-trail-default`, `cursor-trail-motion-blur`, `cursor-trail-railgun`, `cursor-trail-torpedo` or `cursor-trail-pixiedust` overrides the Settings choice. See [Config files](#wiki/config).

## Status from programs

* A window whose foreground program is actively using CPU shows a breathing rim; a background window that rings the bell gets a pulsing rim until you focus it. A silent but busy build can look active, and an idle TUI doesn't count as work just because it is open.
* Every window pill picks up a small mark in the icon's corner: a tick or a cross once a command finishes unseen, or a bell once the window rings.
* **Agent status**: a coding agent's window chip shows a dot, and the sessions browser a word: **Working**, **Needs you** or **Idle**. Set it with `launcherctl agent working|blocked|idle|clear`, or let the built-in screen rules spot known agents. `launcherctl agent install-hooks` wires Claude Code's hooks into `~/.claude/settings.json`.
* A program with no terminal to write into can still post a real Android notification (`launcherctl notify`, the same as an `OSC 99` request: named, replaceable, with an urgency level) or set a progress ring on its window's pill (`launcherctl progress`, the same as `OSC 9;4`). OSC 99 buttons become notification actions and report back which one you pressed; `launcherctl notify --close` closes a notification.

## Small but useful

* **Prompt jumping**: jump between shell prompts from the palette. Works out of the box in fish; bash and zsh need one `source` line ([Config files](#wiki/config)).
* **Kitty keyboard protocol**: modern TUIs get full key disambiguation, all five enhancement levels.
* **Key inspector**: a palette action that shows what any key press produces: the Android event, which keybind claimed it, and the bytes sent to the shell.
* Fonts, ligatures and gap-free box drawing have their own page: [Terminal fonts](#wiki/fonts). Graphics and protocol limits are covered in depth in the bundled [Graphics, protocols and compatibility](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Terminal_Kitty_Protocols.md) page.

Full details: [Touch, links and clipboard](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Touch_Links_And_Clipboard.md)
