---
name: aikido-issues-to-github
description: >
  Create GitHub issues from open Aikido security findings.
  Use when: triaging Aikido findings, translating security issues to tracked work,
  syncing Aikido findings to GitHub, bulk issue creation from Aikido feed.
---

# Aikido Issues to GitHub

Before fetching, read [aikido-findings.md](../../resources/aikido-findings.md): the
prerequisite, feed pagination, and scopes. The issue formats are in
[aikido-templates.md](../../resources/aikido-templates.md).

Inputs: Aikido scope (required); minimum severity (default: `high`); issue types (default:
all); GitHub repository `owner/repo` (required); labels (default `security`, `aikido`, plus
`severity:<level>` added per finding); optional assignee; dry run `true` or `false` (default
`false`).

The `aikido-id:<id>` fingerprint in each issue body is the deduplication key: write it
exactly, and leave it in place on every issue.

1. **Fetch** every matching finding, all pages; list each with title, type, severity, and
   affected file or component.
2. **Deduplicate.** Search open and closed issues for the fingerprint, quoted so it matches as
   one term: `gh issue list --repo <owner/repo> --state all --search
   '"aikido-id:<id>" in:body' --json number,title,state`. A matching open issue: **skipped**.
   Only a matching closed issue: **closed — not recreated** — the finding is still open in
   Aikido, so the fix did not land or the issue was closed without one; report the number and
   let a person decide whether to reopen it.
3. **Check labels.** List the repository's labels (`gh label list --limit 500`) and note each
   label this run needs that does not exist yet: `security`, `aikido`, each
   `severity:<level>`, and any requested label.
4. **Confirm.** Show the user the full list — to create, skipped, closed — and the labels to
   create, and wait for explicit confirmation before creating anything; every issue and label
   is created in the repository for everyone to see. In dry-run mode, stop here with the
   preview.
5. **Create** each missing label first, so `--label` does not fail. Then create one issue per
   finding marked to create, with the templates file's title and body (body via
   `--body-file`), the labels `security`, `aikido`, `severity:<level>`, any requested label,
   and the optional assignee. Record each issue number against its Aikido ID.
6. **Summarize** in the issue sync summary table of the templates file.

For Jira, create each ticket with `jira:create-jira-ticket` instead, keeping the same field
mapping; without the `jira` plugin, GitHub is the only target.
