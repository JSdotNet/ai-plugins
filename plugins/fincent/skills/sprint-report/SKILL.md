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

Generate a structured sprint report for a `FIN` sprint. The report compares the original
sprint scope (stories committed at sprint start) against the final state, groups stories
by epic, and includes untested items inside the completed section.

## Jira Setup Reference

Refer to `../../resources/jira-setup.md` for the Fincent Jira project
configuration including the status flow, custom fields, fix version naming, labels,
and epic ordering conventions.

## Data source (deterministic)

This skill renders a report from the dataset produced by
`../../scripts/Get-SprintData.ps1`. That script owns sprint resolution, JQL,
pagination, completion classification, epic ordering, and totals. It fetches sprint data
only — never release data.

One dataset covers **one team**. Run the script once per team. Paths in this file are
relative to this skill's folder; resolve them to absolute paths before running.

```powershell
../../scripts/Get-SprintData.ps1 `
  -Sprint 'Sprint A - Xanadu','Sprint B - Xanadu' `
  -Team 'Team B' `
  -OutputPath ./sprint-data-team-b.json
```

Sprint scope alternatives when the names are not known up front:

- `-ActiveSprints -BoardId {board id}` — the active sprints of a board.
- `-Release '{release name}'` — the sprints that appear on that release's issues.
- `-ExpectedSprintCount {n}` — fail the run when the resolved count differs.

When `automation-sprint-review` passes a dataset path and team, use them instead of running
the script again.

The script requires `JIRA_BASE_URL`, `JIRA_EMAIL`, and `JIRA_API_TOKEN`. If it fails, stop
and report the error — never fall back to ad-hoc Jira queries or model-discovered Jira skills.

Determinism rules:

- Read every number from `sprints[].totals`; never recount or re-add story points.
- Use `sprints[].epicOrder` verbatim for section grouping and epic order.
- Use `sprints[].issues` in the given order for table rows; never re-sort or re-filter.
- Use `sprints[].removedIssues` for scope changes.
- Treat `issue.isCompleted` as the completion verdict; do not reinterpret status text.
- Copy `status`, `epicName`, `labels`, and `summary` verbatim.
- The same `metadata.datasetHash` must always yield an identical report.

## Goals

- Render the sprint summary from `sprints[].totals`.
- Split issues into completed and not-completed using `isCompleted`.
- Group by epic using `epicOrder`.
- Output a structured report in the sections below.

This skill owns the sprint-report rendering: section layout, table formatting, sprint-goal
evaluation, and narrative summary. It does not own data fetching or classification.

## Field mapping

| Report field | Dataset path |
|--------------|--------------|
| Sprint | `sprints[].name` |
| Team | `metadata.team` |
| Period | `sprints[].metadata.startDate` – `sprints[].metadata.endDate` |
| Sprint goal | `sprints[].metadata.goal` |
| Original scope | `sprints[].totals.issueCount` / `totals.totalPoints` |
| Completed | `sprints[].totals.completedCount` / `totals.completedPoints` |
| Not completed | `sprints[].totals.notCompletedCount` / `totals.notCompletedPoints` |
| Completion rate | `sprints[].totals.completionRatePercent` |
| Epic sections | `sprints[].epicOrder` |
| Issue rows | `sprints[].issues` |
| Scope changes | `sprints[].removedIssues` |

Sprint metadata — and with it the period and the goal — is present only when the script ran
with `-BoardId`; when `sprints[].metadata` is null, write `[not available]` for the period
and drop section 6.

## Report structure

### 1. Sprint Summary

| Field | Value |
|-------|-------|
| Sprint | {sprint name} |
| Team | {team, or All teams when `metadata.team` is null} |
| Period | {start date} – {end date} |
| Original scope | {N} stories / {N} points |
| Completed | {N} stories / {N} points (includes items in Test or beyond) |
| Not completed | {N} stories / {N} points |
| Completion rate | {%} |

### 2. Completed — by Epic

Stories that are **completed** (status is Test, Acceptatie klant, Done, or beyond).
Include the actual status in the State column so it is clear which items are still
awaiting testing vs fully done.

For each epic that had completed stories in this sprint, create an epic sub-section.
Always place the **No epic** group last, after all named epics.

#### {Epic name}

| Key | Summary | Points | Type | Labels | State |
|-----|---------|--------|------|--------|-------|
| FIN-xxx | … | N | Feature/Bug/Support | label1, label2 | Done / Test / Acceptatie klant |

### 3. Not Completed (original scope)

Stories that were in the sprint at start but are **not yet completed** (status is earlier
than Test — e.g. Open, Just in, Ready, In Progress, Analyze).
Always place the **No epic** group last.

| Key | Summary | Status | Points | Epic | Labels | Reason (if known) |
|-----|---------|--------|--------|------|--------|-------------------|
| FIN-xxx | … | In Progress | N | … | … | … |

### 4. Scope Changes

Stories removed from the sprint after they were in it, from `removedIssues`. The dataset
does not record stories added mid-sprint; state "Added mid-sprint: not available in the
dataset" under the table.

| Key | Summary | Direction | Points | Labels | Reason |
|-----|---------|-----------|--------|--------|--------|
| FIN-yyy | … | Removed | N | … | … |

### 5. Bugs (sprint-only, not in Completed)

Bug-type stories in the sprint that are **not yet completed** (status before Test).
Bugs that are already completed appear in section 2 — do not duplicate them here.
Always place the **No epic** group last.

| Key | Summary | Status | Points | Epic | Labels |
|-----|---------|--------|--------|------|--------|

### 6. Sprint Goal Evaluation

If the sprint goal is available, add a compact table that shows whether each goal theme was
met and which issues support that conclusion.

| Goal item | Status | Evidence |
|-----------|--------|----------|
| Acties voor termijnen af | Met / Partially met / Not met | FIN-5894, FIN-5889, FIN-7097 |

### 7. Narrative Summary

End with one short narrative paragraph suitable for a sprint retrospective or stakeholder email.

## Required output fidelity

- Every issue listing in sections 2 through 5 must be rendered as a **Markdown table**.
- Do **not** replace issue tables with bullet lists, even when a section or epic contains only one item.
- Always include the `Points` column and the `Labels` column in the issue tables.
- Use `?` when story points are missing.
- Use `-` when labels are absent.
- Preserve the exact Jira status text in `State` / `Status`.
- Keep the **No epic** group last in every grouped section.

## Working rules

- Render only from the dataset; never query Jira and never estimate a missing value.
- Original scope is the dataset issue set; items in `removedIssues` are reported in Scope
  Changes and excluded from the completion rate.
- **Completed** means `isCompleted` is `true` in the dataset. These items appear in section 2
  with their actual `status` so readers can distinguish fully done from still-in-testing items.
- **Not Completed** means `isCompleted` is `false`.
- Group every section by epic using `epicOrder` — never mix stories from different epics in
  the same table and never reorder the groups.
- The **No epic** group is already last in `epicOrder`; keep that position.
- If `sprints[].metadata.goal` is available, include section 6 instead of dropping that context.
- After producing the report, present section 7 as the final narrative summary.
- Quote `metadata.datasetHash` at the end of the report for reproducibility.

## Tools used

- `../../scripts/Get-SprintData.ps1` — deterministic sprint data collection.
