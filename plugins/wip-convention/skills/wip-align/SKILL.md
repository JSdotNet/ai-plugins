---
name: wip-align
description: 'Align with the .wip folder convention for storing work-in-progress artifacts. Use when: creating stories, epics, bugs, ideas, proposals, or any planning artifact. Triggers on: ".wip", "wip convention", "work in progress", "store artifact", "planning artifact", "where to store", "artifact placement".'
---

# WIP Alignment Skill

Store every work-in-progress artifact under `.wip/` by this table, and read the row's
contract before writing the file — nothing applies it for you.

| Type | Holds | Path | Name | Contract |
|---|---|---|---|---|
| Story | a sprint-sized backlog item | `.wip/work/<module>/` | `story-<short-title>.md` | [wip-stories.md](../../resources/wip-stories.md) |
| Epic | a product outcome to split into stories | `.wip/work/<module>/` | `epic-<short-title>.md` | [wip-epics.md](../../resources/wip-epics.md) |
| Bug | one reproducible defect | `.wip/work/<module>/` | `bug-<short-title>.md` | [wip-bugs.md](../../resources/wip-bugs.md) |
| Idea | an early problem or value hypothesis | `.wip/ideas/` | `idea-<short-title>.md` | [wip-ideas.md](../../resources/wip-ideas.md) |
| Proposal | a technical proposal or decision draft under review | `.wip/proposals/` | `proposal-<short-title>.md` | [wip-proposals.md](../../resources/wip-proposals.md) |
| Implementation plan | an execution blueprint handed from planning to development | `.wip/implementation-plans/` | `plan-<feature>.md` | — |

- `<short-title>` and `<feature>` are lowercase kebab-case: `.wip/work/ordering/story-cart-checkout.md`.
- `.wip/work/` has exactly one module level: `<module>` is a single folder, never nested.
  Keep an epic and its stories and bugs in the same module folder.
- Everything under `.wip/work/` also follows
  [wip-confidence.md](../../resources/wip-confidence.md), the 97% confidence threshold.
- Handing work to another agent or session: store the partial artifact under `.wip/` in its
  row's folder and pass the file path along.
