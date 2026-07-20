---
title: tmux keys & status
order: 45
---

tmux is optional, but it is the easiest way to keep a terminal workspace alive as Android apps open over it. The Termux Launcher plugin adds Material themes, Android-friendly bindings, and status widgets backed by LauncherCtl.

Install it through **Recreate the shell workspace**, then start:

```shell
tmux new-session -A -s main
```

## Learn one key first

Press `Alt+e` inside the plugin to open the current key reference. It is more trustworthy than memorizing an old screenshot.

The public config uses `Ctrl+Space` as the main prefix and `Ctrl+b` as a fallback.

## Essential actions

| Key | Action |
| --- | --- |
| `prefix q` | Reload `~/.tmux.conf` |
| `F12` | Run `termux-reload-settings` |
| `prefix h` / `prefix v` | Split below / right in the current path |
| `prefix x` | Kill current pane |
| `prefix c` | Create a window in the current path |
| `Alt+1 … 9` | Jump to a window |
| `Alt+← / →` | Previous / next window |
| `Alt+↑ / ↓` | Previous / next session |

The full table remains visible in the plugin popup.

## Status widgets

The live configuration uses a compact top bar for sessions/windows plus CPU, memory, weather, and latency/date context. Available plugin options include:

- system resource widgets;
- weather mode;
- current media;
- storage, battery, CPU temperature, and battery temperature;
- `rounded`, `sleek`, and `purem3` visual themes;
- top or bottom status position.

Enable only the widgets you read. LauncherCtl-backed resource snapshots avoid aggressive shell polling.

```tmux
set -g @termux-launcher-tmux-system-widgets on
set -g @termux-launcher-tmux-weather on
set -g @termux-launcher-tmux-now-playing on
set -g @termux-launcher-tmux-theme sleek
set -g @termux-launcher-tmux-status-position top
```

## Launch Android apps

Ask LauncherCtl for exact labels, then add deliberate bindings:

```shell
launcherctl apps
```

```tmux
bind -n M-m run-shell 'launcherctl launch maps >/dev/null 2>&1 || tmux display-message "Launch failed: Maps"'
```

Do not copy the developer phone’s full personal binding list; conflicts depend on your apps and keyboard.

## Reload and recover

```shell
tmux source-file ~/.tmux.conf
termux-reload-settings
```

If tmux itself is broken, start a normal shell/failsafe session and temporarily move only your tmux config out of the way after making a backup. Do not clear the entire Termux app just to debug tmux.
