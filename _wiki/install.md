---
title: Install & first run
order: 15
---

This guide gets you to a safe, reversible first launch. Do not set Termux Launcher as Home until the bootstrap finishes and you can reopen your important apps.

## 1. Pick the correct edition

| Edition | Android package | Use it when |
| --- | --- | --- |
| **Termux edition** | `com.termux` | You want the recommended build and the official Termux package ecosystem. It replaces an existing official Termux install. |
| **VAJ edition** | `io.vaj.tl` | You must keep official Termux installed side by side. It uses the separately maintained VAJ package repository. |

The `com.termux` edition cannot coexist with official Termux because both use the same Android package identity. Back up anything important before replacing an existing installation. If you are unsure, begin with the VAJ edition and read the release notes.

## 2. Install one matching build family

1. Download the Main APK from the project’s [Releases](https://github.com/PickleHik3/termux-launcher/releases).
2. If you use Termux:API or Termux:Styling, download the matching forks from the same edition family.
3. Do not mix official add-ons, old forks, or APKs signed with a different key. Android will reject shared-UID/signature mismatches.

You only need the Main APK to try the launcher.

## 3. Let first-run setup finish

Open Termux Launcher normally. The first launch extracts the Termux bootstrap; wait until a prompt appears. The new Quick start popup opens after a genuinely new bootstrap completes, not merely after an app upgrade.

The tour covers:

- the terminal home screen;
- touch and terminal app search;
- appearance and built-in keyboard controls;
- the optional fish/tmux workspace;
- LauncherCtl, Shizuku, and TAI;
- where to choose the default Home app.

Tap **Skip** if you already know the launcher. Replay it later from **Settings → Quick start tour**.

## 4. Verify the basics before changing Home

At the prompt, run:

```shell
launcherctl status
launcherctl apps
```

Then check these touch paths:

1. Tap one pinned app and return Home.
2. Type `%settings` without pressing Enter; confirm the dock filters.
3. Long-press an app icon; dismiss the actions without changing anything.
4. Long-press the terminal and open **More → Settings**.

![Current settings hub showing the Assistant, Launcher, and System sections](assets/onboarding/screenshots/03-settings-hub.webp)

## 5. Set it as Home

Use either Android’s default-app settings or:

```text
Settings → Apps & Access → Set as home launcher
```

Keep a fallback route in mind while learning: Android Settings → Apps → Default apps → Home app.

If you plan to switch the Termux package manager from `pkg`/`apt` to `pacman`, do it before making the launcher your default Home. Recovery is easier while another Home app is still selected.

## First ten minutes

- Leave Material colors and the default dock enabled.
- Learn `%` search and the A–Z row.
- Decide whether to use the built-in keyboard or an external one.
- Grant notification access only if you want dots, inline notification views, media, or LauncherCtl notification commands.
- Skip Shizuku and TAI until the core launcher feels stable.

## Updating later

Install the newer matching APK over the existing app. Do not uninstall just to update; uninstalling may remove app data.

After an update:

```shell
termux-reload-settings
launcherctl update-scripts
```

`launcherctl update-scripts` refreshes repo-owned helpers with timestamped backups. It does not overwrite `~/.tmux.conf`.
