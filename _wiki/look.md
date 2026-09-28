---
title: Look & themes
group: Everyday
order: 50
---
Look controls what things look like - colours, blur, icons, glass. For where things sit instead, see [Layout](#wiki/layout).

## The Appearance editor

Open **Appearance** from a corner tab or the long-press menu, on the real home screen. Tap the floating palette to style every surface at once, or tap one surface - dock, keyboard, status panel, terminal - to style it on its own. Home, Terminal and Display share the same look, so whatever you change here changes all three.

```clip
src: assets/showcase/features/surface-editor
title: Surface editor
caption: Previewing clock styles and switching among the live dock, keyboard, status and terminal surfaces.
```

## Base vs independent values

Surfaces follow shared **Base** values by default. Change a value on one surface directly and that surface becomes independent of Base for that value; tap **Follow Base** on it to hand the value back.

## Colour mode and wallpaper colours

* **Color mode:** follow the system, force light, or force dark.
* **Use wallpaper colors:** build the whole launcher palette from your Android wallpaper.
* **Interface colors:** choose whether the dock, status bar, app drawer, in-app keyboard and command palette follow the wallpaper palette or the terminal colour scheme in `~/.termux/colors.properties` instead. Needs Android 11 or newer, and a scheme already on disk - apply one from Termux:Styling first.
* **Terminal contrast:** Softer, Default or Harder, for the generated wallpaper palette.

## Tools that follow the terminal colours

Pick which command-line tools get recoloured whenever the palette changes: Starship, Helix, tmux, bat, Yazi, fzf, lazygit, Oh My Posh, Neovim, fish and herdr are built in. Turning one off puts its config back the way it was. You can add your own tool with a template - see [Config files](#wiki/config).

## Fancier Glass

Every glass surface bends the wallpaper at its edge and catches a light along its rim. It needs a wallpaper set from inside Termux Launcher, is hidden below Android 13, and is tuned in the Appearance editor above. Turn it on under **Settings → Terminal → Fancier Glass**.

## Icon packs and monochrome icons

* **Use monochrome icons:** render app icons in grayscale.
* **Icon pack:** use icons from an installed launcher icon pack.
* **Pinned-app icon pack:** an optional override for just the pinned apps; otherwise they use the global icon pack.

All three live under **Settings → Look**.

## Keyboard colours

The built-in keyboard's own theme, colours and typeface are covered on the [Keyboard](#wiki/keyboard) page.

## Battery: Lazy mode

**Settings → Terminal → Lazy mode** stops the launcher animating while you're only looking at it: the clock swaps its digits instead of folding them, a working window's rim holds lit instead of breathing, the CPU/memory/weather readings sample far less often, and nothing repaints until something on screen actually changes. It's worth turning on, and a candidate to become the default - report anything that looks stuck or stale with it on.
