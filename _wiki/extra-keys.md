---
title: Extra keys
group: Typing
order: 70
---
The extra-keys row is the configurable row of keys on the terminal page, separate from the full built-in [Keyboard](#wiki/keyboard) defined by `~/.termux/keyboard/layout.xml`. You can edit it in a visual editor or straight in `termux.properties`.

## What ships on the row

The **Launcher default** row has seven keys. Swipe up on a key for its second action:

* **Keyboard**: show or hide the keyboard; swipe up for **Next keyboard type**.
* **Mouse**: turn **Mouse mode** on or off.
* **Widgets**, **Terminal**, **Display**: go to that place. They are coloured primary, secondary and tertiary.
* **New pane**: swipe up for **New window**.
* **Sessions**: open the sessions browser; swipe up for **New session**.

Other launcher actions can be added from the editor's search. **App drawer** (`app.open_app_drawer`, "Open the app drawer.") opens the app drawer from the apps row's current edge, and does nothing while **Swipe down for app drawer** is off in **Settings → Apps**. It is not on the shipped row. **DRAWER** still opens the sessions drawer.

The second page ships empty, so the row has one page until you add keys to another.

Keys that cannot act on the current place go faint and stop responding. On Display, the pane, window and session keys are dimmed; on Widgets, typing keys, modifiers, Paste and Scroll are dimmed.

In **Appearance → Layout** the row can be moved to any edge, dropped into the slot under the keyboard, or hidden on the eye-off button. See [Layout](#wiki/layout).

## Visual editor

Open **Settings → Keyboard → Terminal extra keys** ("Keys and swipe actions"), or run the `extrakeys.edit` launcher action. The editor writes the same configuration described further down, so you can start visually and hand-edit later. Next to it, **Uppercase key labels** ("Show ESC, TAB and other labels in capitals.") is on by default.

```clip
svg: extra-key-anatomy
title: Anatomy of a key
caption: What the editor lets you set on each key, and how rows and pages fit together.
```

```clip
src: assets/showcase/features/extra-keys-editor
crop: 0 0 1 0.45
title: Extra keys editor
caption: Editing tap and swipe-up actions, choosing a glyph, then adding another page and row.
```

* **Rows**: **Add row** appends one below the last; a row's drag handle reorders it, and holding a key drags it within or between rows. Removing a row asks for confirmation, since its keys go with it.
* **Pages**: swipe the row sideways to switch pages. A page with no keys stays hidden from the live row until it has something to show. The first page can't be emptied out this way; with nothing on it, the whole row stays hidden instead.
* **Editing a key**: tap it to set what **Tap** and **Swipe up** do (a key, a built-in Extra Key command, or a `tool:` action), its **Label** (blank shows the key name), **Swipe-up label**, and its colour. The **Ω** glyph picker offers a searchable catalogue of arrows, box drawing, blocks, shapes, Powerline separators and terminal marks for the label fields; only glyphs your device can draw are offered.
* **Save** applies the row immediately; **Discard** asks first if you have unsaved edits.

## Presets

The editor's **Presets** section replaces everything on the current page in one tap, after a confirmation:

* **Launcher default**: the row the app ships with, described above.
* **Classic Termux**: upstream Termux's row, `ESC`, `TAB`, `CTRL`, `ALT`, `-` (swipe up for `|`), `DOWN`, `UP`.
* **Two rows**: upstream Termux's two-row layout, `ESC / - HOME UP END PGUP` on top and `TAB CTRL ALT LEFT DOWN RIGHT PGDN` below. No launcher actions.
* **Clear page**: empties the current page.
* **Before the update**: your previous row. When an update ships a new default row, a card offers **Switch** or **Keep mine**; choosing **Switch** saves the row you had under this preset first, so your old row is one preset away.

## Editing the file

Configure the rows in `~/.termux/termux.properties` directly, then apply changes with:

```sh
termux-reload-settings
```

### Item schema

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

### Launcher action syntax

Use a `key` item, not `macro`, to run a registry action such as `tool:app.command_palette`, `tool:workspace.picker`, `tool:workspace.save_prompt` or `tool:terminal.toggle_scratchpad`. Unlike `keyboard/layout.xml`, Extra Keys can carry named action arguments after the second colon:

```text
tool:<action-id>
tool:<action-id>:name=value,name=value
```

### Multiplexer control row

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

Pane and window actions are unavailable while **Split-pane controls** is off (**Settings → Terminal → Sessions and panes**); see [Panes & sessions](#wiki/panes).

### App and session shortcuts

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

### Classic terminal and tmux macros

Use `macro` when you want to send ordinary terminal keystrokes instead of invoking a launcher action:

```properties
extra-keys = [[ \
  {key: ESC, popup: {macro: "CTRL b d", display: "tmux detach"}}, \
  {macro: "CTRL b c", display: "tmux +win"}, \
  {macro: "CTRL b n", display: "tmux next"}, \
  {macro: "CTRL c", display: "^C"}, \
  {macro: "CTRL d", display: "^D"} \
]]
```

These macros target a shell program such as tmux. They are unrelated to the launcher's in-app multiplexer actions such as `pane.split_vertical` and `window.next`.

### Choosing the right surface

| Goal | Best configuration |
| --- | --- |
| Physical keyboard shortcut or multi-stroke chord | `termux-launcher-bindings.conf` |
| Modal leader keymap | `termux-launcher-bindings.conf` |
| Full embedded keyboard layout or swipe direction | `keyboard/layout.xml` |
| Visible button with a swipe-up secondary | `extra-keys` in `termux.properties` |
| Run an action requiring arguments from a touch button | `extra-keys` in `termux.properties` |
| Send a shell/tmux key sequence | Extra Keys `macro`, or binding-file `send-key` / `send-text` |

The older `shortcut.create-session`, `shortcut.next-session`, `shortcut.previous-session`, and `shortcut.rename-session` properties still exist, but the launcher binding file is the flexible path for new shortcuts, conditions, chords, and registry actions.

If a `tool:` Extra Key does nothing, confirm the action ID and argument names in [Action reference](#wiki/action-reference), check whether split panes or a terminal selection is required, and inspect the app log. Tool failures are intentionally logged rather than shown as repeated toast messages.

Full details: [Extra keys](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Extra_Keys.md)
