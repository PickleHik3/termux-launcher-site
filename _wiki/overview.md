---
title: Quick Start
order: 10
---
Termux Launcher is an Android home app built around the solid foundation of Termux - Android terminal emulator.

Through its lifetime, termux launcher has diverged pretty far away from upstream termux. The core shell components are still based on upstream, but termux-launcher has many things added on top that can be considered its own now.

![Termux Launcher home screen with tmux status, live terminal, app dock, A–Z row, and built-in keyboard](assets/onboarding/screenshots/01-home-terminal.webp)

## Features

These are in addition to official termux;

1. Terminal Features

   * Sixel and Kitty protocols for images and gif support.
   * Kitty's fonts, symbols and shaping.
   * Animated cursor.
   * touch handling is different from official termux, while inside TUI's two fingers to scroll and otherwise - touches registered as mouse clicks.
2. App native multiplexer (sessions, windows, panes and layouts, including floating panes).
3. In-app status bar.
4. Command Palette.
5. In-app keyboard port of [Unexpected Keyboard](https://github.com/Julow/Unexpected-Keyboard) by Julow.
6. Quick respond to notifications.
7. Android app drawer.
8. Material color themes.
9. Shizuku integration.
10. local LLM backends for Google LiteRT and Alibaba MNN.

## Download & Installation

| Editions                         | Android package | Notes                                                                                                               |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| **(Recommended) Termux edition** | `com.termux`    | Official Termux package ecosystem. timely package updates but **cannot be installed along side official Termux.**   |
| **Standalone edition**           | `io.vaj.tl`     | My own packages, limited updates but **can be installed alongside official Termux.** *Only available for arm64-v8a* |

1. Download the Main APK from the project’s [Releases](<>).
2. Matching Termux:API or Termux:Styling from;

   * Termux edition:  [termux-api](https://github.com/PickleHik3/termux-api/releases/tag/v0.53.0) & [termux-styling](https://github.com/PickleHik3/termux-styling/releases/tag/v0.32.1)
   * Standalone edition: [termux-api](https://github.com/PickleHik3/termux-api/releases/tag/v0.53.0-vaj) & [termux-styling](https://github.com/PickleHik3/termux-styling/releases/tag/v0.32.1-vaj)

Do not mix official add-ons, old forks, or APKs signed with a different key. Android will reject shared-UID/signature mismatches.

You only need the Main APK to try the launcher.

## Features

* [Install & first run](#wiki/install) - pick an edition, install, set it as home.
* [Feature tour](#wiki/tour) - the same tour the app shows on first run.
* [The launcher surface](#wiki/surface) - dock, status bar, panes, command palette, and the surface editor.
* [Keyboards & Extra Keys](#wiki/keys) - the built-in keyboard and how to switch input methods.
* [tmux keys & status](#wiki/tmux) and [the shell workspace](#wiki/shell) - the optional tmux setup from the demo video.
* [launcherctl](#wiki/launcherctl) - launch Android apps from the shell.
* [Termux AI](#wiki/tai) - local models over an OpenAI/Ollama-compatible API.
* [Shizuku](#wiki/shizuku) and [Troubleshooting](#wiki/trouble) when something needs fixing.
