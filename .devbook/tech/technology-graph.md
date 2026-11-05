# Technology Graph

```meta
rating: adopted
```

> This graph records the technologies this marketplace is built, carried, and checked with. It ships no
> runtime of its own: every plugin is Markdown and JSON loaded by two hosts, plus one MCP
> server and three canvases. What a specialist targets, such as Aspire, Playwright, Aikido, or
> Jira, is the consuming repository's stack and is not recorded here. The exceptions are the
> MCP servers this repository's own manifests declare and the Playwright CLI the `qa` plugin runs.

## Layers

| File | Covers |
| --- | --- |
| [shared.md](shared.md) | Asset formats, tool server protocols, the declared MCP servers, and the Playwright CLI |
| [hosts.md](hosts.md) | Both hosts' plugin contracts, the host plugins' two apps, and Claude Code function hooks |
| [tooling.md](tooling.md) | Authoring and loading agents, script runtime and shell, CI, and the plugins and apps carrying a change |

## Graph

```mermaid
graph LR
    subgraph shared
        markdown[Markdown]
        mermaid[Mermaid]
        mcp[MCP]
        mcp-apps[MCP Apps]
        aspire-mcp[Aspire MCP server]
        playwright-cli[Playwright CLI]
        playwright-mcp[Playwright MCP server]
    end
    subgraph hosts
        claude-api[Claude Code plugin API]
        copilot-api[Copilot CLI plugin API]
        claude-desktop[Claude Desktop]
        copilot-sdk[Copilot app extension SDK]
        claude-hooks[Claude Code function hooks]
    end
    subgraph tooling
        claude-code[Claude Code]
        copilot[GitHub Copilot]
        node[Node.js]
        pwsh[PowerShell]
        actions[GitHub Actions]
        gh[GitHub CLI]
        devbook[devbook plugin]
        backlog[Backlog]
        backlog-tools[backlog-tools plugin]
    end
    mermaid --> markdown
    mcp-apps --> mcp
    aspire-mcp --> mcp
    playwright-cli --> node
    playwright-mcp --> mcp
    playwright-mcp --> node
    claude-api --> claude-code
    claude-api --> markdown
    claude-api --> mcp
    copilot-api --> copilot
    copilot-api --> markdown
    copilot-api --> mcp
    claude-desktop --> mcp-apps
    claude-desktop --> node
    copilot-sdk --> copilot
    copilot-sdk --> node
    claude-hooks --> claude-code
    actions --> node
    devbook --> node
    devbook --> claude-code
    backlog-tools --> claude-code
    backlog-tools --> backlog
```

## Reading and extending

`rating` is the tech-radar ladder in `devbook-tech.md`: `candidate`, `trial`, `adopted`,
`hold`, `retired`. It rates each technology in this repository.

To add a technology:

1. Add a `##` chapter in the layer that owns it.
2. Add its node and its `depends-on` edges here in the same change.
3. Run `node .devbook/_tools/devbook-meta/build.mjs --scope tech --check`.

Package facts come from the inventory scripts under `.devbook/_tools/devbook-tech/`. This
repository has no .NET projects and three `package.json` files, and only the canvases carry a
dependency.
