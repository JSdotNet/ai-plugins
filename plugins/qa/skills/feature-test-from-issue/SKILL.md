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

## Purpose

Turn a GitHub issue or Jira ticket into concrete, runnable QA scenarios instead of
guessing what to test. The issue/ticket is the source of truth for acceptance
criteria (features) or repro steps (bugs); this skill maps that content onto the
`qa` agent's existing Aspire + Playwright + monitoring workflow.

This skill holds no GitHub- or Jira-specific API calls or field mappings. It reads
the issue/ticket with whatever issue tooling the session already has (see
[Fetching the Issue](#1-identify-and-fetch-the-issue-or-ticket)).

## Inputs

- Issue/ticket reference — a GitHub issue number/URL (e.g. `owner/repo#123`) or a
  Jira issue key (e.g. `PROJ-456`), or a pasted issue/ticket body when the session
  has no issue tooling.
- (Optional) Which specific acceptance criteria or repro steps to focus on, if the
  issue/ticket contains more than one testable scenario.

## Workflow

### 1. Identify and Fetch the Issue or Ticket

1. Determine the source from the reference format or ask the user: **GitHub** or
   **Jira**.
2. Read the issue/ticket with the issue tooling the session has — the `gh` CLI or a
   GitHub MCP server for GitHub, an Atlassian MCP server for Jira — and retrieve
   the title, description/body, acceptance criteria, labels, and (for bugs) repro
   steps.
3. If the session has no tooling that reaches the source, ask the user to paste
   the relevant issue/ticket content directly.
4. Confirm with the user which acceptance criteria or repro steps to test if the
   issue/ticket contains multiple distinct scenarios.

### 2. Derive Test Scenarios

5. For a **feature**, convert each acceptance criterion into one test scenario:
   `Given <precondition> / When <action> / Then <expected result>`.
6. For a **bug**, convert the repro steps into one regression scenario (reproduce
   the original defect) plus one confirmation scenario (verify the fix holds and
   no adjacent regression was introduced).
7. Present the derived scenario list to the user for confirmation before running
   any test — scenario derivation can be wrong or incomplete.

### 3. Run and Monitor the App

8. Apply the `aspire-run` skill to start the app and confirm all resources are
   healthy.
9. Apply the `aspire-log-monitor` skill (unless the caller runs `qa-monitor` itself)
   to keep Aspire log/trace monitoring active for the whole session.

### 4. Execute Scenarios with Playwright

10. Apply the `playwright-validation` skill to execute each confirmed scenario
    against the running app.
11. Capture evidence per scenario and cross-check each result against the Aspire
    log/trace stream from step 9.

### 5. Report Against the Source Issue/Ticket

12. Produce a QA report mapping each derived scenario back to its originating
    acceptance criterion or repro step, with Pass/Fail/Flaky status, evidence
    paths, and Aspire findings.
13. If the user wants the result posted back to the issue/ticket as a comment,
    show the exact comment text and the issue/ticket it will be posted to, and ask
    for explicit confirmation before posting, because a posted comment is visible
    to everyone watching that issue and cannot be silently withdrawn. Post it only
    after the user confirms, with the session's issue tooling. Leave status
    changes to the user.

## Output

- A confirmed list of test scenarios derived from the issue/ticket.
- A QA report (see `qa.agent.md` report format) with each scenario traced back to
  its source acceptance criterion or repro step.
- Evidence and report stored under `.wip/qa/<feature-name>/` unless the user
  specifies another location.

## Constraints

- Never hardcode GitHub or Jira API endpoints or authentication in this skill —
  use the session's issue tooling, and fall back to asking the user for pasted
  content when it has none.
- Never post to an issue/ticket without the user's explicit confirmation of the
  exact text (step 13).
- Do not run tests against scenarios that have not been confirmed by the user in
  step 7.
- Do not mark a scenario as validated without both Playwright evidence and an
  Aspire log/trace check, per the `qa` agent's constraints.

## Related Skills

| Skill | When to use |
|---|---|
| `aspire-run` | Start (and confirm healthy) the app under test |
| `aspire-log-monitor` | Continuous Aspire log/trace monitoring |
| `playwright-validation` | Execute the derived scenarios against the running app and capture evidence |
