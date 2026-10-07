---
title: Keyboard
group: Typing
order: 60
---
This page covers the built-in keyboard: how to type on it, its three shapes, how to hide or turn it off, and where its settings and looks live.

The launcher ships a built-in port of [Unexpected Keyboard](https://github.com/Julow/Unexpected-Keyboard) by Jules Aguillon, a keyboard originally designed for programmers using Termux. Every key has up to eight extra characters on its corners, typed by swiping the key towards them. That puts Esc, Tab, Ctrl, arrows and all of shell punctuation on a normal-sized keyboard without extra rows. If you like it, support the upstream project; it is also a standalone keyboard app on [Google Play](https://play.google.com/store/apps/details?id=juloo.keyboard2) and [F-Droid](https://f-droid.org/packages/juloo.keyboard2/).

The port is built into the app as a view: no separate keyboard to install, no Android input-method setup, and your system keyboard for other apps is untouched. It shows when you tap the terminal. **Ctrl + Alt + K** toggles it.

```clip
image: assets/uploads/whatsapp-image-2026-08-02-at-12.36.58-am.jpeg
title: Built-in keyboard
caption: The built-in keyboard - corner symbols on every key, real Ctrl and Alt.
```

## What it can do

* **Corner swipes**: swipe any key towards a corner for the symbol printed there. The small circle on a key gives its shifted character.
* **Real modifiers**: Ctrl and Alt are actual keys. Tap to latch for the next key, double-tap to lock.
* **Ctrl key swipes**: up-right (NE) opens **Clipboard history**, down-right (SE) switches to the numeric layer, down-left (SW) is Meta.
* **Fn layer**: swipe the Alt key up-left (NW) for Fn. Its layer puts F1 to F10 on the top row and F11 / F12 on Z / X; Esc / Tab on A / S; Home / Up / End on D / F / G; PgUp / Left / Down / Right on H / J / K / L; Insert / Delete on C / V; PgDn on B; Ctrl+C / Ctrl+D on N / M.
* **Space bar gestures**: swipe up opens the [Command palette](#wiki/command-palette); up-left / up-right switch to the previous / next window; down-left / down-right switch to the previous / next session; slide left or right to move the cursor; swipe down to step through your keyboard layouts.
* **Voice**: swipe up on Enter to dictate. See [Voice & speech](#wiki/voice).
* **Keybind hints**: hold Ctrl + Alt and the keys with bindings light up with a legend. To light only the **?** key instead, turn off **Settings → Terminal → Sessions and panes → Shortcut hints**.

```clip
name: keybind-discovery
title: Keybind hints
caption: Holding Ctrl + Alt lights the bound keys and prints the chord map above them.
```

## Layouts and extra keys

**Settings → Keyboard → Layouts** ("Languages, extra keys and custom layout") holds:

* **Layouts**: choose the layouts the keyboard cycles through. A space-bar swipe down steps through them; the palette rows **Cycle keyboard layout** and **Switch keyboard layout** do the same.
* **Keyboard extra keys**: add optional keys (Copy, Paste, Select all, Undo, F11/F12, dead keys and more) to the keyboard's own layout. This is not the extra-keys row under the terminal; for that, see [Extra keys](#wiki/extra-keys).
* **Custom layout**: the whole layout is one XML file at `~/.termux/keyboard/layout.xml`, and it replaces the bundled layout completely, every key and every swipe slot. See [Keyboard layout schema](#wiki/keyboard-layout) for the file format and the `tool:` key values.

## Docked, floating or split

The keyboard has three shapes:

* **Docked**: the default, along the bottom of the screen.
* **Floating**: a smaller keyboard over the content instead of pushing it up. Move it by either top corner or by the pill in its handle row. Resize it from the bottom-left grip: dragging left makes it wider, dragging up makes the rows taller; the right and bottom edges stay put.
* **Split**: two halves pushed against the screen edges with one straight gap between them, for two-thumb typing. The bundled layout parts q to t | y to p, a to g | h to l, and Shift z to v | b to m Backspace. On the bottom row, Ctrl, Alt and a piece of space bar sit left; a shorter piece of space bar, the arrow key and Enter sit right. Both space pieces type a space.

To change shape:

* **Swipe up on the Keyboard key** of the extra-keys row to step through the three.
* Open **Appearance → Layout** and select the keyboard: three type chips plus **Key radius**, set per orientation.
* Run **Keyboard type** (one row per type) or **Next keyboard type** from the palette.

**Settings → Keyboard → Size and position** sets the sizes, separately for portrait and landscape: **Floating keyboard width** (percent of the screen width), **Floating keyboard height** (percent of the normal keyboard height) and **Split keyboard gap** (percent of the keyboard width between the two halves).

## Hiding it or turning it off

* **Hide for now**: swipe down from the current page's bottom border, or tap the **Keyboard key**. A hidden keyboard comes back the next time you tap the terminal.
* **Keep it off**: run **Keyboard on/off** from the palette, or in **Appearance → Layout** drag the keyboard onto the eye-off button (its tile in the hidden row switches it back on). A swipe up from the bottom border turns it back on.
* **Use another keyboard**: **Settings → Keyboard → Input method → On-screen keyboard** offers **Built-in**, **Android** or **Off**.

In **Appearance → Layout** you can also drop the extra-keys row, the apps row or the A-Z index into the slot under the keyboard. See [Layout](#wiki/layout).

## Hardware keyboards

**Settings → Keyboard → Hardware keyboard** has two switches:

* **Hide on-screen keyboard**: "While a hardware keyboard is connected." Works for the built-in keyboard too.
* **Android language shortcut**: "Ctrl+Space switches Android keyboard languages. Off sends it to the terminal." Off by default.

If the Android on-screen keyboard covers terminal content, try **Settings → Terminal → Compatibility → Keyboard resize workaround**; turn it off if it causes gaps or jumpy resizing.

## Typing and feedback

**Settings → Keyboard → Typing and feedback**:

* **Adaptive touch accuracy**: "Adjust key detection to your typing." Off by default. **Reset learned taps** forgets what it learned.
* **Key preview**: shows the pressed key above your finger.
* **Key sound**: uses the system touch-sound volume.
* **Vibration**: opens **Settings → App behavior**, where **Allow vibration**, **Keyboard vibration** and **Launcher vibration** live.

## Looks

The keyboard's material and colours are set with the rest of the home screen:

* **Appearance → Look**, choose **Custom**, then tap the keyboard: **Blur**, **Grain**, **Opacity**, **Tint**, **Radius** and **Spacing**, plus a **Keyboard theme** button. See [Look](#wiki/look).
* Height is not a Look control: drag the keyboard's top edge in **Appearance → Layout**. The handle on the bottom of the keys sets the padding under the last row.

The **Keyboard theme** page ("Colors and typeface") has a live preview and:

* One chip group for what you paint: **Key fill**, **Border**, **Label**, **Corner labels**, **Bottom label**, **Background**.
* 24 swatches. Tap a key, or drag across the keyboard, to paint it. **Edit colors** / **Save colors** change the swatches, with a hex editor; **Reset to theme** returns to the theme's colours.
* A **Font** row: **Choose font file…** picks any TTF or OTF file from internal storage; **Use system default** goes back. This is separate from the terminal's font (see [Terminal fonts](#wiki/fonts)). With a custom font, the space bar's icons keep the bundled symbols font.

The same two rows, **Surface style** and **Keyboard theme**, also sit in the "Keyboard look" section of the **Theme & fonts** page, which you reach through Settings search or the palette row **Look and feel settings**.

Full details: [Keyboard](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Keyboard.md)
