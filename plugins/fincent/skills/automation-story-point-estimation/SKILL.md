---
name: automation-story-point-estimation
description: 'Automated story point estimation for Fincent. Queries all stories in a given Jira status and runs the story-point-estimation skill on each unestimated story. Produces a consolidated estimation report.'
disable-model-invocation: true
---

# Automation: Story Point Estimation

Run `story-point-estimation` over every story in one Jira status. Follow
[batch-review.md](../../resources/batch-review.md) for the inputs, the confirmation, the
per-story loop, and write-back; this skill's summary replaces the batch summary.

## Extra inputs

- **Skip estimated** — `true` (default) records a story's existing estimate and skips it;
  `false` estimates it again and reports the drift.
- **Reference stories** — Jira keys of estimated stories; fetch them once for calibration.

## Per story

1. A story missing a PO, domain, or dev verdict, or with a ❌ one, is **Not estimable**:
   record the missing or blocking review and move on.
2. Read its current Story Points, then estimate it unless **Skip estimated** applies.
3. With **Update Jira** `true`, write the estimate only when the story has none; an existing
   estimate is never overwritten, and the cell reads `No (existed)`.

## Summary

| Story | Title | Reviews | Current Points | New Estimate | Δ | Split Needed | Jira Updated |
|---|---|---|---|---|---|---|---|
| FIN-124 | … | ✅ | 3 | 5 | +2 | No | No (existed) |
| FIN-125 | … | ❌ dev | — | — | — | — | No (not estimable) |

- **Δ** is the new estimate minus the current value; blank when there was none. Highlight
  every row where `|Δ| > 2` for team review.
- List the estimated stories first in listed order, and the not-estimable stories last.
