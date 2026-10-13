---
name: deployed-environment-validation
description: >
  Validate a feature or bug fix with Playwright against an already-deployed test
  environment (staging, QA, UAT) instead of an app started locally via Aspire.
  Use when: testing a deployed staging/QA/UAT environment, validating a release
  candidate before promotion, smoke or regression checks against an environment
  URL. DO NOT USE FOR: a local run (aspire-run, playwright-validation).
---

# Deployed Environment Validation

Run the `qa` workflow against an environment someone else or a pipeline already stood up —
staging, QA, UAT — instead of starting the app locally. The evidence policy is
[qa-evidence.md](../../resources/qa-evidence.md).

## Steps

1. **Confirm the target.** Get the environment name and its base URL from the user, and
   confirm both explicitly before any scenario: never guess, infer, or reuse a URL. Check that
   the URL belongs to the named environment and is not production when staging, QA, or UAT
   was meant; testing the wrong environment is a serious mistake.
2. **Check health.** Reach a health endpoint, status page, or a simple navigation first. When
   the environment is unreachable or unhealthy, stop and report it.
3. **Skip local startup.** Do not apply `aspire-run`; take the Playwright endpoints from the
   confirmed base URL.
4. **Monitor logs, best effort.** This plugin's Aspire server sees only local AppHosts. When
   the person registered a server against the environment's dashboard (see
   [mcp-tools.md](../../resources/mcp-tools.md)), apply `aspire-log-monitor` through it for the
   whole session. Otherwise proceed on Playwright console and network evidence and say in the
   report that Aspire monitoring was not available. For deeper observability, recommend
   `csharp-coding:sre` rather than reaching into production logging from here; when the
   `csharp-coding` plugin is not installed, name the gap in the report.
5. **Validate.** Apply `playwright-validation` against the confirmed URL. Tag every evidence
   file and report entry with the environment name.

## Shared environment

Treat the environment as shared state that other people and automated jobs depend on.
Before any destructive or irreversible action — deleting data, creating accounts with
real-looking data, changing configuration — describe the action and its effect to the user
and wait for their explicit confirmation; perform it only after they confirm. Where the
environment's purpose is ambiguous, prefer read-only or clearly reversible scenarios.

## Credentials

Reference credentials through an environment variable or the user's existing secret store;
never write a secret into a scenario, evidence file, report, or committed file.

## Output

A QA report labelled with the environment name, evidence under
`.wip/qa/<feature-name>/<environment>/`, and an explicit note on whether Aspire log/trace
monitoring was available and, if not, which evidence was used instead.
