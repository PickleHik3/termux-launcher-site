---
title: The launcher surface
order: 20
---

The terminal is the home screen. Launcher controls live around the Termux session.

## Apps row

Long-press an app icon to pin, move, or drop it in a folder. Long-press empty space in the apps row for list-based management.

## A–Z row

Swipe across the row to filter installed apps by letter. Swipe upward from a letter to launch an app in that group.

## Terminal search

Type the input split character before a query to search apps from terminal input. The default is `%`, so `%whatsapp` finds WhatsApp.

## Lock screen

Double-tap the alphabet row to lock the phone, once a lock method is configured in Apps Bar settings.

## Settings map

Most settings live under:

```text
Long press Terminal -> More
```

| Section | What's there |
| --- | --- |
| **Appearance** | Terminal opacity, blur, dock size, compact dock spacing, monochrome icons, Terminal Material colors |
| **Apps Bar** | Input split character, app-ranking reset, Home launcher shortcut, lock-screen behavior |
| **TAI / Termux AI** | Local model downloads, imports, runtime settings, API port, API token |

> Live wallpapers can disable dock blur. If you use two rows of Extra Keys, turn on **compact dock spacing** so the terminal has more room.
