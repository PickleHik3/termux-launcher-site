---
title: Backup & recovery
order: 70
---
# Updates, backup & recovery

Updating is just installing the new APK over the old one - same edition, same source. Android refusing a mismatched signature is protection, not a bug; **never uninstall to "fix" an update** without backing up first - uninstalling deletes your entire Termux home.

## What to back up

Project files, dotfiles, and `~/.termux` (themes, fonts config, keybinds, saved workspaces). Caches and downloaded AI models are not worth it - they re-download.

```sh
cd ~
tar --exclude='./storage' --exclude='./.cache' -czf ~/storage/downloads/termux-home-backup.tgz .
```

> Note: this writes to shared Downloads - check for secrets (SSH keys, tokens, `~/.launcherctl/token`) before copying the archive off the phone. On the [Nix edition](#wiki/nix), your flake in `~/.config/nix-on-droid` replaces the package manifest - back it up and the environment is reproducible.

Recovering on a fresh install: get a working shell first, restore projects and keys (with correct permissions), reinstall packages (or `nix-on-droid switch`), restore dotfiles, workspaces last - and review captured workspace commands before running them.

## Common fixes

**The APK won't install/update.** Package name or signature mismatch - you're mixing editions or sources. Get the matching build from [Releases](https://github.com/PickleHik3/termux-launcher/releases). The standard edition (`com.termux`) conflicts with Termux from F-Droid/GitHub; use the Nix edition if you want both.

**Home button opens another launcher.** Android Settings > Apps > Default apps > Home app. If the choice keeps resetting, clear defaults on the old launcher.

**CPU card shows stale or basic data.** Shizuku isn't connected - start its service and reconnect from Settings > Services & permissions > Shizuku. Needed after every reboot with wireless-debugging starts. See [Permissions](#wiki/launcherctl).

**A workspace didn't bring my program back.** Workspaces replay commands, they don't resume processes - unsaved buffers and remote logins are gone. Save durable state in files.

**Touch/keyboard acts weird in a TUI.** The app probably enabled mouse reporting or an alternate screen - exit it and test in a clean shell. For hardware key weirdness, check for binding collisions with the *Key inspector* ([Keybindings](#wiki/keybindings)).

**Android kills my background jobs.** Aggressive battery management. Use `termux-services`, the wakelock action on the session notification, and narrow battery exemptions - not hope.

## Security notes

Your Termux home concentrates capability: source code, SSH keys, tokens, shell history, the TAI token, possibly ADB-level Shizuku access. The boundaries that matter;

* Keys and tokens stay in private home storage - never in shared Downloads, screenshots, or public dotfiles.
* Read scripts before piping them into a shell - including this project's setup scripts. Multiline clipboard content can execute more than it looks like when pasted; inspect unfamiliar text in an editor first.
* Workspaces with captured commands, keybind files, and extra-key configs are executable config. Review anything imported before it runs.
* Keep the TAI endpoint on loopback unless you've deliberately set up auth for a network listener. Protect `~/.launcherctl/token` like an API key.
* Install APKs only from the project's releases, grant Shizuku only to the package you intended, and treat `rish` commands as ADB-privileged.
