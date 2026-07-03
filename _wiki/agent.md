---
title: Agent & MCP
order: 70
---

LauncherCtl exposes a shared tool registry for local agents, MCP clients, and scripts. Routing is deterministic—it does not load a hidden model. Execution is confirmation-gated for medium, high, and critical-risk tools.

## Route and execute

```shell
launcherctl agent --dry-run "open maps"
launcherctl agent "open maps"
```

## MCP stdio bridge

For MCP-capable clients such as Codex, OpenCode, and Crush. This requires Python in Termux.

```shell
pkg install python && launcherctl mcp
```
