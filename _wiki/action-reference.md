---
title: Action reference
group: Reference
order: 210
---
These are the current action IDs accepted by `~/.termux/termux-launcher-bindings.conf`, the command palette, `tool:` keys in the embedded keyboard, and `tool:` entries in Termux Extra Keys. Palette titles are given in quotes where they differ from the description.

## Which surfaces accept arguments?

| Surface | Action syntax | Arguments |
| --- | --- | --- |
| Binding file | `map … <action-id> [arguments]` | Positional required values and `name=value` |
| In-app keyboard XML | `tool:<action-id>:<glyph>` | None; the suffix is a display glyph, not arguments |
| `termux.properties` Extra Keys | `tool:<action-id>:name=value,name=value` | Named values after the second colon |
| Command palette | Search by action title or ID | An action with exactly one required text argument is offered too: a choice list opens a submenu with one row per value, free text puts the palette in argument mode |

An action with a required argument is unsuitable for a direct in-app keyboard `tool:` slot. Put it in the binding file, or use an Extra Key that can carry arguments; the Extra Keys picker offers one row per value for a choice-list argument.

## Argument notation

In the tables below, `required` means the value must be supplied. A value marked `optional` uses the shown default when omitted.

### Panes

Pane actions need split panes on, except `pane.kill_focused`, `pane.rename` and `pane.rename_prompt`, which need only a session.

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `pane.split` | none | "New pane": split the focused pane along its longer side |
| `pane.split_vertical` | none | Split the focused pane side by side |
| `pane.split_horizontal` | none | Split the focused pane into a stacked pair |
| `pane.focus_direction` | `direction`: `left`, `right`, `up`, or `down` (required) | Focus the neighbouring pane; with no pane that way, the stroke goes to the shell |
| `pane.resize` | `direction`: `left`, `right`, `up`, or `down` (required) | Grow the focused pane toward an edge |
| `pane.kill_focused` | none | Terminate the focused pane's shell |
| `pane.layout` | `layout`: `stack`, `grid`, `dwindle`, `tall`, `fat`, `horizontal`, or `vertical` (required, `grid`) | Apply and retain an automatic layout; `dwindle` tiles each new pane into the focused pane's longer side, Hyprland-style |
| `pane.equalize` | none | Reset all current dividers to equal ratios |
| `pane.rotate` | `direction`: `clockwise` or `counterclockwise` (optional, `clockwise`) | Rotate the pane tree |
| `pane.move_to_edge` | `edge`: `left`, `right`, `up`, or `down` (required) | Move the focused pane to an outer edge |
| `pane.next_layout` | none | Cycle `grid` → `dwindle` → `tall` → `fat` → `horizontal` → `vertical` → `stack` |
| `pane.toggle_float` | none | Float the focused pane or dock it again |
| `pane.rename` | `name` (required; empty restores the default) | Rename the focused pane's shell |
| `pane.rename_prompt` | none | Open the interactive rename editor for the focused pane |

Examples:

```text
map ctrl+alt+g pane.equalize
map ctrl+alt+space>1 pane.layout dwindle
map ctrl+alt+space>e pane.move_to_edge left
map ctrl+alt+space>r pane.rotate direction=counterclockwise
```

### Windows

A window is a multiplexer workspace inside the current launcher session and may contain several panes. Window actions need split panes on.

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `window.new` | none | Create a new window with a fresh shell |
| `window.close` | none | Close the current window and all of its panes |
| `window.next` | none | Switch to the next window; on the Display place, to the next app |
| `window.previous` | none | Switch to the previous window; on the Display place, to the previous app |
| `window.select` | `index`: `0` … `64` (required, zero-based) | Select a window by index |
| `window.rename` | `name` (required; display is capped at 14 characters; empty restores the automatic label) | Rename the current multiplexer window label |
| `window.rename_prompt` | none | Open the interactive rename dialog |

