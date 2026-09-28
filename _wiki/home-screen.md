---
title: Home screen & apps
group: Everyday
order: 20
---
## Places

The home screen is three places side by side: **Widgets** on the left, the **Terminal** in the middle (where it opens by default) and a Linux **Display** on the right.

Hold the frame around any of them - the top, bottom, left or right edge, not a corner - until you feel a tick, then drag sideways to slide to the next place. A short drag springs back; a longer one, or a quick flick, lands you on the neighbour. The status bar shows where you are: the icon beside the clock names your current place, and the other two peek in from the bar's edges on the side they'd slide in from - tap a peeking icon to jump straight there.

Your session keeps running while you're away, and the terminal never resizes for the others, so nothing reflows in your shells when you move between places.

Want every place to take the whole screen instead? See [minimal mode](#wiki/layout).

## The dock

* **Pin apps:** long press the empty space in the dock to pick your favorites, or manage the whole row from **Settings → Apps → Edit pinned apps**.
* **Reorder or unpin:** long press a pinned icon for its Android shortcuts plus *App info*, *Uninstall*, *Change app icon*, *Change dock icon* and *Unpin* - or just drag it along the dock to move it.

```clip
name: app-icon-menu
title: App actions
caption: Long-pressing a docked icon for its shortcuts, app info and icon options.
```

* **Folders:** drag one icon onto another to create a folder.
* **Custom app icons:** for the entire app or just the pinned rows.
* **Quick reply to notifications:** for pinned apps with an unread notification, swipe up on the app icon to respond right there - the Android keyboard opens with it, send, and you're back at the terminal. It uses the "reply" field on the app's notification (needs notification access - see [Notifications](#wiki/notifications)).

```clip
image: assets/uploads/quick-response.gif
title: Quick reply
caption: Swiping up on a pinned app with an unread notification and replying without opening the app.
```

* **Most used apps page:** an extra page at the end of the pinned pages showing your most frequent non-pinned apps. Toggle it under **Settings → Apps → Most-used apps page**.
* **Double tap the A-Z row to lock the screen:** two backends -

  * Shizuku - sends the power button keypress, so your phone's own screen-off animation plays and secure lock behaves normally.
  * Accessibility - the normal method most launcher apps use, via the Android accessibility service, though the screen can flicker as it turns off.

## App launching

* **The A-Z row:** tap a letter to see filtered app icons; a normal tap opens the app.

  * Slide horizontally on the alphabets row and apps filter as you go - slide up to the icons row without lifting your finger, over to the app you want, and let go to launch.
  * Apps are ranked by usage, so over time your most launched apps sit closest to the alphabet - minimal finger movement. Clear the learned ranking (without touching your pins) under **Settings → Apps → Reset usage ranking**.
  * More than one page of results? Hold your finger near the left/right edge and it auto-scrolls.

```clip
name: app-row-scrub
title: A-Z app row
caption: Sliding across the alphabet row - the icons above filter as you go, and letting go over one launches it.
```

* **From the prompt:** type the app search prefix (`%` by default, changeable under **Settings → Apps → App search prefix**) followed by a query at an idle shell prompt. The app row shows results; Enter opens the first, arrow keys navigate, or just tap an icon.

```clip
name: app-launching
title: Launch from the prompt
caption: Typing "%" and a query at the prompt searches installed apps; Enter opens the first result.
```

* **Command palette:** `Ctrl+Alt+Shift+P` or swipe up on the space bar - every installed app is a row, same usage ranking. See [Palette & shortcuts](#wiki/command-palette).
* **Bind an app to a key:** find the app in the command palette, long-press its row, then press the key combination you want (or, on a hardware keyboard, focus the row and press `Ctrl+Alt+Enter`). It's written into `~/.termux/termux-launcher-bindings.conf` and takes effect immediately - see [Config files](#wiki/config).

## The app drawer

Swipe down on the pinned apps row for a full-screen app drawer. Three layouts, under **Settings → Apps → App drawer**:

* Vertical scroll
* Horizontal paginated scroll
* Categories

```clip
src: assets/showcase/features/app-drawer-layouts
title: App drawer layouts
caption: Switching among the vertical, horizontal-paged and category drawers on the current dev build.
```

**About categories:** established launchers sort apps using server-side configs they tune on the fly. Termux Launcher has no such server, so you have 2 options under the drawer's *Sort apps into categories*:

```clip
image: assets/screenshots/drawer-category-sorting.webp
title: Category sorting choices
caption: Run Gemma on-device, or copy a prompt to an AI chat and paste the result back.
```

* **On this device** - on devices that can run the gemma4-e2b or e4b local LLMs (models downloaded via [On-device AI](#wiki/on-device-ai)), it uses them to sort your apps into categories.
* **Copy prompt for ai chat** - if your device can't, or you just don't want a language model on your phone: copies a prompt with your installed app list to the clipboard. Paste it into any free AI chat online, then paste the response back into the app for the same result.

Installed a batch of new apps since the last sort? **Re-run categorization** counts what's waiting and offers to add them once more than five have piled up, without redoing the rest.

## Home screen widgets

Go to Widgets (swipe from the terminal, or tap the peeking house icon) for a grid of Android home-screen widgets.

* **Add one:** long-press an empty cell.
* **Move or resize:** long-press a widget, then drag it, or drag its edges to resize. Drop it on top of another and both slide aside into free space; with no room, it takes the nearest free spot instead.
* **More pages:** swipe inside the grid to reach the page's neighbours.
* **Grid size:** tap the small tab at a page's edge for its settings and an edit button; while editing, every widget on the page is outlined and the tab shows the grid's columns and rows as two numbers you can drag to resize it live. The same two numbers are also sliders in the Layout editor, set separately for portrait and landscape - see [Layout](#wiki/layout). Widgets that no longer fit a smaller grid move to free space or a new page rather than being dropped.

The keyboard stays out of the way on Widgets - nothing there takes typing - and comes back as soon as you move to the terminal.

## Landscape

In landscape, the dock becomes a vertical rail on the side you chose in Layout, and the drawer uses a denser grid. Insets keep both surfaces clear of display cutouts and the system navigation bar.

```clip
src: assets/showcase/features/landscape-launcher
title: Landscape launcher
caption: The side dock rail, terminal and dense app drawer adapting to the wider display.
shape: wide
layout: full
```
