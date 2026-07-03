---
title: Troubleshooting
order: 80
---

When the terminal feels stale or unresponsive, start here:

```shell
termux-reload-settings
launcherctl restart
```

## Common fixes

- **401 Unauthorized** — run `launcherctl token rotate`.
- **Connection refused** — reopen the launcher and check `~/.launcherctl/endpoint`.
- **No tty detected** — run `launcherctl tty-doctor`.
- **Media or notifications empty** — grant notification access in Android settings.
