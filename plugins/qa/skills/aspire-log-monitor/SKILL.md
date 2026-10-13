---
name: aspire-log-monitor
description: 'Continuously monitor logs and traces of a running Aspire application through the Aspire MCP server for the full duration of a QA test session. Use when: watching backend errors while Playwright validation runs, correlating a UI step with its logs and traces, checking resource health mid-session. DO NOT USE FOR: starting the app (aspire-run) or driving the browser (playwright-validation).'
---

# Aspire Log Monitor

Watch the app's logs and traces for the whole session, so a runtime error is caught even when
the UI looks correct. Start before `playwright-validation` interacts with the app; stop after
its last scenario.

Before the first call, read [mcp-tools.md](../../resources/mcp-tools.md) to resolve tool names.
When the Aspire MCP tools stay unavailable, report the missing capability and claim no log,
trace, or resource-state evidence. The policy this monitoring serves is
[qa-evidence.md](../../resources/qa-evidence.md).

## Baseline — before the first browser interaction

1. Call `list_resources` and confirm every required resource is running and healthy.
2. Call `list_structured_logs` for each resource and note the current tail and any existing
   warnings, so they are not attributed to the test run later.
3. Record the baseline timestamp.

## During validation

1. After each scenario (each step where you can), call `list_structured_logs` for the
   resources involved and diff against the baseline.
2. Flag every new Error or Critical entry at once, with the scenario and step that triggered
   it, even when the browser showed success. Note a Warning only when it is new since the
   baseline or recurs across scenarios.
3. For a flow across services, find its trace with `list_traces` (duration, errored or not),
   then call `list_trace_structured_logs` with that trace id for the logs of every span.
4. Answer a performance question from trace durations; metrics come only from the dashboard.
5. When a resource turns unhealthy, call `list_console_logs` for it immediately: config and
   dependency errors often appear there before structured logs.
6. Correlate by timestamp: match log and trace times against the Playwright evidence times.

## Summary for the QA report

- New Error/Critical entries with resource, timestamp, and message.
- Failed or abnormally slow traces with the correlated scenario.
- Metric anomalies only when a metrics source was actually available.
- Or, exactly: "No new errors observed in Aspire logs/traces during this session."
