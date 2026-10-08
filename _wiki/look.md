---
title: Look & themes
group: Everyday
order: 50
---
Look is what things look like: wallpaper, glass, colours, icons and terminal effects. It lives in two places: the Appearance surface and the Theme & fonts page. For where things sit, see [Layout & full screen](#wiki/layout).

## Appearance

Open **Appearance** from **Settings → Appearance**, from a pane's corner tab, or from the terminal's long-press menu. It opens on the real home screen with four tabs in a pill at the top: **Wallpaper | Look | Layout | Icon pack**. It opens on Wallpaper, or on the tab you last used if you were there in the past 30 minutes. On a tablet (smallest width 600dp or more) held in landscape, the controls sit in a side pane on the right and the preview fits and centres to its left; the pill stays on top, tall pages scroll inside the pane, and the clock face popup opens inside it. In portrait the controls return to the bottom sheet. Phones are unchanged.

Home, Terminal and Display share one look, so a change here applies to all three.

One **Done**, top right, applies everything from every tab at once: the Home wallpaper, the Lock wallpaper, the look and the layout. Pressing Back or Home with a wallpaper not yet applied offers **Keep editing**, **Discard** or **Save**.

## Wallpaper

* Two cards, **Lock screen** and **Home screen**. The Lock card can be **Same as Home**.
* **Choose photo** picks an image, previewed before you apply it. Your last five photos stay on the tab for a quick switch. While another app set the current wallpaper, a small grey line under it reads "Set your wallpaper here to see fancier glass." It goes away once you apply a wallpaper from Appearance.
* If another app set your lock screen wallpaper, the Lock card notices, and applying a Home wallpaper does not overwrite it.

## Look

A **Look** slider with five stops: **Clear**, **Mist**, **Tint**, **Solid** and **Custom**. Clear is the most glassy.

At **Custom**, with nothing tapped, vertical sliders set **Blur**, **Grain**, **Opacity**, **Tint**, **Margin** and **Corner radius** for everything. Tap one element on the screen to tune it on its own; tap bare wallpaper to go back to all of them:

* **Status bar:** blur, grain, opacity and tint, plus a **Clock** button for the clock face (Flip, LCD, Minimal, LED matrix, Tape, Slab) and its alignment (Left, Center, Right).
* **Terminal:** the same four plus **Contrast**, with **Cursor trail** and **Terminal effect** pills.
* **Dock:** plus **Size** and **Icons**.
* **Keyboard:** plus **Radius** and **Spacing**, with a **Keyboard theme** button for its theme, colours and typeface (see [Keyboard](#wiki/keyboard)).

**Undo** steps back; **Done** applies.

## Glass

Every glass surface bends the wallpaper at its edge as far as the chosen Look says, where the device can. There is no switch for it. It needs Android 13 or newer and a wallpaper set through the launcher's own picker or `launcherctl wallpaper set`. Reduce idle activity, battery saver and Android's reduced motion turn the extra motion off.

## Cursor trail and terminal effect

* **Cursor trail:** Default, Motion blur, Railgun, Torpedo, Pixie dust or Comet.
* **Terminal effect:** None, CRT, CRT (green), CRT (amber) or TFT grid. It covers the status bar, dock and keyboard too, with the scanlines fixed to the screen.

Both are on **Settings → Terminal**, under Terminal display, and on the Terminal element in Look → Custom.

## Icon pack

The **Icon pack** tab previews each pack on your real dock. The row of pack tiles starts with **System**; a tap applies a pack. The **Pinned app icons only** switch limits the pack to the dock.

## Theme & fonts

**Theme & fonts** has no row in Settings. Reach it from Settings search (try "theme" or "fonts") or the command palette's **Look and feel settings**. It holds:

* **App theme:** System, Light or Dark.
* **Wallpaper colors** ("Match the launcher and terminal to the wallpaper.", on by default) builds the launcher and terminal palette from your wallpaper. It overrides manual terminal colours: turn it off, or apply a Termux:Styling scheme, to use your own. Then the dock, status bar, drawer, keyboard and palette follow `~/.termux/colors.properties` too (that part needs Android 11 or newer).
* **Terminal contrast:** **Softer · pastel**, **Default · system** or **Harder · punchy**, for the wallpaper palette. Greyed out while Wallpaper colors is off.
* **Wallpaper parallax:** the wallpaper pans a little as the places slide. On by default; needs a wallpaper set through the launcher's picker.
* **Wallpaper alignment:** lines up the wallpaper behind the launcher with the one on your screen.
* **Monochrome icons**, **Icon pack** and **Pinned-app icon pack**, the same choices as the Icon pack tab.
* **Surface style**, which opens the Look tab, and **Keyboard theme**.
* **Terminal fonts**; see [Fonts](#wiki/fonts).

## Tools that follow the terminal colours

On Theme & fonts, pick which command-line tools are recoloured whenever the palette changes: Starship, Helix, tmux, bat, Yazi, fzf, lazygit, Oh My Posh, Neovim, fish and herdr are built in. Turning one off puts its config back the way it was. You can add your own tool with a template; see [Config files](#wiki/config).

## Battery: Reduce idle activity

**Settings → App behavior → Reduce idle activity** ("Lazy mode. Pause idle animations and update status less often.", off by default) stops the launcher animating while you are only looking at it: the clock swaps its digits instead of folding them, a working window's rim holds lit instead of breathing, the CPU, memory and weather readings sample far less often, and nothing repaints until something on screen changes.

Full details: [Look and themes](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Look_And_Themes.md)
