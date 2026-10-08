---
title: Get started
group: Start here
order: 10
---
Termux Launcher turns the Termux terminal emulator into your Android home screen. The shell underneath is still upstream Termux (`pkg`, the repositories and everything you already know keep working), but everything above it, from the dock to the keyboard to the multiplexer, is built for running your phone from a prompt. This page takes you from download to a working setup.

```clip
src: assets/showcase/raw/hero
title: Home screen tour
formats: mp4
caption: The home screen - status strip, live terminal, app dock, A-Z row and the built-in keyboard.
```

## Choose an edition

There are two editions, plus a legacy one that is deprecated.

| Edition | Android package | Notes |
| --- | --- | --- |
| **Termux edition** (recommended) | `com.termux` | Official Termux package ecosystem with timely package updates. **Cannot be installed alongside official Termux.** |
| **Nix edition** | `com.termux.launcher.nix` | The full `nixpkgs` collection with declarative configs and rollbacks. **Can be installed alongside official Termux.** Releases carry `nix-` tags (`nix-vX.Y.Z` from 1.0.0, `vX.Y.Z-nix` before). *arm64-v8a and x86_64.* See [Nix edition](#wiki/nix). |
| **Demo edition** [Deprecated](../migrate-vaj.html) | `io.vaj.tl` | Its hand-built package repo is no longer updated, so treat it as a demo. [Migrate to the Nix edition](../migrate-vaj.html). *arm64-v8a only.* |

## Download and install

1. Download the main APK for your edition from the project's [Releases](https://github.com/PickleHik3/termux-launcher/releases).
2. Optionally, add the matching Termux:API or Termux:Styling. Styling is rarely needed, since fonts and colours are handled in the app.
   * Termux edition: [Termux:API](https://github.com/PickleHik3/termux-api/releases) and [Termux:Styling](https://github.com/PickleHik3/termux-styling/releases) (plain tags).
   * Nix edition: [TLNix:API](https://github.com/PickleHik3/termux-api/releases) and [TLNix:Styling](https://github.com/PickleHik3/termux-styling/releases) (`nix-v*` tags).

Keep the set matched. Mixing official add-ons, old forks or APKs signed with a different key breaks the install, because Android rejects shared-UID and signature mismatches. You only need the main APK to try the launcher.

## First launch

1. The app downloads and unpacks the Termux bootstrap.
2. A **Before you start** card asks for the few permissions the launcher can use. Each row has its own **Allow**: **Wallpaper** (colour the launcher after your wallpaper), **Weather** (shown only while the weather widget or readout is on; its text reads "Shows the weather for a place you pick, or for where you are.") and **Linux display** (only in builds that have it). The **Weather** row has a city search field under its text, the same search as **Settings → Status bar → Weather → Location**, credited "Search by Open-Meteo." Pick a place and the row reads "Now:" followed by the place, with no permission asked. A small **Use my location** button clears the place and runs the **Allow** flow instead; once granted the row reads **Allowed** and the search stays available. Tap **Continue** when you are done. Everything stays changeable later in Settings.
3. The tour offers itself: **Take the tour** or **Not now**.

The tour plays over the real home screen, one card per gesture, in this order:

1. How you will use it: the usage mode (see Launcher mode below).
2. **Hold a corner** of a pane, then tap **?** for help on what you are touching.
3. **Hold the page border** and drag to slide to the next place.
4. Swipe up on the bottom border to raise the keyboard, down to put it away.
5. Swipe down on the top border to open the status bar, up to fold it.
6. Hold an empty spot in the apps row to pin apps.
7. Swipe down on the apps row to open the app drawer (swipe right on a left rail, left on a right rail).
8. Swipe up on the space bar for the command palette.
9. After an update only: the offer of the new extra-keys row.
10. Use Termux Launcher as your home screen.
11. A closing card with tips: holding on the terminal, the Ctrl+Alt shortcut strip, the Appearance corner, minimal mode, dictation, `tlstore` extras with a **Copy** button for the commands, Linux GUI apps, and **Read the docs**.

Skip any card if you would rather explore. Replay the tour later from **Settings → About & help → Replay tour**.

After the tour, an On-device AI card, **What runs on this phone**, lists what this phone can run locally (voice typing, read aloud, an assistant that tidies dictation, and more) with the downloads each needs. Pick what you want and tap **Download selected**, keep **Wi-Fi only** on to wait for Wi-Fi, or tap **Later**. Reopen it any time from **Settings → On-device AI → What runs on this phone**. See [On-device AI](#wiki/on-device-ai).

## Launcher mode

**Settings → Launcher mode**, the first row under the search box, asks "How will you use it?":

* **Terminal**: just the terminal.
* **Terminal + Home**: apps and widgets.
* **Terminal + Home + Display**: also run Linux desktop apps.

It is a preset, not a lock. Picking one sets the pinned apps row, the A-Z index, the app drawer, the widget page, the Linux display switch and whether the app stays in Recents. Each of these stays editable on its own page, and once one drifts from the preset the row reads **Custom**.

Picking **Terminal** while Termux Launcher is still your home app says so and offers **Choose another home app** or **Keep**.

## Make it your Home app

**Settings → Apps → Set as default launcher** opens Android's default home app screen. Pick Termux Launcher there. Switch back to another launcher at any time from Android's own settings.

## Your first hour

**Install a Nerd Font.** Prompts, TUIs and the setup below use Nerd Font icons, so do this first. Open the command palette (swipe up on the space bar) and run **Terminal fonts**, or search Settings for "fonts", which leads to **Theme & fonts → Terminal fonts**. Install one from the picker. Details on [Terminal fonts](#wiki/fonts).

**Shell setup.** The store that ships inside the launcher sets up a themed shell whose colours follow your wallpaper. Termux and Demo editions, details on [tlstore](#wiki/tlstore):

```sh
tlstore install fish-shell   # the fish shell setup in one go
tlstore install              # pick anything else, Claude Code included
```

Nix edition (`com.termux.launcher.nix`), after initialising the launcher flake (see [Nix edition](#wiki/nix)):

```sh
setup-toolkits
```

A config you already have is never replaced without showing you the change first, and every replaced file gets a timestamped `.bak`.

**Shared storage.** Run `termux-setup-storage` to reach your internal shared storage from the shell.

**Where next.** [Home screen & apps](#wiki/home-screen) covers the dock, the A-Z row and the drawer; [Layout & full screen](#wiki/layout) and [Look & themes](#wiki/look) cover arranging and styling it.

Full details: [Get started](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Get_Started.md) and [Learn the launcher](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Learn_The_Launcher.md)
