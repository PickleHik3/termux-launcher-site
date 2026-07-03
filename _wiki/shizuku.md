---
title: Shizuku, rish & btop
order: 50
---

You do **not** need Shizuku for normal launcher use. Set it up only if you want Shizuku-backed lock-screen behavior, a privileged shell, or the optional `btop-shizuku` / `mini-btop-shizuku` commands.

## Set up rish

1. Install and start [Shizuku](https://github.com/rikkaapps/shizuku). The [official setup guide](https://shizuku.rikka.app/guide/setup/) covers the Android-side steps.
2. In the Shizuku app, open **Use Shizuku in terminal apps** and let it create `rish` and `rish_shizuku.dex`.
3. Copy both files into a Termux directory on your `$PATH`, for example `~/.local/bin`.

Check the current launcher's package name and set it at the bottom of `rish`:

```shell
printf '%s\n' "$TERMUX_APP__PACKAGE_NAME"
```

- Standard edition: `RISH_APPLICATION_ID="com.termux"`
- VAJ edition: `RISH_APPLICATION_ID="io.vaj.tl"`

Make it executable and run it once to grant the Shizuku permission prompt:

```shell
chmod +x "$(command -v rish)"
rish
launcherctl tty-doctor
```

## btop through rish

Once `rish` works, run the [shell-setup script](#wiki/shell) again and choose **All** or **btop only**. On Android 14+, keep `rish_shizuku.dex` non-writable.
