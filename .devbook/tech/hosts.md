# Hosts

```meta
status: adopted
```

The surfaces a plugin here is loaded into, and the contracts it is written against. The
agents that load them are in `tooling.md`.

## Claude Code plugin API

```meta
status: adopted
type: platform
depends-on: [".devbook/tech/tooling.md#claude-code", ".devbook/tech/shared.md#markdown", ".devbook/tech/shared.md#mcp"]
```

The plugin contract Claude Code loads: `.claude-plugin/plugin.json`, agents listed
explicitly, skills, command hooks, `mcpServers`, and the marketplace in
`.claude-plugin/marketplace.json`.

- **Used for** — every plugin's Claude manifest, and the `SessionStart` command hooks that
  print a sidecar in place of a prompt hook.
- **Why** — one of the two hosts; `docs/copilot/claude-code-compatibility.md` records where
  the contracts differ, and `tools/check-assets.mjs` fails when they drift.

## Copilot CLI plugin API

```meta
status: adopted
type: platform
depends-on: [".devbook/tech/tooling.md#github-copilot", ".devbook/tech/shared.md#markdown", ".devbook/tech/shared.md#mcp"]
```

The plugin contract GitHub Copilot loads: `.github/plugin/plugin.json`, agents with Copilot
tool ids, skills, `hooks.json` prompt hooks, and `mcpServers`.

- **Used for** — every plugin's Copilot manifest and the row in `copilot-plugins.md`.
- **Why** — the second host; one asset file serves both because each ignores keys it does
  not know.

## Claude Desktop

```meta
status: trial
type: platform
depends-on: [".devbook/tech/shared.md#mcp-apps", ".devbook/tech/tooling.md#nodejs"]
```

The desktop app that renders MCP Apps inline and installs a `.mcpb` extension.

- **Used for** — the `claude-desktop` plugin's orch-dashboard server, which runs as the MCP
  server the Claude Code plugin registers and, packed by `scripts/Build-DesktopExtension.ps1`
  with the MCPB CLI from `manifest.json`, as a Desktop extension.

## Copilot app extension SDK

```meta
status: trial
type: package
version: "latest"
depends-on: [".devbook/tech/tooling.md#github-copilot", ".devbook/tech/tooling.md#nodejs"]
```

`@github/copilot-sdk`, whose `extension` entry point gives a canvas `createCanvas` and
`joinSession` inside the GitHub Copilot app.

- **Used for** — the `copilot-app` plugin's `diagram-canvas` and `markdown-canvas`, each
  pinning it in its own `package.json` and lock file, and the orch-dashboard canvas, which
  imports it without a `package.json` of its own.
- **Why** — the only way a canvas reaches a Copilot app session.
