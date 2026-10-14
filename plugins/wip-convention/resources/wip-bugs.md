---
name: wip-bugs
description: Where a bug report goes in the .wip convention, and which standard governs its content.
---

# Bug placement

- Path: `.wip/work/<module>/bug-<short-title>.md` — one module depth, `<short-title>`
  lowercase kebab-case, in the same module folder as the related epic and story files.
- Content: the bug standard is `product-owner`'s — write the bug with
  `product-owner:write-bug`, which loads that plugin's `bugs` contract.
- Without `product-owner`, keep this section order: `# Bug: <short problem title>`,
  `## Summary`, `## Problem`, `## Steps to Reproduce` (numbered, deterministic),
  `## Expected Result`, `## Actual Result`, `## Scope`, `## Acceptance Criteria`,
  `## Jira Fields`, `## Notes` — one defect per file.
- Apply [wip-confidence.md](wip-confidence.md) while writing it: it sits under `.wip/work/`.
