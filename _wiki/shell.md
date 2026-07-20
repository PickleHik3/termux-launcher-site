---
title: Recreate the shell workspace
order: 40
---

The launcher works with the default Termux shell. This page recreates the optional fish/tmux workspace seen in the screenshots using secret-free repo examples derived from the live device.

## What the guarded installer changes

| Item | Behavior |
| --- | --- |
| Missing packages | Installs only the packages needed by your selection |
| `~/.config/fish/config.fish` | Installs the example only when the file does not already exist |
| Oh My Posh theme | Installs only when the destination does not already exist |
| `~/.tmux.conf` | Keeps the file and appends only missing TPM/plugin lines |
| TPM and launcher plugin | Clones when absent; fast-forwards a clean existing launcher plugin |
| Locally edited plugin checkout | Stops and asks you to clean or back it up |
| Shizuku `btop` | Runs only for the All or btop choice and requires working `rish` |

It does not copy the developer phone’s private aliases, personal paths, or API keys.

## Run it

Download the script so you can inspect it before execution:

```shell
curl -fsSL https://raw.githubusercontent.com/PickleHik3/termux-launcher/main/docs/en/examples/setup-tmux-btop -o ~/setup-shell
chmod 700 ~/setup-shell
sed -n '1,220p' ~/setup-shell
~/setup-shell
```

Choose:

1. **All:** fish + Oh My Posh, tmux plugin, and optional Shizuku `btop` helper.
2. **tmux only:** TPM and the Termux Launcher tmux plugin.
3. **btop only:** the rish-backed helper; use this only after Shizuku setup.
4. **Exit:** make no setup choice.

New users should choose **tmux only** first, or leave the default shell unchanged until the launcher feels familiar.

## How the pieces fit

| Tool | Job |
| --- | --- |
| **fish** | Friendly interactive shell with syntax highlighting and abbreviations |
| **Oh My Posh** | Prompt segments for path, git state, and exit status |
| **tmux** | Persistent sessions, windows, panes, keybinds, and status bar |
| **Termux Launcher tmux plugin** | Material themes, Android-friendly bindings, resource/weather/media widgets |
| **eza** | Colored, icon-aware file listings and tree views |
| **zoxide** | Learns frequently used directories for fast jumps |
| **launcherctl** | Supplies launcher/system data and launches Android apps |

The live phone keeps tmux auto-start disabled in fish until explicitly enabled. The public config follows the same conservative default:

```fish
set -g fish_auto_tmux 0
```

Change it to `1` only after `tmux` starts and detaches cleanly on your device.

## Material colors

Keep **Settings → Appearance → Material colors** enabled. The launcher exports its palette, and the shell/plugin reads the exported values with built-in fallback colors.

![Appearance controls used by the terminal, dock, keyboard, and tmux palette](assets/onboarding/screenshots/04-appearance-controls.webp)

## Add app-launch keybinds safely

List the labels LauncherCtl knows:

```shell
launcherctl apps
```

Then add only the bindings you want to `~/.tmux.conf`:

```tmux
bind -n M-m run-shell 'launcherctl launch maps >/dev/null 2>&1 || tmux display-message "Launch failed: Maps"'
```

In tmux syntax, `M-m` means Alt+m. Avoid copying a large personal binding list: start with one app, test it, then add more.

## Refresh after an app update

```shell
launcherctl update-scripts
tmux source-file ~/.tmux.conf
```

The first command refreshes repo-owned scripts with backups; it leaves `~/.tmux.conf` unchanged. The second reloads your tmux config.

## Manual alternative

If you prefer full control, open the public examples before copying them:

- [fish config](https://github.com/PickleHik3/termux-launcher/blob/main/docs/en/examples/config.fish)
- [Oh My Posh theme](https://github.com/PickleHik3/termux-launcher/blob/main/docs/en/examples/termux-launcher.omp.json)
- [tmux config](https://github.com/PickleHik3/termux-launcher/blob/main/docs/en/examples/tmux.conf)

Back up any destination you already maintain and merge the pieces you understand instead of overwriting the whole file.
