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

## Input Expectations

- The user story to estimate (Jira link, ID, or pasted content).
- The story's `story-review-po`, `story-review-domain`, and `story-review-dev` verdicts
  (each ✅ or ⚠️).
- Optional: reference stories with known point values for calibration.
- Optional: team velocity for calibration. Points are Fibonacci (1, 2, 3, 5, 8, 13).

## Estimation Model

Use the three-factor model from `../../resources/templates/story-review-checklist.md`:

### Factor 1 — Complexity (1–5)

How complex is the logic, domain, or integration involved?

- 1: Trivial change, no logic, minimal code impact.
- 2: Simple logic, single component, well-understood domain.
- 3: Moderate logic, touches multiple components or a domain rule.
- 4: Complex logic, cross-context integration, or new domain concept.
- 5: Highly complex, novel domain territory, or significant algorithm work.

### Factor 2 — Effort (1–5)

How much work is required regardless of complexity?

- 1: < 2 hours of implementation.
- 2: Half a day (~4 hours).
- 3: One day (~8 hours) — approaching the DOR size limit.
- 4: Up to 12 hours — at the DOR size limit; consider splitting.
- 5: Exceeds 12 hours — **must be split** before the story can enter a sprint.

### Factor 3 — Uncertainty / Risk (1–5)

How much is unknown or risky about delivery?

- 1: Fully understood; no unknowns.
- 2: Minor unknowns; team has handled similar before.
- 3: Some unknowns; spike may be needed.
- 4: Significant unknowns; dependency on external parties or unclear requirements.
- 5: High uncertainty; story may need to be split after discovery.

## Workflow

1. Load the story content.
2. **Precondition**: all three verdicts are ✅ or ⚠️. If any is missing, output
   **Not estimable — no {review} verdict yet** and stop. If any is ❌, stop and output:
   > ❌ **Not estimable** — the following issues must be resolved first: {list blockers}.
3. If available, load reference stories for calibration.
4. Score each factor (1–5) with explicit reasoning for each score.
5. If Effort is 5 (over 12 hours), produce no points: output **Split required** with a
   proposed split, and skip steps 6–7. Otherwise map the factor sum to one Fibonacci value:

   | Factor Sum | Points |
   |-----------|--------|
   | 3         | 1      |
   | 4–5       | 2      |
   | 6–8       | 3      |
   | 9–10      | 5      |
   | 11–12     | 8      |
   | 13–14     | 13     |

   A sum of 15 always has Effort 5, so it never reaches the table.

6. Compare against reference stories if provided; adjust if the calibration differs.
7. Flag stories where the estimate exceeds **12 hours** (or the equivalent story points) for
   mandatory split discussion — this is a hard DOR constraint.
8. Summarise the estimate with the reasoning behind each factor score.

## Output Expectations

- Factor scores with explicit rationale for each.
- Story points, or **Split required** with a proposed split.
- Split recommendation if the estimate exceeds 12 hours or equivalent.
- Calibration note if reference stories were used.

## Quality Checks

- Never estimate without reading the story description and any acceptance criteria.
- Uncertainty is never scored 1 unless the team has an identical delivered story as reference.
- Stories touching external Fincent integrations (payment rails, regulatory APIs) are never
  scored below 3 for uncertainty without explicit justification.
- Stories exceeding 12 hours always get a split recommendation and no points.

## References

- `../../resources/templates/story-review-checklist.md` — estimation section
- `../../resources/dor.md` — story readiness criteria (a story must meet DOR before estimation is reliable)
