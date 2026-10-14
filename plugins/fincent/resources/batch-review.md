---
name: batch-review
description: The shared loop of the Fincent automation-story-* skills — inputs, confirmation, a per-story run of the matching single-story skill, Jira write-back, and the sorted summary.
---

# Batch review loop

Each `automation-story-*` skill runs this loop around its single-story skill and names its
own extra inputs, per-story additions, and summary columns. Where a skill states a rule
that differs from this file, the skill's rule wins.

## Inputs

- **Jira status** — every story currently in this status is in the run (for example
  `Pre-Refinement` or `Refinement`).
- **Update Jira** — `false` by default; `true` writes each story's result back.

## Loop

1. Reach Jira per [jira-discovery.md](jira-discovery.md) and list the stories in the
   status. With no search available, run on one pasted story.
2. Load the shared context once for the whole batch: [dor.md](dor.md),
   [story-pipeline.md](story-pipeline.md),
   [story-review-checklist.md](templates/story-review-checklist.md), and what the skill adds.
3. Present the story count and keys and wait for the user to confirm before reviewing any
   story.
4. For each story, in the listed order:
   1. Fetch its full content.
   2. Read its earlier verdicts per the precondition in story-pipeline.md. A story missing
      one, or with a ❌ one, is recorded as blocked with that reason; move to the next story.
   3. Run the single-story skill with the verdicts and the shared context, as that skill is
      written.
   4. When **Update Jira** is `true`, write the result back per jira-discovery.md.
5. Output the summary, then the per-story findings in the same order.

## Summary

One table, one row per story: `Story | Title | {the skill's columns} | Verdict | Jira
updated`.

- Sort ❌ first, then ⚠️, then ✅. A blocked story sits with ❌ and names the missing or
  blocking review.
- **Jira updated** is `yes`, `no (off)`, or `skipped ({reason})`.
