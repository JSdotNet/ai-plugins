---
name: aikido-scan-pr
description: >
  Scan a pull request with Aikido and surface findings that touch changed files.
  Use when: reviewing a PR for security issues before merging, checking AI-generated
  code changes, or enforcing a security gate on a feature branch.
---

# Scan Pull Request with Aikido

## Purpose

Run Aikido security scans on the current workspace, then filter and highlight findings
that are relevant to the files changed in a pull request. Produces a PR-level security
summary and optionally creates GitHub review annotations.

## Inputs

- Pull request number (required) or `current` to use the current branch's open PR.
- GitHub repository in `owner/repo` format (required).
- Scan mode: `full` (SAST + secrets, default), `sast` (code only), `secrets` (credentials only).
- Minimum severity to report: `critical`, `high`, `medium`, `low`, `all` (default: `high`).
- Create review comments: `true` stages inline PR review comments for critical and high findings
  (default: `false` — summary only).

## MCP Prerequisite

> If the Aikido MCP server (`aikido_full_scan`, `aikido_sast_scan`, or `aikido_secrets_scan`) is not available,
> stop immediately and tell the user to configure it using the setup instructions in
> [`agents/aikido.agent.md`](../../agents/aikido.agent.md).

## Workflow

### Phase 1 — Get Changed Files

1. Confirm the workspace holds the PR's code — the scan reads local files, not the PR:
   ```bash
   gh pr view <pr-number> --repo <owner/repo> --json headRefName,headRefOid
   git rev-parse HEAD
   ```
   When the SHAs differ, tell the user which branch and commit are checked out and which the
   PR is at, and ask whether to switch with `gh pr checkout <pr-number> --repo <owner/repo>`.
   Switch only on an explicit yes, and only with a clean working tree. If the user declines,
   stop: a scan of a different tree reports on code the PR does not contain.
2. Fetch the list of files changed in the PR:
   ```bash
   gh pr diff <pr-number> --repo <owner/repo> --name-only
   ```
3. Store the changed file paths as the focus set for filtering scan results.

### Phase 2 — Run Aikido Scan

4. Choose the scan tool based on the requested mode:
   - `full` → `aikido_full_scan`
   - `sast` → `aikido_sast_scan`
   - `secrets` → `aikido_secrets_scan`
5. Call the selected Aikido MCP tool on the workspace root.

> **Note:** Aikido scans the full workspace. Changed-file filtering is applied in Phase 3 to
> focus the report. All workspace findings are still available on request.

### Phase 3 — Filter and Prioritize

6. Split findings into two groups:
   - **PR-relevant**: findings in files that appear in the changed file list.
   - **Pre-existing**: findings in unchanged files (reported as context only, not blocking).
7. Apply the minimum severity filter to the PR-relevant group.
8. Group PR-relevant findings by severity: **Critical → High → Medium → Low**.

### Phase 4 — Report

9. Output a PR security summary:

```
PR Security Scan — #<pr-number>
Branch: <branch-name>
Changed files: <N>
Scan mode: <full | sast | secrets>

PR-relevant findings:
  Critical: N
  High:     N
  Medium:   N
  Low:      N

Pre-existing workspace findings (not in this PR): N total
```

10. List all PR-relevant findings with details:

| Severity | Type | File | Line | Rule | Remediation |
|----------|------|------|------|------|-------------|
| Critical | sast | `src/api/users.cs` | 42 | SQL Injection | Use parameterized queries |
| High | leaked_secret | `appsettings.json` | 15 | AWS Access Key | Rotate and move to Key Vault |

11. For pre-existing findings, output a count only (not a full list) to avoid noise.

### Phase 5 — Actions

12. Present options:
    - **Fix now** — invoke `fix-security-issue` for each Critical or High PR-relevant finding,
      passing it as a local scan finding (file, line, rule, type).
    - **Create review comments** — stage inline PR comments for each PR-relevant finding
      (requires `create review comments: true` or explicit user approval).
    - **Sync to GitHub** — invoke `aikido-issues-to-github` to create tracked issues for pre-existing findings.
    - **Mark as accepted risk** — note the finding as known risk and continue.

13. If `create review comments` is enabled, stage one comment per PR-relevant finding.
    Staging writes nothing to GitHub. Before posting, show the user every staged comment with
    its file and line and the pull request it will be posted to, and ask for explicit
    confirmation. Post them only after a clear yes; a comment on a pull request is visible to
    everyone with access to the repository and cannot be taken back silently. If the user
    declines, keep the comments in the report and post nothing.

**Comment format:**

```
🔒 **Aikido Security Finding**

**Severity:** Critical
**Type:** sast
**Rule:** SQL Injection
**Description:** <description>
**Remediation:** <remediation steps>
```

## Output

- PR security summary with counts by severity.
- Detailed list of PR-relevant findings.
- Pre-existing finding count for context.
- Optional inline PR review comments.

## Notes

- Critical and High PR-relevant findings should block the PR until resolved or
  explicitly accepted by the team.
- Run this skill as part of every PR review that touches security-sensitive code.
- For automated enforcement, add an instruction to your `AGENTS.md`:
  ```
  Scan any new or modified code with `aikido_full_scan` before finalizing changes.
  This security check is required.
  ```
