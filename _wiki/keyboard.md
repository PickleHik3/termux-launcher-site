---
title: Keyboard
group: Typing
order: 60
---
The launcher ships a built-in port of [Unexpected Keyboard](https://github.com/Julow/Unexpected-Keyboard) by Jules Aguillon - a brilliant little keyboard originally designed for programmers using Termux. Its trick: every key has up to eight extra characters on its corners, typed by swiping the key towards them. That puts Esc, Tab, Ctrl, arrows and all of shell punctuation on a normal-sized keyboard without cramming in extra rows. If you like it, check out (and support) the upstream project - it's also a standalone keyboard app on [Google Play](https://play.google.com/store/apps/details?id=juloo.keyboard2) and [F-Droid](https://f-droid.org/packages/juloo.keyboard2/).

The port is baked into the app as a view - no separate keyboard to install, no Android input-method setup, and it doesn't touch your system keyboard for other apps. It shows when you tap the terminal; toggle it with the Keyboard key, the palette, or **Ctrl + Alt + K**.

```clip
image: assets/uploads/whatsapp-image-2026-08-02-at-12.36.58-am.jpeg
title: Built-in keyboard
caption: The built-in keyboard - corner symbols on every key, real Ctrl and Alt.
```

## What it can do

* **Corner swipes** - swipe any key towards a corner for the symbol printed there. Small circle on a key gives its shifted character.
* **Real modifiers** - Ctrl and Alt are actual keys. Tap to latch for the next key, double-tap to lock.
* **Fn layer** - hold Fn for F1–F12 on the letter rows, plus Esc, Tab, Home/End, PgUp/PgDn, arrows on the home row, and Ctrl+C / Ctrl+D on N / M.
* **Extra layers** - a numeric layer and a Greek & math layer.
* **Space bar gestures** - swipe up opens the [Command palette](#wiki/command-palette); the corners switch windows and sessions; slide left/right moves the cursor.
* **Extra keys picker** - add optional keys (Copy, Paste, Select all, Undo, F11/F12, dead keys and more) to the keyboard's own layout from **Settings → Keyboard → Layout → Keyboard extra keys**. This adds keys to the keyboard's own layout, not the dock row under the terminal - see [Extra keys](#wiki/extra-keys) for that.
* **Keybind hints** - hold Ctrl + Alt and the keys with bindings light up with a legend.

```clip
name: keybind-discovery
title: Keybind hints
caption: Holding Ctrl + Alt lights the bound keys and prints the chord map above them.
```

## Docked, floating or split

The keyboard has three shapes:

* **Docked** - the default, sitting at the bottom of the screen under the extra keys row.
* **Floating** - a narrower keyboard placed wherever you drag it, over the content instead of pushing it up. Drag the handle in its bottom-left corner to resize it.
* **Split** - the same docked keyboard with every row parted down the middle, for two-thumb typing.

**Swipe up on the Keyboard key** to cycle between the three. **Settings → Keyboard → Floating and split → Keyboard type** picks the same three shapes, and the sliders below it set how wide a float is, how tall it is, and how far a split parts, one value per orientation.

## Hiding it

Swipe down from its top edge - the strip just above the first row of keys, or the empty space between the keyboard and the rows above it - to put it away. Let go early and it springs back. A hidden keyboard comes back the next time you tap the terminal; to keep it off, run **Keyboard on/off** from the palette or press the Keyboard key again.

## Choosing a keyboard

**Hold the Keyboard key** to choose which keyboard opens: the built-in one, Android's own on-screen keyboard, or none at all. The same choice sits in **Settings → Keyboard → Input method → On-screen keyboard** as *In-app*, *Android IME* and *None*.

If you use a hardware keyboard, **Settings → Terminal → Terminal display → System keyboard compatibility** pads the layout so the terminal and key rows stay visible above an Android on-screen keyboard when one pops up anyway; turn it off if you see gaps or jumpy resizing.

## Looks

The keyboard's colours and typeface live with the rest of the app's look, not under Keyboard. **Settings → Look → Keyboard look** has:

* **Customize keyboard appearance** - drops you into the surface editor on your real home screen, so you tune height, key spacing, corner radius, key opacity and glass blur against the real background.
* **Keyboard colours** - full colour-scheme editing with a persistent live preview, including importing Base16/Base24 themes.
* **Typeface** - pick any `.ttf` font file for the key labels; they redraw with it immediately. This is separate from the terminal's font (see [Terminal fonts](#wiki/fonts)), so the keyboard and the terminal can each have their own.

```clip
image: assets/uploads/whatsapp-image-2026-08-02-at-12.36.17-am-1-.jpeg
title: Keyboard surface editor
caption: Tuning the keyboard's glass, colors and spacing live on the real home screen.
```

Key popup, keypress sound and haptic feedback are their own switches under **Settings → Keyboard → Feedback**. **Settings → Keyboard → Typing → Learn where you tap** nudges presses toward the key you usually mean, based on your own typing; **Forget learned taps** resets it.

## Voice key

Swipe up on Enter to dictate - see [Voice & speech](#wiki/voice) for the engines, cleanup and settings.

## Custom layouts

The whole layout is one XML file at `~/.termux/keyboard/layout.xml`, and it replaces the bundled layout completely - every key and every swipe slot. See [Keyboard layout schema](#wiki/keyboard-layout) for the file format, the `tool:` key values, and the web layout editor.
