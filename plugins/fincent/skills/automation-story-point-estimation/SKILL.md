---
name: automation-story-point-estimation
description: 'Automated story point estimation for Fincent. Queries all stories in a given Jira status and runs the story-point-estimation skill on each unestimated story. Produces a consolidated estimation report.'
disable-model-invocation: true
---

# Automation: Story Point Estimation

## Purpose

Run a batch story point estimation across all Fincent stories in a specified Jira status.
For each story, the automation reads the PO, domain, and dev review verdicts, applies
calibration from reference stories, and delegates to the `story-point-estimation` skill to produce a reasoned
Fibonacci estimate.

## Jira Skill Discovery

Before executing any Jira operation, discover what Jira skills are available:

1. Check installed skills for skills whose name or description mentions "jira".
2. Identify a **query-capable** Jira skill — one that can search or list issues by status.
3. Identify a **retrieval-capable** Jira skill — one that can fetch a single existing issue.
4. Identify an **update-capable** Jira skill — one that can sync content back to an
   existing issue (including estimate fields).
5. If no query or retrieval skill is found: ask the user to paste story content for a
   single-story fallback run.
6. If no update skill is found and `update Jira` is enabled: skip write-back and note
   it in the output.

All Jira field mapping, project keys, and API conventions are owned by the discovered
Jira skill. Never reproduce that knowledge in this skill.

## Inputs

- **Jira status**: the status to query (e.g., `Ready for Refinement`, `Backlog`, `To Do`).
  All stories currently in this status are included in the run.
- **Skip estimated**: `true` (default) or `false` — `true` skips stories that already have an
  estimate in Jira; `false` re-estimates them and reports drift against the current value.
- **Reference stories**: comma-separated list of Jira keys of previously estimated stories
  for calibration (optional).
- **Update Jira**: `true` or `false` (default) — write estimates back to Jira for stories
  that do not yet have one.

## Dependencies

| Dependency | Provided by | Purpose |
|-----------|-------------|---------|
| Story list | Discovered Jira query skill | All stories in the target status |
| Story content | Discovered Jira retrieval skill | Per-story estimation target |
| Reference stories | Discovered Jira retrieval skill | Calibration against historical velocity |
| Jira write-back | Discovered Jira update skill | Sync estimate and reasoning per story |
| Review verdicts | Story content in Jira, or this session | PO, domain, and dev verdicts per story |
| Story review checklist | `../../resources/templates/story-review-checklist.md` | Estimation section |

## Workflow

### Phase 1 — Story List and Shared Context

1. Run Jira Skill Discovery (see above).
2. Use the discovered query skill to retrieve all stories in the specified status.
   Let that skill own the query, filter, and pagination logic.
3. If reference stories were provided, use the retrieval skill to fetch them for
   calibration context.
4. Load `../../resources/templates/story-review-checklist.md` once.
5. Present the story count to the user and confirm before proceeding.

### Phase 2 — Per-Story Estimation (repeat for each story)

6. Use the discovered retrieval skill to fetch the full story content.
7. Read the story's `story-review-po`, `story-review-domain`, and `story-review-dev`
   verdicts — from the review findings the review automations wrote back to Jira, or from
   reviews run in this session. If any verdict is missing or ❌, record the story as
   **Not estimable** with the missing or blocking review, and continue to the next story.

8. Check whether the story already has an estimate in Jira:
   - If an estimate exists and `skip estimated` is `true`: record it and skip estimation.
   - If an estimate exists and `skip estimated` is `false`: record it for the drift column
     and estimate.
   - If no estimate exists: estimate.

9. Use the `story-point-estimation` skill, passing the three verdicts and the loaded context, to:
    - Score Complexity, Effort, and Uncertainty (each 1–5) with explicit reasoning.
    - Map the factor sum to Fibonacci points.
    - Calibrate against reference stories if available.
    - Flag stories exceeding 12 hours / equivalent points for split discussion.
10. If `update Jira` is enabled and an update skill was discovered:
    - Only update if no estimate currently exists in Jira.
    - Use the discovered update skill to sync the estimate to Jira.

### Phase 3 — Consolidated Summary

11. Output a consolidated batch summary after all stories are processed:

    | Story | Title | Reviews | Current Points | New Estimate | Δ | Split Needed | Jira Updated |
    |-------|-------|-----------|---------------|--------------|---|-------------|-------------|
    | FIN-123 | — | ✅ | — | 5 | — | No | Yes |
    | FIN-124 | — | ✅ | 3 | 5 | +2 | No | No (existed) |
    | FIN-125 | — | ❌ dev | — | — | — | — | No (not estimable) |

    - **Δ**: difference between the new estimate and the current Jira value; blank when no
      prior estimate. Highlight rows where `|Δ| > 2` for team review.
    - Stories not estimable are listed last with the missing or blocking review.

## Output

- Per-story three-factor estimate with explicit reasoning.
- Split recommendations for stories exceeding the 12-hour DOR limit.
- Consolidated batch summary with drift column.
- Jira estimates updated for previously unestimated stories (if enabled and available).

## Notes

- The Uncertainty floor for external Fincent integrations (payment rails, regulatory APIs)
  is `story-point-estimation`'s rule; apply it as written there.
- Codebase inspection is not performed during estimation — that is reserved for the
  technical review (`story-review-dev`). Estimation is based on story content and
  reference stories only.
