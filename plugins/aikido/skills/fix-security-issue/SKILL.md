---
name: fix-security-issue
description: >
  Triage and fix one Aikido security finding, given by its Aikido feed issue ID or as a
  local scan finding (file, line, rule). Use when: resolving a SAST vulnerability, removing
  a hardcoded secret, fixing an IaC misconfiguration, or triaging a non-code finding.
  DO NOT USE FOR: finding issues in the first place (scan-code, aikido-scan-pr).
---

# Fix Security Issue

Before starting, read [aikido-findings.md](../../resources/aikido-findings.md): the
prerequisite, the re-scan tool per type, and the code-fixable or triage-only table. A local
scan finding still needs the server for the re-scan.

Inputs: the finding — an Aikido feed issue ID or description, or a local scan finding from
`scan-code` or `aikido-scan-pr` (file, line, rule, type; no feed ID); optional repo name to
filter the feed; accepted risk `true` or `false` (default `false`).

1. **Retrieve.** A local scan finding is the finding as given; skip the feed. Otherwise call
   `aikido_issues_list` filtered to the issue ID, or by `repo_name` and severity to locate it.
   Show its title, type, severity, file and line, and remediation, and confirm with the user
   which finding to address.
2. **Accepted risk** `true`: report the finding as accepted risk with the user's reason,
   change no code, and stop.
3. **Code-fixable** (`sast`, `leaked_secret`, `iac`): read the affected files and apply the
   minimal targeted fix — only the vulnerable code, no new functionality, no unrelated tests.
   - `sast`: the pattern the finding's remediation recommends.
   - `leaked_secret`: remove the credential, replace it with an environment variable or a
     secret-manager reference, and give the user rotation instructions — a committed secret
     stays compromised until it is rotated.
   - `iac`: set the configuration value or policy to its secure setting.
4. **Verify.** Re-scan the changed paths with the type's re-scan tool. Iterate until the
   finding is gone and no new finding appeared; when it cannot be resolved, explain why to the
   user. Commit nothing that introduces a new Aikido finding.
5. **Triage-only:** explain the issue and its impact, and give the type's next step —
   `open_source` the fixed dependency version; `cloud`/`cloud_instance` the provider-side
   remediation; `docker_container` the base image or layer to update; `eol` the supported
   replacement; `license` an alternative package; `malware` immediate removal. Ask whether to
   track it with `aikido-issues-to-github` or a GitHub issue.
6. **Report.** Fixed: the diff (file, line, what changed, why), the clean re-scan, and a
   commit message referencing the finding. Ask for a peer review of a `sast` fix touching
   input validation or cryptography. A fix needing significant refactoring belongs with
   `csharp-coding:coding` — name it and why; whether the work moves is the caller's decision.
