---
name: sprint-report
description: >
  Render a Fincent sprint report for one team from the Get-SprintData.ps1 dataset: completed
  (Test or beyond) vs sprint scope, not completed, removed scope, and a breakdown by epic.
  Use when: "sprint report", "what did we finish this sprint", "sprint FIN results", after a
  sprint ends or for the sprint review. DO NOT USE FOR: a fixVersion (release-report), or the
  full review with deck (automation-sprint-review).
---

# Sprint Report

Render one team's `FIN` sprint report from a `Get-SprintData.ps1` dataset. Before rendering,
read [dataset-rendering.md](../../resources/dataset-rendering.md); the Jira conventions are
in [jira-setup.md](../../resources/jira-setup.md).

## Dataset

One dataset covers one team. Run `../../scripts/Get-SprintData.ps1 -Team '{team}'
-OutputPath ./sprint-data-{team}.json` with the scope as `-Sprint '{name}','{name}'`,
`-ActiveSprints -BoardId {id}`, or `-Release '{name}'`, plus `-ExpectedSprintCount {n}` when
the count is known; omit `-Team` for all teams. Render one report per `sprints[]` entry.

| Report field | Dataset path |
|---|---|
| Sprint / Team | `sprints[].name` / `metadata.team` (null: `All teams`) |
| Period | `sprints[].metadata.startDate` – `sprints[].metadata.endDate` |
| Sprint goal | `sprints[].metadata.goal` |
| Original scope | `sprints[].totals.issueCount` / `totals.totalPoints` |
| Completed | `totals.completedCount` / `totals.completedPoints` |
| Not completed | `totals.notCompletedCount` / `totals.notCompletedPoints` |
| Completion rate | `totals.completionRatePercent` |

`sprints[].metadata` exists only when the script ran with `-BoardId`; when it is null, write
`[not available]` for the period and drop section 6. `removedIssues` stay out of the
completion rate.

## Sections

1. **Sprint Summary** — a `Field | Value` table of the mapped fields; Completed reads
   `{N} stories / {N} points (includes items in Test or beyond)`.
2. **Completed — by Epic** — `isCompleted` true: `Key | Summary | Points | Type | Labels | State`.
3. **Not Completed (original scope)** — `isCompleted` false:
   `Key | Summary | Status | Points | Epic | Labels | Reason (if known)`.
4. **Scope Changes** — `removedIssues`: `Key | Summary | Direction | Points | Labels |
   Reason`; under it, "Added mid-sprint: not available in the dataset".
5. **Bugs (not completed)** — bug-type issues with `isCompleted` false, since completed bugs
   appear in section 2 only: `Key | Summary | Status | Points | Epic | Labels`.
6. **Sprint Goal Evaluation** — when the goal exists: `Goal item | Status | Evidence`, with
   Status `Met`, `Partially met`, or `Not met` and the supporting keys as evidence.
7. **Narrative Summary** — one short paragraph for a retrospective or stakeholder email,
   the report's closing paragraph.
