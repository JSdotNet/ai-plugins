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
- Author `tools` as Copilot tool ids only; the sync script appends the Claude equivalents.
- Describe every `handoffs` target in the body, and require explicit approval for each.
- Leave runtime application code guidance to the plugin that owns that code.
- Follow [spec-conciseness.md](spec-conciseness.md) for pruning and
  the 80-line body budget.
- The dual-host rules behind the `model`, `tools`, and `handoffs` items above are in
  [Crosscutting Concepts](../../../.devbook/arc42/08-crosscutting-concepts.md).

## Validation Checklist

- [ ] File name follows `<role>.agent.md`.
- [ ] Frontmatter is valid YAML and `name` matches the file name.
- [ ] No `model` pin.
- [ ] `node tools/check-assets.mjs` passes.
- [ ] Role, scope, and constraints are explicit.
- [ ] References point to existing files.
