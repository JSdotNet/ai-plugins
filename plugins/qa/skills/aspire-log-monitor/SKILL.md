---
name: aspire-log-monitor
description: 'Continuously monitor the logs, traces, and browser logs of a running Aspire application through the Aspire CLI for the full duration of a QA test session. Use when: watching backend errors while Playwright validation runs, correlating a UI step with its logs and traces, checking resource health mid-session. DO NOT USE FOR: starting the app (aspire-run) or driving the browser (playwright-validation).'
---

# Aspire Log Monitor

Watch the app's logs and traces for the whole session, so a runtime error is caught even when
the UI looks correct. Start before `playwright-validation` interacts with the app; stop after
its last scenario.

Before the first command, read [qa-tools.md](../../resources/qa-tools.md): the CLI commands,
and the MCP tool that answers each on a host without a shell. When neither reaches the app,
report the missing capability and claim no log, trace, or resource-state evidence. The policy
this monitoring serves is [qa-evidence.md](../../resources/qa-evidence.md).

## Baseline — before the first browser interaction

1. `aspire describe`: confirm every required resource is running and healthy.
2. `aspire otel logs <resource> --severity Warning` for each resource, and
   `aspire logs <frontend>-browser-logs` for each frontend: note what already exists, so it
   is not attributed to the test run later.
3. Record the baseline timestamp.

## During validation

1. After each scenario (each step where you can), run `aspire otel logs --severity Error` for
   the resources involved and `aspire logs <frontend>-browser-logs --tail 50`; diff against
   the baseline.
2. Flag every new Error or Critical entry at once, with the scenario and step that triggered
   it, even when the browser showed success. Note a Warning only when it is new since the
   baseline or recurs across scenarios.
3. For a flow across services, find its trace with `aspire otel traces --has-error`, then
   `aspire otel logs --trace-id <id>` for the logs of every span in order.
4. Answer a performance question from trace durations; metrics come only from the dashboard.
5. When `aspire describe` shows a resource unhealthy, read `aspire logs <resource>` at once:
   config and dependency errors appear there before structured logs.
6. Correlate by timestamp: match log and trace times against the Playwright evidence times.

## Summary for the QA report

- New Error/Critical entries with resource, timestamp, and message, browser logs included.
- Failed or abnormally slow traces with the correlated scenario.
- Metric anomalies only when a metrics source was actually available.
- Or, exactly: "No new errors observed in Aspire logs/traces during this session."
