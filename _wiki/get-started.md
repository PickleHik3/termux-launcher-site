---
title: Get started
group: Start here
order: 10
---
Termux Launcher turns the Termux terminal emulator into your Android home screen. The shell underneath is still upstream Termux (`pkg`, the repositories and everything you already know keep working), but everything above it, from the dock to the keyboard to the multiplexer, is built for running your phone from a prompt.

```clip
src: assets/showcase/raw/hero
title: Home screen tour
formats: mp4
caption: The home screen - status strip, live terminal, app dock, A-Z row and the built-in keyboard.
```

## Choose an edition

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

## First launch

Once the Termux bootstrap finishes, Android may ask a couple of things: whether the launcher can read your wallpaper (it colours the status bar, dock and keyboard from it) and whether to turn on the Linux display. Answer either one or tap **Not now** - both stay changeable later in Settings.

Then a short tour plays over the real home screen, one card per gesture: help from a pane corner, pinning apps, opening one from the dock, the keyboard's on/off key, the command palette, your usage mode, and making Termux your home screen, closing on a few tips. Skip any card if you'd rather explore on your own, and replay the whole thing later from **Settings → About & support → Play the tour again**. The [docs home](#wiki) recaps the same moves in one picture if you want a reminder without re-running it.

## Usage mode

Pick how much launcher you want from the first row of Settings:

* **Terminal** - just the terminal.
* **Terminal + Home screen** - apps, widgets and the app drawer.
* **Terminal + Home screen + Linux display** - Linux desktop apps too.

It's a preset, not a lock: picking one sets the pinned apps row, the A-Z index, the app drawer, the widget pane and the Linux display switch, and each one stays editable on its own page afterward. Move one of them off the preset and the row reads **Custom**. Change it anytime from **Settings → Mode**.

## Make it your Home app

**Settings → Apps → Set as default launcher** opens Android's default Home app screen - pick Termux Launcher there. You can switch back to another launcher anytime from Android's own settings.

## Your first hour

**Install a nerd font** - go to **Settings → Look → Terminal fonts** and install one from the in-app picker (the recommended setup is one tap). Prompts, TUIs and the setup script below all use nerd-font icons, so do this first. Details on [Terminal fonts](#wiki/fonts).

**Shell configs** - to get the terminal themes that source your wallpaper's Material colors (fish, oh-my-posh, eza, zoxide, the Neovim colour scheme and the showcase tools), use the store that ships inside the launcher once the bootstrap finishes and you reach the shell.

For the Termux and VAJ editions - details on [tlstore](#wiki/tlstore):

```sh
tlstore shell      # the fish shell setup in one go
tlstore install    # pick anything else, Claude Code included
```

For the Nix edition (`com.termux.launcher.nix`) - run after initializing the launcher flake, see [Nix edition](#wiki/nix):

```sh
setup-toolkits
```

A config you already have is never replaced without showing you the change first, and every replaced file gets a timestamped `.bak`.

**Shared storage** - run `termux-setup-storage` to reach your internal shared storage from the shell.
