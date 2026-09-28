---
title: Linux display
group: Extras
order: 150
---
The Linux display is the third place on the pane wall, alongside Terminal and Widgets: a real X11
display where Linux desktop apps run beside the terminal. Swipe left from the terminal, or tap the
screen glyph at the edge of the status bar, to reach it.

## Turn it on

Swipe to the Display place and tap **Turn on**, or switch it on at **Settings → Display**. This
puts `termux-x11` on your `$PREFIX/bin`, so a display can be started from any shell:

```sh
termux-x11 :0 &
export DISPLAY=:0
```

or tap **Start display** on the Display place, which runs the same thing. Turning the display off
in Settings removes the commands again; the place itself stays and offers to turn it back on.

## Getting apps onto it

**Settings → Display → Setup GUI Apps** builds the install command for you. Pick a source - the
Termux X11 repo for individual apps, or a full Linux distro - tick what you want, and tap **Copy
the command**. Paste it into the terminal and press Enter; it installs everything, including the
keyboard layouts and fonts the display needs.

Apps installed inside a distro (a proot, via `proot-distro`) are the least tested path here: they
work, but treat them as the rougher edge of this feature. A whole desktop environment (XFCE, LXQt)
is catalogued the same way, under its own group in the drawer.

Once installed, apps just appear in the app drawer with their own name and icon, beside your
Android apps. A tap starts the display if it isn't running and opens the app on it, full size - the
same as launching anything else. An app whose menu entry asks for a terminal opens in a terminal
pane instead.

## Mouse mode and the touchpad

The **Mouse mode** action (add it to the extra-keys row, the in-app keyboard, or a key chord)
swaps the keyboard for a touchpad the same size, for apps that expect a mouse:

- **One finger** moves the pointer; tap to click, hold (or tap-and-hold) then move to drag.
- **Two fingers** scroll, with a flick that keeps going; pinch to zoom; tap together for a right
  click.
- **Three fingers** tap for a middle click, or swipe left/right to switch windows and down to bring
  the keyboard back.

Tapping a text field on the display brings the keyboard to the front without leaving mouse mode;
the touchpad is back the moment the field lets go.

## Scale, touch and typing

**Settings → Display** also holds the display's scale, resolution and **Touch** mode.
**Touchscreen** treats fingers as touches (scroll, pinch, drag) the way a tablet would; apps that
only understand a mouse still get clicks. **Trackpad** turns the whole display into a laptop
touchpad. **Direct touch** sends the same touches as Touchscreen without the launcher's own pinch
and keyboard behaviour layered on top.

The keyboard follows text fields: in Touchscreen mode, tapping a text field on the display brings
the keyboard up, and tapping elsewhere puts it down again (**Settings → Display → OSK
auto-show**). A keyboard you opened yourself stays open until you close it.

## GPU acceleration

The display server itself always draws in software, but apps you run on it - a game, a browser -
can be accelerated. **Settings → Display → Setup GUI Apps → Graphics** works out which driver
profile fits this phone and puts the install command and the environment variables on your
clipboard. Export those variables before starting an accelerated app; the launcher does this for
you automatically when you open an app from the drawer.

## The Nix route

On the [Nix edition](#wiki/nix), graphical apps come from `nixpkgs` instead of a proot or the
Termux X11 repo - add the app and `xkeyboard-config` to your flake and `nix-on-droid switch` picks
them up for the drawer.

## When something is off

- **"No display is running" although you started one.** The keyboard layouts are missing - install
  them from **Setup GUI Apps**, or run `termux-x11 :0` in the foreground to read its own message.
- **An app opens and closes again.** Usually a fresh distro missing fonts; **Setup GUI Apps**
  installs them.
- **Nothing is accelerated.** Check `glmark2-es2`'s first lines for the renderer it picked -
  `llvmpipe` means the GPU variables from **Setup GUI Apps → Graphics** are missing or don't fit
  this phone.
