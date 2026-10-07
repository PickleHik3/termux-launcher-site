---
title: Widgets
group: Everyday
order: 25
---
The Widgets page is a grid of home-screen widgets beside the terminal: Android widgets from your apps, and eleven built-in ones drawn in the launcher's own style. This page covers reaching it, adding and arranging widgets, and sizing the grid.

## Turn it on and get there

The page is switched by **Home widgets** ("Show a widget page beside the terminal.") under **Settings → Apps**, in the Home app section. It is on by default, and the **Terminal** launcher mode turns it off (see [Get started](#wiki/get-started)).

Widgets is the place to the left of the terminal. To get there:

* **Hold the page border** (any side, not a corner) until you feel a tick, then drag sideways.
* Or tap the peeking house icon at the edge of the status bar.
* Or bind **Go to Widgets** to an extra key, a keyboard key or a chord.

The built-in keyboard goes away on Widgets, since nothing there takes typing, and comes back when you return to the terminal.

## Add a widget

1. **Hold an empty spot** on the grid. An empty page says "Long-press to add widgets".
2. Choose **Add widget**. The same menu has **Edit widgets** and **Remove page**.
3. Pick a widget in the picker. The launcher's own widgets come first, under **Termux Launcher**.

**Placing on another page.** Picker cards stay live even when the page on screen is full. Tapping one with no room says "No room on this page. Hold the widget to place it on another page." **Hold a card** to pick the widget up, then rest it at the trailing edge of the page for a moment: the grid turns to the next page, or makes a new one past the last. Let go where you want it. Only a widget bigger than the whole grid is greyed out ("too big for this grid").

## Built-in widgets

Listed first in the picker under **Termux Launcher**:

* **Analog clock** and **Digital clock**
* **Agenda** and **Calendar** (a month view)
* **Weather**, **Battery** and **System** (device stats)
* **Media** (what is playing, with controls) and **Notifications**
* **Tasks**, a task list kept in `~/notes/tasks.md`
* **Scratchpad**, a note kept in `~/notes/scratch.md`; a tap opens the file in your editor

A few details:

* The widgets that read your calendar, your notifications or what is playing ask for that access on the card itself. Notifications and Media use the same notification access as the status bar (see [Notifications](#wiki/notifications)).
* Tasks and Scratchpad are plain Markdown files, so the shell sees exactly what the card shows.
* The clocks and the two file widgets take settings (time zones, the file path) from a cog that appears while you are editing the page.

**Built-in widget style** under **Settings → Apps** chooses how they are drawn: **Tonal** (soft cards with rounded corners) or **Pane** (squared cards with a hairline rim, like a terminal pane).

## Move and resize

* **Hold a widget**, then drag it to move it, or drag its edges to resize it.
* Drop it on top of others and they slide aside into free space. With no room for them, the widget takes the nearest free spot instead.
* **Swipe inside the grid** to reach the page's other pages.

## The corner tab

**Hold a corner** of the Widgets page for its tab:

* **Edit widgets** (pencil): every widget on the page is outlined, and a tap on one picks it up to move or resize.
* **Add page** (+).
* **Appearance**, the minimal mode button and **?** for help, as on every place.

## Grid size

While you are editing, the corner tab reads the grid's size as columns × rows. Tap it for **Columns** and **Rows** wheels; the widgets rearrange as you turn them. Tap the tick (**Keep changes**) or the cross (**Discard changes**).

The grid can also be sized in the Layout editor: on Home, a round handle on the corner of the first cell resizes the grid in whole cells, separately for portrait and landscape. See [Layout & full screen](#wiki/layout).

The grid is capped at what the screen fits. Widgets that no longer fit a smaller grid move to free space or a new page rather than being dropped.

Full details: [Widgets](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Widgets.md)
