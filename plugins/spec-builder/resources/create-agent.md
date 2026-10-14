---
name: create-agent
description: Dedicated rules for creating and refining GitHub Copilot agent files.
---

# Create Agent Instructions

## Minimum Structure

Required: YAML frontmatter with `name` and `description`, a title, and a purpose section.

Add expected behavior, constraints, references, and custom instruction sections when the
agent needs them. An empty or restating section is a section to delete.

## Rules

- Keep scope explicit and responsibilities narrow.
- Record the model preference in a `## Model` body section; leave `model` out of frontmatter.
- Author `tools` by hand as one union list: the Copilot tool ids first, then the Claude names
  `tools/tool-map.json` translates them to. Nothing appends them; `node tools/check-assets.mjs`
  fails on a mismatch.
- Name every `handoffs` target in the body as `<plugin>:<agent>`, and write no approval step
  around it.
- Leave runtime application code guidance to the plugin that owns that code.
- Follow [spec-conciseness.md](spec-conciseness.md) for pruning and
  the 80-line body budget.
- The reasoning behind the `model`, `tools`, and `handoffs` items above is in
  [Crosscutting Concepts](../../../.devbook/arc42/08-crosscutting-concepts.md), in the
  marketplace's own repository only; this contract is the installed source of the rules.

## Validation Checklist

- [ ] File name follows `<role>.agent.md`.
- [ ] Frontmatter is valid YAML and `name` matches the file name.
- [ ] No `model` pin.
- [ ] `node tools/check-assets.mjs` passes.
- [ ] Role, scope, and constraints are explicit.
- [ ] References point to existing files.
