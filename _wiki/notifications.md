---
title: Notifications
group: Everyday
order: 30
---
Android's shade pulls you away from what you are doing. The launcher can pin the notifications you actually wait for (a code, a reply, a build result) in the status bar above the prompt, show dots on docked apps, and keep a history your scripts can read. This page covers all three. The rest of the bar is on [Status bar](#wiki/status-bar).

Nothing is pinned by default. You choose what qualifies by writing rules; with no rules, nothing pins and the clock keeps its full size.

## Turn it on

Everything here lives on **Settings → Notifications** ("Dots, pinned alerts and history"). The same page is linked from **Settings → Status bar → More** and from **Settings → Apps**.

1. **Notification access** opens Android's notification-access screen. Without it the launcher cannot read notifications at all, so dots, pins, media, quick reply and history all need it.
2. **Pinned notifications** ("Pin matching notifications to the top pane. Match an app package, keywords, or both.") holds your rules.

```clip
svg: notification-rule
title: A pinned notification rule
caption: An app package, keywords, or both; matching notifications pin to the top pane.
```

## Pinned notification rules

The add form has two fields and a switch, then **Add rule**:

* **App package (e.g. com.whatsapp)**: matched exactly against the posting app, ignoring case. `com.whatsapp`, not `WhatsApp`. Leave it blank for any app.
* **Keywords in title or text**: a plain substring, ignoring case, not a pattern. `otp` matches "Your OTP is 481920". It is tested against the title and the body. Leave it blank for any text.
* **Dismissing the pin also clears the notification**: off by default. Off, swiping the pin away leaves the notification in the shade; on, the notification is cleared too.

At least one field must be filled; a rule with both blank would pin everything, so the form says "Enter an app package, keywords, or both".

Each saved rule is a card with its own **on/off switch**, a **Clears** pill when it clears the notification, and **Remove**. A rule that is off never matches.

Some rules worth copying:

| Package | Keywords | What it catches |
| --- | --- | --- |
| *(blank)* | `otp` | One-time codes from any app |
| `com.whatsapp` | *(blank)* | Every WhatsApp notification |
| `com.google.android.gm` | `invoice` | Only invoice mail |
| *(blank)* | `build failed` | CI results from whichever app reports them |

* **The first matching rule wins.** Rules are tested in list order, so a narrow rule above a broad one takes precedence.
* **Adding the same rule again replaces it.** The same package and keywords move to the end of the list, take the new clear setting and come back switched on.
* The list holds **32 rules**; past that the form says "Rule list is full".

## Pinned cards on screen

* Each card shows the sender in bold, then the message, with the sender's avatar and the app's badge, a tint from the app icon and the age (now, 4m, 2h, 1d). A conversation that folds several messages shows a count.
* Up to **8** matches are kept; past that the oldest is dropped. The bar shows **two** cards at once; **swipe up or down** on them to scroll the rest.
* **Tap** a card to open what the notification points at, as tapping it in the shade would.
* **Swipe sideways** to dismiss it. "Dismissed" with an undo shows for four seconds. A dismissed pin stays gone while that notification is active, even though the rule still matches; if the app posts it again, it can pin again.
* **Hold** a card for the whole message with **Open**, **Dismiss** and **Mute this rule**. Mute turns that rule's switch off.
* TalkBack users get the same actions on each card.

The clock keeps its full face as cards arrive and scales down as one piece to the room left, never below its compact size. A media session shares the space only with a single card. In the open status bar the album art sits next to the play controls, the next button stays clear of the bar's end so a near miss does not page, and tapping the art or title opens the playing app.

## Where the rules live

Rules are stored as a JSON array in the app's own preferences under `essential_notification_rules`, defaulting to `[]`. Each entry is `{"id":…, "package":…, "match":…, "clear":…, "enabled":…}`; an entry without `enabled` counts as on. A malformed entry is dropped on load rather than breaking the list. There is no shell command or config file for rules yet; the settings page is the only way to edit them.

## Notification dots

**Settings → Notifications → On the home screen → Notification dots** shows a dot on docked apps with an active notification. Off by default.

## Notification history for the shell

**Settings → Notifications → For the shell → Notification history** records notifications into a database under `~/.launcherctl`, where commands and agents in Termux can read them:

```sh
launcherctl notifications --app … --since 7d
```

* Nothing is recorded until you check an app in the page's app list. Only checked apps are saved.
* **Keep for**: 7 days, 30 days, 90 days or 1 year.
* **Mask one-time codes** ("Codes are hidden before a notification is saved.").
* **Clear history** deletes every saved notification; the checked apps stay checked.

Dots, pins and the widgets do not need history turned on.

## Elsewhere

* **Quick reply** from the dock answers a notification without opening the app; see [Home screen & apps](#wiki/home-screen).
* The **Notifications** and **Media** widgets use the same notification access; see [Widgets](#wiki/widgets).
* Programs in the terminal can post their own Android notifications; see [Terminal features](#wiki/terminal).

Full details: [Notifications](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Notifications.md)
