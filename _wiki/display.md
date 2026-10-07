---
title: Linux display
group: Extras
order: 150
---
The Linux display is the third place on the pane wall, alongside Terminal and Widgets: a real X11
display where Linux desktop apps run beside the terminal. Once it is on, hold the terminal's
border, then drag sideways, or tap the screen glyph peeking in from the status bar's edge, to
reach it.

## Turn it on

The Display place is only on the wall while the display is switched on. Any of these turns it on:

- **Settings → Display → Display**.
- **Settings → Launcher mode → Terminal + Home + Display** ("Also run Linux desktop apps").
- The first-run card, or tapping a Linux app in the drawer.

Turning it on puts `termux-x11` on your `$PREFIX/bin`, so a display can be started from any shell:

```sh
termux-x11 :0 &
export DISPLAY=:0
```

or tap **Start display** on the Display place, which runs the same thing. Turning the display off
removes the commands and the place. If a display server is still running you are asked to
**Stop** it or **Leave it running**.

## Getting apps onto it

**Settings → Display → Linux apps → Set up Linux apps** ("Select apps and copy the install
command") builds the install command for you. Pick a **Source** (the Termux X11 repo for
individual apps, or a full Linux distro), tick what you want, and tap **Copy the command**. Paste
it into the terminal and press Enter; it installs everything, including the keyboard layouts and
fonts the display needs.

Apps installed inside a distro (a proot, via `proot-distro`) are the least tested path here: they
work, but treat them as the rougher edge of this feature. A whole desktop environment (XFCE, LXQt)
is catalogued the same way, under its own group in the drawer.

Once installed, apps appear in the app drawer with their own name and icon, beside your Android
apps. A tap starts the display if it is not running and opens the app on it, full size. An app
whose menu entry asks for a terminal opens in a terminal pane instead. The same **Linux apps**
page has **Show Linux apps in drawer**, **Hidden Linux apps**, **Window manager** and **Display
badge**.

## Mouse mode and the touchpad

The **Mouse mode** action (add it to the extra-keys row, the in-app keyboard, or a key chord)
swaps the keyboard for a touchpad the same size, for apps that expect a mouse:

- **One finger** moves the pointer; tap to click, hold (or tap-and-hold) then move to drag.
- **Two fingers** scroll, with a flick that keeps going; pinch to zoom; tap together for a right
  click.
- **Three fingers** tap for a middle click, or swipe left/right to switch windows and down to bring
  the keyboard back.
- A strip down the touchpad's trailing edge scrolls with one thumb.

Over a split keyboard, the touchpad stands in the gap so both halves keep typing. Tapping a text
field on the display brings the keyboard to the front without leaving mouse mode; the touchpad is
back the moment the field lets go.

## Display settings

**Settings → Display** is split into subpages:

| Subpage | What it holds |
| --- | --- |
| **Input** | **Touch**, **Use Android keyboard**, **OSK auto-show**, **Share the clipboard** |
| **Resolution and scaling** | **Resolution**, **Scale**, **Fixed size**, **Custom size**, **Scaling** (filtering), **Display density** |
| **Linux apps** | **Show Linux apps in drawer**, **Set up Linux apps**, **Hidden Linux apps**, **Window manager**, **Display badge** |
| **Startup** | **Start with the launcher**, **Start command**, **Connect new shells** |
| **Troubleshooting** | **Compatibility drawing**, **Swap colour channels** |

**Touch** has three modes. **Touchscreen** treats fingers as touches (scroll, pinch, drag) the way
a tablet would; apps that only understand a mouse still get clicks. **Trackpad** turns the whole
display into a laptop touchpad. **Direct touch** sends the same touches as Touchscreen without the
launcher's own pinch and keyboard behaviour layered on top.

In Touchscreen mode the keyboard follows text fields: tapping a text field on the display brings
the keyboard up, and tapping elsewhere puts it down again (**Settings → Display → Input → OSK
auto-show**). A keyboard you opened yourself stays open until you close it.

## GPU acceleration

The display server itself always draws in software, but apps you run on it, such as a game or a
browser, can be accelerated.

- **Settings → Display → Linux apps → Set up Linux apps → Graphics** shows **Graphics
  acceleration** (which driver profile fits this phone) and **Copy the graphics command**, which
  puts the install command and the environment variables on your clipboard.
- `termux-x11-gpu-setup` tries every profile with a short 3D test, keeps the fastest real GPU path,
  removes the losers, repeats the test inside a Debian proot if one is installed, and writes
  `~/.config/termux-launcher/x11-gpu.env`. Options: `--keep`, `--skip-proot`, `--yes`,
  `--display=N`. [tlstore](#wiki/tlstore) runs it for you as `tlstore display`.
- `launcherctl x11 gpu` says which profile fits; `launcherctl x11 gpu --env` prints the exports.

Export those variables before starting an accelerated app from a shell. Apps opened from the
drawer get the variables of the installed profile automatically.

## The Nix route

On the [Nix edition](#wiki/nix), graphical apps come from `nixpkgs` instead of a proot or the
Termux X11 repo: add the app and `xkeyboard-config` to your flake and `nix-on-droid switch` picks
them up for the drawer.

## When something is off

- **"No display is running" although you started one.** The keyboard layouts are missing: install
  them from **Set up Linux apps**, or run `termux-x11 :0` in the foreground to read its own message.
- **An app opens and closes again.** Usually a fresh distro missing fonts; **Set up Linux apps**
  installs them.
- **Nothing is accelerated.** Check `glmark2-es2`'s first lines for the renderer it picked:
  `llvmpipe` means the GPU variables are missing or do not fit this phone. Run
  `termux-x11-gpu-setup` or **Set up Linux apps → Graphics** again.

Full details: [The Linux display](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/X11_Display.md)
