---
name: automation-sprint-review
description: 'End-to-end sprint review automation: collects deterministic Jira datasets with Get-ReleaseData.ps1 and Get-SprintData.ps1, then generates the sprint report(s) per team, the release report for the resolved fixVersion, and a demo presentation as PowerPoint. Runs sprint-report, release-report, and demo-presentation sequentially over those datasets so repeated runs on unchanged Jira data produce identical output.'
disable-model-invocation: true
---

# Automation: Sprint Review (Full Pipeline)

Run the sprint review end to end: collect the datasets, render the sprint reports, the
release report, and the demo deck, and build the `.pptx`. This skill owns the phase order,
the hand-off between phases, the file names, the summary, and the `.pptx` build; rendering
belongs to `sprint-report`, `release-report`, and `demo-presentation`, data resolution to
the scripts. Over the 40-line budget: the phase order, failure rule, file names, and summary
contract are each a correctness rule of the run.

## Inputs

- **Sprints** — names, or active sprints (`-ActiveSprints -BoardId {id}`; ask for the board
  id when unknown), or none to take them from the release.
- **Teams** — ask when the user names none; "all teams" is one dataset with `-Team` omitted.
- **Release** — optional; omitted, the script resolves the latest fixVersion, released or
  not, and that is the release to report.
- **Expected sprint count** — whenever the user states one, pass `-ExpectedSprintCount {n}`
  so a mismatch fails the run instead of dropping sprints.

Translate the request into script parameters; the scripts resolve sprints and release. Jira
is reached only through them, per [dataset-rendering.md](../../resources/dataset-rendering.md);
when one cannot authenticate, stop and ask the user to set the three `JIRA_*` variables.

## Phases, in this order

Resolve each `../../` path to an absolute path before running it.

1. **Release data.** Run `../../scripts/Get-ReleaseData.ps1 [-Release '{name}'] -OutputPath
   ./release-data.json`. Record `metadata.datasetHash`, `release.name` as the release name,
   and `release.sprintsCovered` as the sprint list when the user named none.
2. **Sprint data, once per team.** Run `../../scripts/Get-SprintData.ps1` with the sprint
   scope, `-Team '{team}'`, `-ExpectedSprintCount`, and `-OutputPath
   ./sprint-data-{team}.json`. Record the path, `metadata.team`, `metadata.datasetHash`, and
   `metadata.sprintResolution.resolved` as that team's sprint list.
3. **Sprint reports.** Run `sprint-report` per team per resolved sprint with the dataset
   path, team, and sprint. Save `sprint-report-{team}-{sprint-name}.md`
   (`sprint-report-{sprint-name}.md` with one team). For a team with more than one sprint,
   also save `sprint-report-overview-{first-sprint-name}.md`: a trend table with one row
   per sprint, the per-sprint reports in chronological order, and a cross-sprint paragraph.
4. **Release report.** Run `release-report` on the phase 1 dataset; save
   `release-report-{release-name}.md`.
5. **Demo deck.** Pass `demo-presentation` the saved reports, the resolved sprints, release,
   and teams; when it lacks a detail, enrich the report inputs and run it again. Save its
   Markdown as `demo-{sprint-name}.md` — one combined deck for all sprints — and build
   `demo-{sprint-name}.pptx` from it with `python-pptx`, on
   `../../resources/fincent-review-template.pptx`, each slide on the layout it names.
   Without `python-pptx`, keep the Markdown, report the `.pptx` as not built, and say what
   to install.

Take sprint numbers only from sprint datasets and release numbers only from the release
dataset. Save every result as a file in the working directory. Write nothing to Jira.

**Failure rule.** When a script fails or its dataset is missing, report the error, skip
only the phases that need that dataset — the failed team's sprint reports, or the release
report — and mark each skipped artifact failed. Build the demo deck only when the release
report and at least one sprint report exist.

## Summary

- Every `datasetHash`: the release and one per team.
- `Artifact | Scope | Status | Open | Path`, one row per file: Status `✅ Done` or the
  failure with its error; Open an absolute `file:///` link such as
  `[Open](file:///D:/work/release-report-2026.32.0.md)`, since relative links and bare
  filenames do not open from chat; Path the plain absolute path.
- A sprint snapshot naming every sprint in scope, one row each: `Sprint | Scope | Completed |
  Completed Points | Carry-over | Bugs Done | Key labels / themes`.
- A release snapshot: `Release | Sprints covered | Original Scope | Delivered | Delivered
  Points | Deferred | Bug Fixes`.
