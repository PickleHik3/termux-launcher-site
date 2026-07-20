---
title: Termux AI (TAI)
order: 65
---

TAI is the optional on-device model host built into Termux Launcher. It can serve compatible chat, tool-use, vision/audio, and embedding models through OpenAI- and Ollama-shaped localhost APIs.

You do not need TAI to use the launcher or LauncherCtl.

## Check the device first

Model downloads are large and runtime memory use can be significant. Open:

```text
Settings → TAI · Termux AI
```

Read the device profile, compatible accelerators, minimum memory, model size, and license before downloading. Start with the smallest compatible model that satisfies your use case.

TAI protects the sensitive settings window with Android screenshot security. A black screenshot is expected; do not disable the protection to capture endpoints or tokens.

## Beginner flow

1. Open **Browse Catalog**.
2. Filter by the capability you need: chat, tools, vision/audio, or embeddings.
3. Read license/terms and hardware requirements.
4. Download or import one model.
5. Load it with the recommended/automatic accelerator.
6. Check status from the shell.

```shell
tai status
tai models
tai runtime
```

`tai` manages the host and models; it is not an interactive chat client.

## Connect a client safely

Generate a config when supported:

```shell
launcherctl client-config codex
launcherctl client-config opencode
launcherctl client-config ollama
```

Or read the endpoint/token at runtime from `~/.launcherctl/`. Never commit the token or paste it into screenshots.

```shell
export OPENAI_BASE_URL="$(sed -n '1p' ~/.launcherctl/endpoint)/v1"
export OPENAI_API_KEY="$(cat ~/.launcherctl/token)"
```

Compatible clients can then use chat completions, responses, embeddings, or Ollama-shaped chat/generate endpoints according to model capability.

## Runtime habits

- Keep only one generation model resident.
- Use preflight before loading an unfamiliar model.
- Prefer auto acceleration until you have a reason to force CPU or GPU.
- Unload when finished to release memory.
- Cancel a stuck load/generation before restarting the whole launcher.

```shell
tai doctor
tai runtime
```

For role assignment, import metadata, exact endpoints, streaming, rate limits, and error bodies, open the full **Termux AI** API page from the site navigation.
