---
title: Action reference
order: 55
---
These are the current action IDs accepted by `~/.termux/termux-launcher-bindings.conf`, the command palette, `tool:` keys in the embedded keyboard, and `tool:` entries in Termux Extra Keys.

## Which surfaces accept arguments?

| Surface | Action syntax | Arguments |
| --- | --- | --- |
| Binding file | `map … <action-id> [arguments]` | Positional required values and `name=value` |
| In-app keyboard XML | `tool:<action-id>:<glyph>` | None; the suffix is a display glyph, not arguments |
| `termux.properties` Extra Keys | `tool:<action-id>:name=value,name=value` | Named values after the second colon |
| Command palette | Search by action title or ID | Shows actions it can run or prompt for interactively |

An action with a required argument is unsuitable for a direct in-app keyboard `tool:` slot. Put it in the binding file, or use an Extra Key that can carry arguments.

## Argument notation

In the tables below, `required` means the value must be supplied. A value marked `optional` uses the shown default when omitted.

### Panes

Pane and window actions require split panes to be enabled.

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `pane.split_vertical` | none | Split the focused pane side by side |
| `pane.split_horizontal` | none | Split the focused pane into a stacked pair |
| `pane.focus_direction` | `direction`: `left`, `right`, `up`, or `down` (required) | Focus the neighboring pane |
| `pane.resize` | `direction`: `left`, `right`, `up`, or `down` (required) | Grow the focused pane toward an edge |
| `pane.kill_focused` | none | Terminate the focused pane's shell |
| `pane.layout` | `layout`: `stack`, `grid`, `tall`, `fat`, `horizontal`, or `vertical` (required) | Apply and retain an automatic layout |
| `pane.equalize` | none | Reset all current dividers to equal ratios |
| `pane.rotate` | `direction`: `clockwise` or `counterclockwise` (optional, `clockwise`) | Rotate the pane tree |
| `pane.move_to_edge` | `edge`: `left`, `right`, `up`, or `down` (required) | Move the focused pane to an outer edge |
| `pane.next_layout` | none | Cycle `grid` → `tall` → `fat` → `horizontal` → `vertical` → `stack` |
| `pane.toggle_float` | none | Float the focused pane or dock it again |
| `pane.rename` | `name` (required; empty restores the default) | Rename the focused pane's shell |
| `pane.rename_prompt` | none | Open the interactive rename editor for the focused pane |

Examples:

```text
map ctrl+alt+g pane.equalize
map ctrl+alt+shift+1 pane.layout grid
map ctrl+alt+shift+2 pane.move_to_edge left
map ctrl+alt+space>r pane.rotate direction=counterclockwise
```

### Windows

A window is a multiplexer workspace inside the current launcher session and may contain several panes.

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `window.new` | none | Create a new window with a fresh shell |
| `window.close` | none | Close the current window and all of its panes |
| `window.next` | none | Switch to the next window |
| `window.previous` | none | Switch to the previous window |
| `window.select` | `index`: `0` … `64` (required, zero-based) | Select a window by index |
| `window.rename` | `name` (required; display is capped at 14 characters) | Rename the current multiplexer window label |
| `window.rename_prompt` | none | Open the interactive rename dialog |

### Sessions and workspaces

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `session.new` | `name` (optional), `failsafe` (optional, `false`) | Create a terminal session |
| `session.browser` | none | Open the searchable session/window/pane browser |
| `session.panel` | none | Toggle the sessions panel under the status row |
| `session.clone_current` | none | Create a fresh session at the focused pane's CWD |
| `session.next` | none | Activate the next session |
| `session.previous` | none | Activate the previous session |
| `session.close_current` | none | Close the current session and its windows/panes |
| `session.activate_by_index` | `index`: `0` … `64` (required, zero-based) | Activate a session by drawer position |
| `session.rename` | `name` (required; capped at 8 characters; empty clears it) | Rename the current session's drawer label |
| `session.rename_at_index` | `index`: `0` … `64`, `name` (both required; name capped at 8 characters) | Rename a session by its zero-based drawer index |
| `session.rename_prompt` | none | Open the interactive session rename dialog |
| `workspace.picker` | none | Open the saved-workspace picker |
| `workspace.save_prompt` | none | Prompt for a name and save the live topology |
| `workspace.save` | `name` (required), `overwrite` (optional, `false`), `captureCommands` (optional, `false`) | Save sessions, windows, panes, ratios, focus, and CWDs |
| `workspace.load` | `name` (required), `mode`: `append` or `replace` (optional, `append`), `runCommands` (optional, `false`) | Restore a saved workspace |
| `workspace.list` | none | Return the saved workspace list; mainly useful to internal callers |
| `workspace.delete` | `name` (required) | Delete a saved workspace definition |

