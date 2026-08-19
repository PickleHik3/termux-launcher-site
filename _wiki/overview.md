---
title: Quick Start
order: 5
---
Termux Launcher is a terminal emulator Android home launcher, powered by the amazing Termux terminal emulator. It is designed to give you the closest experience to controlling your Android using a terminal.

The shell underneath is still upstream Termux — `pkg`, the repositories and everything you already know keep working. Everything above the shell has diverged far enough to be its own thing now. If you're familiar with Termux already, the feature list below plus the linked pages is all you need.

```clip
src: assets/showcase/raw/hero
title: Home screen tour
formats: mp4
caption: The home screen - status strip, live terminal, app dock, A-Z row and the built-in keyboard.
```

## What's added on top of Termux

* **Terminal features** — Sixel + Kitty graphics protocols (images and gifs right in the terminal), kitty font handling and shaping, kitty keyboard protocol, styled underlines, animated cursor, TUI-aware touch. Details on [Terminal](#wiki/surface).
* **In-app multiplexer** — like tmux but with some clear advantages, such as pinch zoom per pane. Sessions, windows, panes, floating panes and a scratchpad. `Ctrl+Alt` is the default chord — hold it and the bound keys light up with a legend. See [Terminal](#wiki/surface) and [Keybindings](#wiki/keybindings).
* **Command palette** — swipe up on the space bar or `Ctrl+Alt+Shift+P`. Launch Android apps and reach every launcher feature from one search box. See [Command Palette](#wiki/tour).
* **In-app keyboard** — a built-in port of [Unexpected Keyboard](https://github.com/Julow/Unexpected-Keyboard) by Julow. See [in-app keyboard](#wiki/shell).
* **Status bar** — session chip, window pills, RAM, best-effort CPU and weather; Shizuku adds detailed CPU/memory and process data. Tap a status item for a drop-down with more info, slide down for the expanded clock, and swipe up to close it. [Essential notification](#wiki/notifications) rules pin the notifications you wait for above the prompt.
* **Quick reply** — answer a pinned app's notification without leaving the terminal. See [Home Launcher](#wiki/install).
* **App drawer + dock** — A-Z row launching, a full drawer with three layouts, folders, custom icons. See [Home Launcher](#wiki/install).
* **Material color themes** — the whole UI, terminal and keyboard follow your wallpaper.
* **Local LLM backends** — Google LiteRT and Alibaba MNN, served over OpenAI/Ollama-compatible endpoints. See [LLM backends](#wiki/tai).

## Editions

There are 2 editions (and a legacy one deprecated) of Termux Launcher available;

| Editions | Android package | Notes |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| **(Recommended) Termux edition** | `com.termux`    | Official Termux package ecosystem. Timely package updates but **cannot be installed alongside official Termux.**   |
| **Nix edition** | `com.termux.launcher.nix` | The full `nixpkgs` collection with declarative configs and rollbacks, and it **can be installed alongside official Termux.** Releases tagged `vX.Y.Z-nix` (marked pre-release). *arm64-v8a and x86_64.* See [Nix edition](#wiki/nix). |
| **Demo edition** [Deprecated](migrate-vaj.html) | `io.vaj.tl` | Its manually compiled package repo is not updated anymore — at most consider it a demo, not recommended for daily use. [Migrate to the Nix edition](migrate-vaj.html). *arm64-v8a only.* |

## Download & installation

1. Download the Main APK from the project's [Releases](https://github.com/PickleHik3/termux-launcher/releases).
2. Optionally, the matching Termux:API or Termux:Styling (styling is largely unnecessary — fonts and colors are handled in-app):

   * Termux edition: [Termux:API](https://github.com/PickleHik3/termux-api/releases) & [Termux:Styling](https://github.com/PickleHik3/termux-styling/releases) (plain tags)
   * Nix edition: [TLNix:API](https://github.com/PickleHik3/termux-api/releases) & [TLNix:Styling](https://github.com/PickleHik3/termux-styling/releases) (`nix-v*` tags)

Notes:

* Ensure you're downloading the same set of items — mixing official add-ons, old forks, or APKs signed with a different key breaks the install; Android rejects shared-UID/signature mismatches.
* On first launch the app downloads bootstrap packages. You only need the Main APK to try the launcher.

## Set it up

**Install a nerd font** — go to **Settings → Appearance → Terminal fonts** and install one from the in-app picker (the recommended setup is one tap). Prompts, TUIs and the setup script below all use nerd-font icons, so do this first. Details on [Terminal fonts](#wiki/fonts).

**Shell configs** — to get the terminal themes that source your wallpaper's Material colors (fish, oh-my-posh, eza, zoxide, neovim and the showcase tools), run your edition's setup script once the bootstrap finishes and you reach the shell.

For the Termux edition (`com.termux`) — details on [Shell goodies](#wiki/shell-goodies):

```sh
curl -fsSLO https://raw.githubusercontent.com/PickleHik3/termux-launcher/main/docs/en/examples/setup-launcher
sh setup-launcher
```

For the Nix edition (`com.termux.launcher.nix`) — run after initializing the launcher flake, see [Nix edition](#wiki/nix):

```sh
setup-toolkits
```

Every config either script replaces gets a timestamped `.bak` first.
* **Make it your Home app** — **Settings → Launcher & Apps → Set as default launcher**. Android shows its Home-app picker; you can switch back anytime from Android Settings.
* **Shared storage** — run `termux-setup-storage` to reach your internal shared storage from the shell.
* **Use it as a terminal only** — if you don't want it as your home app, long press the terminal → More → Settings → Launcher & Apps → **Terminal Only**. It disables the launcher features; each can be turned back on individually.

## Docs

* [Home Launcher](#wiki/install) - dock, app drawer, quick reply, app launching gestures, lock screen.
* [Command Palette](#wiki/tour) - every launcher action, searchable from the keyboard or a gesture.
* [Terminal](#wiki/surface) - graphics protocols, the multiplexer, floating panes, workspaces and the status bar.
* [Terminal fonts](#wiki/fonts) - the in-app picker, `fonts.conf`, gap-free box drawing and symbol maps.
* [Essential notifications](#wiki/notifications) - rules that pin the notifications you wait for above the prompt.
* [Permissions](#wiki/launcherctl) - what the app asks for and why, including Shizuku.
* [in-app keyboard](#wiki/shell) - the built-in Unexpected Keyboard port and custom layouts.
* [Nix edition](#wiki/nix) - first setup, `setup-toolkits` and daily Nix commands.
* [LLM backends](#wiki/tai) - local models over an OpenAI/Ollama-compatible API.
* [Shell goodies](#wiki/shell-goodies) - the optional setup script and the CLI tools it installs.
* [configs](#wiki/tmux) - keybindings, fonts and properties.
* [Backup & recovery](#wiki/backup) - updating safely, what to back up, common fixes.
