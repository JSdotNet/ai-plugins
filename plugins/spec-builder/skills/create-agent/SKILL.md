---
name: create-agent
description: 'Create or refine an agent file with correct frontmatter, scope, tools, and handoff documentation. Use when: authoring, reviewing, or fixing a *.agent.md, its tools list, or its handoffs. DO NOT USE FOR: a skill (create-skill) or a rule or contract (create-instruction).'
---

# Create Agent Skill

Before drafting, read [create-agent.md](../../resources/create-agent.md): it owns the
frontmatter, `tools`, `model`, and handoff rules. Why they work that way is in
[Crosscutting Concepts](../../../../.devbook/arc42/08-crosscutting-concepts.md), which exists
only in the marketplace's own repository; where it is absent, the contract is the source.

## Inputs

- Agent role, intent, and scope boundaries.
- Required tools and handoff targets.

## Workflow

1. Review related agent and instruction files, and reuse their patterns.
2. Define role, priorities, constraints, and quality expectations.
3. Draft the frontmatter and the body per create-agent.md: purpose first, then behavior,
   constraints, and references — adding each section only when the agent needs it.
4. Prune against [spec-conciseness.md](../../resources/spec-conciseness.md): 80-line body
   budget, no rule stated twice.
5. List the agent under `agents` in the Claude manifest, then run
   `node tools/check-assets.mjs` to confirm the tools list matches `tools/tool-map.json` and
   the agent is valid for both hosts.
