---
title: launcherctl bridge
order: 30
---

`launcherctl` is a localhost API bridge that exposes Android and launcher data to shell tools without high-frequency polling. It is installed automatically when the launcher session starts and authenticates with a bearer token in `~/.launcherctl/`.

## Try it first

```shell
launcherctl status
launcherctl apps
launcherctl launch whatsapp
```

## The toolbox

`resources · media · notifications · capabilities · tools · agent · events · mcp · update-scripts · token rotate`

Media and notification commands need notification-listener access granted to the launcher.

## Bind apps to tmux keys

Here, `Alt + w` opens WhatsApp:

```tmux
bind -n M-w run-shell 'tmux display-message "Opening WhatsApp"; \
  launcherctl launch whatsapp >/dev/null 2>&1 \
  || tmux display-message "Launch failed"'
```

Full endpoint list and security model → [API reference](#ai)
