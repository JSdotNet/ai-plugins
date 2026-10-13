---
name: create-agent
description: 'Create or refine an agent file with correct frontmatter, scope, tools, and handoff documentation. Use when: authoring, reviewing, or fixing a *.agent.md, its tools list, or its handoffs. DO NOT USE FOR: a skill (create-skill) or a rule or contract (create-instruction).'
---

# Create Agent Skill

## Inputs

- Agent role, intent, and scope boundaries.
- Required tools and handoff expectations.

## Workflow

1. Review related agent and instruction files, and reuse their patterns.
2. Define role, priorities, constraints, and quality expectations.
3. Draft frontmatter with `name` matching the file name, plus `description`. Author `tools`
   as one union list — the Copilot tool ids first, then the Claude names `tools/tool-map.json`
   translates them to — and record any model preference in a `## Model` body section rather
   than in frontmatter.
4. Draft the body: purpose first, then behavior, constraints, and references — adding each
   section only when the agent needs it.
5. Describe every handoff target in the body, since the `handoffs` key alone does not carry
   it to both hosts.
6. Prune against
   [spec-conciseness.md](../../resources/spec-conciseness.md):
   80-line body budget, no rule stated twice.
7. List the agent under `agents` in the Claude manifest, then run
   `node tools/check-assets.mjs` to confirm the tools list matches `tools/tool-map.json` and
   the agent is valid for both hosts.

## References

- [create-agent.md](../../resources/create-agent.md)
- [Crosscutting Concepts](../../../../.devbook/arc42/08-crosscutting-concepts.md) — why
  `model`, `tools`, and `handoffs` are handled the way step 3 and step 5 require. It exists
  only in the marketplace's own repository; where it is absent, `create-agent.md` above is
  the source.
