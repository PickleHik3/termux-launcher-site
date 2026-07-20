---
title: launcherctl bridge
order: 30
---

`launcherctl` is the launcher’s command-line bridge to Android. The app installs it when the launcher starts and serves an authenticated API on localhost. Begin with read-only commands; add permissions and automation only when you need them.

## Confirm it is ready

```shell
launcherctl status
launcherctl apps
launcherctl resources
```

- `status` reports the bridge and optional backend state.
- `apps` lists launch targets exposed to the launcher, including profiles Android makes visible.
- `resources` returns a current CPU, memory, battery, thermal, network, and storage snapshot.

If the command is missing, reopen Termux Launcher. If it exists but cannot connect, run `launcherctl restart`.

## Launch an app

```shell
launcherctl launch maps
```

Queries are fuzzy. Use a more specific label or package fragment when two apps match. This is the same catalog used by the dock and `%` search.

## Optional data sources

| Command | Needs | What it returns |
| --- | --- | --- |
| `launcherctl media` | Notification-listener access | Current media session and playback metadata |
| `launcherctl notifications` | Notification-listener access | Current cached notifications |
| notification recent/search/stats routes | Notification-listener access | Persisted event history and aggregates |
| Shizuku-backed helpers | Shizuku permission | Privileged actions exposed by their specific tool |

No permission is required for ordinary app launch or the basic resource snapshot.

## Endpoint and token

The current endpoint and bearer token live in:

```text
~/.launcherctl/endpoint
~/.launcherctl/token
```

The server binds to localhost by default. Treat the token as a secret: do not paste it into screenshots, bug reports, shell history, dotfile repositories, or chat. If it leaks:

```shell
launcherctl token rotate
```

Existing clients must reread the new token.

## Use it in tmux and scripts

```tmux
bind -n M-m run-shell 'launcherctl launch maps >/dev/null 2>&1 || tmux display-message "Launch failed: Maps"'
```

For scripts, prefer JSON-capable commands/routes and check exit status. Avoid high-frequency polling; use the event stream or event tail routes for changing state.

## Keep helpers current

```shell
launcherctl update-scripts
```

This validates downloaded repo-owned helpers, writes timestamped backups when replacing them, and does not modify `~/.tmux.conf`.

## Clients and automation

Generate starting configurations instead of hand-copying endpoint/token values:

```shell
launcherctl client-config codex
launcherctl client-config opencode
launcherctl client-config ollama
```

For risk-classified tools and natural-language routing, continue to **Agent & MCP**. For every endpoint and request body, use the **Termux AI** page’s API reference.
