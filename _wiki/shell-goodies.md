---
title: Shell goodies
order: 40
---
# Shell goodies

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

1. Everything
2. Packages + fish/prompt configs only
3. Terminal configs (`~/.termux`) only
4. Maple Mono fonts only

It never silently overwrites anything - every file it replaces gets a timestamped `.bak` copy next to it. It also offers to make fish your default shell at the end.

> 🖼️ *Screenshot placeholder: terminal after setup - fish prompt with the Material oh-my-posh theme, an `ll` listing with icons, wallpaper colors visible.*

## What it installs

| Tool | What you get |
| --- | --- |
| [fish](https://fishshell.com) | Friendly shell - autosuggestions and completions out of the box. |
| [oh-my-posh](https://ohmyposh.dev) | Prompt with path, git status and command time - themed from your wallpaper colors. |
| [eza](https://github.com/eza-community/eza) | Modern `ls` with icons and git info. `ls`, `ll`, `la`, `lt` (tree) are set up as wrappers. |
| [zoxide](https://github.com/ajeetdsouza/zoxide) | Smart `cd` that remembers where you've been - `cd proj` jumps to your most used matching directory. `cd` also runs `ls` after landing. |
| [fzf](https://github.com/junegunn/fzf) | Fuzzy finder for history and files. |
| [yazi](https://github.com/sxyazi/yazi) | Terminal file manager. Type `y` to open it - quitting drops you in the directory you navigated to. |
| [neovim](https://neovim.io) | Set as `$EDITOR`. |
| git, curl, unzip | Plumbing for the prompt's git segment and the script itself. |

## Wallpaper colors in the shell

The launcher writes your current Material palette to `~/.termux/material-colors.sh` whenever the wallpaper theme changes. The installed fish config sources it and re-checks it on every prompt, so open shells pick up a new wallpaper theme without restarting. The oh-my-posh themes and your scripts can use the exported `TERMUX_MATERIAL_*` variables (primary, surface, error, the full terminal 16-color set and more).

## Fonts

The font option installs [Maple Mono](https://github.com/subframe7536/maple-font) - the variable-weight family for regular text plus its Nerd Font build mapped in only for icon glyphs, so icons work without changing character widths. It wires everything up in `~/.termux/fonts.conf`; see [configs](#wiki/tmux) for how that file works.

## Extras in the repo

The same [examples folder](https://github.com/PickleHik3/termux-launcher/tree/main/docs/en/examples) has more you can grab by hand: a tmux config with a matching Material theme, a system monitor and weather widget for status bars, and a fastfetch config.
