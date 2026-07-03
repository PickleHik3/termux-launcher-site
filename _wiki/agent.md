---
title: Agent & MCP
order: 70
---

`launcherctl` exposes a shared tool registry for local agents, MCP clients, and scripts. Routing is deterministic — it does not load a hidden model. Execution is confirmation-gated for medium-, high-, and critical-risk tools.

## Route and execute

```shell
launcherctl agent --dry-run "open maps"
launcherctl agent "open maps"
```

## MCP stdio bridge

For MCP-capable clients such as Codex, OpenCode, and Crush. Requires Python in Termux.

```shell
pkg install python && launcherctl mcp
```

MCP keeps model generation and Android permissions separate: the model decides *what* to call, and the bridge gates *whether* it runs. The client can request confirmation before any sensitive action. Pair it with a local [Termux AI](#ai) model for a fully on-device agent, or with any remote model your client already uses.
