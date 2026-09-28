---
title: Panes & sessions
group: Terminal
order: 90
---
No tmux needed - the app is one natively. The hierarchy is **sessions → windows → panes**: a session is a fully separate workspace, a window is a tab inside it, and a pane is one shell. Everything below is reachable from the [Command palette](#wiki/command-palette), keybinds, extra keys, or the space-bar swipes on the built-in keyboard.

```clip
name: window-splitting
title: Window splitting
caption: One pane split in two, focus moved, then reshaped - no tmux running.
```

## Panes

* **Split** - side by side (`Ctrl+Alt+V`) or top and bottom (`Ctrl+Alt+H`); a plain new pane (`Ctrl+Alt+Enter`) splits along the longer side. The new shell starts in the source pane's working directory and at its font size.
* **Move focus** between panes with `Alt+Arrow` (passed to the shell when there's no pane that way).
* **Resize** by dragging a divider, or `Ctrl+Alt+Shift+Arrow` from the focused pane; repeating the shortcut keeps resizing the same way. *Equalize panes* in the palette resets a window's split ratios back to even.
* **Close** the focused pane with `Ctrl+Alt+W`. A window always keeps at least one tiled pane.
* **Zoom** a pane to fill the window without losing the others - apply the `stack` layout (`Ctrl+Alt+L` cycles to it, or pick it by name in the palette) to maximise the focused pane while the rest stay alive and hidden behind it. It's temporary: saving a workspace stores the underlying pane tree, not the maximised view.

## Floating panes

`Ctrl+Alt+F` (or *Float / dock pane* in the palette) detaches the focused tiled pane above the layout. Drag its top handle to move it and the bottom-right grip to resize it; tap its pill for close and dock buttons. Run the action again to dock it back into the tree. Positions and sizes survive app restarts, and workspace save/load records them too. The last tiled pane in a window can't float.

**Scratchpad** (`Ctrl+Alt+` ` `, backtick) is a floating pane of its own: it summons a dedicated shell above whatever you're doing, and toggling it again hides it without closing it - the shell keeps running and follows you across windows and sessions, handy for a music player or a quick calculation.

## Automatic tiling

*Next pane layout* (`Ctrl+Alt+L` or the palette) cycles a window through seven layouts: `grid`, `dwindle`, `tall`, `fat`, `horizontal`, `vertical` and `stack`. Applying one makes it the policy for that window, so later splits and closes re-tile the survivors to match - `dwindle` is the one that grows instead of rebuilding: a new pane halves the focused one along its longer side, and the dividers you've dragged stay put. Hand-resizing or moving a pane drops the retained layout back to manual control (equalizing doesn't - it stays consistent with a layout still being in charge); applying any layout again puts the window back under management.

Two settings turn this on by default rather than one action at a time, both in **Settings → Terminal → Sessions and panes**:

* **Automatic tiling** - every new window starts under `dwindle`.
* **Spotlight the active pane** - the pane you're working in takes most of the screen and the rest shrink aside, whichever layout is in use.

## Windows and sessions

A window is like a tmux window: `Ctrl+Alt+C` opens a new one, `Ctrl+Alt+[` / `Ctrl+Alt+]` switch, and its pill sits in the status row - tap to switch, hold to rename, tap its own `×` to close. Pills label themselves after the open file in your editor, the running process, or the working directory, in that order.

A session is a fully separate set of windows. Tap the chip at the left of the status row for a quick sessions panel with visible rename and close buttons on every row, or open **Session browser** in the palette for the full searchable session → window → pane tree - it searches working directories and cached process or title labels too. Cloning a session starts a fresh shell at the selected pane's directory; it doesn't copy the running process, scrollback, or layout.

`Ctrl+Alt+1`…`9` jump to a window by number, `Ctrl+Alt+Shift+1`…`9` to a session by number, and `Ctrl+Alt+Up` / `Ctrl+Alt+Down` step to the previous or next session.

## Workspaces

*Save workspace* in the palette records the whole arrangement - sessions, windows, pane trees and their split ratios, floating panes and their bounds, focused panes, titles and working directories - to a named file, optionally with the foreground command in each pane too. Files live in `~/.termux/workspaces/` as JSON.

*Load workspace* offers **Append** to keep what's already open or **Replace** to remove it once the replacement terminals are ready. Recorded commands, if you saved them, are a separate confirmation, and every one starts again from the beginning in a fresh login shell - it's never resumed at its old point. Review a hand-edited workspace file before agreeing to run its commands.

## Programs controlling panes

A program running in the terminal can open, switch and close panes on its own, if you allow it: **Let programs and agents control panes** in **Settings → Terminal → Sessions and panes**. See [Keybindings config](#wiki/keybindings) to script the same actions yourself.

If you want none of this, turn off **Split-pane controls** in the same settings screen to return to a single plain pane.
