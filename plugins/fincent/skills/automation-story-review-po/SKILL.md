---
name: automation-story-review-po
description: 'Automated Product Owner story review for Fincent. Queries all stories in a given Jira status, applies the Fincent DOR to each, and produces a consolidated readiness report. Use before backlog refinement to surface and fix story quality issues automatically.'
disable-model-invocation: true
---

# Automation: Story Review — Product Owner

Run `story-review-po` over every story in one Jira status. Follow
[batch-review.md](../../resources/batch-review.md) for the inputs, the confirmation, the
per-story loop, write-back, and the summary. The PO review reads no earlier verdict, so no
story is blocked.

## Extra inputs

- **Story type filter** — `all` (default), `feature`, `bug`, or `support`. Drop the other
  types from the list before presenting the count.
- **Auto-fix suggestions** — `true` (default) adds to each ⚠️ and ❌ finding the corrected
  text: the rewritten title or description, or the item to attach. `false` lists the gaps
  only.

## Summary columns

`Type` beside the batch columns. The verdict is ✅ Ready, ⚠️ Needs refinement, or ❌ Not ready.
