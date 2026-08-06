---
title: Fonts
order: 22
---
# Fonts

Font handling is ported from kitty and then taken further. There are three ways in and they stack: an in-app picker for people who just want a good font, the classic `~/.termux/font.ttf` for people who already have one, and `~/.termux/fonts.conf` for people who want every knob.

## Which file wins

Read this once and the rest of the page stops surprising you. Config is loaded in this order, and a later duplicate directive replaces an earlier one:

1. `~/.termux/fonts.d/*.conf` - drop-ins, read first, in ascending filename order. The app writes exactly one of them, `10-launcher.conf`.
2. `~/.termux/fonts.conf` - your own file, read last, so it wins every directive it mentions.
3. `~/.termux/font.ttf` and `~/.termux/font-italic.ttf` - used for any face the files above left unset. This is what Termux:Styling writes.
4. Android `monospace` - the last resort.

So a hand-written `fonts.conf` beats the picker, and the picker beats Termux:Styling. If you set a font in the app and nothing changes on screen, you have a `fonts.conf` overriding it.

## The easy path - the picker

**Settings → Appearance → Terminal fonts** is a font store: it downloads from the upstream release, checks it against a SHA-256 pinned in the app, installs it under `~/.termux/fonts/`, and writes the managed drop-in for you. Nothing needs a shell, and the catalog ships inside the APK so the list works offline.

