---
title: Config files
group: Reference
order: 230
---
This page lists every file the launcher reads or writes in your home directory, and what each one is for. Almost everything lives in `~/.termux/`. After editing a file, apply it without restarting:

```sh
termux-reload-settings
```

A running terminal session keeps the environment it started with, so `terminal-term` reaches only sessions opened after the reload.

## Files you edit

| File | What it controls |
| --- | --- |
| `~/.termux/termux.properties` | Classic Termux properties plus the extra-keys row |
| `~/.config/termux/termux.properties` | Read only when `~/.termux/termux.properties` is absent; only one properties file is ever read |
| `~/.termux/termux-launcher-bindings.conf` | Custom keybindings, see [Keybindings config](#wiki/keybindings) |
| `~/.termux/fonts.conf` | Fonts, nerd-font symbols, ligatures, box drawing, see [Terminal fonts](#wiki/fonts) |
| `~/.termux/fonts.d/` | Drop-in font fragments, including the app-managed `10-launcher.conf` |
| `~/.config/kitty/kitty.conf` | Font directives only, read before `fonts.d/`; every other kitty setting is ignored, and the app never creates this file |
| `~/.termux/font.ttf`, `font-italic.ttf` | The classic Termux fonts, also what Termux:Styling writes |
| `~/.termux/colors.properties` | Terminal colours (only when **Wallpaper colors** is off) |
| `~/.termux/launcher-theme.properties` | Overrides for single launcher interface colour tokens; applies on top even with **Wallpaper colors** on |
| `~/.termux/theme-templates/<id>/` | Your own templates for **Tools that follow the terminal colours**: a `template.properties` manifest, the file to render and its hooks |
| `~/.termux/keyboard/layout.xml` | In-app keyboard layout, see [Keyboard layout schema](#wiki/keyboard-layout) |
| `~/.termux/app-categories.conf` | The drawer's app categories, one section per category, editable by hand |
| `~/.termux/boot/` | Scripts the Termux:Boot add-on runs after a restart (a Termux:Boot fork exists for every edition) |

## Files the launcher writes

| File | What it holds |
| --- | --- |
| `~/.termux/material-colors.sh`, `.properties` | The palette in use right now, exported for scripts and prompts |
| `~/.termux/material-colors-dark.sh`, `.properties` and `material-colors-light.sh`, `.properties` | The same keys for each mode, written on every palette pass |
| `~/.termux/fonts/` | Font files the font picker installs |
| `~/.termux/fonts.d/10-launcher.conf` | The font picker's managed selection |
| `~/.termux/workspaces/<name>.json` | Workspaces saved with `workspace.save` |
| `~/.termux/shell-integration/termux-launcher.{bash,zsh}` | Prompt-marking scripts, see [Shell integration](#shell-integration) |
| `~/.termux/theme-templates/.applied` | The list of templates that are switched on |

## The examples folder

`~/.termux/launcher/examples/` holds reference copies, rewritten every time the app starts: `README.md`, `termux-launcher-bindings.conf`, `fonts.conf`, `termux.properties`, `keyboard-layout.xml` and `kitty.conf`. Do not edit them; edit the live files.

`termux-launcher-bindings.conf`, `fonts.conf` and `termux.properties` are seeded on install, fully commented out, if they are absent, so a fresh install behaves as if they did not exist. They are written only when missing, so your edits survive updates. `layout.xml` is never seeded: as soon as it exists it replaces the bundled keyboard, so copy it yourself:

```sh
mkdir -p ~/.termux/keyboard
cp ~/.termux/launcher/examples/keyboard-layout.xml ~/.termux/keyboard/layout.xml
```

## Keybindings

`~/.termux/termux-launcher-bindings.conf` binds keys to any action from the [Command Palette](#wiki/command-palette); the palette is also where you discover action ids and see which keys are already taken. The format is kitty-inspired:

```text
# map <keys> <action> [arguments]
map --label WhatsApp ctrl+alt+space>w  app.launch com.whatsapp
map ctrl+alt+shift+n  session.new name=build
map ctrl+alt+t        send-text "echo hi\n"
map ctrl+alt+space>c  send-key ctrl+c

# chords: press the first stroke, release, press the next
map ctrl+alt+space>t  app.launch org.telegram.messenger

# a tmux-style prefix for every ctrl+alt binding
leader ctrl+b

# remove a default binding
unmap ctrl+alt+s
```

Worth knowing:

- Modifier names and multi-character keys are case-insensitive, and `control` is an alias for `ctrl`. A single upper-case letter means Shift: `Ctrl+Alt+R` is `ctrl+alt+shift+r`, not `ctrl+alt+r`.
- Binding a key that already has a default **replaces** the default: `map ctrl+alt+w …` removes "kill focused pane", `map ctrl+alt+enter …` removes "New pane". Repeating the same keys on multiple lines runs the actions in order.
- Arguments can be positional or `name=value`.
- `--when splits-on` / `--when splits-off` makes a binding apply only in one terminal mode.
- `--label "Name"` (up to 32 characters) names the binding in the keybind legend.
- `leader <stroke>` gives every root `ctrl+alt+…` binding a second spelling: the leader, then the key.
- Bad lines are skipped and reported; the rest of the file keeps working. A file over 256 KiB, 4,096 lines or 4,096 characters on a line is ignored whole.
- The *Key inspector* action in the palette shows you exactly what the app sees when you press something.

## termux.properties

All the upstream Termux properties work. The shipped file is nearly all commented out and documents the launcher's own keys:

- `terminal-term`: the `TERM` exported to new sessions (default `xterm-256color`).
- `volume-keys`: the volume keys change the volume by default; `volume-keys = virtual` restores upstream Termux behaviour.
- `extra-keys` and `extra-keys2`: the extra-keys row and its second page. The launcher's own row is the built-in default, so there is nothing to set to get it; the property only overrides it. The `extrakeys.edit` action ("Edit key row") opens an editor that writes the property for you.

Extra keys can trigger any palette action with the `tool:` syntax:

```properties
extra-keys = [[ \
  {macro: "tool:workspace.picker", display: "▤"}, \
  {macro: "tool:terminal.toggle_scratchpad", display: "▣"}, \
  {macro: "tool:pane.move_to_edge:edge=left", display: "⇤"} \
]]
```

`tool:<action-id>` runs the action; arguments ride along as `:name=value` pairs. The shipped example has only a commented upstream-style row.

## Fonts

`~/.termux/fonts.conf` is a kitty-style font config. Without it, the classic `~/.termux/font.ttf` / `font-italic.ttf` still work. With it you get per-style fonts, nerd-font symbol mapping and ligature control:

```text
font_family        path=~/.termux/fonts/MapleMono[wght].ttf
italic_font        path=~/.termux/fonts/MapleMono-Italic[wght].ttf
font_variations    regular wght=400
font_variations    bold    wght=700

# pull icon glyphs from a nerd font without affecting text width
symbol_map U+E000-U+F8FF path=~/.termux/fonts/MapleMono-NF-Regular.ttf

disable_ligatures cursor
font_features regular +zero
```

Also available: `bold_font`, `bold_italic_font`, `family="…"` to use an installed family instead of a file, and `modify_font` to nudge cell width/height, baseline and underline metrics. The example file documents every directive.

Precedence, strongest first: `~/.termux/fonts.conf`, then `~/.termux/fonts.d/*.conf` in filename order, then `font.ttf` / `font-italic.ttf`. Below all three, `~/.config/kitty/kitty.conf` is read first, for its font directives only.

## Colors

By default the terminal is themed from your wallpaper (Material You), with **Wallpaper colors** on the **Theme & fonts** settings page (search Settings for it, or run **Look and feel settings** from the command palette). While that is on, `colors.properties` is ignored. Turn it off, or apply a Termux:Styling scheme (which turns it off), to use your own `colors.properties`, same format as upstream Termux. With the switch off, an edited `colors.properties` is re-read when it changes, and the material-colors exports are rewritten.

`~/.termux/launcher-theme.properties` overrides single interface colour tokens, one per line, on top of either palette:

```properties
primary                = color3
surface_container_high = lighten(surface, 0.08)
```

The current palette is exported for scripts as `~/.termux/material-colors.sh` / `.properties`, see [tlstore](#wiki/tlstore).

## Shell integration

Prompt-jumping (*Jump to previous/next prompt* in the palette) needs the shell to mark prompts (OSC 133). fish 4 does this out of the box. For bash or zsh, source the script the app keeps in place:

```sh
# ~/.bashrc
source ~/.termux/shell-integration/termux-launcher.bash
# ~/.zshrc
source ~/.termux/shell-integration/termux-launcher.zsh
```

The app updates those scripts itself but never touches your rc files.

Full details: [Config files](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Config_Files.md)
