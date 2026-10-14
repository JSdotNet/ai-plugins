---
name: scan-code
description: >
  Scan local code files with Aikido for SAST vulnerabilities and hardcoded secrets.
  Use when: finishing a feature, reviewing a file for security, scanning before a commit,
  or running a targeted scan on a specific path or file type.
  DO NOT USE FOR: findings in a pull request's changed files (aikido-scan-pr).
---

# Scan Code with Aikido

Before scanning, read [aikido-findings.md](../../resources/aikido-findings.md): the
prerequisite, the tool per mode, and how findings are ordered and reported.

Inputs: target path — file, directory, or workspace root (default: workspace root); mode
`full` (default), `sast`, or `secrets`; minimum severity `critical`, `high`, `medium`, `low`,
or `all` (default: `all`).

1. Run the mode's tool on the target path and collect every finding.
2. Drop findings below the minimum severity; report the rest grouped by severity, each with
   the contract's field set. With no findings, say the scan completed cleanly.
3. Close with this summary:

   ```
   Scan complete.
   Target: <path>
   Mode: <full | sast | secrets>
   Findings: <N critical, N high, N medium, N low>
   ```

4. Offer the next actions:
   - **Fix now** — `fix-security-issue` for each critical or high finding, passed as a local
     scan finding (file, line, rule, type).
   - **Defer** — record the finding as known risk and continue.
   - **Sync to GitHub** — `aikido-issues-to-github` for the findings the Aikido feed holds.

A clean scan covers known vulnerability patterns; it does not replace a code review.
