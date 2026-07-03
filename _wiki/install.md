---
title: Install & first run
order: 15
---

The [About page](#setup) has the simplest three-step install. This page is the fuller reference for first-run details and edge cases.

## 1. Install the APKs

1. Download the Main app plus the matching **API** and **Styling** companions from the same build pack — see [downloads](#setup).
2. All three must share one signing key. Mixing packs or adding stock Termux add-ons causes shared-UID / signing errors.
3. Open the Main app once so Termux finishes its first-run bootstrap. Wait for the `fish ❯` prompt.

## 2. Optional: switch package manager first

If you want to switch Termux from `pkg`/`apt` to `pacman`, do it **before** setting Termux Launcher as your Home app — that keeps fail-safe mode easy to reach. See the Termux wiki on [switching package manager](https://wiki.termux.com/wiki/Switching_package_manager).

## 3. Set it as your home launcher

From Android settings, or from inside the launcher:

```text
Long press Terminal -> More -> Apps Bar -> Set as home launcher
```

Current builds ship with **Terminal Material colors on by default**, so the terminal and tmux theme follow your wallpaper immediately — no manual toggle.

## Keeping it fresh

If terminal drawing or input feels slow after an update:

```sh
termux-reload-settings
```

After updating the APK, refresh only the repo-owned helper scripts (your `~/.tmux.conf` and configs stay intact):

```sh
launcherctl update-scripts
```

## Helpful apps

- [Unexpected Keyboard](https://github.com/Julow/Unexpected-Keyboard) — tuned for terminal and tmux. Also on the [Play Store](https://play.google.com/store/apps/details?id=juloo.keyboard2).
- [Shizuku](https://github.com/rikkaapps/shizuku) — only if you want optional lock-screen, Shizuku shell, or the `btop` helper. See [Shizuku, rish & btop](#wiki/shizuku).
