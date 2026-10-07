---
title: Permissions & Shizuku
group: Reference
order: 240
---
A home screen that is also a terminal ends up asking for a few permissions that look scary out of context. Here is what each one actually does. The short version: **everything below is optional**; deny anything and only that one feature stops working.

## Where to manage them

**Settings → Permissions & services**, in the **App** group, has two sections:

- **Permissions**: **Files and media**, **Wallpaper access**, **Notification access**, **Accessibility service**, **App notifications**, **All app permissions**.
- **Connected services**: **Shizuku** and **Termux:API**.

## The big ones

**Default home app.** The whole point; Android asks you to confirm this the normal way. You can always switch back in system settings.

**Notification access.** Powers the notification dots on app icons, the dock popup you get when swiping up on an app with an unread notification (including the quick-reply box), and the now-playing media widget in the status bar. It also feeds **Notification history** (**Settings → Notifications → Notification history**, "Choose which apps are recorded for Termux"), which is off until you pick apps: only those apps are recorded, in `~/.launcherctl/launcher.db`, for 30 days by default, with one-time codes masked by default. Scripts read it with `launcherctl notifications`. Without notification access: no dots, no quick reply, no media controls, no history.

**Accessibility service.** Used for exactly one thing: locking the screen when you double-tap the alphabets row. The service is declared with screen-reading and gesture abilities *disabled*; it can only send the "lock screen" action. If you would rather not enable an accessibility service, the Shizuku lock method does the same job.

