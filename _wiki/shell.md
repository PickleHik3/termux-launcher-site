---
title: in-app keyboard
order: 30
---
# in-app keyboard

The launcher ships a built-in port of [Unexpected Keyboard](https://github.com/Julow/Unexpected-Keyboard) by Jules Aguillon - a brilliant little keyboard originally designed for programmers using Termux. Its trick: every key has up to eight extra characters on its corners, typed by swiping the key towards them. That puts Esc, Tab, Ctrl, arrows and all of shell punctuation on a normal-sized keyboard without cramming in extra rows. If you like it, check out (and support) the upstream project - it's also a standalone keyboard app on [Google Play](https://play.google.com/store/apps/details?id=juloo.keyboard2) and [F-Droid](https://f-droid.org/packages/juloo.keyboard2/).

The port is baked into the app as a view - no separate keyboard to install, no Android input-method setup, and it doesn't touch your system keyboard for other apps. It shows when you tap the terminal; toggle it with the Keyboard button, the palette, or **Ctrl + Alt + K**. Prefer your regular keyboard? **Settings → Keyboard & input → On-screen keyboard** switches between *Built-in terminal keyboard*, *Android keyboard* and *None*.

> ![](/termux-launcher-site/assets/uploads/whatsapp-image-2026-08-02-at-12.36.58-am.jpeg)

## What it can do

* **Corner swipes** - swipe any key towards a corner for the symbol printed there. Small circle on a key gives its shifted character.
* **Real modifiers** - Ctrl and Alt are actual keys. Tap to latch for the next key, double-tap to lock.
* **Fn layer** - hold Fn for F1–F12 on the letter rows, plus Esc, Tab, Home/End, PgUp/PgDn, arrows on the home row, and Ctrl+C / Ctrl+D on N / M.
* **Extra layers** - a numeric layer and a Greek & math layer.
* **Space bar gestures** - swipe up opens the [Command Palette](#wiki/tour); the corners switch windows and sessions; slide left/right moves the cursor.
* **Extra keys picker** - add optional keys (Copy, Paste, Select all, Undo, F11/F12, dead keys and more) from **Settings → Keyboard & input → Extra keys**.
* **Keybind hints** - hold Ctrl + Alt and the keys with bindings light up with a legend.

## Looks

The keyboard follows your wallpaper's Material colors, and everything about it is adjustable: height, key spacing, corner radius, keys opacity, glass blur, a custom label font, and full color-scheme editing with live preview (including importing Base16/Base24 themes). Start from **Settings → Keyboard & input → Customize keyboard surface** - it drops you into the surface editor on your real home screen so you tweak against the real background.

> ![](/termux-launcher-site/assets/uploads/whatsapp-image-2026-08-02-at-12.36.17-am-1-.jpeg)

## Custom layouts

The whole layout is one XML file. Drop your own at:

```text
~/.termux/keyboard/layout.xml
```

and it replaces the bundled layout (run `termux-reload-settings` or reopen the app to apply; delete the file to go back). A fully commented copy of the default layout sits at `~/.termux/launcher/examples/keyboard-layout.xml` - the best starting point, since it documents the 8-slot key model and the launcher's `tool:` key values (any [palette action](#wiki/tour) can live on any key slot).

Handy resources:

* The [web layout editor](https://unexpected-keyboard-layout-editor.lixquid.com) - build a layout visually, paste the XML out.
* Upstream's [layout format docs](https://github.com/Julow/Unexpected-Keyboard/blob/master/doc/Custom-layouts.md) and [possible key values](https://github.com/Julow/Unexpected-Keyboard/blob/master/doc/Possible-key-values.md) - both also linked from the keyboard settings.

If your XML has a mistake, the keyboard falls back to the last working layout and tells you the line number. **Settings → Keyboard & input → Custom layout** validates the file on demand.

One limit: `tool:` keys can't carry arguments, so you can't put "launch WhatsApp" directly on a key - bind a key chord to `app.launch` in the bindings file instead ([configs](#wiki/tmux)).
