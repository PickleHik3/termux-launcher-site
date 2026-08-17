---
title: Essential notifications
order: 24
---
Android's shade is a pull-away from whatever you are doing. The status bar at the top of the terminal can hold up to three notifications *in place* instead, so the ones you actually wait for - a code, a reply, a build result - sit above the prompt until you deal with them.

Nothing is pinned by default. You choose what qualifies by writing rules, and with no rules the feature stays idle: no pins, and the clock keeps its full size.

## Turning it on

**Settings → Terminal & status**, in the notification section:

1. **Media and pinned notifications** - opens Android's notification-access screen. Without this grant the launcher cannot read notifications at all, so no rule can ever match. The same grant is what powers the media widget.
2. **Essential notification rules** - the rule list, and where you add one.

```clip
todo: Screenshot - the Essential notification rules screen with the add-rule dialog open (package + keywords fields visible).
title: rule editor
caption: Adding a rule - app package, keywords, and the clear-on-dismiss checkbox.
```

## What a rule is

Two fields and a checkbox:

* **App package** - matched exactly against the posting app, case-insensitive. `com.whatsapp`, not `WhatsApp`. Leave it blank to mean *any app*.
* **Keywords in title or text** - a case-insensitive **substring**, not a pattern. `otp` matches "Your OTP is 481920". It is tested against the notification's title and its body, and a pin matches if either contains it. Leave it blank to mean *any text*.
* **Dismissing the pin also clears the notification** - off by default. Off, swiping the pin away only removes it from the pane and the notification stays in the shade. On, the source notification is cancelled too, so the pin is the only place you need to deal with it.

At least one of the two fields must be filled. A rule with both blank would pin everything, so it is rejected - the dialog says *Enter an app package, keywords, or both*.

Some shapes worth stealing:

| Package | Keywords | What it catches |
| --- | --- | --- |
| *(blank)* | `otp` | One-time codes from any app |
| `com.whatsapp` | *(blank)* | Every WhatsApp notification |
| `com.google.android.gm` | `invoice` | Only invoice mail |
| *(blank)* | `build failed` | CI results from whichever app reports them |

Two details that decide behaviour once you have more than one rule:

* **The first matching rule wins.** Rules are tested in list order, so a narrow rule placed above a broad one takes precedence - useful when you want one app's matches cleared on dismiss and everything else left alone.
* **A rule cannot be added twice.** Its identity is derived from the package and keywords, so re-adding the same pair is a no-op rather than a duplicate.

The list holds **32 rules**; past that the dialog reports *Rule list is full*.

## What happens on screen

* **Three pins at most.** A fourth match evicts the oldest rather than growing the stack.
* **Order is stable.** Pins already on screen keep their positions, and new matches are appended oldest-first by post time - so a pin never jumps around underneath your finger while you are reading it.
* **Tapping a pin opens what the notification points at**, by sending the notification's own content intent, exactly as tapping it in the shade would. Only if there is no such intent, or it has been cancelled, does the app's plain launcher entry get used. Notifications marked auto-cancel are cleared afterwards, as the shade does.
* **Dismissing a pin keeps it gone** for as long as that notification stays active, even though the rule still matches. If the app reposts it, it can pin again.

Pins share the widget slot with the clock, so the clock gives up room as pins arrive: full size with nothing pinned, compact with one or two, and down to a mono chip with all three. One pin alongside an active media session is the one case where both are shown together. The [Terminal](#wiki/surface) page covers the rest of the status bar.

## Where the rules live

They are stored as a JSON array in the app's own preferences under `essential_notification_rules`, defaulting to `[]`. Each entry is `{"id":…, "package":…, "match":…, "clear":…}`. There is no shell command or config file for this yet - the dialog is the only way to edit rules, and a malformed or unusable entry is dropped on load rather than breaking the list.
