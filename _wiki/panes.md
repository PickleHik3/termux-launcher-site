---
title: Panes & sessions
group: Terminal
order: 90
---
No tmux needed: the app is a multiplexer of its own. The hierarchy is **sessions → windows → panes**: a session is a fully separate workspace, a window is a tab inside it, and a pane is one shell. Everything below is reachable from the [Command palette](#wiki/command-palette), keybinds, extra keys, or the space-bar swipes on the built-in keyboard. The shortcuts below assume **Split-pane controls** is on; a few change meaning when it is off (see "With split panes off" below).

```clip
name: window-splitting
title: Window splitting
caption: One pane split in two, focus moved, then reshaped - no tmux running.
```

## Panes

* **Split**: side by side (`Ctrl+Alt+V`) or top and bottom (`Ctrl+Alt+H`); **New pane** (`Ctrl+Alt+Enter`) splits along the longer side. The new shell starts in the source pane's working directory and at its font size.
* **Move focus** between panes with `Alt+Arrow`. When there is no pane that way, the keys pass through to the shell.
* **Resize** by dragging a divider: put a finger in the gap between two panes and drag. The split snaps to the cell grid when you lift, with a tick. From the keyboard, `Ctrl+Alt+Shift+Arrow` resizes the focused pane; repeating it keeps resizing the same way. **Equalize pane dividers** in the palette resets a window's split ratios to even.
* **Close** the focused pane with `Ctrl+Alt+W`. A window always keeps at least one tiled pane.
* **Rename** the pane's shell from the palette (**Rename pane**).

## The pane's corner tab

**Hold a split pane's corner** for its tab:

* **Close**: close the pane.
* **Move**: drag the move icon onto another pane. Under `dwindle`, the pane takes the half you drop it on.
* **Maximise**: zoom the pane to fill the window. The tab stays out while maximised and offers **Restore pane**.

A lone pane's tab instead offers minimal mode, the **automatic tiling** switch, settings and help. Holding a corner shows the tab only; it does not resize.

**Zoom** without the tab: apply the `stack` layout (`Ctrl+Alt+L` cycles to it, or pick it by name in the palette) to maximise the focused pane while the rest stay alive behind it. It is temporary: saving a workspace stores the underlying pane tree, not the maximised view.

## Floating panes

`Ctrl+Alt+F` (or **Float / dock pane** in the palette) detaches the focused tiled pane above the layout. Move it by its **top-left corner**, like every other frame on the home screen, and resize it from the bottom-right corner. Tap its pill for **Close** and **Dock**. Run the action again to dock it back into the tree. Positions and sizes survive app restarts, and workspace save and load record them too. The last tiled pane in a window can't float.

**Scratchpad** (``Ctrl+Alt+` ``, backtick) is a floating pane of its own: it summons a dedicated shell above whatever you are doing, and toggling it again hides it without closing it. The shell keeps running and follows you across windows and sessions, handy for a music player or a quick calculation.

## Automatic tiling

**Next pane layout** (`Ctrl+Alt+L` or the palette) cycles a window through seven layouts: `grid`, `dwindle`, `tall`, `fat`, `horizontal`, `vertical` and `stack`. Applying one makes it the policy for that window, so later splits and closes re-tile the survivors to match. `dwindle` grows instead of rebuilding: a new pane halves the focused one along its longer side, and the dividers you have dragged stay put. Resizing or moving a pane by hand hands the window back to manual control (equalizing doesn't); applying any layout again puts it back under management.

Two settings in **Settings → Terminal → Sessions and panes** set this up for every window:

* **Automatic tiling**: every new window starts under `dwindle`.
* **Focus active pane**: "Enlarge the active pane and shrink the others." Works with whichever layout is in use.

## Windows

A window is like a tmux window:

* `Ctrl+Alt+C` opens a new one.
* `Ctrl+Alt+[` / `Ctrl+Alt+]` or `Ctrl+Alt+Left` / `Ctrl+Alt+Right` switch to the previous or next window.
* `Ctrl+Alt+1`…`9` jump to a window by number.
* `Ctrl+Alt+R` renames the current window.
* `Ctrl+Alt+X` closes the current window and every pane in it.

Its pill sits in the status row: tap to switch, hold to rename, tap its own `×` to close. Pills label themselves after the open file in your editor, the running process, or the working directory, in that order.

## Sessions

A session is a fully separate set of windows.

* Tap the chip at the left of the status row, or press `Ctrl+Alt+Shift+S` (**Toggle sessions**), for a quick sessions panel with rename and close buttons on every row.
* **Sessions** in the palette opens the full searchable session → window → pane tree. It searches working directories and cached process or title labels too.
* `Ctrl+Alt+Up` / `Ctrl+Alt+Down` step to the previous or next session, and `Ctrl+Alt+Shift+1`…`9` jump to a session by number.
* `Ctrl+Alt+Shift+C` starts a new session, `Ctrl+Alt+Shift+R` renames the current one, and `Ctrl+Alt+Shift+X` closes it.
* Cloning a session starts a fresh shell at the selected pane's directory; it doesn't copy the running process, scrollback or layout.

Window pills and the sessions browser also show **agent status** for coding agents: **Working**, **Needs you** or **Idle**. See [Terminal features](#wiki/terminal).

## With split panes off

Turn off **Split-pane controls** in **Settings → Terminal → Sessions and panes** to return to a single plain pane per session. Some shortcuts then change meaning: `Ctrl+Alt+1`…`9` jump to a session, `Ctrl+Alt+R` renames the pane, `Ctrl+Alt+C` starts a new session, and `Ctrl+Alt+Left` / `Ctrl+Alt+Right` close and open the sessions browser.

## Workspaces

**Save workspace** in the palette records the whole arrangement (sessions, windows, pane trees and their split ratios, floating panes and their bounds, focused panes, titles and working directories) to a named file, optionally with the foreground command in each pane too. Files live in `~/.termux/workspaces/` as JSON.

**Load workspace** offers **Append** to keep what is already open or **Replace** to remove it once the replacement terminals are ready. Recorded commands, if you saved them, are a separate confirmation, and each one starts again from the beginning in a fresh login shell; it is never resumed at its old point. Review a hand-edited workspace file before agreeing to run its commands.

## Programs controlling panes

A program running in the terminal can open, switch and close panes on its own if you allow it: **Let programs and agents control panes** in **Settings → Terminal → Sessions and panes**. See [Keybindings config](#wiki/keybindings) to script the same actions yourself.

Full details: [Panes, windows and sessions](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Panes_Windows_And_Sessions.md)
