# Onboarding and guide media

Finalized screenshots, crops, and recordings for the first-launch tour and the refreshed beginner-to-moderate guide live in this directory.

## Capture provenance

- Captured: 2026-07-19
- Device: Nothing A065, development phone name `Pong`
- Android: 16 (API 36)
- Natural display: 1080 × 2412; onboarding and action-menu captures were taken in the device's live landscape orientation
- App package: `com.termux`
- App source branch: `codex/onboarding-showcase`
- Capture method: the project Pong wireless-ADB workflow; screenshots and recordings are from the physical device, not mock data

The first five screenshots show the live launcher, shell workspace, and settings. Screenshots 06–09 show the implemented onboarding and current icon action menu. `tour-crops/` contains privacy-safe crops of those real captures used directly by the Android onboarding activity.

## Files

- `screenshots/01-home-terminal.webp` — portrait terminal Home, tmux status, dock, A–Z row, and keyboard
- `screenshots/02-terminal-app-search.webp` — live `%maps` app filtering
- `screenshots/03-settings-hub.webp` — top-level settings with Shizuku ready
- `screenshots/04-appearance-controls.webp` — Material and dock-glass controls
- `screenshots/05-keyboard-settings.webp` — built-in keyboard configuration
- `screenshots/06-onboarding-welcome.webp` — finalized first onboarding page
- `screenshots/07-onboarding-launcherctl.webp` — shell-to-Android onboarding page
- `screenshots/08-onboarding-ready.webp` — final onboarding actions
- `screenshots/09-app-actions.webp` — long-press app actions and icon customization
- `recordings/onboarding-tour.mp4` — complete seven-step onboarding walkthrough
- `recordings/launcher-search-and-actions.mp4` — live `%` search and long-press actions

## Privacy and maintenance

No SSH configuration, API key, bearer token, notification content, or TAI endpoint is stored here. TAI intentionally marks its sensitive settings window secure; that protection was respected and no attempt was made to bypass it.

When replacing a capture, keep its filename stable when possible and update the capture date above. Verify that status-bar notifications, terminal history, and shell prompts contain no private information before committing a replacement.
