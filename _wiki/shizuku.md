---
title: Shizuku, rish & btop
order: 50
---

Shizuku unlocks lock-screen control, a privileged shell, and the `btop` helper. Install and start Shizuku, then set up `rish`.

## Set up rish

Let Shizuku create `rish` and `rish_shizuku.dex`, copy both into a directory on your `$PATH`, and set `RISH_APPLICATION_ID="com.termux"` at the bottom of `rish`. Then verify:

```shell
launcherctl tty-doctor
rish -c "id"
```

Then run the shell-setup script and choose **All** or **btop only**. On Android 14+, keep `rish_shizuku.dex` non-writable.
