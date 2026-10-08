---
title: Layout & full screen
group: Everyday
order: 40
---
Layout is where things sit and how much of the screen they get: the status bar, the apps row, the A-Z index, the extra keys and the keyboard. The corner tab and the Layout editor set that; minimal mode and full screen take things away. For what things look like, see [Look & themes](#wiki/look).

## The corner tab

**Hold a corner** of a pane for its tab. Tap away from it to put it away. What it holds depends on the place:

* **Terminal, one pane:** **Appearance**, the minimal mode button, the automatic tiling toggle, **Open settings** and **?** for help on what you are touching.
* **Terminal, a split pane:** close, move, and maximise or restore that pane.
* **Widgets:** **Edit widgets**, **Add page**, **Appearance**, minimal mode and **?** (see [Widgets](#wiki/widgets)).
* **Display:** turn the display on or off, minimal mode, settings, **Appearance** and **?**.

## Open the Layout editor

Layout is a tab of **Appearance**. Open Appearance from **Settings → Appearance**, from the corner tab, or from the terminal's long-press menu, then pick **Layout** in the **Wallpaper | Look | Layout | Icon pack** pill at the top.

Home, Terminal and Display share one layout, so whatever you arrange applies to all three. Portrait and landscape each have their own layout; the toggle in the editor switches which one you are arranging.

## The Layout editor

The canvas, a picture of your screen, fills the editor. Under it is a sheet of fixed height. On a tablet in landscape the same controls sit in a side pane on the right instead, and the move control stops at the pane's left edge. The other orientation is drawn in your device's real shape, so a tablet is not shown as a phone outline.

* **Row A:** the **Portrait/Landscape** toggle, **Style: Docked / Floating**, and the eye-off **Hidden elements** button.
* **Row B:** **Corners** and **Margin**, or the keyboard's own tools while the keyboard is selected.
* **Undo** and **Done** sit in the top bar.

**Move a bar.** Press the status bar, the apps row, the A-Z index or the extra keys anywhere and drag it to any of the four edges. Dropping it between two others on the same edge sets their order. Or tap a bar to select it: it gets an outline and a four-arrow **Move** button whose menu lists the edges and **Hide**.

**Under the keyboard.** The apps row, the A-Z index or the extra keys can drop into the slot under the keyboard. They then stay at the bottom of the screen and the keyboard opens above them. The status bar always stands over the keyboard.

**Hide and restore.** Drop a bar on the eye-off button to hide it; the button shows how many are hidden. Tap eye-off to see hidden elements as tiles with a restore arrow: tap one to put it back on the edge it left, or drag it onto the canvas.

**The A-Z index** rides the pinned apps row while they share an edge; on another edge it stands on its own. It is either on an edge or hidden.

**The status bar** can go on any edge. At the bottom it grows upward from the dock; on a side it becomes a column of place badge, window chips and readings. Hide it to give the content its room: that is how a full-screen layout is built. See [Status bar](#wiki/status-bar).

**Heights, by handle.** Each is set per orientation by dragging on the canvas; a readout shows the value while you hold:

* the dock's inner edge sets **Dock** height;
* the keyboard's top edge sets **Keyboard** height;
* the bottom of the keys sets **Bottom padding**.

**The keyboard.** Select it and three **Keyboard type** chips appear (docked, floating, split), with **Key radius** under them in Row B, set per orientation. To turn the built-in keyboard off, drag it onto eye-off; its tile in the hidden row turns it back on. This one switch covers every place and both orientations, and is the same as **Keyboard on/off** in the command palette and on the extra-keys row. See [Keyboard](#wiki/keyboard).

**The widget grid** (Home only): a round handle on the corner of the first cell resizes the grid in whole cells, per orientation. See [Widgets](#wiki/widgets).

**Style.** **Docked** joins the bars into one flush glass frame with the pane as a rounded insert. **Floating** gives each bar its own card. **Corners** and **Margin** apply in both styles.

On the canvas the apps row shows seven placeholder icons; the extra keys show your real keys. Every bar and handle is also reachable with TalkBack, with move, hide, show and resize actions.

**Done** keeps your changes and **Undo** steps back. Pressing Back with unsaved changes offers **Keep editing** or **Discard**, plus **Save** when a wallpaper change is pending.

## Border gestures

* **Hold the page border** and drag sideways to move between places.
* **Swipe up from the bottom border** to open the keyboard, down to close it. This also turns the keyboard back on if you switched it off.
* **Swipe down from the top border** to open the status bar, up to fold it, while the bar is along the top.

## Minimal mode

Minimal mode is a second saved layout. It starts with only the content showing: the status bar, the apps row, the A-Z index, the extra keys and the keyboard go away, and the terminal, widgets or display take the room. Open Layout while minimal mode is on to choose what it keeps.

Everything else works as in your normal layout: a split shows all its panes, and the status bar and the borders answer the same gestures.

* **Turn it on or off:** hold a corner and tap the four-outward-corners button; the same button, now pointing inward, turns it off. Nothing else does.
* It is one mode for the whole launcher, it survives restarts, and moving between places never turns it off.
* The keyboard goes away when you enter it. Raise it with a swipe up from the bottom border or a tap on the terminal; it goes down again when you move to another place.

## Full screen

**Settings → Terminal → Full screen** ("Hide system bars while using the launcher") hides Android's own status and navigation bars.

## Pane padding

**Settings → Terminal → Extend edge colors** ("Match pane padding to nearby terminal colors.", on by default) fills the space between the text and a pane's rounded border with the colour of the nearest edge, so a full-screen program reaches the border instead of stopping short of it.

Full details: [Layout and full screen](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Layout_And_Full_Screen.md)
