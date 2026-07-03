---
title: Overview
order: 10
---

Termux Launcher replaces your Android home screen with a live Termux session. Everything you would tap for on a normal launcher — opening apps, searching, media, and system status — happens in and around the prompt. It is built on Termux + Termux:Monet and inspired by TEL.

These docs cover launcher-specific usage: the launcher surface, shell commands, terminal integrations, the optional Shizuku backend, and troubleshooting. For the on-device model host, see the [Termux AI](#ai) page.

## Requirements

- A modern Android device compatible with Termux (Android 8.0+).
- The `com.termux` build cannot coexist with the regular Termux app because they share a package identity. Uninstall stock Termux first, or use the side-by-side `io.vaj.tl` build.
- Recommended companion: [Unexpected Keyboard](https://github.com/Julow/Unexpected-Keyboard), which this launcher is tuned for — especially for terminal and tmux use.

## Companion forks

Add-ons must be signed to match the launcher. Mixing differently signed Termux add-ons causes shared-UID errors. Always install the matching forks from the same build family:

- [Termux:API](https://github.com/PickleHik3/termux-api/releases)
- [Termux:Styling](https://github.com/PickleHik3/termux-styling/releases)

Grab all three APKs (Main + API + Styling) from one pack in the [downloads section](#setup).

## Where to go next

- New here? Start with **Install & first run**.
- Learn **The launcher surface** and the **launcherctl bridge**.
- Recreate the workspace: **tmux & shell setup** and **tmux keybinds**.