* **Recommended setup** - one tap installs Maple Mono (a 373 KB download) with its ligatures on and icon glyphs routed to the bundled Symbols Nerd Font Mono. Same result as the [Shell goodies](#wiki/shell-goodies) script's font step, without the 20 MB Nerd Font build.
* **Families** - seven curated families. Each row shows the download size, face count, whether it is variable and whether it ligates, plus a **License** button with the full notice and upstream link before anything is fetched.
* **Nerd Font icons** - routes `U+E000-U+F8FF` and `U+F0000-U+FFFFD` to the bundled symbols face, so powerline, devicon, codicon and Material Design glyphs work with any family. The symbols face is in the APK, not downloaded.
* **Ligature policy** - the three `disable_ligatures` values, spelled out: always shaped, un-fuse under the cursor, or off.
* **Weight** - a `wght` slider for variable families only. Moving it moves bold with it, so the family keeps its own regular-to-bold contrast.
* **Use font.ttf / Termux:Styling** - the exit. It deletes `~/.termux/fonts.d/10-launcher.conf` and nothing else: your `fonts.conf` and the installed font files stay where they are.

| Family | Download | Faces | Notes |
| --- | --- | --- | --- |
| **Maple Mono** (recommended) | 373 KB | 4 | Variable `wght` 100-800, ligatures. The face the shaping was tuned against. |
| Hack | 601 KB | 4 | Four hand-tuned static faces, no ligatures. Smallest in the catalog. |
| JetBrains Mono | 1.1 MB | 4 | Tall x-height, wide ligature set. |
| Fira Code | 2.3 MB | 2 | No italic upstream, so italics stay synthetic. |
| Victor Mono | 8.8 MB | 4 | Semi-connected cursive italics. |
| Cascadia Code | 23.7 MB | 4 | Variable `wght` 200-700, cursive italics. One large upstream archive. |
| Maple Mono NF | 20.2 MB | 4 | The Nerd Font patched static build - icons live in the text faces. |

Everything is SIL Open Font License 1.1 except Hack, which is MIT plus the Bitstream Vera License; the bundled Symbols Nerd Font Mono is MIT. Installing writes a `LICENSE.txt` next to the faces so the attribution travels with the files.

Installing also mirrors the regular and italic faces to `~/.termux/font.ttf` and `font-italic.ttf`, so plain Termux tooling and other forks see a sane font even though they know nothing about `fonts.d`.

The same screen is reachable without leaving the terminal: `fonts.pick` opens the picker and `fonts.install` installs a family by id, both from the [Command Palette](#wiki/tour), a keybind or an extra key.

> 🖼️ *Screenshot placeholder: the Terminal fonts screen with the Recommended setup card and two family rows, one Active and one mid-download.*

## The simple path - font.ttf

Unchanged from upstream Termux. Drop a TrueType file at `~/.termux/font.ttf`, optionally `~/.termux/font-italic.ttf`, or let Termux:Styling do it, then:

```sh
termux-reload-settings
```

No `fonts.conf`, no `fonts.d`, no picker needed. Bold and bold italic are synthesized from the regular face; italic comes from `font-italic.ttf` when you supply it and is synthesized otherwise.

## The power path - fonts.conf

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
* `disable_ligatures` takes `never` (the default), `cursor` or `always`, and touches programming ligatures only - Arabic, Indic, emoji and combining-mark shaping are never affected.
* `font_features` and `font_variations` target `regular`, `bold`, `italic`, `bold_italic`, `symbols`, or a named symbol map. `none` clears a target.
* `modify_font` adjusts `cell_width`, `cell_height`, `baseline`, `underline_position`, `underline_thickness`, `strikethrough_position` and `strikethrough_thickness`. A percentage (10% to 500%) replaces the font-derived metric; a bare number or one ending in `px` adds pixels (-256 to 256).
* Bad lines are skipped and counted in a toast, with the full text in logcat - the rest of the file keeps working.
* Limits per file: 64 KiB, 512 lines, 4096 characters per line.

The `~/.termux/fonts.d/` directory is the drop-in half of the same config. Anything valid in `fonts.conf` is valid in a `*.conf` file there, the files are concatenated in ascending filename order, and the app's own `10-launcher.conf` is just one of them. The `10-` prefix leaves room on both sides, so a `05-` file lands before it and a `20-` file after. Drop-ins are capped at 32 files and 256 KiB in total; that budget never squeezes out your `fonts.conf`, which keeps its own allowance. Symlinks pointing out of `fonts.d` are ignored.

## Seamless box drawing

Fonts disagree about box drawing. A face designed for prose leaves a background-colored seam between two adjacent `─`, puts the crossbar of `┼` off the centerline of `│`, and usually covers none of the block, braille or legacy-computing ranges at all - so a TUI drawn with it looks perforated. Every glyph in those ranges is a handful of rectangles, so the terminal computes them from the cell instead of asking the font for a glyph, snapped to the integer pixel edges that adjacent cells already share.

The result: TUI frames, block ramps and braille graphs join cleanly at any font size, after a pinch-zoom, and after `modify_font` changes the cell. This is on by default.

```text
box_drawing        synthesize
box_drawing_scale  0.001,1,1.5,2
powerline_symbols  synthesize
```

* `box_drawing synthesize` is the default. `box_drawing font` turns it all off and hands every one of those code points back to your font's glyphs.
* `box_drawing_scale` sets the stroke widths of the four line weights - thin, light, heavy and very heavy - as multipliers of a base stroke derived from the cell height. Four values, comma or space separated, each above 0 and at most 8; the shipped default is `0.001 1 1.5 2`. Thin is deliberately near zero: it names a hairline, and the one-pixel floor produces one at any size.
* `powerline_symbols` defaults to `font`, because a Nerd Font's own separators are usually what you want. Set it to `synthesize` to have the separators drawn as geometry instead, so two consecutive separators butt together with no sliver of background between them.
* An explicit `symbol_map` always wins. If you deliberately routed a range to a font, that was a choice, and it is respected over the geometry.

Synthesized ranges:

| Range | What it is |
| --- | --- |
| `U+2500-U+257F` | Box Drawing - lines, corners, crosses, dashes, arcs, doubles |
| `U+2580-U+259F` | Block Elements - full, half, eighth and quadrant blocks, shades |
| `U+25E2-U+25E5` | The four corner triangles from Geometric Shapes |
| `U+2800-U+28FF` | Braille Patterns - the whole block, as used by graph and plot tools |
| `U+1FB00-U+1FB3B` | Legacy Computing sextants |
| `U+1FB70-U+1FB8F` | Legacy Computing eighth bars and corners, and half medium shades |
| `U+E0B0-U+E0B7`, `U+E0BA-U+E0BD` | Powerline separators - only with `powerline_symbols synthesize` |

Not synthesized - these still come from your font or your `symbol_map`, by design, so they are not a bug: the rest of Geometric Shapes (`U+25A0-U+25E1` and `U+25E6-U+25FF`), the Legacy Computing wedges and diagonals (`U+1FB3C-U+1FB6F`), the inverse shades, pattern fills, arrows and segmented digits (`U+1FB90-U+1FBFF`), and the diagonal Powerline separators (`U+E0B8-U+E0B9` and `U+E0BE-U+E0BF`) even in synthesize mode.

> 🖼️ *Screenshot placeholder: a close crop of a TUI frame with `box_drawing synthesize` beside the same frame with `box_drawing font`, showing the hairline gaps.*

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

* Names are 1 to 32 characters of `A-Z a-z 0-9 _ -` and cannot reuse a face target name. Naming a map that was never declared is an error, reported and dropped.
* A named map's own `font_features` and `font_variations` win for its own cells, and the terminal breaks a text run whenever two adjacent maps differ in them, so neighbouring maps really do shape independently.
* Anything a map does not declare comes from the shared `symbols` target - which is also what unnamed maps use - so `font_features symbols +ss01` is the default for every map without a line of its own.
* An axis a mapped face cannot honour is reported once and dropped, leaving that face at its own default rather than breaking the config.
* Ceilings: 256 `symbol_map` lines, 1024 ranges in total, 64 distinct symbol font files, and 8 `fallback_font` entries.

`fallback_font` is the answer to "Android picked an emoji or CJK font I did not choose". It is an ordered chain, tried in the order written, and the per-cell order is: an explicit `symbol_map` first, then synthesized box drawing, then the cell's own face, then the `fallback_font` chain, then Android's platform fallback. The chain is only consulted when the cell's own face genuinely lacks the glyph, and the first configured face that has it wins - so you decide what covers the gaps instead of Android deciding for you.

## Why only four faces

Because ANSI SGR only distinguishes bold and italic. Every combination of the two is one of exactly four addressable faces - regular, bold, italic, bold italic - and no escape sequence exists to ask for a fifth. That is a limit of the protocol every terminal speaks, not of this config.

The number of font *files* in play is much higher: four faces, plus up to 256 `symbol_map` targets across 64 distinct files, plus 8 `fallback_font` entries. What SGR cannot do is let a program say "set this word in semibold condensed". For that, move the axis with `font_variations` and the whole face moves with it.
