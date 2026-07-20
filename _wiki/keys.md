---
title: Keyboards & Extra Keys
order: 60
---

Termux Launcher supports three layers that are easy to confuse:

1. an Android keyboard such as Unexpected Keyboard;
2. the launcher’s optional built-in keyboard;
3. Termux Extra Keys, the configurable row above either keyboard.

Use whichever combination feels reliable. None is required for the app dock.

## Built-in keyboard

Open **Settings → Keyboard** to enable it and choose theme, per-key colors, dock matching, size and shape, font, haptics, sound, and optional keys.

![Current built-in keyboard settings](assets/onboarding/screenshots/05-keyboard-settings.webp)

The built-in keyboard stays available when returning from other apps. Use the size-and-shape editor if it consumes too much terminal space, especially in landscape.

## External keyboard

[Unexpected Keyboard](https://github.com/Julow/Unexpected-Keyboard) remains a good terminal-oriented choice. Disable the built-in keyboard first if you want Android to use your selected IME.

## Extra Keys file

Termux Extra Keys live in:

```text
~/.termux/termux.properties
```

After every edit:

```shell
termux-reload-settings
```

## Compact tmux row

Start with one row. It assumes `Ctrl+b` is available as a tmux prefix:

```properties
extra-keys = [[ \
  {macro: "CTRL b F12", display: "♼"}, \
  {macro: "CTRL b h", display: "𝍣", popup: {macro: "CTRL b v", display: "𝍬"}}, \
  {macro: "CTRL b 1", display: "⓵"}, \
  {macro: "CTRL b 2", display: "⓶"}, \
  {macro: "CTRL b 3", display: "⓷"}, \
  {macro: "CTRL b [", display: "✎"}, \
  {key: KEYBOARD, popup: PASTE}, \
  {macro: "CTRL b", display: "㋡"} \
]]
```

The keyboard key toggles the IME; its popup pastes. The tmux plugin can use `F12` to reload Termux settings.

## Two rows

Two rows give dedicated modifiers and more pane controls, but cost terminal height. Enable compact dock spacing and test portrait plus landscape before keeping them.

```properties
extra-keys = [[ \
  {macro: "CTRL b h", display: "𝍣"}, \
  {macro: "CTRL b v", display: "𝍬"}, \
  {macro: "ALT LEFT", display: "⬸"}, \
  {macro: "CTRL b c", display: "+"}, \
  {macro: "ALT RIGHT", display: "⤑"}, \
  {macro: "CTRL b [", display: "✏"}, \
  {macro: "CTRL b z", display: "□"}, \
  {macro: "CTRL b x", display: "×", popup: {macro: "CTRL b k", display: "⊠"}} \
], [ \
  {key: ESC, display: "Esc", popup: {macro: "CTRL b F12", display: "⟲"}}, \
  {key: TAB, display: "TAB"}, \
  {key: SHIFT, display: "SHFT"}, \
  {key: CTRL, display: "CTRL"}, \
  {key: ALT, display: "ALT"}, \
  {key: LEFT, popup: DOWN}, \
  {key: RIGHT, popup: UP}, \
  {key: KEYBOARD, popup: PASTE} \
]]
```

If a macro behaves differently from typing the same keys, first confirm the tmux prefix in `~/.tmux.conf`, then run `tmux source-file ~/.tmux.conf` and `termux-reload-settings`.
