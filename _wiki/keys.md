---
title: Extra Keys
order: 60
---

Edit `~/.termux/termux.properties`, then run `termux-reload-settings`. This compact row assumes the tmux setup with `CTRL b` as its prefix.

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

A two-row layout with dedicated modifier keys is in the repository documentation. Turn on compact dock spacing first.
