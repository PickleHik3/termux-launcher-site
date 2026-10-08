---
title: Nix edition
group: Reference
order: 250
---
The Nix edition (`com.termux.launcher.nix`) pairs the launcher with Nix-on-Droid: the full `nixpkgs` collection, declarative configs, generations and rollback, and it coexists with a stock Termux install. First bootstrap is bigger and slower than the standard edition; keep the app in the foreground and use decent wifi.

## Getting it

Grab it from [Releases](https://github.com/PickleHik3/termux-launcher/releases). From v1.0.0 every edition shares one version number and the edition is in the tag: `nix-vX.Y.Z` for Nix, `vX.Y.Z` for the Termux edition, `vaj-vX.Y.Z` for VAJ. APKs are named `termux-app_v<version>_<edition>_<variant>_<abi>`. Older releases keep the `-nix` tags they shipped under.

Companions are the `nix-v*` tagged [TLNix:API](https://github.com/PickleHik3/termux-api/releases), [TLNix:Styling](https://github.com/PickleHik3/termux-styling/releases) and [TLNix:Boot](https://github.com/PickleHik3/termux-boot/releases).

## First setup

When the bootstrap asks about flakes, answer yes. Once you have a shell, initialize the launcher config:

```sh
cd ~/.config/nix-on-droid
rm flake.nix nix-on-droid.nix
nix flake init -t github:PickleHik3/nix-on-droid/launcher-nix#launcher
nix-on-droid switch --flake ~/.config/nix-on-droid
setup-toolkits
```

> Note: the `rm` replaces the bootstrap config on purpose. Only run it in that directory, and back up first if you already customized it.

After a `nix-on-droid switch`, **open a new session**: the login shell and `PATH` only change for sessions started after the switch.

## Toolkits

`setup-toolkits` is a checklist over the launcher flake's optional toolkits; it is the Nix edition's equivalent of [tlstore](#wiki/tlstore). The toolkits are `shell`, `eye-candy`, `editor`, `build`, `node`, `go`, `python` and `animated-logo`. Shell, eye-candy, editor and build are on by default; `editor` implies `build`. Rerun it anytime:

```sh
setup-toolkits --list                        # current selection, no changes
setup-toolkits --all                         # everything prebuilt (not the animated logo)
setup-toolkits --essentials                  # shell + eye candy only
setup-toolkits --enable node,go              # add toolkits, leave the rest
setup-toolkits --disable eyeCandy            # remove one
setup-toolkits --enable python --no-switch   # edit the file, switch later yourself
setup-toolkits --animated-logo               # patched fastfetch with an animated GIF; compiles on the phone
```

## Which file do I edit?

| File | What belongs here |
| --- | --- |
| `flake.nix` | Inputs (which `nixpkgs`, home-manager, the fork), overlays |
| `nix-on-droid.nix` | The environment: login shell, `/etc`, base packages, Android integration |
| `home.nix` | Your user: dotfiles, per-user packages, session variables |
| `toolkits.nix` | Which package groups `home.nix` installs; this is what `setup-toolkits` writes |

## Daily commands

```sh
nix search nixpkgs ripgrep
nix profile install nixpkgs#ripgrep
nix profile list
nix profile remove ripgrep
nix-on-droid rollback
```

Put durable choices in the flake instead of piling up an unexplained profile; rollback is only useful when generations mean something. Your flake is your backup: with it you can rebuild the whole environment on a new phone.

## Extras

- The Android filesystem is visible at `/android`.
- A small sshd toolset: `sshd-start`, `sshd-status`, `sshd-stop` and `sshd-autostart on|off`, on port 8023 by default.
- Graphical apps come from `nixpkgs`, see [Linux display](#wiki/display).

Coming from the VAJ edition? The [VAJ → Nix migration guide](../migrate-vaj.html) covers backing up your home, installing side by side and replacing APT packages from `nixpkgs`.

Full details: [Nix edition: a beginner's guide](https://github.com/PickleHik3/termux-launcher/blob/dev/docs/en/Nix_Getting_Started.md)
