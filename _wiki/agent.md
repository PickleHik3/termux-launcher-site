---
title: Agent & MCP
order: 70
---

LauncherCtl exposes one shared tool registry to shell scripts, local/remote model clients, and MCP-capable agents. It does not hide a model inside the router: the client decides what to request, while the bridge enforces schemas, risk levels, and confirmations.

## Inspect before executing

```shell
launcherctl agent --dry-run "open maps"
launcherctl agent "open maps"
```

Use dry-run while learning which tool and arguments a natural-language request resolves to.

## Risk model

- Low-risk read-only tools can run without an extra confirmation.
- Medium-, high-, and critical-risk tools require explicit confirmation.
- Android/Shizuku permissions remain separate from the model’s decision.
- A model cannot gain access that the launcher itself does not have.

Treat tool confirmation as a security boundary, not an annoyance. Read the resolved tool and arguments before approving changes.

## MCP stdio bridge

Install Python, then start the bridge:

```shell
pkg install python
launcherctl mcp
```

Generate a client preset when available:

```shell
launcherctl client-config codex
launcherctl client-config opencode
```

The bridge speaks over stdio; the authenticated Android/TAI server remains on localhost. Keep `~/.launcherctl/token` out of version control and shared logs.

## Optional web tools

Settings can generate a LauncherCtl MCP preset for supported web-search providers. Provider API keys stay in app preferences and are injected into that MCP server’s environment. They are not part of the public fish/tmux dotfiles.

## Local model pairing

Pair MCP with TAI for an on-device model path, or use a remote model client you already trust. Local inference does not make every tool action local or harmless; the confirmation and Android permission rules still apply.
