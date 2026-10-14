---
name: playwright-validation
description: 'Validate a feature or run extensive end-to-end testing against a running app through the Playwright MCP server, capturing screenshot evidence per scenario. Use when: the app under test is running and a feature, bug fix, or scenario list must be proved in a real browser. DO NOT USE FOR: writing a checked-in test file (playwright-e2e-authoring) or deriving scenarios from an issue (feature-test-from-issue).'
---

# Playwright Validation

Prove the feature in a real browser against the running app. Before starting, read
[qa-evidence.md](../../resources/qa-evidence.md) — what counts as evidence and where it is
stored — and resolve tool names and the recordable form per
[mcp-tools.md](../../resources/mcp-tools.md). When the Playwright MCP tools are absent,
report that Playwright evidence cannot be captured and stop.

## Preconditions

- The app is running and healthy (`aspire-run`, or a confirmed deployed URL).
- Aspire log/trace monitoring is already active (`aspire-log-monitor`, or the caller's
  `qa-monitor`).

## Preflight capture

1. Call `browser_navigate` to the target page or a lightweight health or render page.
2. Call `browser_take_screenshot` and save the smoke screenshot in the evidence folder.
3. When either call fails, capture is unavailable this session: stop, or mark the limitation
   as the caller's validation policy says.

## Per scenario

1. Restate the scenario as concrete steps. For extensive testing, list the scenarios first:
   happy path, edge cases, invalid input, empty states, permission boundaries.
2. Call `browser_navigate` to the entry URL, then `browser_snapshot` for element references;
   take selectors from the snapshot, not from source code.
3. Perform each interaction in order. After a re-render, take a fresh snapshot before using a
   reference again.
4. Before every capture, call `browser_wait_for` on the specific element or text you expect,
   never a fixed sleep: a mid-transition frame is misleading evidence.
5. Capture one screenshot for a single-state checkpoint (scoped to an element when only that
   component matters), or one per state-changing step, numbered zero-padded (`01-`, `02-`) so
   the sequence reads in execution order.
6. After each step, read `browser_console_messages`; for an API-backed feature, read
   `browser_network_requests` and check status codes and payload shape.
7. On failure, capture the frame first, then console and network output, and only then try
   any recovery.
8. Assert the outcome from the final snapshot or screenshot, cross-check the Aspire stream
   for the same window, and record Pass / Fail / Flaky with evidence paths and findings.
9. Start the next independent scenario with a fresh navigation or full reload.
