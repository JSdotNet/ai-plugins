---
name: aspire-logging
description: 'Diagnose a running Aspire application from its structured logs, console output, traces, and browser logs through the Aspire CLI. Use when: diagnosing errors, investigating a slow or failing request, or reviewing service output during local development. DO NOT USE FOR: watching logs for a whole QA session (qa:aspire-log-monitor), wiring telemetry into a service (open-telemetry).'
---

# Aspire Logging — Diagnose Through the CLI

The commands themselves are in the Aspire skill `aspire agent init --skills aspire` installs.
This skill is the order to read them in. To watch a whole QA session, use
`qa:aspire-log-monitor`; without the `qa` plugin, repeat this order at each checkpoint.

**Diagnostic order:**

1. `aspire describe` — which resources run and are healthy; use their names below.
2. `aspire logs <resource>` first when a resource is degraded or stopped: startup failures
   and missing config surface there before structured logs exist.
3. `aspire otel logs <resource> --severity Error` — error messages and stack traces.
4. `aspire otel traces --has-error`, then `aspire otel logs --trace-id <id>` — one request
   across services, every span's logs in order; prefer it over per-resource logs.
5. `aspire logs <frontend>-browser-logs` — console errors and failed requests from the
   browser, when the frontend calls `.WithBrowserLogs()`.
6. Latency — trace durations. The CLI has no metrics; use the dashboard's metrics view, and
   report no metric check you did not run.

Pass `--apphost <path>` when `aspire ps` lists more than one AppHost, and `--format Json` to
parse the output.

**A host without a shell** reads the same through the Aspire MCP server (`aspire agent init
--mcp`): `list_resources`, `list_console_logs`, `list_structured_logs`, `list_traces`,
`list_trace_structured_logs`, under the prefix your tool list shows — `mcp__aspire__` when
the repository registers it, `mcp__plugin_qa_aspire__` from the `qa` plugin.
