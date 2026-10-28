---
name: qa-evidence
description: The evidence policy every QA validation follows — what must run, what must be watched, what counts as evidence, where it is stored, and how depth and gaps are reported.
---

# QA evidence

A feature is validated only when it was exercised in a running app, with captured evidence
and an Aspire log/trace review. Static code reading never validates a feature.

## Run and watch

- Run the target through Aspire (`aspire-run`), or name the deployed environment it runs in
  (`deployed-environment-validation`).
- Start Aspire log/trace monitoring before the first browser interaction and keep it active
  until the last scenario finishes. A UI that looks correct can still be logging errors, and
  a single check at the end misses entries lost to rotation or buffer limits.
- Report only what the Aspire MCP tools returned; never write log or trace content you did
  not read.

## What counts as evidence

- Every pass or fail finding from a browser scenario carries a concrete evidence path the
  user can open. A screenshot described without a path is not evidence.
- Every scenario has at least one screenshot; a multi-step flow has one per state-changing
  step, or a video when one was recorded.
- Every failure has a frame captured at the point of failure, before any recovery, plus the
  browser console and network output at that moment.
- Name the form used — screenshot, screenshot sequence, video, or trace. Never call a
  screenshot sequence a video or a trace.
- Browser-canvas or browser-pane snapshots and smoke output are not Playwright CLI evidence.
  Cite them only as fallback evidence for a limited render check, labelled as such.

## Verdicts

- A scenario that passes visually but produces a new Error or Critical log entry is Fail (or
  Flaky), with the log entry as evidence — never Pass.
- Cross-check each UI outcome against the Aspire log/trace stream for the same time window.

## Honest depth and absence

- When the caller selects a shallower depth — startup-only for a dependency update, or no
  runnable application at all — record that depth and its result; never claim validation
  that was not performed.
- When monitoring was unavailable (no Aspire MCP server, or none reaching a deployed
  environment), say so in the report and name the evidence used instead. Never omit the gap.
- When Playwright capture is unavailable (`playwright-cli` does not answer), say so and
  claim no Playwright evidence.

## Where it is stored

Store evidence and the report under `.wip/qa/<feature-name>/`, or
`.wip/qa/<feature-name>/<environment>/` for a deployed environment, unless the caller names
another location. The path is relative to the caller's worktree or workspace root; a path
outside it is rejected, so copy evidence back under that root before reporting it when you
run in a separate checkout. Keep every file for the whole session; never overwrite an
earlier scenario's evidence.