### Sessions and workspaces

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `session.new` | `name` (optional), `failsafe` (optional, `false`) | Create a terminal session |
| `session.browser` | none | "Sessions": open the searchable session/window/pane browser |
| `session.panel` | none | "Toggle sessions": toggle the sessions panel under the status row |
| `session.clone_current` | none | Create a fresh session at the focused pane's CWD |
| `session.next` | none | Activate the next session |
| `session.previous` | none | Activate the previous session |
| `session.close_current` | none | Close the current session and its windows/panes |
| `session.activate_by_index` | `index`: `0` … `64` (required, zero-based) | Activate a session by drawer position |
| `session.rename` | `name` (required; capped at 8 characters; empty clears it) | Rename the current session's drawer label |
| `session.rename_at_index` | `index`: `0` … `64`, `name` (both required; name capped at 8 characters) | Rename a session by its zero-based drawer index |
| `session.rename_prompt` | none | Open the interactive session rename dialog |
| `workspace.picker` | none | "Load workspace": open the saved-workspace picker |
| `workspace.save_prompt` | none | Prompt for a name and save the live topology |
| `workspace.save` | `name` (required), `overwrite` (optional, `false`), `captureCommands` (optional, `false`) | Save sessions, windows, panes, ratios, focus, and CWDs |
| `workspace.load` | `name` (required), `mode`: `append` or `replace` (optional, `append`), `runCommands` (optional, `false`) | Restore a saved workspace |
| `workspace.list` | none | Return the saved workspace list; mainly useful to internal callers |
| `workspace.delete` | `name` (required) | Delete a saved workspace definition |

Workspace names are at most 64 Unicode code points. They must begin with a letter or digit and may then contain letters, digits, spaces, `_`, `-`, or `.`. Do not include `.json`.

### Places on the wall

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `wall.go` | `page`: `widgets`, `terminal`, `display`, `left`, or `right` (required, `terminal`) | "Go to place": show a chosen place, or the one to the left or right |
| `wall.widgets` | none | "Go to Widgets": show the widget grid |
| `wall.terminal` | none | "Go to Terminal": show the terminal |
| `wall.display` | none | "Go to Display": show the Linux display |

### Keyboard

All of these need the in-app keyboard, except `keyboard.toggle_enabled`, `voice.dictate` and `mouse.toggle`.

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `keyboard.cycle_layout` | `direction`: `forward` or `backward` (optional, `forward`) | "Cycle keyboard layout": next layout in the keyboard's ring |
| `keyboard.select_layout` | `layout` (required): a catalogue id such as `latn_dvorak`, or `main` for `~/.termux/keyboard/layout.xml` | "Switch keyboard layout" |
| `keyboard.cycle_form` | `direction`: `forward` or `backward` (optional, `forward`) | "Next keyboard type": docked, floating, split |
| `keyboard.set_form` | `form`: `docked`, `floating`, or `split` (required) | "Keyboard type" |
| `keyboard.show` | `source`: `manual` or `focus` (optional, `manual`) | Open the on-screen keyboard |
| `keyboard.hide` | `source`: `manual` or `focus` (optional, `manual`) | Close the on-screen keyboard |
| `keyboard.clipboard` | none | "Clipboard history": open or close the list of things you copied |
| `keyboard.toggle_enabled` | none | "Keyboard on/off": while off, tapping the terminal no longer raises it |
| `voice.dictate` | none | "Dictate": start or stop a dictation on any place |
| `mouse.toggle` | none | "Mouse mode": touches become mouse clicks and drags in the terminal; on the Display place a touchpad takes the keyboard's place |

`keyboard.select_layout` and `keyboard.set_form` have their own rows in the palette's Keyboard section rather than an argument prompt.

### Terminal and clipboard

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `terminal.toggle_scratchpad` | none | Show or hide the persistent scratchpad shell |
| `terminal.toggle_soft_keyboard` | none | Show or hide the keyboard |
| `terminal.toggle_toolbar` | none | "Toggle dock": show or hide the terminal dock |
| `terminal.font_size_increase` | none | Increase font size |
| `terminal.font_size_decrease` | none | Decrease font size |
| `terminal.select_url` | none | Open the URL picker for scrollback links |
| `terminal.select_at_cursor` | none | "Select at cursor": start a selection on the word under the shell cursor |
| `terminal.select_all` | none | "Select all": select the whole buffer, scrollback included |
| `terminal.hints` | none | "Quick select": label visible URLs, paths, hashes, and source locations |
| `terminal.search_scrollback` | none | Search terminal history and jump to a result |
| `terminal.share_transcript` | none | Share the complete terminal transcript |
| `terminal.share_selected` | none | Share the currently selected terminal text |
| `terminal.reset` | none | Reset emulator state and scrollback without killing the shell |
| `terminal.jump_previous_prompt` | none | Jump to the previous OSC 133 prompt marker |
| `terminal.jump_next_prompt` | none | Jump to the next OSC 133 prompt marker |
| `terminal.action_sheet` | none | "Terminal actions": open the curated terminal action sheet |
| `terminal.state` | `resetPerformance` (optional, `false`) | Return terminal hierarchy/performance state; mainly useful to internal callers |
| `extrakeys.edit` | none | "Edit key row": open the visual Extra Keys editor |
| `clipboard.paste` | none | Paste clipboard contents into the focused shell |
| `clipboard.copy_selected` | none | Copy the current terminal selection |

