---
name: aikido-issues-to-github
description: >
  Create GitHub issues from open Aikido security findings.
  Use when: triaging Aikido findings, translating security issues to tracked work,
  syncing Aikido findings to GitHub, bulk issue creation from Aikido feed.
---

# Aikido Issues to GitHub

## Purpose

Fetch open security findings from the Aikido feed and create one GitHub issue per
new finding, enriched with severity, type, remediation steps, and a stable Aikido
issue ID fingerprint to prevent duplicates on re-runs.

## Inputs

- Aikido scope — one of: `repo_name`, `cloud_name`, `vm_name`, `domain_name`, `container_name` (required).
- Minimum severity to include: `critical`, `high`, `medium`, `low` (default: `high`).
- Issue types to include (optional): defaults to all types.
- GitHub repository in `owner/repo` format (required).
- Labels to apply (default: `security`, `aikido`; severity label such as `severity:critical` is added automatically).
- Assignee GitHub username (optional).
- Dry-run mode: `true` previews what would be created without creating issues (default: `false`).

## MCP Prerequisite

> If the Aikido MCP server (`aikido_issues_list`) is not available, stop immediately
> and tell the user to configure it using the setup instructions in
> [`agents/aikido.agent.md`](../../agents/aikido.agent.md).

## Workflow

### Phase 1 — Fetch Aikido Findings

1. Call `aikido_issues_list` for the given scope and filters.
   Use pagination to retrieve all matching findings.
2. List all findings with: title, type, severity, affected file or component.

### Phase 2 — Deduplicate Against Existing GitHub Issues

3. For each finding, search open and closed GitHub issues for the Aikido issue ID fingerprint,
   quoting it so the search matches it as one term:
   ```bash
   gh issue list --repo <owner/repo> --state all --search '"aikido-id:<aikido-issue-id>" in:body' --json number,title,state
   ```
4. Mark each finding:
   - A matching open issue: **skipped**.
   - Only a matching closed issue: **closed — not recreated**. The finding is still open in
     Aikido, so the fix did not land or the issue was closed without one; report the issue
     number and let a person decide whether to reopen it.
5. List the repository's labels and note every label this run needs that does not exist yet
   (`security`, `aikido`, each `severity:<level>`, and any requested label):
   ```bash
   gh label list --repo <owner/repo> --limit 500 --json name
   ```
6. Present the full list — to-create, skipped, closed — and the labels to create, and ask for
   confirmation before proceeding. In dry-run mode, stop here with the preview.

### Phase 3 — Create GitHub Issues

7. Create each missing label first, so `--label` does not fail:
   ```bash
   gh label create "<label>" --repo <owner/repo>
   ```
8. For each finding marked to-create, create a GitHub issue using this structure:

**Title:** `[Security] <Finding Title> (<Severity>)`

**Body:**

```markdown
## Aikido Security Finding

| Field | Value |
|-------|-------|
| **Aikido ID** | `aikido-id:<aikido-issue-id>` |
| **Type** | `<sast | leaked_secret | iac | open_source | …>` |
| **Severity** | `<Critical | High | Medium | Low>` |
| **Scope** | `<repo/cloud/container name>` |
| **Affected** | `<file path and line, or component name>` |

## Description

<finding description from Aikido>

## Remediation

<remediation steps from Aikido>

## References

- [View in Aikido](https://app.aikido.dev)
```

   ```bash
   gh issue create --repo <owner/repo> --title "<title>" --body-file <body-file> \
     --label security --label aikido --label "severity:<level>" [--assignee <user>]
   ```

9. Apply labels — `security`, `aikido`, the severity label (e.g., `severity:critical`), and any
   requested label — and the optional assignee, as in the command above.
10. Record the created issue number against the Aikido issue ID.

### Phase 4 — Summary

11. Output a summary table:

| Finding | Type | Severity | Action | Issue |
|---------|------|----------|--------|-------|
| `SQL injection in users.cs` | sast | Critical | Created | #42 |
| `Hardcoded AWS key` | leaked_secret | High | Skipped (existing #38) | #38 |
| `Open redirect` | sast | High | Closed — not recreated | #31 |

## Output

- One GitHub issue per new Aikido finding above the severity threshold.
- Summary table with action taken for each finding.
- No duplicate issues created (deduplication by `aikido-id:<id>` fingerprint).

## Notes

- The `aikido-id:<id>` fingerprint in the issue body is the deduplication key.
  Do not edit or remove it from issue bodies.
- Accepted-risk and suppressed findings in Aikido will not appear in the feed
  and will not be synced.
- For Jira, replace the GitHub issue creation step with `jira:create-jira-ticket`, keeping the
  same field mapping. Without the `jira` plugin, GitHub is the only target.
- Run this skill after each security sprint to sync newly discovered findings.
