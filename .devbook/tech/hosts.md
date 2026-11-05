# Hosts

```meta
rating: adopted
```

This file records the surfaces a plugin here is loaded into, and the contracts it is written against. The
agents that load them are in `tooling.md`.

## Claude Code plugin API

```meta
rating: adopted
type: platform
depends-on: [".devbook/tech/tooling.md#claude-code", ".devbook/tech/shared.md#markdown", ".devbook/tech/shared.md#mcp"]
```

This is the plugin contract Claude Code loads.

- **Contract** — `.claude-plugin/plugin.json` with agents listed explicitly, skills, command
  hooks, `mcpServers`, and the marketplace in `.claude-plugin/marketplace.json`.
- **Used for** — every plugin's Claude manifest, and the `SessionStart` command hooks that
  print a sidecar in place of a prompt hook.
- **Why** — one of the two hosts; `.devbook/arc42/08-crosscutting-concepts.md` records where
  the contracts differ, and `tools/check-assets.mjs` fails when they drift.

## Copilot CLI plugin API

```meta
rating: adopted
type: platform
depends-on: [".devbook/tech/tooling.md#github-copilot", ".devbook/tech/shared.md#markdown", ".devbook/tech/shared.md#mcp"]
```

This is the plugin contract GitHub Copilot loads.

- **Contract** — `.github/plugin/plugin.json`, agents with Copilot tool ids, skills, `hooks.json`
  prompt hooks, and `mcpServers`.
- **Used for** — every plugin's Copilot manifest and the row in `copilot-plugins.md`.
- **Why** — the second host; one asset file serves both because each ignores keys it does
  not know.

## Claude Desktop

```meta
rating: trial
type: platform
depends-on: [".devbook/tech/shared.md#mcp-apps", ".devbook/tech/tooling.md#nodejs"]
```

Claude Desktop is the desktop app that renders MCP Apps inline and installs a `.mcpb` extension.

- **Used for** — the `claude-desktop` plugin's orch-dashboard server. It runs as the MCP server
  the Claude Code plugin registers, and as a Desktop extension.
  `scripts/Build-DesktopExtension.ps1` packs the extension with the MCPB CLI from `manifest.json`.

## Copilot app extension SDK

```meta
rating: trial
type: package
version: "latest"
depends-on: [".devbook/tech/tooling.md#github-copilot", ".devbook/tech/tooling.md#nodejs"]
```

`@github/copilot-sdk` is the package whose `extension` entry point gives a canvas `createCanvas` and
`joinSession` inside the GitHub Copilot app.

- **Used for** — the `copilot-app` plugin's canvases. `diagram-canvas` and `markdown-canvas`
  each pin it in their own `package.json` and lock file. The orch-dashboard canvas imports it
  without a `package.json` of its own.
- **Why** — the only way a canvas reaches a Copilot app session.

## Claude Code function hooks

```meta
rating: trial
type: platform
depends-on: [".devbook/tech/tooling.md#claude-code"]
```

Claude Code mods are TypeScript and TSX modules a plugin names under `modules` in
`hooks/hooks.json`. They run inside a session and add commands, panes, bands above the prompt,
and status line entries. Copilot has no equivalent.

- **Used for** — the `claude-desktop-mods` plugin's `/handoff-to` band and pane and its
  `/context-view` pane. `hooks/register.ts` registers them. They are typed against the
  manifest's `types` and tested with the `claude-code/testing` runner.
- **Why** — the only way a plugin draws its own interface inside a Claude Code session. It
  ships apart from `claude-desktop` so the hooks hot-reload on their own.
