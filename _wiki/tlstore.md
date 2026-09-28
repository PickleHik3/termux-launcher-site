---
title: tlstore
group: Extras
order: 120
---
The launcher works with whatever shell setup you already have. But if you want the setup from the demo videos - fish shell, a Material-themed prompt that follows your wallpaper, nice `ls`, smart `cd` - the launcher ships a small store that sets it all up in one go.

## tlstore

`tlstore` (or `tl`, `tls` for short) is already on your PATH; the app puts it there. Nothing to download, nothing to read through first.

```sh
tlstore shell            # fish, the prompt, eza, zoxide and the plugins, in one go
tlstore install          # a picker over everything else
tlstore update           # bring what you have up to date
tlstore display          # set up graphics for Linux apps
```

Seven things are on offer:

| Item          | What you get                                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `fish-shell`  | [fish](https://fishshell.com) with the launcher's config, an [oh-my-posh](https://ohmyposh.dev) prompt themed from your wallpaper, [eza](https://github.com/eza-community/eza) as `ls`, [zoxide](https://github.com/ajeetdsouza/zoxide) as `cd`, and fisher with puffer-fish and autopair. |
| `omp-theme`   | Just the prompt theme, for a fish or oh-my-posh setup you already have.                                                            |
| `nvim-theme`  | A Neovim colour scheme that follows your wallpaper — works in AstroNvim, LazyVim, NvChad or plain Neovim (`:colorscheme launcher-material`). |
| `fastfetch`   | System information beside an animated logo. Drop any GIF at `~/Pictures/gif/skel.gif` and it plays there.                          |
| `sigye`       | A clock for the terminal.                                                                                                           |
| `kitten`      | Kitty's companion tool, for images and files in the terminal.                                                                       |
| `claude-code` | Anthropic's Claude Code, about 200 MB. Sign in by running `claude`; `tlstore update` keeps it current.                              |

A config you already have is never replaced silently: `tlstore update` shows you the change and asks. Every file it does replace gets a timestamped `.bak` next to it. Tools land in `~/.local/bin`, so a bootstrap reinstall does not take them with you.

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

Two from the wider terminal world that lean on the graphics and font work - both in the repo:

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
