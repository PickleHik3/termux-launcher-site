---
title: Troubleshooting
order: 80
---

Start with the smallest safe check. Do not clear app data, uninstall, or delete dotfiles as a first response.

## Launcher or terminal feels stale

```shell
termux-reload-settings
```

If only tmux looks wrong:

```shell
tmux source-file ~/.tmux.conf
```

## Symptom map

| Symptom | First check | Next step |
| --- | --- | --- |
| Dock search does not filter | Confirm the split character under Apps & Access | Try `%settings`, then reset usage ranking only if ranking is the issue |
| No dock/apps row | Apps & Access → apps row enabled | Reopen Home after changing the toggle |
| Keyboard covers too much space | Keyboard → Size & shape | Test landscape; disable built-in keyboard to use Android IME |
| Blur is flat/black | Check live wallpaper and blur value | Use clear glass (0 blur) or a static/managed wallpaper |
| `launcherctl` missing | Reopen the launcher | Confirm `$PREFIX/bin/launcherctl` exists after startup |
| 401 Unauthorized | Client has stale token | Reread token or rotate deliberately, then update every client |
| `launcherctl launch` cannot connect | Launcher API is not running | Reopen the launcher and check `~/.launcherctl/endpoint` |
| Notifications/media empty | Notification-listener access | Confirm the source app currently has media/notifications |
| Shizuku says OFF/DENIED | Shizuku service and app grant | Verify the edition package in `rish` |
| tmux plugin update refuses | Local plugin changes | Back up/commit those changes; installer intentionally stops |

## TAI

```shell
tai doctor
tai status
tai runtime
```

- **Model incompatible:** recheck ABI, backend, role, and accelerator support.
- **Out of memory:** unload, choose a smaller model/context, close other heavy apps, and avoid repeated immediate load attempts.
- **Secure settings screenshot is black:** expected behavior, not a rendering failure.
- **Client 401:** reread the current LauncherCtl token.
- **Endpoint unavailable:** reopen the launcher, check `~/.launcherctl/endpoint`, and run `tai status` before touching model files.

## Shell setup

The guarded installer keeps existing fish/Oh My Posh files and only appends missing tmux plugin lines. If your custom setup behaves differently, compare against the public examples rather than overwriting your files.

## Collect a useful report

Include:

- edition and app version;
- Android/device model;
- exact path and command;
- whether the app is the selected Home launcher;
- relevant permission/backend state;
- a screenshot with tokens and private notification text removed;
- the smallest app-scoped log excerpt that contains the failure.

Never include `~/.launcherctl/token`, provider/API keys, private notifications, or unrestricted device logs.
