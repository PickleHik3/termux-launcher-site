---
title: Home screen & apps
group: Everyday
order: 20
---
This page covers moving around the home screen and opening apps: the three places, the dock, the A-Z row, launching from the prompt and the app drawer. Widgets have their own page, [Widgets](#wiki/widgets).

## Places

The home screen is three places side by side: **Widgets** on the left, the **Terminal** in the middle (where it opens by default) and a Linux **Display** on the right.

* **Move between places:** **hold the page border** (the frame line on the top, bottom, left or right, not a corner) until you feel a tick, then drag sideways. A short drag springs back; a longer one, or a quick flick, lands on the neighbour.
* **Jump straight there:** the icon beside the clock names the place you are on, and the other two peek in from the status bar's edges on the side they slide in from. Tap a peeking icon to go there.
* **Keyboard:** swipe up from the bottom border of any place to raise the keyboard, down to put it away. No hold needed.
* **Status bar:** swipe down from the top border to open the status bar, up to fold it. See [Status bar](#wiki/status-bar).

Your session keeps running while you are away, and the terminal never resizes for the others, so nothing reflows in your shells when you move between places. Want every place to take the whole screen? See [minimal mode](#wiki/layout).

## The dock

* **Pin apps:** hold the empty space in the dock to pick your favourites, or manage the whole row from **Settings → Apps → Pinned apps** ("Choose and reorder dock apps."). The same row sits under **Settings → Apps → Dock**.
* **Reorder or unpin:** hold a pinned icon for its Android shortcuts plus **App info**, **Uninstall**, **Change app icon**, **Change dock icon** and **Unpin**, or drag it along the dock to move it.

```clip
name: app-icon-menu
crop: 0.13 0.48 0.74 0.32
title: App actions
caption: Long-pressing a docked icon for its shortcuts, app info and icon options.
```

* **Folders:** drag one icon onto another to make a folder.
* **Custom app icons:** for every app, or for the pinned row only. See [Look & themes](#wiki/look) for icon packs.
* **Quick reply:** when a pinned app has an unread notification, swipe up on its icon to answer right there. The Android keyboard opens with it; send, and you are back at the terminal. It uses the reply field on the app's notification and needs notification access (see [Notifications](#wiki/notifications)).

```clip
src: assets/docs/figures/quick-reply
formats: webm,mp4
size: 398x340
title: Quick reply
caption: Swiping up on a pinned app with an unread notification and replying without opening the app.
```

* **Most-used apps page:** an extra page after the pinned pages with your most-launched apps that are not pinned. Turn it on under **Settings → Apps → Dock → Most-used apps page** (off by default).
* **Double-tap to lock:** double-tap the A-Z row to turn the screen off. Choose the method under **Settings → Apps → Double-tap to lock**, **Lock method**: **Off** (the default), **Shizuku** (sends the power key, so your phone's own screen-off animation plays and secure lock behaves normally) or **Accessibility** (the method most launchers use; the screen can flicker as it turns off).

## Launching apps

**The A-Z row.** Tap a letter to see the apps under it; tap an icon to open it.

* Slide along the letters and the icons above filter as you go. Slide up to the icons without lifting your finger, over to the app you want, and let go to launch it.
* Apps are ranked by use, so your most-launched apps end up closest to the letters. Clear the learned ranking, without touching your pins, under **Settings → Apps → App search → Reset usage ranking**.
* More than one page of results? Hold your finger near the left or right edge and it scrolls.

```clip
name: app-row-scrub
crop: 0.13 0.62 0.74 0.20
title: A-Z app row
caption: Sliding across the alphabet row - the icons above filter as you go, and letting go over one launches it.
```

**From the prompt.** At an idle shell prompt, type the search prefix (`%` by default) and a query. The app row shows the results: Enter opens the first, the arrow keys move between them, or tap an icon. Change the prefix under **Settings → Apps → App search → App search prefix**.

```clip
name: app-launching
crop: 0.13 0.50 0.74 0.30
title: Launch from the prompt
caption: Typing "%" and a query at the prompt searches installed apps; Enter opens the first result.
```

**Command palette.** Press `Ctrl+Alt+Shift+P` or swipe up on the space bar. Every installed app is a row, with the same usage ranking. See [Palette & shortcuts](#wiki/command-palette).

**Bind an app to a key.** Find the app in the command palette, hold its row, then press the key combination you want (on a hardware keyboard, focus the row and press `Ctrl+Alt+Enter`). The binding is written to `~/.termux/termux-launcher-bindings.conf` and works at once. See [Config files](#wiki/config).

## The app drawer

Swipe down on the pinned apps row for a full-screen app drawer. On a left rail swipe right, and on a right rail swipe left. The gesture is the **Swipe down for app drawer** switch under **Settings → Apps**. **Settings → Apps → Drawer layout** chooses the layout: **Vertical**, **Horizontal pages** or **Categories**. The same page has:

* **Open keyboard automatically**: start typing a search as soon as the drawer opens.
* **Search keyboard**: use the Android keyboard, with its suggestions and swipe typing, for the drawer's search.
* **Category sorting** and **Re-sort apps**, below.

```clip
image: assets/docs/figures/drawer-vertical.webp
size: 720x794
title: Vertical
layout: trio
```

```clip
image: assets/docs/figures/drawer-pages.webp
size: 720x794
title: Horizontal pages
```

```clip
image: assets/docs/figures/drawer-categories.webp
size: 720x794
title: Categories
caption: The three drawer layouts under Settings → Apps → Drawer layout.
```

**Categories.** Established launchers sort apps with server-side lists. Termux Launcher has no server, so **Category sorting** ("Choose how apps are grouped.") offers two ways in its **Sort apps into categories** dialog:

```clip
svg: category-sorting
title: How apps get sorted
caption: Two ways to the same result: a local Gemma model, or a prompt you paste into any AI chat.
```

* **On this device**: a local Gemma model sorts your apps, and nothing leaves your phone. Which model runs depends on your phone's tier: E2B on Tier 2, E4B on Tier 3, and the option is unavailable on Tier 1 phones, which lack the memory. You can change the model per function in the Model Centre; see [On-device AI](#wiki/on-device-ai).
* **Copy a prompt for an AI chat**: copies a prompt with your installed-app list. Paste it into any AI chat, then paste the answer back for the same result. This sends your app list to that service.

Installed new apps since the last sort? **Re-sort apps** shows when it last ran and how many new apps are not sorted yet, and sorts only those. Once six or more are waiting, the drawer itself offers a nudge to sort them.

## Landscape

In landscape the dock becomes a vertical rail, on the left by default or on any edge you choose in [Layout](#wiki/layout), and the drawer uses a denser grid. Both stay clear of display cutouts and the system navigation bar.

```clip
src: assets/showcase/features/landscape-launcher
title: Landscape launcher
caption: The side dock rail, terminal and dense app drawer adapting to the wider display.
shape: wide
layout: full
```

Full details: [Home screen and apps](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Home_Screen_And_Apps.md)
