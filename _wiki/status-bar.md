---
title: Status bar
group: Everyday
order: 28
---
The status bar is the launcher's own bar: a clock, the row of sessions and windows, and readings for CPU, memory and weather. This page covers what each part shows, how to open and fold it, and where to set it up. Its settings are under **Settings → Status bar**. Pinned notifications in the bar are on [Notifications](#wiki/notifications).

```clip
image: assets/screenshots/clock-status-pane.webp
title: Expanded clock and status pane
caption: The open status bar: the clock above the session badge, a window chip and the CPU, RAM and weather readings.
```

## Open and fold it

* **Swipe down from the top border** of the page to open the bar with your finger; **swipe up** to fold it back to its slim form. Let go past about a third of the way, or flick, and it finishes on its own.
* A drag across the bar itself folds and unfolds it too.
* A swipe that starts in Android's own strip at the very top of the screen still pulls down the notification shade.

The top-border swipe works on every place, minimal mode included, while the bar stands along the top. With the bar on another edge or hidden, the top border only pages.

## The status row

The row under the clock belongs to the place on screen. On the terminal:

* **Sessions badge:** the numbered badge on the left. Tap it to open the sessions panel. See [Panes & sessions](#wiki/panes).
* **Window chips:** one per window. Tap one to switch to it, and swipe along the chips to scroll them. Tap `+` to open a new window.
* **CPU, memory and weather chips:** tap one for its detail card: per-core load and top processes, memory use, or the forecast with an Open-Meteo credit. CPU and memory describe the whole device, not only the shell.
* **Mouse mode:** a small mouse at the end of the readings means mouse mode is on. Tap it to turn mouse mode off. See [Terminal features](#wiki/terminal).

On the Display place the row lists the apps open on the display, and a tap brings one forward. On Widgets it holds only the readings and the weather.

**Place icons.** The icon beside the clock names the place you are on: a house for Home, a prompt for Terminal, a screen for Display. The other two peek in from the bar's edges; tap one to go there.

## What a window chip tells you

A chip shows one short item: the open file in an editor, the running process, or the directory of an idle shell. A mark in the icon's place tells you what the window is doing:

* a **ring** while its foreground process is busy;
* a **bell** once it rang the terminal bell or asked for attention;
* a **tick** or a **cross** once a command finished while you were not looking.

A background window that rings gets a pulsing rim until you focus it.

**Agent status.** When a coding agent runs in a window, a small dot sits in front of the chip's label: the accent colour while it is **Working**, a warm colour when it **Needs you** (a permission prompt or a question), and a muted colour when it is **Idle**. The sessions panel shows the same, as `claude · Working`. The launcher recognises common agents (Claude Code, Codex, opencode, Gemini, aider and others) from the screen; for exact states, `launcherctl agent install-hooks` writes Claude Code hooks that report them with `launcherctl agent working|blocked|idle|clear`.

## Clock

* **Face and alignment:** open **Appearance → Look**, choose **Custom**, tap the status bar and tap **Clock**. Faces: Flip, LCD, Minimal, LED matrix, Tape and Slab; alignment Left, Center or Right. See [Look & themes](#wiki/look).
* **12-hour time** ("Show AM and PM."): **Settings → Status bar → Clock**. Off by default.
* In the open bar, tap the clock to open Android's clock app, or the cog to open Settings.

## Readings and weather

Under **Settings → Status bar**:

* **CPU usage** and **Memory usage**, under Indicators. Both off by default.
* **Weather**, on by default.
* **Location**: tap it to search for a city ("Search for a city"), or choose **Use device location**. While a city is set, the launcher asks for no location permission, and a change refetches the weather straight away. With device location, weather needs location permission.
* **Fahrenheit** ("Show °F instead of °C.").

## On any edge

The status bar does not have to sit at the top. In the Layout editor ([Layout & full screen](#wiki/layout)) drag it to any edge, separately for portrait and landscape:

* **Bottom:** it grows upward from the dock, clock at its foot and window chips along its upper edge.
* **Left or right:** a narrow column with the place badge, one chip per window and the readings stacked down it.
* **Hidden:** the clock, weather and window chips go with it and the content takes its room. This is how a full-screen layout is built.

Full details: [Status bar](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Status_Bar.md)
