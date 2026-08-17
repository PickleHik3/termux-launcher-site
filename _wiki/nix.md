---
title: Nix edition
order: 12
---
# The Nix edition

The Nix edition (`com.termux.launcher.nix`) pairs the launcher with Nix-on-Droid: the full `nixpkgs` collection, declarative configs, generations and rollback - and it coexists with a stock Termux install. First bootstrap is bigger and slower than the standard edition; keep the app in the foreground and use decent wifi.

Grab it from [Releases](https://github.com/PickleHik3/termux-launcher/releases) - the `vX.Y.Z-nix` prerelease. Companions are the `nix-v*` tagged [TLNix:API](https://github.com/PickleHik3/termux-api/releases) and [TLNix:Styling](https://github.com/PickleHik3/termux-styling/releases).

## First setup

When the bootstrap asks about flakes, answer yes. Once you have a shell, initialize the launcher config:

```sh
cd ~/.config/nix-on-droid
rm flake.nix nix-on-droid.nix
nix flake init -t github:PickleHik3/nix-on-droid/launcher-nix#launcher
nix-on-droid switch --flake ~/.config/nix-on-droid
setup-toolkits
```

> Note: the `rm` replaces the bootstrap config on purpose - only run it in that directory, and back up first if you already customized it.

`setup-toolkits` is a checklist over the launcher flake's optional toolkits (shell essentials, eye candy, language toolchains) - it's the Nix edition's equivalent of the [setup script](#wiki/shell-goodies). Rerun it anytime:

```sh
setup-toolkits --list            # current selection, no changes
setup-toolkits --essentials      # shell + eye candy only
setup-toolkits --enable node,go  # add toolkits, leave the rest
```

## Daily commands

```sh
nix search nixpkgs ripgrep
nix profile install nixpkgs#ripgrep
nix profile list
nix profile remove ripgrep
nix-on-droid rollback
```

Put durable choices in the flake instead of piling up an unexplained profile - rollback is only useful when generations mean something. Your flake IS your backup: with it you can rebuild the whole environment on a new phone.

Coming from the deprecated VAJ edition? The [VAJ → Nix migration guide](migrate-vaj.html) covers backing up your home, installing side by side and replacing APT packages from `nixpkgs`.
