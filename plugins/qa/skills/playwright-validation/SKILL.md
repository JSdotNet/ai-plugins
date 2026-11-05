---
name: playwright-validation
description: 'Validate a feature or run extensive end-to-end testing against a running app by driving a real browser with the Playwright CLI, capturing screenshot or video evidence per scenario. Use when: the app under test is running and a feature, bug fix, or scenario list must be proved in a real browser. DO NOT USE FOR: writing a checked-in test file (playwright-e2e-authoring) or deriving scenarios from an issue (feature-test-from-issue).'
---

# Playwright Validation

Prove the feature in a real browser against the running app. Before starting, read
[qa-evidence.md](../../resources/qa-evidence.md) — what counts as evidence and where it is
stored — and [qa-tools.md](../../resources/qa-tools.md) — the CLI's session, commands, and
output folder. When `playwright-cli --version` does not answer, report that Playwright
evidence cannot be captured, name the install command from qa-tools.md, and stop.

## Preconditions

- The app is running and healthy (`aspire-run`, or a confirmed deployed URL).
- Aspire log/trace monitoring is already active (`aspire-log-monitor`, or the caller's
  `qa-monitor`).

## Preflight capture

1. Pick one session name for the run and pass `-s=<name>` on every command.
2. Run `open <url>` on the target page or a lightweight health or render page, then
   `screenshot --filename=<evidence folder>/00-smoke.png`.
3. When either command fails, capture is unavailable this session: stop, or mark the
   limitation as the caller's validation policy says.

## Per scenario

1. Restate the scenario as concrete steps. For extensive testing, list the scenarios first:
   happy path, edge cases, invalid input, empty states, permission boundaries.
2. Run `goto <entry url>`, then `snapshot` for element refs; take refs from the snapshot,
   not from source code. For a multi-step flow, `video-start <evidence folder>/<scenario>.webm`.
3. Perform each interaction in order (`click`, `fill`, `type`, `press`). After a re-render,
   take a fresh `snapshot` before using a ref again.
4. Before every capture, wait on the specific element or text you expect per qa-tools.md,
   never a fixed sleep: a mid-transition frame is misleading evidence.
5. Capture one screenshot for a single-state checkpoint (scoped to a ref when only that
   component matters), or one per state-changing step, numbered zero-padded (`01-`, `02-`)
   so the sequence reads in execution order, or stop the video with `video-stop`.
6. After each step, read `console`; for an API-backed feature, read `requests` and
   `request <n>` and check status codes and payload shape.
7. On failure, capture the frame first, then console and network output, and only then try
   any recovery.
8. Assert the outcome from the final snapshot or screenshot, cross-check the Aspire stream
   for the same window, and record Pass / Fail / Flaky with evidence paths and findings.
9. Start the next independent scenario with a fresh `goto` or `reload`; `close` the session
   after the last one.
