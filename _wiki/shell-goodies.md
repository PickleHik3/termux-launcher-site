---
title: Shell goodies
order: 40
---
The launcher works with whatever shell setup you already have. But if you want the setup from the demo videos - fish shell, a Material-themed prompt that follows your wallpaper, nice `ls`, smart `cd` - there is an optional script that sets it all up in one go.

## setup-launcher

Download it, read it, run it:

```sh
curl -fsSLo ~/setup-launcher "https://raw.githubusercontent.com/PickleHik3/termux-launcher/main/docs/en/examples/setup-launcher"
less ~/setup-launcher   # always read a script before running it
chmod 700 ~/setup-launcher
~/setup-launcher
```

The script is interactive and asks what you want:

1. **All** — fish, Oh My Posh, zoxide, eza, Neovim + AstroNvim, sigye, fastfetch with the animated logo, and kitten.
2. **Shell essentials** — fish, Oh My Posh, zoxide, and eza.
3. **Pick items one at a time.**
4. **Quit.**

It never silently overwrites anything - every file it replaces gets a timestamped `.bak` copy next to it. The current script does not write launcher-owned files under `~/.termux`; the app seeds those defaults itself.

Fonts are not part of the script: the in-app font picker (**Settings › Appearance › Terminal fonts**) downloads and wires up curated families, Nerd Font builds included.

```clip
image: assets/uploads/whatsapp-image-2026-08-02-at-12.40.06-am.jpeg
title: setup-launcher result
caption: The shell after setup-launcher - fish, wallpaper-Material prompt, eza listings.
```

## What it installs

| Tool                                            | What you get                                                                                                                           |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [fish](https://fishshell.com)                   | Friendly shell - autosuggestions and completions out of the box.                                                                       |
| [oh-my-posh](https://ohmyposh.dev)              | Prompt with path, git status and command time - themed from your wallpaper colors.                                                     |
| [eza](https://github.com/eza-community/eza)     | Modern `ls` with icons and git info. `ls`, `ll`, `la`, `lt` (tree) are set up as wrappers.                                             |
| [zoxide](https://github.com/ajeetdsouza/zoxide) | Smart `cd` that remembers where you've been - `cd proj` jumps to your most used matching directory. `cd` also runs `ls` after landing. |
| [neovim](https://neovim.io)                     | Optional Neovim + AstroNvim setup with the wallpaper-Material theme; the installed shell config sets it as `$EDITOR`.                  |
| sigye                                           | Optional terminal clock used in the showcase.                                                                                           |
| fastfetch                                       | Optional pinned build plus the animated Termux Launcher logo configuration.                                                             |
| kitten                                          | Optional kitty client binary for tools that use the kitty graphics protocol.                                                            |
| git, curl                                       | Plumbing for the prompt's git segment and the script itself.                                                                            |

## Wallpaper colors in the shell

The launcher writes your current Material palette to `~/.termux/material-colors.sh` whenever the wallpaper theme changes. The installed fish config sources it and re-checks it on every prompt, so open shells pick up a new wallpaper theme without restarting. The oh-my-posh themes and your scripts can use the exported `TERMUX_MATERIAL_*` variables (primary, surface, error, the full terminal 16-color set and more).

## Fonts

Fonts moved into the app: the font picker (**Settings › Appearance › Terminal fonts**) downloads curated families - Nerd Font builds included - and wires them up for you. For manual control, `~/.termux/fonts.conf` still works; see [Terminal fonts](#wiki/fonts).

## Extras in the repo

The same [examples folder](https://github.com/PickleHik3/termux-launcher/tree/main/docs/en/examples) has more you can grab by hand: a tmux config with a matching Material theme, a system monitor and weather widget for status bars, and a fastfetch config.

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
