---
title: Shizuku, rish & btop
order: 50
---

Shizuku is optional. Skip this page unless you want a privileged lock method, a `rish` shell, or the Shizuku-backed `btop` helpers. App launch, search, styling, keyboards, normal tmux, and basic LauncherCtl do not need it.

## Before you start

- Install Shizuku from a source you trust.
- Follow its [official setup guide](https://shizuku.rikka.app/guide/setup/).
- Understand that Shizuku grants selected apps elevated Android service access while its service is running.

The launcher shows backend state as OFF, READY, SHELL, or DENIED in Settings.

## Set up rish

1. In Shizuku, open **Use Shizuku in terminal apps**.
2. Generate `rish` and `rish_shizuku.dex`.
3. Put both in a directory already on your Termux `$PATH`, such as `~/.local/bin` after you add that directory to PATH.
4. Check the launcher edition:

```shell
printf '%s\n' "$TERMUX_APP__PACKAGE_NAME"
```

5. Set the bottom of `rish` to that exact package:

```shell
# Termux edition
RISH_APPLICATION_ID="com.termux"

# VAJ edition
RISH_APPLICATION_ID="io.vaj.tl"
```

6. Make the script executable and run it once:

```shell
chmod +x "$(command -v rish)"
rish
```

Approve the Shizuku prompt only for the launcher edition you installed.

## Verify before adding btop

```shell
launcherctl tty-doctor
rish -c 'id'
```

Read the reported identity and errors. Do not continue if `rish` points at the wrong package or Shizuku is not running.

## Install the optional helper

Run the guarded shell installer and choose **btop only** or **All**:

```shell
~/setup-shell
```

The wrappers are `btop-shizuku` and `mini-btop-shizuku`. On Android 14+, keep `rish_shizuku.dex` non-writable as Shizuku recommends.

## Lock methods

Under **Settings → Apps & Access**, the A–Z double-tap lock can remain off or use a configured accessibility/Shizuku method. Test the selected method manually before relying on it. Never weaken the device lock screen to make a launcher gesture work.
