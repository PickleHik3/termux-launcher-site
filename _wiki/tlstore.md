---
title: tlstore
group: Extras
order: 120
---
The launcher works with whatever shell setup you already have. But if you want the setup from the demo videos - fish shell, a Material-themed prompt that follows your wallpaper, nice `ls`, smart `cd` - plus a handful of terminal apps worth having, the launcher ships a small store that gets them for you.

## tlstore

`tlstore` is the launcher's own package manager for tools and configs it shows off but does not ship in the APK - a fish setup, a few terminal programs, and two coding agents, all installed and kept up to date by one command. It's already on your PATH; the app puts it there, along with the shorter `tl` and `tls`, so all three names run the same store. Nothing to download, nothing to read through first.

```sh
tlstore shell            # fish, the prompt, eza, zoxide and the plugins, in one go
tlstore install          # a picker over everything else
tlstore update           # bring what you have up to date
tlstore remove kitten    # remove an item tlstore installed
```

Eight things are on offer, and each brings whatever it needs along with it:

| Item          | What you get                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `fish-shell`  | [fish](https://fishshell.com) with the launcher's config, [eza](https://github.com/eza-community/eza) as `ls`, [zoxide](https://github.com/ajeetdsouza/zoxide) as `cd`, and fisher with the puffer-fish and autopair plugins. |
| `fastfetch`   | System information beside an animated logo. Drop any GIF at `~/Pictures/gif/skel.gif` and it plays there.                          |
| `sigye`       | A clock for the terminal.                                                                                                           |
| `kitten`      | Kitty's companion tool, for images and files in the terminal.                                                                       |
| `dawn`        | A writing pad for the terminal: markdown that takes shape as you type. With a local model downloaded and set as default in On-device AI, `Ctrl+/` asks it to rewrite the selected text or write at the cursor. |
| `claude-code` | Anthropic's [Claude Code](https://claude.com/claude-code), about 200 MB. Sign in by running `claude`; `tlstore update` keeps it current. |
| `opencode`    | [opencode](https://opencode.ai), about 200 MB. Sign in by running `opencode`; `tlstore update` keeps it current.                    |
| `btop`        | A resource monitor that sees the whole phone - every process, disk and network interface - run as the shell user through Shizuku. Needs [Shizuku](#wiki/permissions) connected, or it says the lane isn't there. Launcher only. |

The wallpaper-matching oh-my-posh prompt theme and a matching Neovim colour scheme are now set up from **Settings › Look & feel** (see [Wallpaper colors in the shell](#wallpaper-colors-in-the-shell) below), not from tlstore.

A config you already have is never replaced silently: `tlstore update` shows you the change and asks, and the answer defaults to no. Say yes and it leaves a timestamped backup right beside your file. Everything tlstore installs lives under `~/.local` - never in Termux's own `bin` - so a bootstrap reinstall never takes your tools with it.

Fonts are not part of the store: the in-app font picker (**Settings › Appearance › Terminal fonts**) downloads and wires up curated families, Nerd Font builds included.

```clip
image: assets/uploads/whatsapp-image-2026-08-02-at-12.40.06-am.jpeg
title: tlstore shell result
caption: The shell after tlstore shell - fish, wallpaper-Material prompt, eza listings.
```

## Wallpaper colors in the shell

The launcher writes your current Material palette to `~/.termux/material-colors.sh` whenever the wallpaper theme changes. The installed fish config sources it and re-checks it on every prompt, so open shells pick up a new wallpaper theme without restarting. The oh-my-posh themes and your scripts can use the exported `TERMUX_MATERIAL_*` variables (primary, surface, error, the full terminal 16-color set and more).

## Fonts

Fonts moved into the app: the font picker (**Settings › Appearance › Terminal fonts**) downloads curated families - Nerd Font builds included - and wires them up for you. For manual control, `~/.termux/fonts.conf` still works; see [Terminal fonts](#wiki/fonts).

## Extras in the repo

The same [examples folder](https://github.com/PickleHik3/termux-launcher/tree/main/docs/en/examples) has more you can grab by hand: a tmux config with a matching Material theme, and a system monitor and weather widget for status bars.

## Things worth installing

Two that lean on the graphics and font work above. `sigye` is in the tlstore catalogue; `kew` is a separate music player worth a look.

```clip
name: kew
title: kew
caption: kew - music in the terminal, cover art drawn through the kitty graphics protocol.
```

```clip
name: sigye
title: sigye
caption: sigye - the clock in box-drawing glyphs, which join because the launcher computes them as geometry.
```
