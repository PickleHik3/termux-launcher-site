---
title: Start here
order: 10
---

Termux Launcher turns a real Termux session into your Android home screen. You keep the terminal, packages, files, and sessions you expect from Termux, then gain a touch-friendly app dock, fast search, wallpaper-aware styling, an optional built-in keyboard, and an authenticated shell bridge to Android.

![Termux Launcher home screen with tmux status, live terminal, app dock, A–Z row, and built-in keyboard](assets/onboarding/screenshots/01-home-terminal.webp)

## The shortest path to a working launcher

1. Read **Install & first run** and choose the correct edition.
2. Open the app once and let the Termux bootstrap finish.
3. Walk through the in-app Quick start tour.
4. Try the dock and `%` app search before changing anything.
5. Set it as your Home app only when the terminal and your must-have apps work.

The core launcher does **not** require Shizuku, notification access, tmux, local AI, or a custom shell. Add those one at a time later.

## A first launch that explains itself

New installations open a seven-step, scrollable tour after the Termux bootstrap is ready. It introduces the terminal Home, app search, Material styling, the optional fish/tmux workspace, LauncherCtl, and the optional Shizuku and TAI layers before Android asks you to make any long-term choices.

![First page of the live seven-step onboarding tour](assets/onboarding/screenshots/06-onboarding-welcome.webp)

Existing installations are not interrupted after an upgrade. Replay the tour at any time from **Settings → Quick start tour**.

## What you can grow into

| Level | Start with | Add when useful |
| --- | --- | --- |
| New to Termux | Terminal, app dock, A–Z row, `%` search | Built-in keyboard, appearance controls |
| Comfortable in a shell | fish, tmux, Oh My Posh, eza, zoxide | LauncherCtl commands and tmux app bindings |
| Automating Android | LauncherCtl resources, media, notifications, events | Agent tools, MCP, Shizuku-backed helpers |
| Running models locally | TAI catalog and runtime | OpenAI/Ollama clients, embeddings, local agents |

## Required, recommended, optional

- **Required:** one Termux Launcher main APK.
- **Recommended:** the matching Termux:API and Termux:Styling forks if you use those add-ons.
- **Helpful:** Unexpected Keyboard if you prefer a mature external terminal keyboard.
- **Optional:** tmux workspace, Shizuku, notification access, TAI models, MCP clients.

## Choose your next page

- **Feature tour** shows the complete surface with current screenshots.
- **The launcher surface** teaches the gestures and icon actions.
- **Recreate the shell workspace** explains the live fish/tmux setup without copying private aliases or keys.
- **launcherctl bridge** is the beginner entry to shell-to-Android automation.
- **Troubleshooting** starts with safe checks and escalates only when needed.

> Tip: the Quick start tour is always available again under **Settings → Quick start tour**.
