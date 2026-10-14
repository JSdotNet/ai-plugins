---
name: write-bug
description: 'Draft or refine one reproducible bug artifact with clear impact, expected behavior, and testable acceptance criteria. Use when: writing up a bug, a defect report, reproduction steps, or tightening an existing bug. DO NOT USE FOR: a user story (write-story) or an epic (write-epic).'
---

# Write Bug

Use this skill to write or improve bug artifacts only.

## Rules

- Load [bugs.md](../../resources/bugs.md) before writing.
- Store the file per `wip-convention:wip-align` when that plugin is installed; without it, at
  `.wip/work/<module>/bug-<short-title>.md`.
- Keep bug scope bounded to one defect per artifact.
- Keep Jira synchronization as a separate step handled by the `jira` plugin's skills.
