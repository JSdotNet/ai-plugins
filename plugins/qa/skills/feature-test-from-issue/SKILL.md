---
name: feature-test-from-issue
description: >
  Derive Playwright test scenarios from a GitHub issue or Jira ticket (acceptance
  criteria, repro steps), then validate the feature or bug fix against the running
  app with evidence and Aspire log monitoring.
  Use when: an issue/ticket number or link is the source of truth for what to test,
  checking a feature against its acceptance criteria, confirming a bug fix against
  its repro steps. DO NOT USE FOR: writing or updating the issue itself, or
  scenarios with no issue behind them (playwright-validation).
---

# Feature Test from Issue

The issue or ticket is the source of truth for what to test: acceptance criteria for a
feature, repro steps for a bug. This skill maps it onto the `qa` workflow and holds no
GitHub- or Jira-specific API, endpoint, authentication, or field mapping.

## Steps

1. **Read the source.** Tell GitHub (`owner/repo#123`, an issue URL) from Jira (`PROJ-456`)
   by the reference, or ask. Read it with the issue tooling the session already has — the
   `gh` CLI or a GitHub MCP server, an Atlassian MCP server — for title, body, acceptance
   criteria, labels, and repro steps. When nothing reaches the source, ask the user to paste
   the content.
2. **Pick the scope.** When the issue holds several distinct scenarios and the user named
   none, confirm with the user which acceptance criteria or repro steps to test.
3. **Derive scenarios.** For a feature, turn each acceptance criterion into exactly one
   `Given <precondition> / When <action> / Then <expected result>` scenario. For a bug, write
   one regression scenario that reproduces the original defect and one confirmation scenario
   that proves the fix holds with no adjacent regression.
4. **Confirm before running.** Present the scenario list and run only the scenarios the user
   confirmed; derivation can be wrong or incomplete.
5. **Run and monitor.** Apply `aspire-run`, then `aspire-log-monitor` unless the caller runs
   `qa-monitor` itself, per [qa-evidence.md](../../resources/qa-evidence.md).
6. **Execute.** Apply `playwright-validation` to each confirmed scenario and cross-check each
   result against the Aspire log/trace stream.
7. **Report against the source.** Trace every scenario back to its acceptance criterion or
   repro step, with Pass / Fail / Flaky, evidence paths, and Aspire findings, in the `qa`
   agent's report format.
8. **Post a comment only on confirmation.** When the user wants the result on the issue or
   ticket, show the exact comment text and the issue it goes to, and ask for explicit
   confirmation before posting, because a posted comment is visible to everyone watching
   that issue and cannot be silently withdrawn. Post it only after the user confirms, with
   the session's issue tooling. Leave status changes to the user.

## Output

The confirmed scenario list and the QA report, each scenario traced to its source criterion,
stored per [qa-evidence.md](../../resources/qa-evidence.md).
