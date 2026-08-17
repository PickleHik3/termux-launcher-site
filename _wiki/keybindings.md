---
title: Keybindings & multiplexer
order: 50
---
Termux Launcher routes panes, windows, sessions, terminal controls, and app shortcuts through one action registry. The command palette, physical keyboard, embedded in-app keyboard, and Termux Extra Keys can therefore reach the same actions, but each surface has a different configuration syntax.

This page covers `~/.termux/termux-launcher-bindings.conf`: the full keybinding layer used by the in-app multiplexer. See [Action reference](#wiki/action-reference) for action IDs and arguments, [Keyboard layout schema](#wiki/keyboard-layout) for embedded keyboard swipe slots, and [Extra Keys recipes](#wiki/extra-keys) for `termux.properties`.

## Start from the shipped example

The app creates the live binding file if it is absent and refreshes a pristine reference copy on every app start:

```text
~/.termux/termux-launcher-bindings.conf
~/.termux/launcher/examples/termux-launcher-bindings.conf
```

Edit only the live file, then reload without restarting the launcher:

```sh
termux-reload-settings
```

The basic grammar is:

```text
map   [options] <key-sequence> <action-id> [arguments...]
unmap [--mode <name>] <key-sequence>
```

Examples:

```text
map ctrl+alt+g pane.equalize
map ctrl+alt+shift+1 pane.layout grid
map ctrl+alt+w app.launch com.whatsapp
map ctrl+alt+t send-text "printf 'hello from a binding\n'\n"
map ctrl+alt+enter send-key ctrl+c
unmap ctrl+alt+u
```

Mentioning a root sequence with `map` or `unmap` replaces every built-in mapping for that exact sequence. Repeating the same sequence and condition appends another action, so the actions run from top to bottom.

## Built-in multiplexer shortcuts

Bindings match Android key codes: they follow physical US key positions, not the character produced by the current language layout.

| Shortcut | Split panes on | Split panes off / compatibility mode |
| --- | --- | --- |
| `Ctrl+Alt+V` | Split vertically, creating side-by-side panes | Paste |
| `Ctrl+Alt+H` | Split horizontally, creating stacked panes | Unclaimed |
| `Ctrl+Alt+Arrow` | Focus the pane in that direction | Left/right closes or opens the drawer; up/down changes session |
| `Ctrl+Alt+Shift+Arrow` | Grow the focused pane in that direction | Unclaimed |
| `Ctrl+Alt+C` | New window | New session |
| `Ctrl+Alt+X` | Close the current window | Unclaimed |
| `Ctrl+Alt+[` / `Ctrl+Alt+]` | Previous/next window | Unclaimed |
| `Ctrl+Alt+L` | Next automatic pane layout | Unclaimed |
| `Ctrl+Alt+F` | Float or dock the focused pane | Unclaimed |
| `Ctrl+Alt+R` | Rename window prompt | Rename session prompt |
| `Ctrl+Alt+Shift+C` | New session | New session |
| `Ctrl+Alt+Shift+X` | Close the current session | Unclaimed |
| `Ctrl+Alt+N` / `Ctrl+Alt+P` | Next/previous session | Next/previous session |
| `Ctrl+Alt+1` … `Ctrl+Alt+9` | Activate session 1 … 9 | Activate session 1 … 9 |
| `Ctrl+Alt+Shift+S` | Toggle sessions panel | Toggle sessions panel |
| `Ctrl+Alt+K` | Toggle soft keyboard | Toggle soft keyboard |
| `Ctrl+Alt++` / `Ctrl+Alt+-` | Increase/decrease font size | Increase/decrease font size |
| `Ctrl+Alt+M` | Terminal action sheet | Terminal action sheet |
| `Ctrl+Alt+U` | Terminal hints | Terminal hints |
| `Ctrl+Alt+S` | Search scrollback | Search scrollback |
| `Ctrl+Alt+Shift+P` | Command palette | Command palette |
| `Ctrl+Alt+Space`, then `P` | Command palette | Command palette |
| `Ctrl+Alt+Backtick` | Toggle scratchpad | Unclaimed |

The same stroke can safely have two meanings when their conditions cannot overlap. Use `--when` to do that in your own file:

```text
map --when splits-on  ctrl+alt+v pane.split_vertical
map --when splits-off ctrl+alt+v clipboard.paste
```

`--when` accepts `always` (the default), `splits-on`, or `splits-off`.

## Supported key names

A sequence can contain one to eight strokes separated by `>`. Key names and modifiers are case-insensitive; `control` is accepted as an alias for `ctrl`.

| Kind | Tokens |
| --- | --- |
| Modifiers | `ctrl`, `alt`, `shift` |
| Letters and digits | `a` … `z`, `0` … `9` |
| Function keys | `f1` … `f12` |
| Navigation | `left`, `right`, `up`, `down`, `home`, `end`, `pageup`, `pagedown` |
| Editing | `space`, `tab`, `enter`, `escape`, `backspace`, `delete` |
| Punctuation | `[`, `]`, `minus`, `equals`, `plus`, `/`, `\`, `;`, `'`, `,`, `.`, backtick |

Examples:

```text
map ctrl+alt+space>w app.launch com.whatsapp
map ctrl+alt+space>g pane.rotate
map ctrl+alt+f12 terminal.toggle_toolbar
```

Avoid bare letters and plain `Alt+letter` at the root unless you deliberately want to intercept them. Shells and editors commonly use `Alt` as an Escape prefix. `Ctrl+Alt` or a leader chord is less disruptive.

## Action arguments

Required arguments can be positional in schema order. Any argument can instead use `name=value`; quote values containing spaces.

```text
map ctrl+alt+shift+1 pane.layout grid
map ctrl+alt+shift+2 pane.move_to_edge edge=left
map ctrl+alt+shift+w window.select index=0
map ctrl+alt+shift+n session.new name=build failsafe=false
map ctrl+alt+shift+s workspace.save name=project overwrite=true
map ctrl+alt+shift+r session.rename "build shell"
```

Values are checked against the action schema. Integers must be in range, booleans must be exactly `true` or `false`, and enum values must match the listed spelling. Unknown arguments invalidate only that line.

Arrow strokes automatically provide a `direction`, and `Ctrl+Alt+1` … `9` automatically provide a zero-based `index`. An argument written in the file overrides the value inferred from the key.

## Send text or a terminal key

`send-text` writes decoded text directly to the focused shell. Double-quoted and unquoted values understand `\n`, `\r`, `\t`, and `\e`; single-quoted values stay literal.

```text
map ctrl+alt+j send-text "cd ~/src\n"
map ctrl+alt+j send-text "git status\n"
map ctrl+alt+enter send-key ctrl+c
map ctrl+alt+space>x send-key escape
```

`send-key` accepts one supported stroke, not a chord. It uses the terminal's current cursor-key and keypad modes when encoding special keys.

## Modal keymaps

A mode is a persistent leader layer. This keeps ordinary shell shortcuts free while putting many launcher actions behind one prefix:

```text
map --new-mode nav --timeout 10 --on-unknown passthrough --on-action keep ctrl+alt+space
map --mode nav h window.previous
map --mode nav l window.next
map --mode nav v pane.split_vertical
map --mode nav s pane.split_horizontal
map --mode nav w app.launch com.whatsapp
map --mode nav q pop-mode
map --mode nav escape pop-mode
```

| Option | Values | Default |
| --- | --- | --- |
| `--new-mode` | A name using letters, digits, `_`, `-`, or `.`, up to 32 characters | none |
| `--timeout` | `0` … `3600` seconds | `2` |
| `--on-unknown` | `beep`, `ignore`, `end`, `passthrough` | `beep` |
| `--on-action` | `keep`, `end` | `keep` |
| `--mode` | Add a mapping to an existing named mode | root map |

Modes can stack. `pop-mode` (or its compatibility alias `pop_keyboard_mode`) exits the top mode. The launcher displays the pending chord and active mode in a non-focusable overlay.

## Using bindings from the in-app keyboard

The embedded keyboard emits the same Android key events used by physical keyboards. Latch `Ctrl` and `Alt`, then press the suffix key to trigger a binding; while the prefix is latched, the launcher shows the available suffixes and highlights matching keys.

For a one-gesture button or swipe, assign the registry action directly in `~/.termux/keyboard/layout.xml` instead. Direct layout actions cannot carry arguments, while the binding file can. See [Keyboard layout schema](#wiki/keyboard-layout).

## Limits and diagnostics

The binding file is limited to 256 KiB, 4,096 lines, and 4,096 characters per line. Invalid lines are skipped; other valid mappings remain active.

Open **Key inspector** from the command palette to see the Android key code, normalized stroke, action that claimed it, active Kitty keyboard flags, and bytes sent to the shell. It is intentionally unbound by default, but you can add:

```text
map ctrl+alt+shift+k app.key_inspector
```

If all launcher shortcuts stop working, check that hardware keyboard shortcuts are not disabled in `termux.properties`, then run `termux-reload-settings` again.
