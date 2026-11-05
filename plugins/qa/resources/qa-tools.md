---
name: qa-tools
description: How a QA skill or agent reaches its two tools — the Aspire MCP server by tool name, the Playwright CLI through the shell — what each does not expose, and what to do when one is missing.
---

# QA tools

Aspire is an MCP server this plugin declares; its tools are named bare here
(`list_resources`). The browser is driven by the Playwright CLI, `playwright-cli`, run
through the shell — there is no browser MCP server.

## Aspire

- Its tools normally surface plugin-namespaced, `mcp__plugin_qa_aspire__<tool>`; registered
  in a repository's own MCP configuration they surface as `mcp__aspire__<tool>`. Prepend
  whichever prefix your tool list shows; never assume one.
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

## Playwright CLI

- Check `playwright-cli --version` before the first browser step. When it does not answer,
  stop and name the install command, `npm install -g @playwright/cli@latest`; never install
  it yourself.
- Pass a named session on every command, `-s=<name>` (or set `PLAYWRIGHT_CLI_SESSION`), one
  name per validation run, so parallel runs never share a browser. Close it with
  `-s=<name> close` when the run ends.
- It runs headless with an in-memory profile by default; pass `--headed` or `--persistent`
  only when the caller asks.
- Commands used here: `open [url]`, `goto <url>`, `snapshot` (element refs such as `e15`),
  `click <ref>`, `fill <ref> <text>`, `type`, `press`, `screenshot [ref] --filename=<path>`,
  `console`, `requests`, `request <n>`, `video-start <file>`/`video-stop`,
  `tracing-start`/`tracing-stop`. Read `playwright-cli --help <command>` for an exact
  spelling or option before guessing one.
- There is no wait command. Wait on the expected element or text with `run-code`, for
  example `run-code "async page => await page.getByText('Saved').waitFor()"`.
- Snapshots and default output land under `.playwright-cli/` in the working directory. Keep
  that folder out of the change set; write evidence to the evidence folder with `--filename`.
- Video and traces are available, so a multi-step flow may be recorded rather than
  screenshotted step by step.

## Missing tools

After an MCP configuration change, restart the session or reload MCP tools before QA starts.
When the Aspire tools are still absent, stop and name the missing server and tool family;
when it is configured for normal sessions but absent here, report a child-agent tool
exposure problem instead of asking the user to rerun the same validation. When the shell
itself is unavailable, report that the browser cannot be driven.
