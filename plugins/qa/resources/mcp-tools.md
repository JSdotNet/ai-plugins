---
name: mcp-tools
description: How a QA skill or agent resolves the Aspire and Playwright MCP tool names it calls, what each server does not expose, and how the Aspire server is started.
---

# MCP tools

Skills and agents in this plugin name tools bare (`list_resources`, `browser_navigate`).
Resolve each name against the tool list you actually have before the first call.

## Prefix

Both servers ship with this plugin, so their tools normally surface plugin-namespaced:
`mcp__plugin_qa_aspire__<tool>` and `mcp__plugin_qa_playwright__<tool>`. The same server
registered directly in a repository's own MCP configuration surfaces as
`mcp__aspire__<tool>` or `mcp__playwright__<tool>`. Prepend whichever prefix your tool list
shows; never assume one.

## Aspire

- Started as `aspire agent mcp`; an older Aspire CLI names it `aspire mcp start`. The plugin
  declares it, so the host starts it with the session.
- Query tools: `list_resources`, `list_structured_logs` (optionally one resource and/or a
  search term), `list_console_logs` (`resourceName` required), `list_traces` (duration and
  whether it errored), `list_trace_structured_logs` (the logs of one trace id), `doctor`
  (works with no AppHost running), `list_apphosts`.
- These replaced an earlier `get_*` set (`get_resources`, `get_resource_logs`, `get_traces`,
  `get_console_logs`) that an older CLI may still expose. A name missing from your list
  means look up its current spelling there, not that the server is unavailable.
- There is no metrics tool: `get_metrics` is gone with no `list_*` replacement. Metrics come
  from the Aspire dashboard; never report metrics as monitored through this server.
- It sees only AppHosts on this machine. A deployed environment's dashboard is reachable
  only through a server the person registered against it
  (`aspire agent mcp --dashboard-url <url> --api-key <key>`), which exposes the
  structured-log and trace tools but not resource state.

## Playwright

- `@playwright/mcp` as of 0.0.79 exposes no tracing or video tools (`browser_start_tracing`
  and `browser_stop_tracing` do not exist) and no `--save-trace` or `--save-video` option;
  only screenshots and `--save-session` (a log of tool calls under `--output-dir`).
- The plugin pins `@latest`, which moves: read the tool list. Continuous evidence is a
  numbered screenshot sequence unless that list shows tracing or video tools.
- On an unfamiliar page, take `browser_snapshot` first to get element references.

## Missing tools

After an MCP configuration change, restart the session or reload MCP tools before QA starts.
When a server's tools are still absent, stop and name the missing server and tool family.
When the server is configured for normal sessions but absent here, report a child-agent
tool exposure problem instead of asking the user to rerun the same validation.
