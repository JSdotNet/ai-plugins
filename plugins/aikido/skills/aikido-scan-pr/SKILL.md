---
name: aikido-scan-pr
description: >
  Scan a pull request with Aikido and surface findings that touch changed files.
  Use when: reviewing a PR for security issues before merging, checking AI-generated
  code changes, or enforcing a security gate on a feature branch.
---

# Scan Pull Request with Aikido

Before scanning, read [aikido-findings.md](../../resources/aikido-findings.md): the
prerequisite, the tool per mode, and how findings are ordered and reported.

Inputs: PR number or `current`; repository `owner/repo`; mode `full` (default), `sast`, or
`secrets`; minimum severity (default: `high`); create review comments `true` or `false`
(default: `false` — summary only).

1. **Check the tree.** The scan reads local files, not the PR: compare the PR's
   `headRefOid` with local `HEAD`. When they differ, tell the user which branch and commit are
   checked out and which the PR is at, and ask whether to switch with `gh pr checkout`. Switch
   only on an explicit yes and with a clean working tree; when the user declines, stop — a
   scan of another tree reports on code the PR does not contain.
2. **Scan.** Take the PR's changed file names as the focus set, then run the mode's tool on
   the workspace root.
3. **Split.** PR-relevant: findings in changed files, filtered by the minimum severity and
   grouped by severity. Pre-existing: the rest, reported as a count only, never blocking.
4. **Report** the PR scan summary from [aikido-templates.md](../../resources/aikido-templates.md),
   then one row per PR-relevant finding — Severity, Type, File, Line, Rule, Remediation.
   Critical and High PR-relevant findings block the PR until resolved or explicitly accepted.
5. **Offer:** Fix now (`fix-security-issue` per Critical or High finding, passed as a local
   scan finding: file, line, rule, type); review comments; Sync to GitHub
   (`aikido-issues-to-github` for pre-existing findings); accepted risk.
6. **Review comments**, when enabled or approved: stage one per PR-relevant finding in the
   templates file's PR review comment format. Staging writes nothing to GitHub. Before
   posting, show the user every staged comment with its file and line and the pull request it
   will be posted to, and ask for explicit confirmation. Post them only after a clear yes; a
   comment on a pull request is visible to everyone with access to the repository and cannot
   be taken back silently. If the user declines, keep the comments in the report and post
   nothing.
