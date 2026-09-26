# Tooling

```meta
status: trial
```

## Claude Code

```meta
status: adopted
type: tool
```

The agent host most changes here are authored and carried in, and one of the two hosts that
loads every plugin.

- **Used for** — authoring and reviewing assets in worktree sessions, and loading each
  plugin through `.claude-plugin/plugin.json` to confirm it works in Claude.
- **Why** — one of the two hosts the marketplace serves; `docs/copilot/claude-code-compatibility.md`
  explains how one file serves both.

## GitHub Copilot

```meta
status: adopted
type: tool
```

The second host that loads every plugin, through `.github/plugin/plugin.json`.

- **Used for** — loading and exercising the same assets in the Copilot CLI and app; the
  `copilot-app` plugin's canvases run only here.
- **Why** — the marketplace is authored once for both hosts.

## Node.js

```meta
status: adopted
type: runtime
version: "22"
```

The runtime every checker and script in the repository runs on, dependency-free.

- **Used for** — `tools/check-assets.mjs`, `tools/bump-version.mjs`, and the devbook check
  under `.devbook/_tools/`.
- **Why** — both hosts already need it, so the checkers add no install.

## PowerShell

```meta
status: adopted
type: tool
version: "7"
```

`pwsh`, the shell for the scripts that are not checkers.

- **Used for** — `scripts/Build-DesktopExtension.ps1`, the version-bump step of
  `nightly-plugin-version-bump.yml`, and the `scripts/*.ps1` the architecture, domain-design,
  and fincent plugins run from their own root. The checkers stay on Node.js.

## GitHub Actions

```meta
status: adopted
type: service
depends-on: [".devbook/tech/tooling.md#nodejs"]
```

CI for this repository.

- **Used for** — `check-assets.yml` on every pull request, `devbook-meta.yml` on a devbook
  change, and the nightly `nightly-plugin-version-bump.yml`.

## GitHub CLI

```meta
status: adopted
type: tool
```

`gh`, the command line every pull request here is opened with.

- **Used for** — the `pr-jsdotnet` skill opens pull requests as the JSdotNet account through
  it, and sessions read runs and pull requests with it.

## devbook plugin

```meta
status: trial
type: package
version: "1.9.0"
depends-on: [".devbook/tech/tooling.md#nodejs", ".devbook/tech/tooling.md#claude-code"]
```

The devbook convention from the `jsdotnet` marketplace: the `tech/` and `ai/` folders, their
rules, and the checker copied to `.devbook/_tools/`.

- **Used for** — this folder and `.devbook/ai/`, installed by `devbook:init` on 2026-09-26.
- **Why** — the marketplace's specialists write devbook chapters in other repositories;
  keeping its own record in the same shape is how the convention gets exercised here.

## Backlog

```meta
status: adopted
type: tool
```

The JSdotNet Backlog app, where import plans live as entries that are copied out one at a time
into an agent session.

- **Used for** — holding the plans multi-step changes to this repository are cut into, such as
  `ai-plugins-devbook-adoption`.

## backlog-tools plugin

```meta
status: adopted
type: package
depends-on: [".devbook/tech/tooling.md#claude-code", ".devbook/tech/tooling.md#backlog"]
```

The plugin that turns a Backlog plan into prompts and runs a pasted entry.

- **Used for** — `backlog-import-plan` to write a plan and `backlog-run-plan-item` to run one
  item in a session, checking first whether it has already landed.
