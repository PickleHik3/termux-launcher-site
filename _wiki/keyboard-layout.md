---
title: Keyboard layout schema
group: Reference
order: 220
---
The embedded keyboard is a Termux-focused port of Unexpected Keyboard. A custom file at `~/.termux/keyboard/layout.xml` replaces the complete bundled layout, including every center key and swipe slot.

Start by copying the example layout shipped with your installed build:

```sh
mkdir -p ~/.termux/keyboard
cp ~/.termux/launcher/examples/keyboard-layout.xml ~/.termux/keyboard/layout.xml
termux-reload-settings
```

The example is close to the bundled layout but not identical: the bundled bottom row marks its keys with `role="action"` and `role="space_bar"`, and its `Ctrl` key has clipboard history on the north-east swipe (`ne="loc switch_clipboard" sw="loc meta"`), where the example has those two swapped.

Delete the live file to return to the bundled layout. If an edit is invalid, the launcher keeps the last working layout and then falls back to the bundled one.

## The layout ring

Your file is one layout among several. **Settings → Keyboard → Layouts → Layouts** ("Choose the layouts the keyboard cycles through") sets the ring, up to 16 layouts. Your `layout.xml` appears there as `main` (the bundled QWERTY when the file is absent). From a binding or an Extra Key, `keyboard.select_layout main` switches to it and `keyboard.cycle_layout` moves through the ring; see [Action reference](#wiki/action-reference).

The label font and key radius are settings, not layout attributes: **Typeface** on the **Keyboard theme** page (the font picker browses internal storage, and icon glyphs keep the symbols font), and **Key radius** in the Layout editor.

## Document structure

```xml
<?xml version="1.0" encoding="utf-8"?>
<keyboard bottom_row="false" name="My terminal keyboard" script="latin">
  <row>
    <key c="q" ne="1" se="loc esc"/>
    <key c="w" nw="~" ne="2"/>
  </row>
  <row height="0.95">
    <key width="1.7" c="ctrl" nw="fn"/>
    <key width="4.0" c="space" w="cursor_left" e="cursor_right"/>
    <key width="1.7" c="enter"/>
  </row>
  <modmap>
    <fn a="q" b="f1"/>
    <fn a="a" b="esc"/>
  </modmap>
</keyboard>
```

### `<keyboard>` attributes

| Attribute | Meaning |
| --- | --- |
| `name` | Display name for the layout |
| `script` | Main script identifier; must not be empty when present |
| `numpad_script` | Optional script for the numeric layout; defaults to `script` |
| `bottom_row` | Whether the keyboard adds its bundled bottom row; default `true` |
| `embedded_number_row` | Whether to insert the optional number row inside this layout; default `false` |
| `locale_extra_keys` | Whether enabled optional keyboard keys may be merged into free `loc` slots; default `true` |
| `width` | Optional total layout width in relative units; otherwise computed from the widest row |

### `<row>` attributes

| Attribute | Meaning |
| --- | --- |
| `height` | Relative row height; default `1` |
| `shift` | Empty vertical space above the row; default `0` |
| `scale` | Rescale all keys so the row reaches this total width |

### `<key>` attributes

Each key has a center value plus eight swipe directions:

```text
nw / key1     n / key7     ne / key2
w  / key5     c / key0     e  / key6
sw / key3     s / key8     se / key4
```

The short compass names and long `key0` … `key8` names are synonyms; do not put both synonyms on the same key.

| Attribute | Meaning |
| --- | --- |
| `c` or `key0` | Center/tap value |
| `nw`, `n`, `ne`, `w`, `e`, `sw`, `s`, `se` | Swipe values |
| `width` | Relative key width; default `1` |
| `shift` | Empty horizontal space before the key; default `0` |
| `anticircle` | Value produced by the counter-clockwise circle gesture |
| `indication` | Label drawn on the key without changing its output |
| `role` | Rendering/behaviour role: `normal` (default), `action`, `space_bar`, or `suggestion` |
| `split_before` | `"true"` starts the right half of the split keyboard at this key |
| `split_at` | Cuts a wide key this many units from its left edge when the keyboard is split |

Prefix a value with `loc ` to reserve its position while letting the keyboard's optional-key setting decide whether it is visible:

```xml
<key c="a" nw="loc tab"/>
<key c="backspace" ne="loc delete"/>
```

## Where the split keyboard cuts

When the keyboard is in its split form, each row is parted in two. You choose where with two marks:

- `split_before="true"` on a key starts the right half at that key.
- `split_at="<units>"` on a wide key cuts that key the given number of units from its left edge. Both pieces type the centre value; west-side swipes stay on the left piece, east-side swipes on the right, and north, south and the circle gesture go to the wider piece.

A row with neither mark is cut at its middle. Putting both marks on one key is an error, as is a negative or non-finite `split_at`. Both halves are the same width, set against the screen edges with one straight gap between them.

The bundled and example layouts cut `q`–`t` | `y`–`p`, `a`–`g` | `h`–`l`, `shift z`–`v` | `b`–`m backspace`, and the space bar with `split_at="2.5"`:

```xml
<key c="y" split_before="true" ne="6" sw="^"/>
<key width="4.0" role="space_bar" c="space" split_at="2.5" w="cursor_left" e="cursor_right"/>
```

## Put launcher actions on keys and swipes

Any slot can call an argument-free launcher action:

```text
tool:<action-id>
tool:<action-id>:<display-glyph>
```

The optional suffix is only the glyph drawn on the key. It is not an argument list.

This space bar keeps cursor sliding on east/west and puts multiplexer navigation on the corners:

```xml
<key width="4.0" c="space"
     w="cursor_left" e="cursor_right" s="switch_backward"
     n="tool:app.command_palette:⌘"
     nw="tool:window.previous:◧"
     ne="tool:window.next:◨"
     sw="tool:session.previous:↰"
     se="tool:session.next:↳"/>
```

You can also dedicate ordinary keys or unused swipe slots:

```xml
<row height="0.8">
  <key c="tool:pane.split_vertical:⇳" n="tool:pane.split_horizontal:⇔"/>
  <key c="tool:pane.equalize:=" n="tool:pane.next_layout:⟳"/>
  <key c="tool:pane.toggle_float:◈" n="tool:terminal.toggle_scratchpad:▣"/>
  <key c="tool:terminal.search_scrollback:⌕" n="tool:terminal.hints:?"/>
</row>
```

Actions that require arguments cannot run from `layout.xml`. For example, `app.launch` requires a `query`, `pane.layout` requires a layout name, and `pane.move_to_edge` requires an edge. Assign those in `termux-launcher-bindings.conf` or use an argument-capable Termux Extra Key.

## Modifier layers

`<modmap>` remaps one key value to another while a keyboard modifier is active. Supported mapping tags are `<fn>`, `<shift>`, and `<ctrl>`; `a` is the original value and `b` is the mapped value.

```xml
<modmap>
  <fn a="q" b="f1"/>
  <fn a="w" b="f2"/>
  <fn a="a" b="esc"/>
  <fn a="s" b="tab"/>
  <fn a="n" b="^C:ctrl,c"/>
  <fn a="m" b="^D:ctrl,d"/>
</modmap>
```

The shipped layout maps `Fn+Q` … `Fn+P` to `F1` … `F10`, `Fn+Z/X` to `F11/F12`, navigation across the home row, and `Fn+N/M` to `Ctrl+C/D`.

## Key values

Values may be literal Unicode text, named keyboard keys such as `esc`, `tab`, `enter`, `backspace`, `delete`, `home`, `page_up`, `left`, or `f1`, keyboard modifiers such as `ctrl`, `alt`, `shift`, and `fn`, built-in gestures such as `cursor_left`, or `tool:` launcher actions.

The shipped layout also uses these named values: `switch_clipboard` (clipboard history), `switch_numeric`, `switch_backward`, `config`, `change_method`, `voice_typing`, `compose`, `meta`, `insert` and `page_down`.

XML-reserved characters must be escaped: write `&amp;`, `&lt;`, `&gt;`, and `&quot;`. The shipped example also demonstrates escaped keyboard parser values such as `\?`, `\#`, `\@`, and `\\`.

## Safe editing and limits

- Maximum file size: 512 KiB.
- Maximum rows: 16.
- Maximum keys per row: 32.
- Maximum total keys: 512.
- Only one `<modmap>` is allowed.
- Save atomically when possible: write a temporary file beside `layout.xml`, then rename it.
- Run `termux-reload-settings` after every edit; no app restart is required.

When debugging, begin with the shipped example and make one change at a time. The command palette lists action IDs, while **Key inspector** shows the key event and terminal bytes produced by ordinary keyboard values.

Full details: [Keyboard](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Keyboard.md)
