---
title: Extra Keys
order: 60
---

Termux Launcher includes the regular Termux Extra Keys plus a convenient paste popup. Edit `~/.termux/termux.properties`, then run `termux-reload-settings`.

## Compact tmux row

The easiest default. Assumes the [tmux setup](#wiki/tmux) with `CTRL b` as the prefix.

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

## Two-row layout

Dedicated modifier keys and more tmux controls. Turn on **compact dock spacing** first (Appearance settings).

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

> After editing `termux.properties`, always run `termux-reload-settings` to apply it.