`clipboard.copy_selected` and `terminal.share_selected` are available only while text is selected; `terminal.select_at_cursor` and `terminal.select_all` start a selection for them. Prompt jumping needs OSC 133 shell integration; fish 4 emits it natively, while Bash and zsh can source the scripts installed under `~/.termux/shell-integration/`.

### Appearance

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `appearance.set_wallpaper` | none | Open the wallpaper picker |
| `appearance.toggle_wallpaper` | none | Enable or disable terminal wallpaper mode |
| `appearance.toggle_cursor_trail` | none | Enable or disable the animated cursor trail |
| `appearance.surface_editor` | none | "Surface editor": tune the dock, keyboard, status bar, and terminal surfaces. The old id `appearance.glass_lab` still works |
| `fonts.pick` | none | "Terminal fonts": open the terminal font picker |
| `fonts.install` | `id` (required), `nerd_icons` (optional, `true`), `ligatures`: `never`, `cursor`, or `always` (optional, `cursor`), `weight`: `0` … `1000` (optional, `0`) | Download, verify and activate a catalogue font family |

### Launcher and apps

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `app.open_settings` | none | Open launcher settings |
| `app.open_help` | none | "Help": open help for the place you are on |
| `app.open_look_and_feel` | none | "Look and feel settings": open the Theme & fonts page |
| `app.open_apps_bar` | none | Open Apps bar settings |
| `app.command_palette` | none | Open the searchable command palette |
| `app.launch` | `query` (required) | Launch by exact package, app label, or stable ID, with fuzzy ranking fallback |
| `app.key_inspector` | none | Toggle the key-event and terminal-byte inspector |
| `app.open_drawer` | none | "Open sessions": open the sessions drawer |
| `app.close_drawer` | none | "Close sessions": close the sessions drawer |

`app.launch` is not offered as a palette row with a prompt: the palette's Apps section already gives one row per app.

Examples:

```text
map --label WhatsApp ctrl+alt+space>w app.launch com.whatsapp
map --label Maps ctrl+alt+shift+m app.launch "Google Maps"
map ctrl+alt+shift+k app.key_inspector
```

## Actions for scripts only

Some actions exist for `launcherctl` and the HTTP API, so a program in a shell can drive panes. They never appear in the palette:

| Action ID | Arguments | What it does |
| --- | --- | --- |
| `pane.open` | `command`, `cwd`, `title`, `focus` (`true`), `tag` (all optional) | Open a pane, optionally running a command |
| `pane.list` | none | List windows and panes with their ids |
| `pane.focus` / `pane.close` | `id` (required) | Focus a pane, or close one the API opened |
| `pane.write` | `id` (required), `text` (required, up to 16 KiB), `enter` (optional, `false`) | Type into a pane the API opened |
| `pane.read` | `id` (required), `lines` (`1` … `500`, optional, `60`) | Read the last lines of a pane the API opened |

These are in the registry, so a binding can name them, though they are meant for scripts. A few other `launcherctl` commands (`window open`, `agent`, `notify`, `progress`, `clipboard copy` and `clipboard paste`) run on ids that are not in the registry at all (`window.open`, `agent.status`, `shell.notify`, `shell.progress`, `clipboard.write`, `clipboard.read`); the binding file rejects them.

## Actions versus shell input

The binding file also provides three binding-only operations that are not registry IDs:

| Operation | Form | Purpose |
| --- | --- | --- |
| Send text | `send-text "text\n"` | Write literal decoded text to the focused shell |
| Send a key | `send-key ctrl+c` | Encode one terminal key stroke |
| Leave a modal keymap | `pop-mode` | Pop the current custom mode |

Use the command palette to discover current action IDs on the phone.

Full details: [Command palette and actions](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Command_Palette_And_Actions.md)
