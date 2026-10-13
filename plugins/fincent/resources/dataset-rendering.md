---
name: dataset-rendering
description: Determinism and output-fidelity rules every Fincent sprint and release report holds to when it renders a Get-SprintData.ps1 or Get-ReleaseData.ps1 dataset.
---

# Dataset rendering

## Data

- Render only from the dataset. When the caller passes a dataset path, use it; otherwise
  run the report's script, resolved to an absolute path. The scripts need `JIRA_BASE_URL`,
  `JIRA_EMAIL`, and `JIRA_API_TOKEN`.
- When a script fails, report its error and stop. Jira is reached only through the scripts
  in `../scripts/`: never through an ad-hoc query, a Jira skill, or a Jira MCP tool.
- Read every count, point total, and rate from the dataset's `totals` and breakdowns; never
  recount, re-add, or estimate a missing value.
- Use `epicOrder` verbatim for grouping and group order, `issues` in the given order for
  rows, and `removedIssues` for scope changes. Never re-sort, re-group, or re-filter.
- `issue.isCompleted` is the completion verdict: `true` means completed or delivered (Test
  or beyond), `false` means not. Never reinterpret the status text.
- Copy `status`, `epicName`, `labels`, `summary`, sprint names, and the release name
  verbatim.
- The same `metadata.datasetHash` always yields an identical report. A rerun that changes
  a number, a row, or an order is a defect, not a judgement call.

## Output

- Render every issue listing as a Markdown table, even a one-row group; never as a bullet
  list.
- Group every issue section by epic, one table per epic in `epicOrder`, never mixing
  epics in a table. The **No epic** group is already last in `epicOrder`; keep it last.
- Include the `Points` and `Labels` columns wherever a section defines them. Write `?` for
  missing story points and `-` for absent labels.
- Write the exact Jira status in `State` or `Status`, so a reader tells an item still in
  Test from a Done one.
- End with the report's closing paragraph, then the line `datasetHash: {metadata.datasetHash}`.
