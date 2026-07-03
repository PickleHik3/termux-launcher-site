---
title: tmux & shell setup
order: 40
---

For a persistent workspace: `fish · oh-my-posh · tmux · eza · zoxide`. Turn on Material colors first so the tmux theme follows your wallpaper.

## Install packages

```shell
pkg i -y tmux curl jq git fish oh-my-posh eza zoxide termux-api
```

## Material colors

> Long press Terminal → More → Appearance → **Terminal Material colors**

## Pull the defaults

```shell
mkdir -p ~/.config/fish ~/.config/ohmyposh ~/.tmux
BASE=https://raw.githubusercontent.com/PickleHik3/termux-launcher/main/docs/en/examples
curl -fsSL "$BASE/config.fish"              -o ~/.config/fish/config.fish
curl -fsSL "$BASE/termux-launcher.omp.json" -o ~/.config/ohmyposh/termux-launcher.omp.json
curl -fsSL "$BASE/tmux.conf"                -o ~/.tmux.conf
curl -fsSL "$BASE/material-theme.tmux"      -o ~/.tmux/material-theme.tmux
```

> After an APK update, refresh only the repo-owned helpers with `launcherctl update-scripts`; your `~/.tmux.conf` stays intact.
