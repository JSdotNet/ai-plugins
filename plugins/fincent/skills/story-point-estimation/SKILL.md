---
name: story-point-estimation
description: >
  Estimate story points for a Fincent user story with a three-factor model (complexity,
  effort, uncertainty) mapped to Fibonacci points and calibrated against reference stories.
  Takes the story's PO, domain, and dev review verdicts as input. Use when: "estimate
  FIN-123", "how many points is this story", before sprint planning. DO NOT USE FOR: a batch
  by Jira status (automation-story-point-estimation).
---

# Story Point Estimation

Last in [story-pipeline.md](../../resources/story-pipeline.md): check its input
precondition (the PO, domain, and dev verdicts) first, writing **Not estimable** where that
file says "Not ready for estimation".

1. Load the story per [jira-discovery.md](../../resources/jira-discovery.md) and read its
   description and every acceptance criterion; fetch the reference stories with known
   points when the user gives them. Estimate from the story and the references only.
2. Score Complexity, Effort, and Uncertainty 1–5 on the rubric in the Story Points section of
   [story-review-checklist.md](../../resources/templates/story-review-checklist.md), with a
   rationale per score.
3. Hold the uncertainty floors:
   - Score Uncertainty 1 only when the team delivered an identical story, named as reference.
   - Score Uncertainty at least 3 for a story touching an external Fincent integration —
     payment rails, regulatory APIs — unless the rationale justifies lower explicitly.
4. When Effort is 5 (over 12 hours, the hard DOR limit), give no points: output **Split
   required** with a proposed split, and stop here.
5. Otherwise map the factor sum to one Fibonacci value:

   | Sum | 3 | 4–5 | 6–8 | 9–10 | 11–12 | 13–14 |
   |---|---|---|---|---|---|---|
   | Points | 1 | 2 | 3 | 5 | 8 | 13 |

   A sum of 15 always has Effort 5, so it never reaches the table.
6. Compare with the reference stories; when they disagree, adjust and say why.

## Output

The filled Story Points table, the points or **Split required** with the proposed split, and
a calibration note when reference stories were used.
