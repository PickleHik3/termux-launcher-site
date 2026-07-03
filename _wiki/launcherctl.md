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

```shell
launcherctl resources        # CPU, memory, battery, thermal, storage
launcherctl media            # current media session
launcherctl notifications    # cached notifications
launcherctl restart          # restart the launcher bridge
launcherctl update-scripts   # refresh repo-owned helper scripts
launcherctl token rotate     # rotate the API token
```

Media and notification commands need Android notification-listener access granted to the launcher.

## Endpoint & token

TAI and `launcherctl` share one local server. Its address and secret live in:

```text
~/.launcherctl/endpoint
~/.launcherctl/token
```

The address normally looks like `http://127.0.0.1:54298`. Every route requires the bearer token. Localhost bind is the default; LAN mode is opt-in — treat the token as a network secret when enabled.

## Bind apps to tmux keys

Here `Alt + w` opens WhatsApp:

```tmux
bind -n M-w run-shell 'tmux display-message "Opening WhatsApp"; \
  launcherctl launch whatsapp >/dev/null 2>&1 \
  || tmux display-message "Launch failed"'
```

Change the app ids to match your `launcherctl apps` output.

Full endpoint list and security model → [API reference](#ai). For agent tools and MCP, see [Agent & MCP](#wiki/agent).
