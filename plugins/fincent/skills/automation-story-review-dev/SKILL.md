---
name: automation-story-review-dev
description: 'Automated dev story review for Fincent. Queries all stories in a given Jira status, retrieves architecture documentation and ADRs, and runs the story-review-dev skill on each. Identifies architectural gaps and drafts enabler stories when needed.'
disable-model-invocation: true
---

# Automation: Story Review — Dev

Run `story-review-dev` over every story in one Jira status. Follow
[batch-review.md](../../resources/batch-review.md) for the inputs, the confirmation, the
per-story loop, write-back, and the summary.

## Extra inputs

- **Architecture context path** — the architecture documentation folder; default
  `.devbook/arc42/`, with the ADRs in `.devbook/arc42/adr/`. Load it once for the batch.
- **Draft enabler stories** — `true` (default) saves each enabler `story-review-dev` drafts
  as a Markdown artifact under `.wip/`: title, enabler type, description, and acceptance
  scope. `false` keeps the enabler need in the findings only.

## Per story

Pass the PO and domain verdicts and the architecture context to `story-review-dev`. When
**Update Jira** is `true`, also create each drafted enabler per
[jira-discovery.md](../../resources/jira-discovery.md) and name its key in the story's
write-back.

## Summary columns

`Enabler drafted` — `No`, the `.wip/` path, or the created key. The verdict is ✅ Arch ready,
⚠️ Conditional, or ❌ Blocked; a story blocked by a missing or ❌ verdict sits under ❌ with
that reason.
