<!--
Exact output formats the aikido skills emit. Copy the block for the step that names it.
Read by: ../skills/aikido-scan-pr/SKILL.md, ../skills/review-security-posture/SKILL.md,
../skills/aikido-issues-to-github/SKILL.md
-->

# Aikido output templates

## PR scan summary

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

## PR review comment

```
🔒 **Aikido Security Finding**

**Severity:** Critical
**Type:** sast
**Rule:** SQL Injection
**Description:** <description>
**Remediation:** <remediation steps>
```

## Security posture summary

```
Security Posture — <scope>
Date: <today>

| Severity | Total | Code-fixable | Triage-only |
|----------|-------|--------------|-------------|
| Critical | N     | N            | N           |
| High     | N     | N            | N           |
| Medium   | N     | N            | N           |
| Low      | N     | N            | N           |
| Total    | N     | N            | N           |
```

Top findings, one row each:

| # | Severity | Type | Title | File / Component | Remediation |
|---|----------|------|-------|------------------|-------------|
| 1 | Critical | sast | SQL injection | `src/api/users.cs:42` | Use parameterized queries |

## GitHub issue

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

## Issue sync summary

| Finding | Type | Severity | Action | Issue |
|---------|------|----------|--------|-------|
| `SQL injection in users.cs` | sast | Critical | Created | #42 |
| `Hardcoded AWS key` | leaked_secret | High | Skipped (existing #38) | #38 |
| `Open redirect` | sast | High | Closed — not recreated | #31 |
