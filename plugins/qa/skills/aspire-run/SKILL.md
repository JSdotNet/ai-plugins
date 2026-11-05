---
name: aspire-run
description: 'Start a .NET Aspire-orchestrated application and confirm every resource is healthy before QA. Use when: starting the app under test before Playwright validation, exploratory or regression testing against a local build, a QA report must name the running version, refreshing the app after a code change. DO NOT USE FOR: an already-deployed environment (deployed-environment-validation).'
---

# Aspire Run

Start the app through its AppHost, so databases, caches, queues, and downstream services are
wired as a real user gets them, and confirm it is healthy before any validation. Resolve
tool names and the server start command per [qa-tools.md](../../resources/qa-tools.md).

## Steps

1. **Locate the AppHost.** Use the AppHost path the caller supplied. Otherwise find the
   project ending in `.AppHost`. Ask for the path only when discovery found nothing and you
   have a user turn; invoked by an orchestration (a sub-agent or child session), return the
   question and your best candidate to the caller instead of stalling.
2. **Build and start.** Build the AppHost if needed, then start it with `aspire run` (or
   `dotnet run --project <AppHost>.csproj` without the Aspire CLI) as a background process.
3. **Confirm health.** Call `list_resources` until every required resource is running and
   healthy. For one stuck starting or failed, read its `list_console_logs` before going on;
   never validate against a partially started app.
4. **Without the Aspire MCP server**, continue only for a startup-only check that needs no
   resource-state, log, trace, or health evidence. For validation that needs that evidence,
   the missing server blocks the phase: report that Aspire MCP must be started or configured
   first — to the user with a user turn, otherwise to the caller as a blocked result.
5. **Resolve endpoints.** Read the frontend and API base URLs from the dashboard or console
   output and record the exact URLs for the report.
6. **Keep it running for the whole session.** A restart between scenarios changes state and
   breaks the log/trace timeline `aspire-log-monitor` depends on. Stop it only after
   monitoring and validation are complete and the report exists.
7. **After a code change**, refresh before validating again: keep the running instance when
   its command hot-reloads and resources stay healthy, otherwise restart and wait for
   healthy. Re-resolve endpoint URLs, since ports may change, and record whether the refresh
   was hot reload or a full restart.

## Failure modes

| Symptom | Likely cause | Check |
|---|---|---|
| Resource stuck in Starting | Dependency container not pulled | `list_console_logs` for it |
| Frontend loads, API calls fail | Service discovery misconfigured | `ConnectionStrings__*`, `services__*__http__0` |
| App exits immediately | Missing config or secret | Startup console output |
