---
title: tmux & shell setup
order: 40
---

The [About page](#setup) gives you one command to recreate the workspace from the video. This page explains what that command actually installs, and how the pieces fit together.

## The one command

```shell
curl -fsSL https://raw.githubusercontent.com/PickleHik3/termux-launcher/main/docs/en/examples/setup-tmux-btop -o ~/setup-shell \
  && chmod 700 ~/setup-shell && ~/setup-shell
```

The script asks what to install:

- **All** — tmux theme plus the optional Shizuku `btop` helper.
- **tmux only** — theme and status helpers only.
- **btop only** — only the Shizuku `btop` helper.

It can install the [termux-launcher-tmux](https://github.com/PickleHik3/termux-launcher-tmux) theme/plugin and the optional `btop` wrapper that runs through Shizuku `rish`. See [tmux keybinds & theme](#wiki/tmux) and [Shizuku, rish & btop](#wiki/shizuku).

## What the workspace is made of

The setup is a small stack of tools that each do one job well:

| Tool | Role | How it works |
| --- | --- | --- |
| **fish** | The shell | Friendly interactive shell with autosuggestions and syntax highlighting out of the box — less config than bash/zsh. |
| **oh-my-posh** | The prompt | A cross-shell prompt engine. The bundled `termux-launcher` theme renders git status, path, and exit codes. |
| **tmux** | Terminal multiplexer | Persistent sessions, windows, and panes so your workspace survives closing the terminal. Drives the status bar too. |
| **eza** | `ls` replacement | Modern `ls` with colors, icons, git awareness, and a `--tree` view. The fish config aliases it in when present. |
| **zoxide** | Smarter `cd` | Learns your most-used directories; `z proj` jumps to the best match instead of typing the full path. |

The bundled `config.fish` keeps a single `fish_auto_tmux` toggle, loads the `termux-launcher` oh-my-posh theme, and switches to `eza` and `zoxide` automatically when they are installed.

## Prefer to do it by hand?

Install the packages:

```shell
pkg i -y tmux curl jq git fish oh-my-posh eza zoxide termux-api
```

Then pull the matching defaults:

```shell
mkdir -p ~/.config/fish ~/.config/ohmyposh ~/.tmux
BASE=https://raw.githubusercontent.com/PickleHik3/termux-launcher/main/docs/en/examples
curl -fsSL "$BASE/config.fish"              -o ~/.config/fish/config.fish
curl -fsSL "$BASE/termux-launcher.omp.json" -o ~/.config/ohmyposh/termux-launcher.omp.json
curl -fsSL "$BASE/tmux.conf"                -o ~/.tmux.conf
curl -fsSL "$BASE/material-theme.tmux"      -o ~/.tmux/material-theme.tmux
```

## Material colors

Current builds ship with **Terminal Material colors on by default**, so the terminal and the tmux theme follow your wallpaper with no extra step. If you ever want to change it:

> Long press Terminal → More → Appearance → **Terminal Material colors**

The launcher exports the palette to `~/.termux/material-colors.sh` and `~/.termux/material-colors.properties`, which the tmux theme reads.

> After an APK update, refresh only the repo-owned helpers with `launcherctl update-scripts`; your `~/.tmux.conf` stays intact.
