---
title: Extra Keys recipes
order: 65
---
Termux Extra Keys are the configurable rows in the terminal dock. They are separate from the full embedded keyboard defined by `~/.termux/keyboard/layout.xml`.

## Visual editor

Open **Settings → Keyboard → Edit extra keys**, or run the `extrakeys.edit` launcher action. The visual editor supports multiple pages, tap-to-edit keys, hold-and-drag reordering, macros, swipe-up actions and a glyph picker. It writes the same Extra Keys configuration described below, so you can start visually and keep hand-editing later.

```clip
src: assets/showcase/features/extra-keys-editor
title: Extra keys editor
caption: Editing tap and swipe-up actions, choosing a glyph, then adding another page and row.
```

## Edit the file directly

Configure the rows in `~/.termux/termux.properties`, then apply changes with:

```sh
termux-reload-settings
```

## Item schema

`extra-keys` is a matrix: the outer array contains rows and each inner array contains buttons.

```properties
extra-keys = [[ESC, TAB, CTRL, ALT, LEFT, DOWN, UP, RIGHT]]
```

A button can be a simple key name or an object:

| Field | Value | Meaning |
| --- | --- | --- |
| `key` | One key/action string | Run one key, built-in Extra Key command, or `tool:` launcher action |
| `macro` | Space-separated key sequence | Send several classic terminal keys in order |
| `display` | Text or glyph | Override the label shown on the button |
| `popup` | Simple key or another item object | Secondary action selected by swiping upward |

An item must contain either `key` or `macro`, never both. `popup` supports the same `key`, `macro`, and `display` structure.

```properties
extra-keys = [[ \
  {key: ESC, popup: {macro: "CTRL f d", display: "tmux exit"}}, \
  {macro: "ALT j", display: "A-j", popup: {macro: "ALT g", display: "A-g"}}, \
  {key: KEYBOARD, popup: PASTE} \
]]
```

## Launcher action syntax

Use a `key` item—not `macro`—to run a registry action:

```text
tool:<action-id>
tool:<action-id>:name=value,name=value
```

Unlike `keyboard/layout.xml`, Extra Keys can carry named action arguments after the second colon.

```properties
extra-keys = [[ \
  {key: "tool:app.command_palette", display: "⌘"}, \
  {key: "tool:workspace.picker", display: "▤"}, \
  {key: "tool:workspace.save_prompt", display: "⛁"}, \
  {key: "tool:terminal.toggle_scratchpad", display: "▣"} \
]]
```

## Multiplexer control row

This row combines pane creation, focus, layouts, floating panes, and window navigation. Swipe upward on buttons with a `popup` to run the secondary action.

```properties
extra-keys = [[ \
  {key: "tool:pane.split_vertical", display: "⇳", popup: {key: "tool:pane.split_horizontal", display: "⇔"}}, \
  {key: "tool:pane.focus_direction:direction=left", display: "←", popup: {key: "tool:pane.move_to_edge:edge=left", display: "⇤"}}, \
  {key: "tool:pane.focus_direction:direction=down", display: "↓"}, \
  {key: "tool:pane.focus_direction:direction=up", display: "↑", popup: {key: "tool:pane.next_layout", display: "⟳"}}, \
  {key: "tool:pane.focus_direction:direction=right", display: "→", popup: {key: "tool:pane.move_to_edge:edge=right", display: "⇥"}}, \
  {key: "tool:window.previous", display: "◧"}, \
  {key: "tool:window.next", display: "◨"}, \
  {key: "tool:pane.toggle_float", display: "◈", popup: {key: "tool:pane.equalize", display: "="}} \
]]
```

Pane and window actions are unavailable while single-pane compatibility mode is enabled.

## App and session shortcuts

Extra Keys can launch apps because they can supply the required `query` argument:

```properties
extra-keys = [[ \
  {key: "tool:app.launch:query=com.whatsapp", display: "WA"}, \
  {key: "tool:app.launch:query=YouTube", display: "YT"}, \
  {key: "tool:session.new:name=build,failsafe=false", display: "+build"}, \
  {key: "tool:session.browser", display: "sessions"}, \
  {key: "tool:session.previous", display: "↰"}, \
  {key: "tool:session.next", display: "↳"} \
]]
```

For values containing punctuation or spaces, prefer a package name or stable app ID. The Extra Key argument parser trims names and values and separates multiple arguments with commas; it does not provide a second quoting layer inside the `tool:` string.

## Two-row example

```properties
extra-keys = [ \
  [ \
    {key: KEYBOARD, popup: PASTE}, \
    {key: "tool:app.command_palette", display: "⌘"}, \
    {key: "tool:terminal.search_scrollback", display: "⌕"}, \
    {key: "tool:terminal.hints", display: "?"}, \
    {key: "tool:workspace.picker", display: "▤"}, \
    {key: "tool:terminal.toggle_scratchpad", display: "▣"} \
  ], \
  [ \
    ESC, TAB, CTRL, ALT, \
    {key: LEFT, popup: HOME}, \
    {key: DOWN, popup: PGDN}, \
    {key: UP, popup: PGUP}, \
    {key: RIGHT, popup: END} \
  ] \
]
```

## Classic terminal and tmux macros

Use `macro` when you want to send ordinary terminal keystrokes instead of invoking a launcher action:

```properties
extra-keys = [[ \
  {key: ESC, popup: {macro: "CTRL b d", display: "tmux detach"}}, \
  {macro: "CTRL b c", display: "tmux +win"}, \
  {macro: "CTRL b p", display: "tmux prev"}, \
  {macro: "CTRL b n", display: "tmux next"}, \
  {macro: "CTRL c", display: "^C"}, \
  {macro: "CTRL d", display: "^D"} \
]]
```

These macros target a shell program such as tmux. They are unrelated to the launcher's in-app multiplexer actions such as `pane.split_vertical` and `window.next`.

## Choosing the right surface

| Goal | Best configuration |
| --- | --- |
| Physical keyboard shortcut or multi-stroke chord | `termux-launcher-bindings.conf` |
| Modal leader keymap | `termux-launcher-bindings.conf` |
| Full embedded keyboard layout or swipe direction | `keyboard/layout.xml` |
| Visible dock button with a swipe-up secondary | `extra-keys` in `termux.properties` |
| Run an action requiring arguments from a touch button | `extra-keys` in `termux.properties` |
| Send a shell/tmux key sequence | Extra Keys `macro`, or binding-file `send-key` / `send-text` |

The older `shortcut.create-session`, `shortcut.next-session`, `shortcut.previous-session`, and `shortcut.rename-session` properties still exist, but the launcher binding file is the flexible path for new shortcuts, conditions, chords, and registry actions.

If a `tool:` Extra Key does nothing, confirm the action ID and argument names in [Action reference](#wiki/action-reference), check whether split panes or a terminal selection is required, and inspect the app log. Tool failures are intentionally logged rather than shown as repeated toast messages.
