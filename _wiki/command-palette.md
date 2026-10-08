---
title: Palette & shortcuts
group: Terminal
order: 100
---
Every action the launcher knows, from splits, sessions and windows to appearance, the keyboard and launching Android apps, lives in one searchable list. Keybinds, keyboard gestures and the palette all run the same actions, so anything you can bind to a key you can also just type.

```clip
name: command-palette
crop: 0.13 0.24 0.74 0.32
title: Command palette
caption: Swipe up from the space bar, type "split", run it - the keycap strip shows the chord for what matched.
```

## Opening it

Any of these:

1. **Swipe up from the space bar** of the built-in keyboard.
2. **Ctrl + Alt + Shift + P** on a hardware keyboard.
3. **Ctrl + Alt + Space**, release, then **P** (two-stroke chord).
4. **Long press the terminal** and pick *Command palette* from the action sheet.

## Using it

* The palette opens with just a search box and a strip of four keycaps; your most used actions end up there over time.
* **Type to filter.** Matching is forgiving: titles, word starts, fuzzy letters, action ids ("split pane" finds *Split pane vertically*) and even keybinds (typing `ctrl+alt+v` finds whatever is bound to it) all work.
* **Press ↓** with nothing typed to browse the whole catalogue, grouped by category.
* **Enter** runs the focused action, **Esc** or a tap outside closes.
* If nothing matches, **Enter runs what you typed in the shell** instead, so a quick command doesn't need a round trip to the keyboard.

Some rows want more from you:

* Rows marked `›` open a small submenu of choices (like pane resize directions).
* Rows marked `args` ask you to type a value (rename a session, for example), then Enter applies it.
* Destructive actions (like *Kill focused pane*) ask for confirmation first.
* Rows that can't run right now stay visible but greyed out, with the reason ("no text selected", "no active session").

## What's inside

* **Pane**: new pane and splits, focus, resize, equalize, float and dock, layouts, rename, kill.
* **Window** and **Session**: create, close, switch, rename, **Sessions** (the full session browser), **Toggle sessions**, clone, save and load workspaces.
* **Terminal**: toggle the keyboard and the dock, scratchpad, font size, search scrollback, **Quick select**, prompt jumping, share transcript, edit the key row, reset.
* **Keyboard**: **Keyboard type** (one row per type), **Next keyboard type**, **Show keyboard** / **Hide keyboard**, **Keyboard on/off**, **Clipboard history**, **Cycle keyboard layout** and **Switch keyboard layout** (one row per layout), **Mouse mode**, **Dictate**.
* **Places**: **Go to Widgets**, **Go to Terminal**, **Go to Display**.
* **Clipboard**: copy selection, paste.
* **Appearance**: wallpaper, **Toggle cursor trail**, surface editor, **Terminal fonts**, and **Install terminal font** (an `args` row that asks for the font id).
* **App**: **Open settings**, **Help**, **Look and feel settings**, **Key inspector**.
* **Apps**: every installed Android app as a row, ranked by how often you launch things. This is separate from the `%` app search in the terminal, but both use the same ranking. Hold an app row, then press a key combination, to bind that key to the app.
* **Sessions**: every live session as a row; pick one to jump straight to it.

## Handy defaults

A few worth remembering. The ones marked "splits on" need **Split-pane controls** on; the full set, and how to change them, is on the [Keybindings config](#wiki/keybindings) page.

| Keys | Action |
| --- | --- |
| Ctrl + Alt + Shift + P | Open the palette |
| Ctrl + Alt + Enter | New pane (splits on) |
| Ctrl + Alt + V / H | Split pane vertically / horizontally (splits on) |
| Alt + arrows | Move pane focus (splits on) |
| Ctrl + Alt + W | Kill focused pane (splits on) |
| Ctrl + Alt + Left / Right | Previous / next window (splits on) |
| Ctrl + Alt + Up / Down | Previous / next session |
| Ctrl + Alt + 1…9 | Window 1 to 9 (splits on); session 1 to 9 (splits off) |
| Ctrl + Alt + Shift + 1…9 | Session 1 to 9 |
| Ctrl + Alt + X | Close window (splits on) |
| Ctrl + Alt + R | Rename window (splits on); rename pane (splits off) |
| Ctrl + Alt + Shift + R | Rename session (splits on) |
| Ctrl + Alt + F | Float / dock the pane (splits on) |
| Ctrl + Alt + ` | Toggle scratchpad (splits on) |
| Ctrl + Alt + K | Toggle the keyboard |
| Ctrl + Alt + S | Search scrollback |
| Ctrl + Alt + U | Quick select |

## Shortcut hints

Hold **Ctrl + Alt** on the built-in keyboard at any time, in or out of the palette, and the bound keys light up with a legend of what they do. To light only the **?** key instead, turn off **Settings → Terminal → Sessions and panes → Shortcut hints** ("Show pane shortcuts while holding Ctrl+Alt. Off lights the ? key instead.").

## Changing bindings

Every shortcut can be remapped, and new keys bound to any palette action, in `~/.termux/termux-launcher-bindings.conf`; see [Keybindings config](#wiki/keybindings). [Keyboard shortcuts](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Keyboard_Shortcuts.md) lists every default.

Full details: [Command palette and actions](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Command_Palette_And_Actions.md)
