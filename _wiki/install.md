---
title: Home Launcher
order: 10
---
# Launcher Features

* **Pin Apps to Dock:** Long press on the empty space in the dock to pin your favorite apps.
* **App actions on hold:** long press any app icon - in the dock or in the filtered row - for its Android shortcuts plus *App info*, *Uninstall*, *Change app icon*, *Change dock icon* and *Unpin*.

```clip
name: app-icon-menu
title: App actions
caption: Long-pressing a docked icon for its shortcuts, app info and icon options.
```

* **Folders:** drag and drop an icon onto another to create a folder.
* **Custom app icons:** for the entire app or just the pinned rows.
* **Quick reply to notifications:** for pinned apps which have an unread notification, swipe up on the app icon to respond to the message right there - the Android keyboard opens with it, send, and you're back at the terminal. It works using the "reply" field on the app's notification (needs notification access - see [Permissions](#wiki/launcherctl)).

```clip
image: assets/uploads/quick-response.gif
title: Quick reply
caption: Swiping up on a pinned app with an unread notification and replying without opening the app.
```

* **Most used apps page:** enables an additional page at the end of pinned app pages showing your most frequent non-pinned apps. Toggle it from Settings > Launcher & Apps.
* **Double tap the Alphabets Row to lock screen:** two options;

  * Shizuku - sends the power button keypress, so your phone's system screen-off animation plays and secure lock behaves normally.
  * Accessibility - the normal method all launcher apps use, via the Android accessibility service.

## App launching

You have a few options;

* **The A-Z row:** tap an alphabet to see filtered app icons; a normal tap opens the app.

  * Slide horizontally on the alphabets row and apps filter as you go - slide up to the icons row without lifting your finger, over to the app you want, and let go to launch.
  * Apps are ranked by usage, so over time your most launched apps sit closest to the alphabet - minimal finger movement.
  * More than one page of results? Hold your finger near the left/right edge and it auto-scrolls.

```clip
name: app-row-scrub
title: A-Z app row
caption: Sliding across the alphabet row - the icons above filter as you go, and letting go over one launches it.
```

* **From the prompt:** type the app search prefix (`%` by default, change it in Settings > Launcher & Apps > App Search prefix) followed by a query. The app row shows results; Enter opens the first, arrow keys navigate, or just tap an icon.

```clip
name: app-launching
title: Launch from the prompt
caption: Typing "%" and a query at the prompt searches installed apps; Enter opens the first result.
```

* **Command palette:** `Ctrl+Alt+Shift+P` or swipe up on the space bar - every installed app is a row, same usage ranking. See [Command Palette](#wiki/tour).
* **Direct keybinds:** bind a chord to any app in `~/.termux/termux-launcher-bindings.conf` - see [configs](#wiki/tmux).

## The app drawer

Swipe down on the app icons row for a traditional app drawer. Three layouts, in Settings > Launcher & Apps > App Drawer;

* Vertical scroll
* Horizontal paginated scroll
* Categories

```clip
todo: Screen recording - swiping down on the app icons row into the drawer, then cycling the three layouts (vertical, paginated, categories).
title: drawer layouts
caption: The app drawer's three layouts.
```

**About categories:** established launchers sort apps using server-side configs they tune on the fly. Termux Launcher has no such server, so you have 2 options under *Drawer layout > Sort apps into categories*;

* **On this device** - on devices that can run the gemma4-e2b or e4b local LLMs (models downloaded via [TAI](#wiki/tai)), it uses them to sort your apps into categories.
* **Copy prompt for ai chat** - if your device can't, or you just don't want a language model on your phone: copies a prompt with your installed app list to the clipboard. Paste it into any free AI chat online, then paste the response back into the app (or the persistent notification) for the same result.

```clip
todo: Screenshot - the "Sort apps into categories" choice in Settings with both options visible, or the paste-back step after an AI chat round trip.
title: category sorting
caption: Sorting the drawer into categories - on-device model or the copy-prompt round trip.
```
