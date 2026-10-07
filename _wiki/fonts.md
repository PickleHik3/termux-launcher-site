---
title: Fonts
group: Terminal
order: 110
---
Font handling is ported from kitty and then taken further. There are three ways in and they stack: an in-app picker for people who want a good font quickly, the classic `~/.termux/font.ttf` for people who already have one, and `~/.termux/fonts.conf` for people who want every knob.

## Which file wins

Read this once and the rest of the page stops surprising you. Config is loaded in this order, and a later duplicate directive replaces an earlier one:

1. `~/.config/kitty/kitty.conf`: only its font directives are read (one level of `include` is followed), so your kitty setup carries over.
2. `~/.termux/fonts.d/*.conf`: drop-ins, in ascending filename order. The app writes exactly one of them, `10-launcher.conf`.
3. `~/.termux/fonts.conf`: your own file, read last, so it wins every directive it mentions.

Anything those files leave unset comes from `~/.termux/font.ttf` and `~/.termux/font-italic.ttf` (what Termux:Styling writes), and after that from Android `monospace`.

So a hand-written `fonts.conf` beats the picker, the picker beats `kitty.conf`, and all of them beat Termux:Styling. If you set a font in the app and nothing changes on screen, a `fonts.conf` is overriding it.

## The easy path: the picker

