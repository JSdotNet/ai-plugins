---
name: aspire-logging
description: 'Retrieve and analyze structured logs, console output, and traces from a running Aspire application through the Aspire MCP server. Use when: diagnosing errors, investigating a slow or failing request, or reviewing service output during local development. DO NOT USE FOR: watching logs for a whole QA session (qa:aspire-log-monitor), wiring telemetry into a service (open-telemetry).'
---

# Aspire Logging — Logs and Traces via Aspire MCP

This skill needs the Aspire MCP server: `aspire agent mcp` starts it, `aspire agent init`
configures it for an assistant (older CLIs: `aspire mcp start`, `aspire mcp init`). Without it,
read logs and traces in the Aspire dashboard and say that the MCP tools were not available.
To watch a whole QA session, use `qa:aspire-log-monitor`; without the `qa` plugin, repeat the
diagnostic order below at each checkpoint of the session.

**Tool names.** Take the exact names from your tool list:

- The prefix depends on the registration: `mcp__aspire__<tool>` when the repository's MCP
  configuration registers the server, namespaced by the plugin that provides it otherwise —
  `mcp__plugin_qa_aspire__<tool>` from `qa`. The names here are bare.
- Current names: `list_resources`, `list_structured_logs` (optional `resourceName` and
  `search`), `list_console_logs` (`resourceName` required; also carries resource-command
  output), `list_traces`, `list_trace_structured_logs` (`traceId`), `doctor` (works with no
  AppHost), `list_apphosts` / `select_apphost`, `execute_resource_command` (`start`, `stop`,
  `restart`).
- An older Aspire CLI exposes the earlier `get_*` set instead: `get_resources`,
  `get_resource_logs`, `get_traces`, `get_console_logs`.
- The server has no metrics tool — `get_metrics` is gone with no replacement. Answer latency
  or throughput from trace durations or the dashboard's metrics view, and report no metric
  check you did not run.

**Diagnostic order:**

1. `list_resources` — which resources run and are healthy; use their names in later calls.
2. `list_structured_logs` for the failing service — error messages and stack traces.
3. `list_traces` — find the failing or slow request across services, then
   `list_trace_structured_logs` with its trace id for the logs of every span in order; prefer
   it over per-resource logs when following one request.
4. `list_console_logs` — startup failures and missing config; go here first when a resource
   is degraded or stopped, since those errors surface before structured logs exist.
5. Latency or saturation — trace durations, or the dashboard's metrics view.
