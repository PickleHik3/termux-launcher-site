---
title: Troubleshooting
order: 80
---

When the terminal feels stale or unresponsive, start here:

```shell
termux-reload-settings
launcherctl status
launcherctl restart
```

If `launcherctl` is missing entirely, restart Termux Launcher — the app installs the command when the launcher activity starts.

## Common fixes

- **Stale drawing / input / colors** — run `termux-reload-settings`.
- **Launcher bridge not responding** — `launcherctl status`, then `launcherctl restart`.
- **401 Unauthorized** — refresh your client with the current value from `~/.launcherctl/token`, or run `launcherctl token rotate`.
- **Connection refused** — reopen the launcher and check `~/.launcherctl/endpoint`.
- **No tty detected** — run `launcherctl tty-doctor`.
- **Media or notifications empty** — grant notification-listener access in Android settings.
- **Shizuku features not working** — confirm Shizuku is running, grant it permission, then run `launcherctl tty-doctor`. See [Shizuku, rish & btop](#wiki/shizuku).

## Termux AI

Model-specific problems (won't load, out of memory, GPU crash, tools ignored) are covered on the [Termux AI](#ai) page. Start with:

```shell
tai doctor
tai status
tai runtime
```
