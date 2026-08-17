---
title: configs
order: 45
---
Everything lives in `~/.termux/`. Fully commented reference copies of every config are kept fresh in `~/.termux/launcher/examples/` on each app start - when in doubt, read those. After editing any file, apply it without restarting:

```sh
termux-reload-settings
```

| File | What it controls |
| --- | --- |
| `~/.termux/termux.properties` | Classic Termux properties + the extra-keys row |
| `~/.termux/termux-launcher-bindings.conf` | Custom keybindings |
| `~/.termux/fonts.conf` | Fonts, nerd-font symbols, ligatures, box drawing - see [Terminal fonts](#wiki/fonts) |
| `~/.termux/fonts.d/` | Drop-in font fragments, including the app-managed `10-launcher.conf` |
| `~/.termux/colors.properties` | Terminal colors (only when wallpaper colors are off) |
| `~/.termux/keyboard/layout.xml` | In-app keyboard layout - see [in-app keyboard](#wiki/shell) |

## Keybindings

`~/.termux/termux-launcher-bindings.conf` binds keys to any action from the [Command Palette](#wiki/tour) - the palette is also where you discover action ids and see which keys are already taken. The format is kitty-inspired:

```text
# map <keys> <action> [arguments]
map ctrl+alt+w        app.launch com.whatsapp
map ctrl+alt+shift+n  session.new name=build
map ctrl+alt+t        send-text "echo hi\n"
map ctrl+alt+enter    send-key ctrl+c

# chords: press the first stroke, release, press the next
map ctrl+alt+space>t  app.launch org.telegram.messenger

# remove a default binding
unmap ctrl+alt+s
```

Worth knowing:

* Key names are case-insensitive; modifiers are `ctrl`, `alt`, `shift`.
* Binding a key that already has a default **replaces** the default; repeating the same keys on multiple lines runs the actions in order.
* Arguments can be positional or `name=value`.
* `--when splits-on` / `--when splits-off` makes a binding apply only in one terminal mode.
* Bad lines are skipped and reported - the rest of the file keeps working.
* The *Key inspector* action in the palette shows you exactly what the app sees when you press something.

## termux.properties

All the upstream Termux properties work. The launcher adds one thing: extra keys can trigger any palette action with the `tool:` syntax:

```properties
extra-keys = [[ \
  {macro: "tool:workspace.picker", display: "▤"}, \
  {macro: "tool:terminal.toggle_scratchpad", display: "▣"}, \
  {macro: "tool:pane.move_to_edge:edge=left", display: "⇤"} \
]]
```

`tool:<action-id>` runs the action; arguments ride along as `:name=value` pairs. The shipped example (`~/.termux/launcher/examples/`) has a full row with workspace picker, window switching, pane controls and scratchpad.

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

Also available: `bold_font`, `bold_italic_font`, `family="…"` to use an installed family instead of a file, and `modify_font` to nudge cell width/height, baseline and underline metrics. The example file documents every directive. The [setup script](#wiki/shell-goodies) writes a ready-made Maple Mono version of this.

## Colors

By default the terminal is themed from your wallpaper (Material You) - **Settings → Look & feel → Use wallpaper colors**. While that's on, `colors.properties` is ignored. Turn it off to use your own `colors.properties`, same format as upstream Termux.

The current palette is also exported for scripts as `~/.termux/material-colors.sh` / `.properties` - see [Shell goodies](#wiki/shell-goodies).

## Shell integration

Prompt-jumping (*Jump to previous/next prompt* in the palette) needs the shell to mark prompts (OSC 133). fish 4 does this out of the box. For bash or zsh, source the script the app keeps in place:

```sh
# ~/.bashrc
source ~/.termux/shell-integration/termux-launcher.bash
# ~/.zshrc
source ~/.termux/shell-integration/termux-launcher.zsh
```

The app updates those scripts itself but never touches your rc files.
