---
name: release-report
description: >
  Render a Fincent release report for one fixVersion from the Get-ReleaseData.ps1 dataset:
  delivered (Test or beyond), deferred, removed scope, by epic, bug fixes, and a stakeholder
  release notes draft. Use when: "release report", "what is in release/2026.32.0", release
  notes, release sign-off. DO NOT USE FOR: one sprint's results (sprint-report), or the full
  review with deck (automation-sprint-review).
---

# Release Report

Render a `FIN` release report for one fixVersion from a `Get-ReleaseData.ps1` dataset.
Before rendering, read [dataset-rendering.md](../../resources/dataset-rendering.md); the Jira
conventions are in [jira-setup.md](../../resources/jira-setup.md).

## Dataset

Run `../../scripts/Get-ReleaseData.ps1 -Release '{fixVersion}' -OutputPath
./release-data.json`. Omit `-Release` for the latest fixVersion, released or not; omit
`-Team` for all teams.

| Report field | Dataset path |
|---|---|
| Release / Teams | `release.name` / `metadata.team` (null: `All teams`) |
| Release date / Released | `release.version.releaseDate` / `release.version.released` |
| Sprints covered | `release.sprintsCovered` — every name |
| Original scope | `release.totals.issueCount` / `totals.totalPoints` |
| Delivered | `totals.completedCount` / `totals.completedPoints` |
| Deferred | `totals.notCompletedCount` / `totals.notCompletedPoints` |
| Delivery rate / Bug fixes | `totals.completionRatePercent` / `totals.completedBugCount` |

## Sections

1. **Release Summary** — a `Field | Value` table of the mapped fields; Delivered reads
   `{N} stories / {N} points (includes items in Test or beyond)`. Directly after it, a
   `Status | Count` table from `release.statusBreakdown` and a `Type | Count` table from
   `release.typeBreakdown`, in dataset order.
2. **Delivered — by Epic** — `isCompleted` true: `Key | Summary | Points | Type | Labels | State`.
3. **Deferred (not shipped)** — `isCompleted` false:
   `Key | Summary | Status | Points | Epic | Labels | Reason (if known)`.
4. **Scope Changes** — `release.removedIssues`, issues that carried this fixVersion and no
   longer do: `Key | Summary | Direction | Points | Labels | Reason`; under it, "Added late:
   not available in the dataset".
5. **Bug Fixes** — delivered bug-type issues: `Key | Summary | Points | Epic | Labels | Sprint`.
6. **Release Notes Draft** — a stakeholder "What's New", grouped by epic or theme, in plain
   business language with no Jira keys and no technical jargon: per theme a bold heading and
   one or two sentences on the value and what users can now do, closing with **Bug Fixes**:
   the count and one notable fix.

Close with a one-paragraph executive summary for a release email or stakeholder update.
