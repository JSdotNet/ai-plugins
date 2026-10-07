# spec-builder

Installable plugin for creating customization assets that load in both GitHub Copilot and
Claude Code from a single copy of every file.

## Includes

- Agent:
  - `agents/spec-builder.agent.md`
- Skills:
  - `skills/create-agent/SKILL.md`
  - `skills/create-instruction/SKILL.md`
  - `skills/create-plugin/SKILL.md`
  - `skills/create-skill/SKILL.md`
  - `skills/create-workflow/SKILL.md`
- Instructions:
  - `resources/agent-naming.md`
  - `resources/agent-spec-workflow.md`
  - `resources/create-agent.md`
  - `resources/create-instruction.md`
  - `resources/create-plugin.md`
  - `resources/create-skill.md`
  - `resources/create-canvas.md`
  - `resources/create-workflow.md`
  - `resources/spec-conciseness.md`
- Resources:
  - `resources/quick-reference.md`
- Hooks:
  - `hooks.json` (session-start authoring quality guardrail prompt), with its Claude twin in
    `hooks/`
  - `hooks/budget-status.ts` — Claude only, see [Body budget status](#body-budget-status)

## Body budget status

In Claude Code, after every Write or Edit the status line shows the edited asset's body lines
against its budget from [`resources/spec-conciseness.md`](resources/spec-conciseness.md):

| Asset | Budget |
| --- | --- |
| `SKILL.md` | 40 |
| `*.agent.md` | 80 |
| `rules/*.md`, `.agents/rules/*.md`, a `resources/*.md` contract (`name` + `description`) | 60 |

Body lines are the non-blank lines after the frontmatter, as `tools/check-assets.mjs` counts
them. `SKILL.md 37/40` is plain below 90% of the budget, 🟡 within 10% of it, 🔴 over it,
and `(exempt)` when the file states why it exceeds it ("Over the 60-line budget by design:
..."). A toast fires once per file per session when an edit first takes it over. Editing any
other file clears the status. It matches by filename, so it works in any repository. Tests:

```bash
claude plugin validate plugins/spec-builder
claude plugin test plugins/spec-builder
```

## Scope

- This plugin focuses on creating and refining GitHub customization assets: agents, instructions, plugins, skills, canvas extensions, and GitHub Actions workflow files.
- A single `spec-builder` agent owns the full flow: scope, plan, build, verify, and report.
- Asset-specific rules live in the `create-*` skills and matching authoring instructions.
- It does not provide runtime application code implementation.
- It is self-contained and does not require assets from an external source repository.

## Dual-Host Authoring

Every asset this plugin produces is authored once and read by both GitHub Copilot and Claude
Code. Both manifests and both hook files are hand-authored — nothing is generated — and a
change to one host's file is a change owed to the other. Run the checker before committing;
CI fails on drift:

```bash
node tools/check-assets.mjs
```

Canvas extensions are the one Copilot-only asset type. Full rules:
[Crosscutting Concepts](../../.devbook/arc42/08-crosscutting-concepts.md).

## Install

```bash
copilot plugin install JSdotNet/ai-plugins:plugins/spec-builder
copilot plugin list
```

## Reinstall After Changes

```bash
copilot plugin install JSdotNet/ai-plugins:plugins/spec-builder
```

## Uninstall

```bash
copilot plugin uninstall spec-builder
```

## Resources

- [GitHub Copilot Customization Docs](https://docs.github.com/en/copilot/customizing-copilot) — official reference for agents, instructions, prompts, and skills.
- [VS Code Copilot Chat Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) — host environment for `.agent.md`, `.instructions.md`, and `SKILL.md` files.
- [GitHub Copilot for Azure](https://docs.github.com/en/copilot/github-copilot-enterprise) — enterprise context and deployment considerations.
- [YAML Frontmatter Reference](https://jekyllrb.com/docs/front-matter/) — general frontmatter syntax used in Copilot customization assets.

## Future Upgrades

- **Review create naming**
- **Prompt authoring skill** — add a `create-prompt` skill and matching `resources/create-prompt.md` to cover `.prompt.md` assets.
- **Multi-action canvas templates** — add reusable canvas renderer templates (static-file server, Vite dev server wiring) to `resources/` referenced by the `create-canvas` instructions.
- **Spec authoring skill** — add a `create-spec` skill for structured specification documents that drive multi-step agent workflows.
- **`plugin.json` schema validation** — add a `validate-plugin` skill that checks manifest completeness and path integrity before install.
- **Hooks and MCP authoring** — add skills for `hooks.json` and `.mcp.json` to support lifecycle automation and MCP server wiring.
- **Resource templates folder** — add a `resources/` folder with reusable checklists, frontmatter templates, and example assets for bootstrapping new customization work.
- **Marketplace publishing workflow** — extend `create-plugin` to include `marketplace.json` composition and publishing readiness checks.
