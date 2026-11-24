---
name: qa-tools
description: How a QA skill or agent reaches its two tools — the Aspire CLI and the Playwright CLI, both through the shell, with the Aspire MCP server as the fallback for a host without one — what each does not expose, and what to do when one is missing.
---

# QA tools

Both tools run through the shell: the Aspire CLI, `aspire` (17 or later), and the Playwright
CLI, `playwright-cli`. The Aspire MCP server this plugin declares is the fallback for a host
that has no shell.

## Aspire CLI

- Check `aspire --version` before the first call. Pass `--apphost <path>` on every command
  when `aspire ps` lists more than one AppHost, so it reaches this checkout's app; add
  `--format Json` where you parse the output.
- `aspire describe [<resource>]` — state, health, and endpoint URLs of every resource.
- `aspire logs <resource> [--tail <n>] [--search <text>]` — console output.
- `aspire logs <frontend>-browser-logs` — console output and network events of Aspire's own
  tracked browser, on a frontend with `.WithBrowserLogs()`. It sees only a session opened with
  `aspire resource <frontend>-browser-logs open-tracked-browser`, never the browser the
  Playwright CLI drives: that browser's evidence is `playwright-cli console` and `requests`.
  Read it only when the tracked browser ran this session, and never cite it otherwise.
- `aspire otel logs [<resource>] [--severity Error] [--trace-id <id>]` — structured logs.
- `aspire otel traces [<resource>] [--has-error]` — traces, with duration and status.
- `aspire start`, `aspire wait <resource>`, `aspire stop`, and
  `aspire resource <resource> <command>` start and change the app; a read-only persona never
  runs them.
- There are no metrics: `aspire otel` reads logs, spans, and traces only. Metrics come from
  the dashboard; never report metrics as monitored.
- A deployed environment's dashboard answers `aspire otel logs|traces --dashboard-url <url>
  --api-key <key>`, which the person supplies; resource state and console logs stay local.
- The `aspire` skill that `aspire agent init --skills aspire` installs covers the rest of the
  CLI; follow it, and the repository's own run recipe, where they say more.

## Aspire MCP fallback — a host without a shell

- Its tools surface as `mcp__plugin_qa_aspire__<tool>`, or `mcp__aspire__<tool>` when the
  repository registers the server itself; prepend whichever prefix your tool list shows.
- `list_resources` answers `aspire describe`, `list_console_logs` `aspire logs`,
  `list_structured_logs` `aspire otel logs`, `list_traces` `aspire otel traces`,
  `list_trace_structured_logs` a trace id. An older CLI exposes `get_*` names instead.

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

## Missing tools

When `aspire` does not answer, stop and name the Aspire CLI as missing; never install it.
With no shell, use the MCP fallback; when its tools are absent too, name the missing server,
and report a child-agent tool exposure problem when it is configured for normal sessions.
Without a shell the browser cannot be driven: say so.
