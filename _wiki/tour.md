---
title: Feature tour
order: 18
---

This is the current Termux Launcher surface, captured live on the Nothing phone used for development. Start with the core launcher; every integration later on this page is optional.

## Watch the first-launch tour

<video controls muted playsinline preload="metadata" aria-label="Seven-step Termux Launcher onboarding walkthrough">
  <source src="assets/onboarding/recordings/onboarding-tour.mp4" type="video/mp4">
  Your browser cannot play this video. The same flow is described below.
</video>

## Terminal-first Home

Your active terminal is the wallpaper, workspace, and control surface. Normal Termux sessions, packages, files, selection, URLs, and Extra Keys remain available. tmux can keep sessions, panes, and status widgets alive across app switches.

![Live terminal Home with tmux status widgets, dock, A–Z navigation, and keyboard](assets/onboarding/screenshots/01-home-terminal.webp)

The native terminal workspace supports sessions, windows, tiled panes, and floating panes. Choose **Float / dock pane** in the command palette or press `Ctrl+Alt+F`. Move a floating pane with its slim top handle and resize it from the bottom-right grip. Long-press and drag inside the terminal still sends mouse drag reporting to the running program. Toggle the action again to return the pane to the tiled tree. One pane must remain tiled in each window.

Floating positions and sizes survive activity recreation and workspace save and restore. Session working directories inside the Termux home display as `~` or `~/subdirectory`. The session-switch chip counts launcher sessions and appears only when you switch sessions, not when you create another pane or window in the current one.

The command palette uses one glass rectangle with the search row at the top. Its result count and breadcrumb sit at the right of that row, with six frequent-action keycaps below. Its corners follow the dock capsule.

## Open and organize Android apps

- Tap pinned icons for one-touch launch.
- Type `%` plus a name to filter from terminal input.
- Drag across A–Z to narrow the catalog; swipe upward to launch the highlighted result.
- Long-press icons to pin, move, group into folders, choose shortcuts, change icons, open app info, or uninstall where Android allows it.
- Enable a Most used page if you prefer learned ranking next to explicit pins.
- Discover cloned/work-profile launch targets when Android exposes them to the launcher.

![Terminal app search for maps showing the live filtered dock](assets/onboarding/screenshots/02-terminal-app-search.webp)

The live recording below shows `%` filtering followed by the long-press menu. No app is opened or changed.

<video controls muted playsinline preload="metadata" aria-label="Live launcher app search and long-press action menu">
  <source src="assets/onboarding/recordings/launcher-search-and-actions.mp4" type="video/mp4">
  Your browser cannot play this video. The same controls are listed above.
</video>

![Long-press actions for an app, including app info and icon customization](assets/onboarding/screenshots/09-app-actions.webp)

## Style one connected surface

Wallpaper-derived Material colors can flow through the terminal, ANSI palette, cursor, dock, built-in keyboard, and tmux plugin. Appearance controls include theme mode, wallpaper handling, terminal opacity, blur, glass opacity and grain, dock height, icon count, labels, icon normalization, monochrome/material icons, shadows, and icon packs.

![Appearance screen with Material colors, terminal opacity, and live dock glass controls](assets/onboarding/screenshots/04-appearance-controls.webp)

The edit-surface popup reopens the Dock, Keyboard, Status, or Other section used last.

## Pick your keyboard

Fresh installs use the launcher’s built-in terminal keyboard and keep the Android keyboard hidden. Existing installs keep their selected input method. **Settings → Keyboard → Input method** switches between the built-in keyboard, Android keyboard, and no on-screen keyboard.

The built-in path supports system/custom themes, per-key color-scheme editing, dock matching, drag-to-resize sizing, typography, haptics, key sounds, optional extra keys, and custom layout files.

![Built-in keyboard settings showing theme, color scheme, dock matching, sizing, and feedback](assets/onboarding/screenshots/05-keyboard-settings.webp)

## Recreate the live shell workspace

The public setup mirrors the safe foundation of the live device:

- fish with an empty greeting and optional tmux auto-attach;
- Oh My Posh using the `termux-launcher` theme;
- eza aliases and zoxide navigation;
- tmux with the Termux Launcher plugin;
- wallpaper Material colors and status helpers;
- optional Shizuku-backed `btop` wrappers.

Private aliases and API keys are intentionally not copied. See **Recreate the shell workspace** for the guarded installer and a file-by-file explanation.

## Bridge the shell and Android

`launcherctl` has one command. It sends an authenticated request to the local app catalog and launches the unique best match:

```shell
launcherctl launch maps
launcherctl launch com.example.maps
```

No match returns 404. Tied best matches return 409 with candidate app records, so scripts can retry with a package or activity. The route allows 30 requests per minute. Status, resources, notifications, media, events, restart, agent, MCP, and client-config commands are not present. Local AI uses `tai`.

![LauncherCtl page in the replayable onboarding tour](assets/onboarding/screenshots/07-onboarding-launcherctl.webp)

## Optional privileged and AI layers

![Settings hub with TAI and a live Shizuku READY status](assets/onboarding/screenshots/03-settings-hub.webp)

- **Shizuku:** optional lock-screen backend, privileged shell, richer system helpers, and `btop` integration.
- **TAI / Termux AI:** on-device LiteRT-LM and MNN model hosting, catalog downloads/imports, language and embedding roles, and OpenAI/Ollama-compatible localhost APIs.
- **Termux add-ons:** matching API and Styling forks extend normal Termux workflows.

TAI marks its sensitive settings window secure, so Android screenshots of endpoint/token details are intentionally blocked. The docs never ask you to disable that protection.

![Final onboarding page with optional Home selection and full guide actions](assets/onboarding/screenshots/08-onboarding-ready.webp)

## Capability checklist

| Capability | Works immediately | Extra setup |
| --- | --- | --- |
| Terminal Home, sessions, dock, A–Z, `%` search | Yes | None |
| Folders, pins, ranking, icon packs, shortcuts | Yes | Configure to taste |
| Built-in keyboard and color editor | Yes, built-in keyboard selected | Change Input method only if wanted |
| Material terminal/dock palette | Yes by default | Wallpaper and appearance choices |
| `launcherctl launch` | Yes | None |
| Notification dots, replies, and media | No | Notification-listener access |
| tmux/fish/Oh My Posh workspace | No | Run the guarded shell setup |
| Shizuku lock, shell, `btop` | No | Shizuku + rish permission |
| TAI models and local clients | No | Model download/import and enough RAM |