**Terminal fonts** is a font store: it downloads from the upstream release, checks the file against a SHA-256 pinned in the app, installs it under `~/.termux/fonts/`, and writes the managed drop-in for you. The catalog ships inside the APK, so the list works offline. Open it with **Terminal fonts** in the [Command palette](#wiki/command-palette) (`fonts.pick`), by searching Settings for "fonts", or from the **Theme & fonts** page (palette row **Look and feel settings**) under **Terminal font → Terminal fonts**.

**Install terminal font** (`fonts.install`) in the palette installs a family by id. Both actions also work from a keybind or an extra key.

```clip
image: assets/screenshots/terminal-fonts-picker.webp
title: Terminal font picker
caption: The managed Maple Mono setup, rendering controls and installed family cards.
```

The picker has four sections:

* **Setup**: the **Active font** card, showing the face in use and whether `~/.termux/fonts.d/10-launcher.conf` manages it.
* **Tuning**: **Nerd Font icons** routes `U+E000-U+F8FF` and `U+F0000-U+FFFFD` to the bundled Symbols Nerd Font Mono (in the APK, not downloaded), so powerline, devicon, codicon and Material Design glyphs work with any family. **Ligature policy** offers the three `disable_ligatures` values: always shaped, un-fuse under the cursor, or off. **Weight** is a `wght` slider for variable families only; bold moves with it, so the family keeps its own contrast.
* **Families**: fourteen curated families. Maple Mono carries the recommended star. Each row shows the download size, face count, whether it is variable and whether it ligates, plus a **License** button with the full notice and upstream link before anything is fetched.
* **Manual control**: **Use font.ttf / Termux:Styling** is the exit. It deletes `~/.termux/fonts.d/10-launcher.conf` and nothing else; your `fonts.conf` and the installed font files stay. **Hand-edited config** explains writing your own `fonts.conf`.

| Family | Download | Faces | Notes |
| --- | --- | --- | --- |
| **Maple Mono** (recommended) | 373 KB | 4 | Variable `wght` 100-800, ligatures. The face the shaping was tuned against. |
| Intel One Mono | 494 KB | 4 | Designed with and for low-vision developers. |
| Hack | 601 KB | 4 | Four hand-tuned static faces, no ligatures. |
| Commit Mono | 707 KB | 4 | Deliberately neutral, smart kerning; alternates are opt-in `font_features`. |
| JetBrains Mono | 1.1 MB | 4 | Tall x-height, wide ligature set. |
| 0xProto | 1.2 MB | 3 | Legibility-first shapes; ships no bold italic. |
| Fira Code | 2.3 MB | 2 | No italic upstream, so italics stay synthetic. |
| Monaspace Neon | 4.0 MB | 2 | Variable `wght` 200-800, texture healing; ligatures live in stylistic sets. |
| Comic Shanns Mono | 8.6 MB | 2 | Comic letterforms on monospace metrics, icons already patched in. |
| Victor Mono | 8.8 MB | 4 | Semi-connected cursive italics. |
| MesloLGS NF | 9.8 MB | 4 | The Powerlevel10k face; prompt glyphs align with no tweaking. |
| Cascadia Code | 23.7 MB | 4 | Variable `wght` 200-700, cursive italics. One large upstream archive. |
| Rec Mono Casual | 48.1 MB | 4 | Brush-loop letterforms across all four faces. |
| Iosevka Term | 56.2 MB | 4 | Narrow slab grotesk, enormous Unicode coverage; Nerd Font build. |

Most are SIL Open Font License 1.1. The exceptions: Hack is MIT plus the Bitstream Vera License, Comic Shanns Mono is MIT, MesloLGS NF is Apache License 2.0, and the bundled Symbols Nerd Font Mono is MIT. Installing writes a `LICENSE.txt` next to the faces so the attribution travels with the files.

The picker never creates, overwrites or deletes `~/.termux/font.ttf` or `font-italic.ttf`; a font you placed there yourself is safe.

## The simple path: font.ttf

Unchanged from upstream Termux. Drop a TrueType file at `~/.termux/font.ttf`, optionally `~/.termux/font-italic.ttf`, or let Termux:Styling do it, then run `termux-reload-settings`. No `fonts.conf`, no `fonts.d`, no picker needed. Bold and bold italic are synthesized from the regular face; italic comes from `font-italic.ttf` when you supply it and is synthesized otherwise.

## The power path: fonts.conf

`~/.termux/fonts.conf` is a kitty-style config. A fully commented reference copy is refreshed at `~/.termux/launcher/examples/fonts.conf` on every app start, and `termux-reload-settings` applies your edits without restarting the app.

```text
font_family        path=~/.termux/fonts/maple-mono/regular.ttf
bold_font          path=~/.termux/fonts/maple-mono/bold.ttf
italic_font        path=~/.termux/fonts/maple-mono/italic.ttf
bold_italic_font   path=~/.termux/fonts/maple-mono/bold-italic.ttf
font_variations    regular wght=400
font_variations    bold    wght=700
font_features      regular +zero
disable_ligatures  cursor
modify_font        cell_width 95%
```

Worth knowing:

* Face sources are `path=` (absolute or starting `~/`) or `family=` for an Android system family. Paths are the reliable case on Android; a `family=` lookup is best-effort.
* `disable_ligatures` takes `never` (the default), `cursor` or `always`, and touches programming ligatures only; Arabic, Indic, emoji and combining-mark shaping are never affected.
* `font_features` and `font_variations` target `regular`, `bold`, `italic`, `bold_italic`, `symbols`, or a named symbol map. `none` clears a target.
* `modify_font` adjusts `cell_width`, `cell_height`, `baseline`, `underline_position`, `underline_thickness`, `strikethrough_position` and `strikethrough_thickness`. A percentage (10% to 500%) replaces the font-derived metric; a bare number or one ending in `px` adds pixels (-256 to 256).
* Kitty's own spellings are accepted (`font_family Fira Code`, `italic_font auto`, a line starting with `\` continues the one above). A family name is looked up in `~/.termux/fonts`, `~/.fonts` and `~/.local/share/fonts` before Android's families.
* Bad lines are skipped and counted in a toast, with the full text in logcat; the rest of the file keeps working.
* Limits per file: 64 KiB, 512 lines, 4096 characters per line.

### Keep selected symbols narrow

Kitty-compatible symbol expansion lets an icon use blank cells after it, which makes Nerd Font glyphs match the text height around them. Use `narrow_symbols` when a range must stay within a fixed number of cells:

```text
narrow_symbols U+E0A0-U+E0A3,U+E0C0-U+E0C7
narrow_symbols U+F0000-U+FFFFD 3
```

The optional trailing cell ceiling defaults to `1` and may be `1` through `5`; when several lines match a code point, the last one wins. Synthesized Powerline separators need no rule; `powerline_symbols font` hands them back to the font and makes them subject to `narrow_symbols`.

```clip
image: assets/screenshots/narrow-symbols-comparison.webp
title: Symbol width comparison
caption: Default symbol expansion on the left; the same Material symbols constrained to one cell on the right.
shape: wide
layout: full
```

Anything valid in `fonts.conf` is valid in a `~/.termux/fonts.d/*.conf` drop-in. The app's `10-launcher.conf` is one of them, so a `05-` file lands before it and a `20-` file after. Drop-ins are capped at 32 files and 256 KiB in total, separate from `fonts.conf`'s own allowance. Symlinks pointing out of `fonts.d` are ignored.

## Seamless box drawing

Fonts disagree about box drawing: a face designed for prose leaves seams between adjacent `─`, puts the crossbar of `┼` off the centreline of `│`, and often lacks the block, braille and legacy-computing ranges entirely. The terminal draws those glyphs itself from the cell, snapped to the pixel edges adjacent cells share, so TUI frames, block ramps and braille graphs join cleanly at any font size, after a pinch-zoom, and after `modify_font` changes the cell. This is on by default, and it is what the `sigye` clock from [tlstore](#wiki/tlstore) leans on.

```clip
image: assets/screenshots/box-drawing-comparison.webp
title: Box drawing comparison
caption: Synthesized, seamless cell joins on the left; font glyph seams and misalignment on the right.
shape: wide
layout: full
```

* `box_drawing synthesize` is the default. `box_drawing font` turns it all off and hands every one of those code points back to your font's glyphs.
* `box_drawing_scale` sets the stroke widths of the four line weights (thin, light, heavy and very heavy) as multipliers of a base stroke derived from the cell height. Four values, comma or space separated, each above 0 and at most 8; the shipped default is `0.001 1 1.5 2`. Thin is deliberately near zero: it names a hairline, and the one-pixel floor produces one at any size.
* `powerline_symbols` defaults to `synthesize`, so separator edges sit flush with the cell and two consecutive separators butt together with no sliver of background between them. It needs `box_drawing synthesize` as well. Set it to `font` for a patched Nerd Font whose author drew their own.
* An explicit `symbol_map` always wins: a range you deliberately routed to a font is respected over the geometry.

Synthesized ranges: Box Drawing (`U+2500-U+257F`), Block Elements (`U+2580-U+259F`), the four corner triangles of Geometric Shapes (`U+25E2-U+25E5`), Braille Patterns (`U+2800-U+28FF`), Legacy Computing sextants (`U+1FB00-U+1FB3B`) and eighth bars, corners and half medium shades (`U+1FB70-U+1FB8F`), and the Powerline separators `U+E0B0-U+E0B7` and `U+E0BA-U+E0BD` unless `powerline_symbols font` is set.

Not synthesized, by design (they come from your font or your `symbol_map`): the rest of Geometric Shapes (`U+25A0-U+25E1` and `U+25E6-U+25FF`), the Legacy Computing wedges and diagonals (`U+1FB3C-U+1FB6F`), the inverse shades, pattern fills, arrows and segmented digits (`U+1FB90-U+1FBFF`), and the diagonal Powerline separators (`U+E0B8-U+E0B9` and `U+E0BE-U+E0BF`) even in synthesize mode.

## Many fonts at once

`symbol_map` routes chosen Unicode ranges to another font file without changing the cell width, so the grid stays intact. It is repeatable, a later overlapping map wins, and each map can carry its own name so its shaping is tuned separately:

```text
symbol_map name=icons  U+E000-U+F8FF,U+F0000-U+FFFFD path=~/.termux/fonts/symbols/SymbolsNerdFontMono.ttf
symbol_map name=cjk    U+4E00-U+9FFF                path=~/.termux/fonts/NotoSansMonoCJK-Regular.otf
font_features icons    +ss01
font_variations cjk    wght=450

fallback_font path=~/.termux/fonts/NotoEmoji-Regular.ttf
fallback_font family="Noto Sans Symbols 2"
```

* Names are 1 to 32 characters of `A-Z a-z 0-9 _ -` and cannot reuse a face target name; naming an undeclared map is reported and dropped.
* A named map's own `font_features` and `font_variations` win for its cells, so neighbouring maps shape independently. Anything a map does not declare comes from the shared `symbols` target, which unnamed maps also use.
* An axis a mapped face cannot honour is reported once and dropped.
* Ceilings: 256 `symbol_map` lines, 1024 ranges in total, and 8 `fallback_font` entries.

`fallback_font` is the answer to "Android picked an emoji or CJK font I did not choose". Per cell, the order is: an explicit `symbol_map`, synthesized box drawing, the cell's own face, the `fallback_font` chain in the order written, then Android's platform fallback. The chain is consulted only when the cell's own face lacks the glyph, and the first configured face that has it wins.

## Why only four faces

ANSI SGR only distinguishes bold and italic, so there are exactly four addressable faces: regular, bold, italic, bold italic. No escape sequence asks for a fifth; that is a limit of the protocol, not of this config. The number of font *files* in play is much higher (four faces, up to 256 `symbol_map` targets, 8 `fallback_font` entries), and `font_variations` can move a face along an axis such as weight.

Full details: [Terminal fonts](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Terminal_Fonts.md)
