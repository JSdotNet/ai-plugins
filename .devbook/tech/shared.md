# Shared

```meta
status: adopted
```

The formats and protocols every layer builds on: what an asset is written in, and how a
plugin reaches a tool server. The tools recorded here are only the MCP servers this
repository's own manifests declare and the Playwright CLI the `qa` plugin runs; what a
specialist targets in a consuming repository is that repository's stack.

## Markdown

```meta
status: adopted
type: format
```

The format of every asset: agents, skills, contracts, rules, READMEs, and these chapters.

- **Used for** — `*.agent.md` and `SKILL.md` bodies under YAML frontmatter, `resources/`
  contracts, and the rules under `.agents/rules/`.
- **Why** — both hosts load Markdown with frontmatter and ignore keys they do not know, which
  is what lets one file serve both.

## Mermaid

```meta
status: adopted
type: format
version: "11"
depends-on: [".devbook/tech/shared.md#markdown"]
```

The diagram language inside Markdown that the diagram skills emit and the viewers render.

- **Used for** — the architecture and domain-design diagram skills, whose
  `generate-diagram-svgs.ps1` renders SVGs through the Mermaid CLI (`mmdc`) when it is on the
  path; the Mermaid viewer in the orch-dashboard server and the `diagram-canvas` extension,
  which load `mermaid@11` from jsDelivr; and the graph in `technology-graph.md`.

## MCP

```meta
status: adopted
type: protocol
```

The Model Context Protocol, the way a plugin puts a tool server in front of either host.

- **Used for** — `mcpServers` in `plugins/claude-desktop/.claude-plugin/plugin.json` and in
  both manifests of `plugins/qa`.
- **Why** — both hosts start a declared stdio server from the plugin manifest, so one
  declaration serves both.

## MCP Apps

```meta
status: trial
type: protocol
depends-on: [".devbook/tech/shared.md#mcp"]
```

The MCP extension that lets a server return an interactive page as a `ui://` resource,
rendered inline by the host.

- **Used for** — the orch-dashboard server's dashboard, diagram, and document views;
  `app-bridge.js` speaks the 2026-01-26 postMessage protocol so the pages stay byte-identical
  to the Copilot canvas versions.

## Aspire MCP server

```meta
status: adopted
type: tool
depends-on: [".devbook/tech/shared.md#mcp"]
```

The MCP server the Aspire CLI starts with `aspire agent mcp`, declared by the `qa` plugin in
both manifests.

- **Used for** — the `qa` agents read resources, logs, and traces of the application under
  test. The Aspire CLI itself is the consuming repository's, not this one's.

## Playwright CLI

```meta
status: adopted
type: tool
depends-on: [".devbook/tech/tooling.md#nodejs"]
```

`@playwright/cli`, run as `playwright-cli` through the shell. The `qa` plugin declares no
server for it: the person installs it, and a skill stops when `playwright-cli --version`
does not answer.

- **Used for** — the `qa` agents drive a browser and capture screenshot, video, and trace
  evidence.

## Playwright MCP server

```meta
status: retired
type: tool
depends-on: [".devbook/tech/shared.md#mcp", ".devbook/tech/tooling.md#nodejs"]
```

`@playwright/mcp`, which the `qa` plugin declared until 0.5.0. Replaced by the Playwright CLI —
[Browser Automation](../arc42/adr/browser-automation.md).

- **Used for** — nothing; kept for history.
