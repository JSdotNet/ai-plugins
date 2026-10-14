---
name: story-pipeline
description: The Fincent story readiness order, the verdict legend every story review uses, and the input precondition each review checks before it runs.
---

# Story readiness pipeline

## Order

A story is reviewed in this order; each review takes every earlier verdict as input:

1. `story-review-po` — against the Definition of Ready in [dor.md](dor.md); no precondition.
2. `story-review-domain` — takes the PO verdict.
3. `story-review-dev` — takes the PO and domain verdicts.
4. `story-point-estimation` — takes all three.

## Verdict legend

Every criterion and every overall result carries one label. This is the only definition;
the checklist and the review skills use it as written here.

| Label | Means | Next |
|---|---|---|
| ✅ | Meets every applicable criterion | Proceeds to the next review |
| ⚠️ | Gaps that do not block, each listed with a concrete correction | Proceeds; the gaps travel with it |
| ❌ | A blocking gap | Stops; rework before the next review |
| ⏭ | Not assessed at this stage, with the reason | Never counts against the verdict |

Leave out a criterion or section that does not apply to the story type; it is not ❌.

## Input precondition

Before reviewing, read the verdict of every earlier review — from the findings a batch run
wrote back to Jira, or from a review run in this session.

- A verdict is missing: output `**Not ready for {this review}** — no {earlier review}
  verdict yet` and stop.
- A verdict is ❌: output `❌ **Not ready for {this review}** — resolve first: {that
  review's blockers}` and stop.
- Otherwise run the review.

## Every review's output

- One row per assessed criterion: label, finding, and for ⚠️ or ❌ the concrete correction.
- The overall label with the review's own name for it, and a one-line rationale.
- A prioritised list of corrections when the result is not ✅.
- The next step: on ✅ or ⚠️ the next review in the order; on ❌ the blockers to resolve.
