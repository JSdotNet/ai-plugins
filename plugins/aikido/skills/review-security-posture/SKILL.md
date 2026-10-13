---
name: review-security-posture
description: >
  Retrieve and prioritize all open Aikido security findings across a repository or scope.
  Use when: assessing the overall security health of a project, planning a security sprint,
  preparing for a security review, or onboarding to a codebase's security state.
---

# Review Security Posture

Before querying, read [aikido-findings.md](../../resources/aikido-findings.md): the
prerequisite, feed pagination, scopes and the case-sensitive repository name, and the
code-fixable or triage-only table.

Inputs: scope — `repo_name` (required unless another feed scope is set); issue types (default:
all); minimum severity `critical`, `high`, `medium`, `low` (default: `low`).

1. **Fetch** every open finding for the confirmed scope, all pages. Keep in the working set
   only findings at or above the minimum severity and of the requested types; everything
   below the threshold stays out of every later step.
2. **Group** by severity, then by class — code-fixable, or triage-only sub-grouped by owner
   area — so each triage-only finding has an owner.
3. **Present** the security posture summary from
   [aikido-templates.md](../../resources/aikido-templates.md), then one row per Critical and
   High finding in its top-findings table. Medium and Low: a count per type only, details on
   request.
4. **Recommend an order:**
   - **Immediate** — every Critical finding, code-fixable first.
   - **This sprint** — every High finding.
   - **Backlog** — Medium and Low.
   - **Triage-only** — non-code findings by area, each with its recommended owner (cloud
     team, ops, and so on).
5. **Offer:** Fix now (`fix-security-issue` for one finding); Sync to GitHub
   (`aikido-issues-to-github`); drill down (re-query filtered by type or severity); export a
   Markdown report of every finding. Re-run after a fix sprint to measure progress.
