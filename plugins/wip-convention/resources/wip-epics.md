---
name: wip-epics
description: Where an epic goes in the .wip convention, and which standard governs its content.
---

# Epic placement

- Path: `.wip/work/<module>/epic-<short-title>.md` — one module depth, `<short-title>`
  lowercase kebab-case, in the same module folder as its stories and bugs.
- Content: the epic standard is `product-owner`'s — write the epic with
  `product-owner:write-epic`, which loads that plugin's `epics` contract.
- Without `product-owner`, keep this section order: `# Epic: <outcome title>`, `## Scope`,
  `## Risks and Dependencies`, `## Jira Fields`, `## Notes` — an outcome, not a task bucket,
  decomposable into independent stories.
- Apply [wip-confidence.md](wip-confidence.md) while writing it: it sits under `.wip/work/`.
