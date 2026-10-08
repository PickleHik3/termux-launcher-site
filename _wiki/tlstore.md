---
title: tlstore
group: Extras
order: 120
---
The launcher works with whatever shell setup you already have. If you want the setup from the demo videos (fish shell, a Material-themed prompt that follows your wallpaper, nicer `ls`, smart `cd`) plus a handful of terminal apps worth having, the launcher ships a small store that gets them for you.

## tlstore

`tlstore` is the launcher's own package manager for tools and configs it shows off but does not ship in the APK: a fish setup, a few terminal programs, and three coding agents, all installed and kept up to date by one command. It is already on your PATH; the app puts it there, along with the shorter `tl` and `tls`, so all three names run the same store. The app ships tlstore release 2026.10.04.

```sh
tlstore install fish-shell   # fish, the prompt, eza, zoxide and the plugins, in one go
tlstore install              # a picker over everything else
tlstore update               # bring what you have up to date
tlstore remove kitten        # remove an item tlstore installed
```

Plain `tlstore` inside the launcher opens the store window; anywhere else it prints the list. `tlstore shell` is gone: it is now `tlstore install fish-shell`.

## What's in the store

Ten items, and each brings whatever it needs along with it:

| Item          | What you get |
| ------------- | ------------ |
| `fish-shell`  | [fish](https://fishshell.com) with the launcher's config, [eza](https://github.com/eza-community/eza) as `ls`, [zoxide](https://github.com/ajeetdsouza/zoxide) as `cd`, and fisher with the puffer-fish and autopair plugins. |
| `fastfetch`   | System information beside an animated logo. Drop any GIF at `~/Pictures/gif/skel.gif` and it plays there. |
| `sigye`       | A clock for the terminal. |
| `kitten`      | Kitty's companion tool, for images and files in the terminal. |
| `dawn`        | A writing pad for the terminal: markdown that takes shape as you type. With a model picked for **Assistant and endpoint** in the Model centre's **Functions** segment ([On-device AI](#wiki/on-device-ai)), `Ctrl+/` asks it to rewrite the selected text or write at the cursor. The launcher's **Dawn notes integration** function lets Dawn find notes by meaning. |
| `claude-code` | Anthropic's [Claude Code](https://claude.com/claude-code), about 200 MB. Sign in by running `claude`; `tlstore update` keeps it current. |
| `opencode`    | [opencode](https://opencode.ai), about 200 MB. Sign in by running `opencode`; `tlstore update` keeps it current. |
| `codex`       | OpenAI's [Codex](https://github.com/openai/codex), as built for Android by [codex-termux](https://github.com/DioNanos/codex-termux), about 275 MB. Sign in by running `codex`; its own update check is off and `tlstore update` keeps it current. |
| `btop`        | A resource monitor that sees the whole phone (every process, disk and network interface), run as the shell user through Shizuku. Needs [Shizuku](#wiki/permissions) connected, or it says the lane isn't there. Launcher only. |
| `termux-api-shims` | `termux-clipboard-get`, `termux-clipboard-set`, `termux-notification`, `termux-notification-remove`, `termux-notification-list`, `termux-toast`, `termux-vibrate`, `termux-torch`, `termux-battery-status`, `termux-volume` and `termux-wallpaper`, working through `launcherctl` without the Termux:API app. Launcher only; it refuses to install while the real `termux-api` package is present. |

Ask about any item first with `tlstore info <name>`.

The wallpaper-matching oh-my-posh prompt theme and a matching Neovim colour scheme are not in tlstore: they are set up from **Tools that follow the terminal colours** on the **Theme & fonts** settings page (search Settings for it, or run **Look and feel settings** from the command palette). See [Wallpaper colors in the shell](#wallpaper-colors-in-the-shell) below.

A config you already have is never replaced silently: `tlstore update` shows you the change and asks, and the answer defaults to no. Say yes and it leaves a timestamped backup right beside your file. Everything tlstore installs lives under `~/.local`, never in Termux's own `bin`, so a bootstrap reinstall never takes your tools with it.

```clip
image: assets/docs/figures/fish-prompt.webp
size: 576x440
shape: wide
title: fish-shell result
caption: The shell after tlstore install fish-shell - fish, wallpaper-Material prompt, eza listings.
```

## Commands

| Command | What it does |
| --- | --- |
| `tlstore list [-i\|-a]` | Everything in the store; `-i` only what you have, `-a` only what you do not |
| `tlstore search <word>` | Find an item by name or description |
| `tlstore info <name>` | What an item is, its version, and where it goes |
| `tlstore install [--dry-run] <name>...` | Install items, or open the picker with no name |
| `tlstore remove [--dry-run] <name>` | Remove an item tlstore installed |
| `tlstore update [--check\|--offline\|--dry-run]` | Bring everything up to date, or only check |
| `tlstore rollback [--dry-run] <name>` | Go back one recorded version and hold the item there |
| `tlstore hold <name>` / `unhold <name>` | Keep an item at its version, or let it update again |
| `tlstore refresh` | Fetch the newest item list without changing anything |
| `tlstore display` | Set up graphics for Linux apps (runs `termux-x11-gpu-setup`; see [Linux display](#wiki/display)) |
| `tlstore doctor` | Check that everything is in place |
| `tlstore self-update` | Bring tlstore itself up to date |
| `tlstore version` | Show the tlstore and item-list versions |
| `tlstore readme <name>` | Where a copy of the item's own README is saved |
| `tlstore help [command]` | The command list, or one command's page (`<command> --help` too) |

`--tsv` on `list`, `search`, `info` and `update --check` prints tab-separated columns for scripts. `-y` says yes to everything except replacing one of your config files; `--configs` on `install` and `update` answers that too. Exit status 0 means done, 1 means something failed, 2 means a mistake in what you typed.

## Going back a version

`tlstore rollback <name>` puts an item back at the version it had before its last update and holds it there, so the next `tlstore update` skips it. `tlstore list -i` and `tlstore info` mark a held item. `tlstore update <name>` updates it anyway and releases the hold; `tlstore unhold <name>` only releases it. Rollback does not work for package items, bundles or fish plugins.

## Wallpaper colors in the shell

The launcher writes your current Material palette to `~/.termux/material-colors.sh` whenever the wallpaper theme changes. The installed fish config sources it and re-checks it on every prompt, so open shells pick up a new wallpaper theme without restarting. The oh-my-posh themes and your scripts can use the exported `TERMUX_MATERIAL_*` variables (primary, surface, error, the full terminal 16-colour set and more).

## Fonts

Fonts are not part of the store. The **Terminal fonts** row on the **Theme & fonts** page downloads curated families, Nerd Font builds included, and wires them up for you. For manual control, `~/.termux/fonts.conf` still works; see [Terminal fonts](#wiki/fonts).

## Extras in the repo

The same [examples folder](https://github.com/PickleHik3/termux-launcher/tree/main/docs/en/examples) has more you can grab by hand: a tmux config with a matching Material theme, and a system monitor and weather widget for status bars.

## Things worth installing

Two that lean on the graphics and font work above. `sigye` is in the tlstore catalogue; `kew` is a separate music player worth a look.

```clip
name: kew
crop: 0.13 0.28 0.74 0.34
title: kew
caption: kew - music in the terminal, cover art drawn through the kitty graphics protocol.
```

```clip
name: sigye
crop: 0.13 0.40 0.74 0.22
title: sigye
caption: sigye - the clock in box-drawing glyphs, which join because the launcher computes them as geometry.
```

Full details: [Tlstore](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Tlstore.md)
