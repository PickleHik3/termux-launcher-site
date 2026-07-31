---
title: launcherctl
order: 30
---

`launcherctl` launches Android apps from the Termux shell. The app installs it when the launcher starts. It has one command:

```shell
launcherctl launch <app name, package, or activity>
```

Local AI uses the separate `tai` command.

## Launch an app

Pass a label, package, or activity:

```shell
launcherctl launch maps
launcherctl launch com.example.maps
launcherctl launch com.example.maps.MainActivity
```

The launcher compares the query with its app catalog. Exact package and activity matches rank before labels and partial matches. A unique best match launches and returns its label, package, activity, stable ID, user ID, and clone-profile state as JSON.

If nothing matches, the local API returns HTTP 404 with `not_found`. If several apps tie at the best rank, it returns HTTP 409 with `ambiguous` and a `candidates` array. Retry with a package or activity from that array.

The launch route allows 30 requests per minute.

## Endpoint and token

The command reads:

```shell
~/.launcherctl/endpoint
~/.launcherctl/token
```

It sends `{"query":"..."}` to `POST /v1/apps/launch` with the bearer token. The server binds to localhost by default. Do not paste the token into screenshots, bug reports, shell history, dotfile repositories, or chat.

To call the route directly:

```shell
base="$(sed -n '1p' ~/.launcherctl/endpoint)"
token="$(cat ~/.launcherctl/token)"
curl -sS -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{"query":"maps"}' \
  "$base/v1/apps/launch"
```

## Use it in tmux

```tmux
bind -n M-m run-shell 'launcherctl launch maps >/dev/null 2>&1 || tmux display-message "Launch failed: Maps"'
```

Use a package or activity when labels are ambiguous.

## Removed commands

The old status, app-list, resource, notification, media, event, restart, script-update, client-config, agent, and MCP commands are not available. `launcherctl-mcp` and `launcher-restart` are deleted during an upgrade. Reopen Termux Launcher if the launch-only command or its endpoint files are missing. Use `tai status` to check the local AI host.
