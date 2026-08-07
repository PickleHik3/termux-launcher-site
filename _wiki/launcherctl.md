---
title: Permissions
order: 25
---
# Permissions

A home screen that is also a terminal ends up asking for a few permissions that look scary out of context. Here is what each one actually does. The short version: **everything below is optional** - deny anything and only that one feature stops working. The app manages them all from **Settings → Services & permissions**.

## The big ones

**Default home app.** The whole point - Android asks you to confirm this the normal way. You can always switch back in system settings.

**Notification access.** Powers the notification dots on app icons, the dock popup you get when swiping up on an app with an unread notification (including the quick-reply box), and the now-playing media widget in the status bar. The launcher reads only what it needs to draw those; notification content is not used for anything else. Without it: no dots, no quick reply, no media controls.

**Accessibility service.** Used for exactly one thing: locking the screen when you double-tap the alphabets row. The service is declared with screen-reading and gesture abilities *disabled* - it can only send the "lock screen" action. If you'd rather not enable an accessibility service, the Shizuku lock method does the same job.

**Shizuku.** The privileged backend, if you have [Shizuku](https://shizuku.rikka.app/) or Sui set up. It powers the nicer screen-lock method (a real power-button keypress, so the system's screen-off animation plays and secure lock behaves normally), plus the CPU/RAM stats and top-process list in the status bar. Without it those features fall back to a shell method or simply hide.

**Storage / All files access.** Only for the classic Termux `~/storage` symlinks (`termux-setup-storage`), so the shell can reach your shared storage. The launcher itself doesn't touch your files.

## Regular permissions

| Permission | Used for |
| --- | --- |
| Internet | `pkg` installs, model downloads, the weather card |
| Approximate location | The status-bar weather card, nothing else |
| Notifications | The persistent session notification and download progress |
| Wake lock | The "Acquire wakelock" action on the session notification, to keep long jobs alive |
| Battery optimization exemption | Asked when you take a wakelock, so Doze doesn't kill your session |
| Display over other apps | Lets a background command (Tasker / `RUN_COMMAND`) bring the terminal to the front; deny and you tap the notification instead |
| Vibrate | Terminal bell and keyboard haptics |
| Set wallpaper | The "set as wallpaper" action in the launcher |
| Run at boot | Boot scripts (Termux:Boot style) |
| Install packages | So APKs opened from the terminal can be handed to the system installer |

One custom permission is *defined* by the app: `com.termux.permission.RUN_COMMAND` (or `io.vaj.tl.permission.RUN_COMMAND` on the demo edition). Other apps must hold it - and you must approve them - before they can run commands in your shell. That protects you; the launcher doesn't ask you for it.

## Inherited from upstream

A few declarations come along from the Termux base and do nothing in normal use: microphone (exists so Termux:API's `termux-microphone-record` can work, since add-ons share the app's identity - the launcher itself never records), and several system-level entries (`READ_LOGS`, `DUMP`, `WRITE_SECURE_SETTINGS`, usage stats) that Android will not grant to a regular app anyway - they only matter if you deliberately grant them over ADB, e.g. for the phantom-process-killer workaround.

Worth noting what's *absent*: the app does not request `QUERY_ALL_PACKAGES`. The app drawer uses the normal launcher-app query every home screen uses.
