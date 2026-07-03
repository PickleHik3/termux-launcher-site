---
title: Termux AI (TAI)
order: 65
---

TAI is the local model host built into Termux Launcher. It exposes an OpenAI- and Ollama-compatible localhost endpoint, so tools such as Codex, OpenCode, Crush, AIChat, and Ollama clients work against on-device models.

The full model catalog, import flow, and API reference live on the **[Termux AI](#ai)** page. This is the shell quickstart.

## Start here

```text
Long press Terminal -> More -> TAI / Termux AI
```

Open the model catalog, pick a model that fits your device memory, accept the provider terms, and download it. Then load it and check the shell helper:

```sh
tai status
tai models
tai load MODEL_ID
tai runtime
```

`tai` manages models — it is not an interactive chat program. Add `--json` for raw output you can pipe into `jq`.

## Connect a client

The base URL and bearer token live in `~/.launcherctl/`:

```sh
export OPENAI_BASE_URL="$(sed -n '1p' ~/.launcherctl/endpoint)/v1"
export OPENAI_API_KEY="$(cat ~/.launcherctl/token)"
```

Or generate a ready-made config:

```sh
launcherctl client-config codex
launcherctl client-config opencode
launcherctl client-config ollama
```

For the catalog, importing your own models, capabilities, and the full API, see the [Termux AI](#ai) page.
