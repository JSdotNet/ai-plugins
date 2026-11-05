---
name: playwright-e2e-authoring
description: >
  Author a persistent, version-controlled Playwright end-to-end test file from
  scenarios already validated interactively, so they can be committed and re-run
  in CI instead of only existing as one-off evidence.
  Use when: a validated scenario should become a permanent regression test,
  adding lasting E2E coverage for a feature or bug fix, turning an interactive
  Playwright CLI session into a checked-in test file.
---

# Playwright E2E Test Authoring

Turn scenarios already validated interactively (`playwright-validation`,
`feature-test-from-issue`) into a committed Playwright test that CI re-runs. Evidence and
tests are different outputs: a screenshot never substitutes for a re-runnable test, and a
test never substitutes for the session's evidence.

## Steps

1. **Codify only what was validated.** Take each scenario that passed interactively, with
   the steps, selectors, and assertions observed to work. Assert only what was observed;
   a test written from an unvalidated scenario encodes a guess.
2. **Follow the repository.** Find the existing Playwright project (`playwright.config.*`,
   the e2e folder, spec naming, fixtures, page objects) and follow it exactly — language,
   runner API, structure. Extend an existing spec that covers the same flow instead of
   duplicating it.
3. **Ask before scaffolding.** When no Playwright project exists, ask the user for language,
   directory, and whether to wire it into CI before creating anything; introduce no new test
   framework or tooling without their approval.
4. **Write the test.** Use the role-based or `data-testid` locators found in the session
   (`playwright-cli generate-locator <ref>` turns a snapshot ref into one).
   Map each acceptance criterion or repro step onto setup, actions, and assertions so the
   test traces to its source; comment only where the name and structure do not show it.
5. **Run it.** Run the new file with the repository's own test command (its package script
   or documented command) and confirm it passes.
6. **Investigate a failure.** A failing new test means the interactive validation and the
   test disagree: find out which is wrong. Never loosen an assertion to make it pass.

## Report

The files created or changed, the scenario each test covers and its source issue, how to
run them locally, and whether and how they run in CI.
