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
* **Quick reply to notifications:** for pinned apps which has an unread notification, you can swipe up on the app icon to respond to the message. It works using the "reply" field available on the app's notification. 

> ![](/termux-launcher-site/assets/uploads/quick-response.gif)

* **Most used apps page:** enables an additional page at the end of pinned app pages showing your most frequent non-pinned apps. Toggle it from Setting > Launcher & Apps
* **Double tap the Alphabets Row to Lock screen:** You have 2 options;

  * Shizuku - Sends the power button keypress, it will show your phone's system screen off animation. Plays well with secure lock. 
  * Accessibility - Normal  method which all launcher apps  use, uses android accessibility service. 
* **App Launching:** you have 3 options;

1. * Tap on an alphabet, to see filtered app icons, normal tap opens it. 
   * Slide horizontally on the alphabets row, you will see apps being filtered - slide upward to the app icons row  - without lifting your finger slide towards the app you want to open - having it in focus let go to launch the app. 
   * Swipe upwards on an alphabet,  slide over to the app you want to  launch, let go to launch. 
   * apps are ranked by frequency of use, so over time your most launched apps will be centered above the alphabet you are in, it should make it easier to reach. 
   * if there is more than one page of apps, slide your finger near the left/right edges and keep holding until it automatically scrolls. 
   * in the terminal type "%"character followed by app search query

     * Pressing enter opens the first app search result
     * use arrow keys to navigate between search results, enter opens app. 
     * if you don't launch an app, it the search will be invalidated after a short time.

```clip
name: app-row-scrub
title: A-Z app row
caption: Sliding across the alphabet row - the icons above filter as you go, and letting go over one launches it.
```

```clip
name: app-launching
title: Launch from the prompt
caption: Typing "%" and a query at the prompt searches installed apps; Enter opens the first result.
```

1. **Command Palette:** The app features a command palette triggered by either "Ctrl + Shift + Alt + P" or swipe up from the space bar key of in-app keyboard. 

   * Launch apps
   * Shell controls 
   * Read about the command palette in more detail on the [Command Palette](#wiki/tour) page.
