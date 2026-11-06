# 03. Context and Scope

```meta
related: [".devbook/tech/hosts.md", ".devbook/tech/tooling.md", ".devbook/arc42/adr/flow-control.md"]
```

![System context](c4:context)

The marketplace is a set of files. Nothing here runs on its own: a host loads a plugin, and a
person or a flow consults what it loaded.

## Hosts

```meta
related: [".devbook/tech/hosts.md#copilot-cli-plugin-api", ".devbook/tech/hosts.md#claude-code-plugin-api"]
```

| Host | Reads | Only it has |
| --- | --- | --- |
| GitHub Copilot (CLI and app) | `.github/plugin/plugin.json`, root `hooks.json`, agents by their Copilot tool ids | canvas extensions, which `copilot-app` builds on |
| Claude Code, and Claude Desktop through it | `.claude-plugin/plugin.json`, `hooks/hooks.json`, agents by their Claude tool names, `.claude-plugin/marketplace.json` | MCP Apps and `.mcpb` extensions, which `claude-desktop` builds on |

Both read the same agents, skills, and contracts. How one file satisfies both is in
[08 — One File, Two Hosts](08-crosscutting-concepts.md#one-file-two-hosts).

## Outside the Marketplace

```meta
```

| Neighbour | What it owns | The interface |
| --- | --- | --- |
| Delivery engine: `delivery`, `delivery-schedule`, and their `delivery-*` surfaces | Staged flows, gates, the pull-request lane, schedules, model selection | Consults a specialist by role (`architecture`, `docs`, …) through the repository's `phases` maps. |
| devbook and its `devbook-*` extensions | The `.devbook/` folder convention, its rules, and the `devbook-meta` check | The specialists write chapters to its rules. |
| Backlog | Plans and work items for changes to this repository | Items are pasted into a session and run by `run-plan-item`. |
| GitHub | The repository, pull requests, CI | Its workflows check and merge pull requests. |

The engine and devbook both live in `JSdotNet/devbook`. A specialist never names the engine. The
specialists write `arc42/`, `domain/`, and `design/` chapters, and this repository adopts devbook
for its own `arc42/`, `tech/`, and `ai/`.

`run-plan-item` is a skill of the `backlog-tools` plugin. Nothing in a plugin here depends on
Backlog.

`check-assets.yml` gates every pull request. `auto-merge.yml` merges a pull request that is not a
draft once every other check on its head commit is green.

The flow control that used to ship here moved to the engine on 2026-09-14, when the engine
lived in `JSdotNet/ai-agent-stack`. See [the flow-control decision](adr/flow-control.md).