Workspace names are at most 64 Unicode code points. They must begin with a letter or digit and may then contain letters, digits, spaces, `_`, `-`, or `.`. Do not include `.json`.

### Terminal and clipboard

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `terminal.toggle_scratchpad` | none | Show or hide the persistent scratchpad shell |
| `terminal.toggle_soft_keyboard` | none | Show or hide the keyboard |
| `terminal.toggle_toolbar` | none | Show or hide the terminal dock |
| `terminal.font_size_increase` | none | Increase font size |
| `terminal.font_size_decrease` | none | Decrease font size |
| `terminal.select_url` | none | Open the URL picker for scrollback links |
| `terminal.hints` | none | Label visible URLs, paths, hashes, and source locations |
| `terminal.search_scrollback` | none | Search terminal history and jump to a result |
| `terminal.share_transcript` | none | Share the complete terminal transcript |
| `terminal.share_selected` | none | Share the currently selected terminal text |
| `terminal.reset` | none | Reset emulator state and scrollback without killing the shell |
| `terminal.jump_previous_prompt` | none | Jump to the previous OSC 133 prompt marker |
| `terminal.jump_next_prompt` | none | Jump to the next OSC 133 prompt marker |
| `terminal.action_sheet` | none | Open the curated terminal action sheet |
| `terminal.state` | `resetPerformance` (optional, `false`) | Return terminal hierarchy/performance state; mainly useful to internal callers |
| `extrakeys.edit` | none | Open the visual Extra Keys editor |
| `clipboard.paste` | none | Paste clipboard contents into the focused shell |
| `clipboard.copy_selected` | none | Copy the current terminal selection |

Selection actions are available only while text is selected. Prompt jumping needs OSC 133 shell integration; fish 4 emits it natively, while Bash and zsh can source the scripts installed under `~/.termux/shell-integration/`.

### Appearance

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `appearance.set_wallpaper` | none | Open the wallpaper picker |
| `appearance.toggle_wallpaper` | none | Enable or disable terminal wallpaper mode |
| `appearance.toggle_cursor_trail` | none | Enable or disable the animated cursor trail |
| `appearance.glass_lab` | none | Enter dock and surface tuning mode |
| `fonts.pick` | none | Open the terminal font picker |
| `fonts.install` | `id` (required), `nerd_icons` (optional, `true`), `ligatures`: `never`, `cursor`, or `always` (optional, `cursor`), `weight`: `0` … `1000` (optional, `0`) | Download, verify and activate a catalog font family |

### Launcher and apps

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `app.open_settings` | none | Open launcher settings |
| `app.open_look_and_feel` | none | Open Look & feel settings |
| `app.open_apps_bar` | none | Open Apps Bar settings |
| `app.command_palette` | none | Open the searchable command palette |
| `app.launch` | `query` (required) | Launch by exact package, app label, or stable ID, with fuzzy ranking fallback |
| `app.key_inspector` | none | Toggle the key-event and terminal-byte inspector |
| `app.open_drawer` | none | Open the sessions drawer |
| `app.close_drawer` | none | Close the sessions drawer |

Examples:

```text
map ctrl+alt+w app.launch com.whatsapp
map ctrl+alt+shift+m app.launch "Google Maps"
map ctrl+alt+shift+k app.key_inspector
```

## Actions versus shell input

The binding file also provides three binding-only operations that are not registry IDs:

| Operation | Form | Purpose |
| --- | --- | --- |
| Send text | `send-text "text\n"` | Write literal decoded text to the focused shell |
| Send a key | `send-key ctrl+c` | Encode one terminal key stroke |
| Leave a modal keymap | `pop-mode` | Pop the current custom mode |

Use the command palette to discover current action IDs on-device. Required-argument actions may not appear as ordinary palette rows because the palette cannot always collect their schema; they remain valid in the binding file and in argument-capable Extra Keys.
