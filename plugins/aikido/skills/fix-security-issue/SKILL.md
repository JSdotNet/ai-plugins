---
name: fix-security-issue
description: >
  Triage and fix one Aikido security finding, given by its Aikido feed issue ID or as a
  local scan finding (file, line, rule). Use when: resolving a SAST vulnerability, removing
  a hardcoded secret, fixing an IaC misconfiguration, or triaging a non-code finding.
  DO NOT USE FOR: finding issues in the first place (scan-code, aikido-scan-pr).
---

# Fix Security Issue

## Purpose

Take an Aikido finding, classify whether it is code-fixable or requires a
non-code action, apply the appropriate remediation, and verify the fix with a
targeted re-scan.

## Issue Type Classification

| Code-fixable (fix in codebase) | Triage-only (advise and track) |
|---|---|
| `sast` | `open_source` (dependency upgrade) |
| `leaked_secret` | `cloud` |
| `iac` | `cloud_instance` |
| | `docker_container` |
| | `malware` |
| | `eol` |
| | `license` |
| | `mobile` |
| | `surface_monitoring` |
| | `scm_security` |
| | `ai_pentest` |

## Inputs

- The finding (required), one of:
  - an Aikido feed issue ID or description;
  - a local scan finding from `scan-code` or `aikido-scan-pr`: file, line, rule, and type.
    It has no feed ID.
- Repo name (optional): used to filter `aikido_issues_list` if no issue ID is available.
- Accepted risk: `true` records the finding as known/accepted without fixing (default: `false`).

## MCP Prerequisite

> If the Aikido MCP server is not available, stop immediately and tell the user to configure
> it using the setup instructions in [`agents/aikido.agent.md`](../../agents/aikido.agent.md).
> A local scan finding still needs the server for the re-scan in Phase 3.

## Workflow

### Phase 1 — Retrieve the Finding

1. If a local scan finding is given, use its file, line, rule, and type as the finding and
   skip the feed lookup. Otherwise, if an issue ID is provided, call `aikido_issues_list`
   filtered to that ID; else call `aikido_issues_list` with filters for `repo_name` and/or
   `severity` to locate the finding.
2. Display the finding details:
   - Title, type, severity, affected file/line (if applicable), and remediation guidance.
3. Confirm with the user which finding to address.
4. If accepted risk is `true`, report the finding as accepted risk with the user's reason,
   change no code, and stop.

### Phase 2 — Classify

5. Determine the issue type:
   - **Code-fixable** → proceed to Phase 3.
   - **Triage-only** → proceed to Phase 4.

### Phase 3 — Apply Code Fix (code-fixable only)

6. Read the affected file(s).
7. Analyse the vulnerable code section identified in the finding.
8. Apply the minimal targeted fix. Follow these rules:
   - Do not refactor unrelated code.
   - Do not introduce new functionality.
   - Do not change tests unrelated to the fix.
   - For `leaked_secret`: remove the credential, replace with an environment variable
     or secret manager reference, and provide rotation instructions.
   - For `sast`: apply the pattern recommended by the finding's remediation guidance.
   - For `iac`: update the configuration value or policy to the secure setting.
9. Re-scan the changed file(s):
   - For `sast` or `iac`: call `aikido_sast_scan` on the changed path.
   - For `leaked_secret`: call `aikido_secrets_scan` on the changed path.
10. Confirm the finding is no longer reported.
   - If the finding persists, analyse the re-scan output and iterate.
   - If the finding cannot be resolved, escalate to the user with a clear explanation.

### Phase 4 — Triage Non-Code Issues

11. For triage-only issues, do **not** attempt a code fix. Instead:
    - Explain the issue and its security impact.
    - Provide recommended remediation steps tailored to the issue type:
      - `open_source`: identify the vulnerable dependency and its fixed version.
      - `cloud` / `cloud_instance`: describe the misconfiguration and the remediation action in the cloud provider.
      - `docker_container`: describe the container vulnerability and the base image or layer to update.
      - `eol`: identify the end-of-life component and its supported replacement.
      - `license`: flag the incompatible license and suggest an alternative package.
      - `malware`: flag the affected dependency for immediate removal.
    - Ask whether to create a GitHub issue to track the finding.

### Phase 5 — Record and Close

12. For fixed issues:
    - Summarize the change made (file, line, what changed, why).
    - Confirm the re-scan result is clean.
    - Suggest committing with a message referencing the finding.

13. For triaged issues where a GitHub issue should be created:
    - Invoke the `aikido-issues-to-github` skill or create a GitHub issue directly.

## Output

- For code-fixable issues: diff of the applied fix, re-scan result confirming resolution.
- For triage-only issues: impact summary, remediation steps, and optional GitHub issue.

## Notes

- Never commit a fix that introduces a new Aikido finding.
- For `sast` fixes involving user input validation or cryptography, request a peer review.
- If a fix requires a significant refactoring, name `csharp-coding:coding` as its owner and
  say why; whether the work moves is the caller's decision.