**Shizuku.** The privileged backend, if you have [Shizuku](https://shizuku.rikka.app/) or Sui set up. It powers the nicer screen-lock method (a real power-button keypress, so the system's screen-off animation plays and secure lock behaves normally), detailed CPU/memory and top-process data in the status bar, foreground-process labels on window pills, and the privileged lane that runs `btop` from [tlstore](#wiki/tlstore). See [Shizuku](#shizuku) below.

**Files and media (All files access).** Only for the classic Termux `~/storage` symlinks (`termux-setup-storage`), so the shell can reach your shared storage. The launcher itself does not touch your files.

**Wallpaper access.** Lets the glass bars blur the system wallpaper. Until it is allowed, the glass bars render flat.

**Microphone.** Asked the first time you dictate, from the keyboard's Enter key or the **Dictate** action (see [Voice & speech](#wiki/voice)). The microphone is open only while a dictation runs. Termux:API's `termux-microphone-record` also relies on it, since add-ons share the app's identity.

## Shizuku

Shizuku lets an app use selected system APIs with the privileges of ADB or root, after you approve
that app. No root is required: on supported Android versions Shizuku can start through Wireless
debugging. Without it, RAM totals remain available through Android's `ActivityManager`, and CPU
uses a best-effort direct `/proc` fallback when the device allows it; Shizuku adds detailed
CPU/memory and process data, foreground-process labels on window pills, the Shizuku screen-lock
method, and the privileged lane.

**Setting it up:**

1. Install the [Shizuku](https://shizuku.rikka.app/) app and start its service through Wireless
   debugging or root, per its own setup guide.
2. In Termux Launcher, open **Settings → Permissions & services → Shizuku**.
3. Choose **Request Shizuku permission** and approve the dialog that appears over the launcher.

**The Shizuku page:**

- **Backend Status** shows the backend and its state, for example `SHIZUKU · READY`.
- **Backend policy**: **Enable privileged features**, **Prefer Shizuku backend**, **Allow shell
  fallback** (su or `rish` may be used when Shizuku is unavailable) and **Request Shizuku
  permission**. The three switches are on by default.
- **Privileged lane**: **Lane status** (Running as shell, Connecting to Shizuku…, Shizuku isn't
  running, Shizuku permission missing, or Off) and **Allow catalog tools to run as shell via
  Shizuku** (on by default). Catalog tools marked `priv=shizuku`, such as `btop`, start as the
  shell user from a terminal session; with the switch off, every request from the terminal is
  refused.

The privileged backend only initializes once you connect it from that page; until then the CPU
card uses whatever the direct `/proc` fallback can read, and detailed process data may be absent.
A Wireless-debugging start does not survive a reboot: start Shizuku again, then revisit the page to
reconnect; everything falls back to unprivileged data in the meantime.

**`rish` in the terminal.** Shizuku's shell helper gives a command an ADB-privileged shell, which
can read system process data and run tools outside Termux's app sandbox: anything installed under
`/data/local/tmp` runs from there, so tools the sandbox would otherwise refuse to execute work when
launched through `rish`.

**Common failures:**

- **Permission denied, or the prompt never appears.** Open the Shizuku app and check Termux
  Launcher's authorization there (grant it, or reset a previous denial), then use **Request
  Shizuku permission** again. Also check that **Enable privileged features** and **Prefer Shizuku
  backend** are on, on the same page.
- **Unavailable after a reboot.** Expected for a Wireless-debugging start; start Shizuku again and
  reconnect from the page.
- **The stats card shows `--`, `stale`, or no processes.** CPU percentages need two samples to
  compute a change, and the process list only samples while the card is open; leave it open a few
  seconds first. If it still does not recover, confirm the page reports **SHIZUKU · READY**, then
  restart Shizuku and re-check permission.

## Regular permissions

| Permission | Used for |
| --- | --- |
| Internet | `pkg` installs, model downloads, weather |
| Approximate location | Weather, only when no city is set under **Settings → Status bar → Weather → Location**. With a city picked there, no location permission is asked. Weather feeds the status-bar card and the Weather widget |
| Calendar | The built-in Agenda and Calendar widgets; asked when you place one |
| Bind widgets | Placing app widgets on the Widgets place (Android shows its own allow dialog) |
| Notifications | The persistent session notification, download progress, notifications sent from the shell (`launcherctl notify`, OSC 99) and the progress ring (`launcherctl progress`) |
| Wake lock | The "Acquire wakelock" action on the session notification, to keep long jobs alive |
| Battery optimization exemption | Asked when you take a wakelock, so Doze does not kill your session |
| Display over other apps | Lets a background command (Tasker / `RUN_COMMAND`) bring the terminal to the front; deny and you tap the notification instead |
| Vibrate | Terminal bell, keyboard haptics and `launcherctl vibrate` |
| Change audio settings | Volume control (`launcherctl volume`) |
| Set wallpaper | The wallpaper picker's separate Home and Lock wallpapers, and `launcherctl wallpaper set FILE --home\|--lock\|--both` |
| Run at boot | Boot scripts (Termux:Boot style) |
| Install packages | So APKs opened from the terminal can be handed to the system installer |

One custom permission is *defined* by the app for running commands: `com.termux.permission.RUN_COMMAND` on the Termux edition, `com.termux.launcher.nix.permission.RUN_COMMAND` on the Nix edition, and `io.vaj.tl.permission.RUN_COMMAND` on the demo edition. Other apps must hold it, and you must approve them, before they can run commands in your shell. That protects you; the launcher does not ask you for it.

A second one, `<package>.permission.X11_DISPLAY`, guards the built-in X11 display server; only apps signed with the same key can hold it.

## Inherited from upstream

A few declarations come along from the Termux base and do nothing in normal use: several system-level entries (`READ_LOGS`, `DUMP`, `WRITE_SECURE_SETTINGS`, usage stats) that Android will not grant to a regular app anyway; they only matter if you deliberately grant them over ADB, for example for the phantom-process-killer workaround. Also declared without a prompt: `SET_ALARM`, `FOREGROUND_SERVICE_SPECIAL_USE`, `SET_WALLPAPER_HINTS` and `ACCESS_NETWORK_STATE`.

Worth noting what's *absent*: the app does not request `QUERY_ALL_PACKAGES`. The app drawer uses the normal launcher-app query every home screen uses.

Full details: [Shizuku](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Shizuku.md)
