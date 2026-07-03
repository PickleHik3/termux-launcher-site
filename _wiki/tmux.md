---
title: tmux keybinds & theme
order: 45
---

The bundled [termux-launcher-tmux](https://github.com/PickleHik3/termux-launcher-tmux) plugin ships Android-friendly keybinds, a Material status bar, and helper widgets. It's installed by the [shell setup](#wiki/shell) script.

## Forgot a key? Open the popup

The fastest way to learn the bindings is the built-in reference popup — it lists every current keybind on screen:

| Key | Action |
| --- | --- |
| `Alt + e` | Show the keybind reference popup |
| `prefix q` | Reload `~/.tmux.conf` |
| `F12` | Reload Termux settings (`termux-reload-settings`) |

The default prefix is `Ctrl + Space`, with `Ctrl + b` available as a fallback.

## Panes

| Key | Action |
| --- | --- |
| `prefix h` | Split below (current path) |
| `prefix v` | Split right (current path) |
| `prefix x` | Kill the current pane |
| `Ctrl+Alt + arrows` | Move focus between panes |
| `Ctrl+Alt+Shift + arrows` | Resize the current pane |

## Windows

| Key | Action |
| --- | --- |
| `prefix c` | New window (current path) |
| `prefix k` | Kill window |
| `prefix r` | Rename window |
| `Alt + 1 … 9` | Jump to window 1–9 |
| `Alt + ← / →` | Previous / next window |
| `Alt+Shift + ← / →` | Move window left / right |

## Sessions

| Key | Action |
| --- | --- |
| `prefix Shift+c` | New session (current path) |
| `prefix Shift+r` | Rename session |
| `prefix Shift+k` | Kill session |
| `Alt + ↑ / ↓` | Previous / next session |

## App-launch shortcuts

The plugin does not install app shortcuts by default — add only the ones you want to `~/.tmux.conf`. In tmux config, `M-` means `Alt+`:

```tmux
bind -n M-w run-shell 'tmux display-message "Opening WhatsApp"; launcherctl launch whatsapp >/dev/null 2>&1 || tmux display-message "Launch failed: WhatsApp"'
bind -n M-y run-shell 'tmux display-message "Opening YouTube"; launcherctl launch youtube >/dev/null 2>&1 || tmux display-message "Launch failed: YouTube"'
```

Change the app ids to match your `launcherctl apps` output.

## Themes

The plugin defaults to the compact `rounded` Material theme. `sleek` and `purem3` are also available, and a `pure-m3` color mode works with both `rounded` and `sleek`:

```tmux
set -g @termux-launcher-tmux-theme sleek
```

All themes read the launcher's exported Material palette, so they follow your wallpaper automatically.
