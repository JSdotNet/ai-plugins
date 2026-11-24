---
name: aspire-run
description: 'Start a .NET Aspire-orchestrated application and confirm every resource is healthy before QA. Use when: starting the app under test before Playwright validation, exploratory or regression testing against a local build, a QA report must name the running version, refreshing the app after a code change. DO NOT USE FOR: an already-deployed environment (deployed-environment-validation).'
---

# Aspire Run

Start the app through its AppHost, so databases, caches, queues, and downstream services are
wired as a real user gets them, and confirm it is healthy before any validation. The commands
and the MCP fallback are in [qa-tools.md](../../resources/qa-tools.md).

## Steps

1. **Locate the AppHost.** Use the AppHost path the caller supplied. Otherwise find the
   project ending in `.AppHost`. Ask for the path only when discovery found nothing and you
   have a user turn; invoked by an orchestration (a sub-agent or child session), return the
   question and your best candidate to the caller instead of stalling.
2. **Start it detached.** Follow the repository's run recipe or its `aspire` skill when it
   has one. Otherwise run `aspire start --apphost <path>`, adding `--isolated` when
   `aspire ps` already lists this AppHost from another checkout, so the two get separate
   ports.
3. **Confirm health.** `aspire wait <resource>` for every required resource, then
   `aspire describe` to see them all healthy. For one stuck starting or failed, read
   `aspire logs <resource>` before going on; never validate against a partially started app.
4. **Without the Aspire CLI**, or on a host without a shell and without the MCP fallback,
   continue only for a startup-only check that needs no resource-state, log, trace, or health
   evidence. Otherwise the missing tool blocks the phase: report it — to the user with a user
   turn, otherwise to the caller as a blocked result.
5. **Resolve endpoints.** Read the frontend and API URLs from `aspire describe --format Json`,
   never a hard-coded port, and record the exact URLs for the report.
6. **Keep it running for the whole session.** A restart between scenarios changes state and
   breaks the log/trace timeline `aspire-log-monitor` depends on. Run `aspire stop` only after
   monitoring and validation are complete and the report exists.
7. **After a code change**, refresh before validating again the way the repository's `aspire`
   skill says (a resource rebuild, or a full restart for an AppHost change), wait for healthy,
   re-resolve the URLs, and record which refresh it was.

## Failure modes

| Symptom | Likely cause | Check |
|---|---|---|
| Resource stuck in Starting | Dependency container not pulled | `aspire logs <resource>` |
| Frontend loads, API calls fail | Service discovery misconfigured | `ConnectionStrings__*`, `services__*__http__0` |
| App exits immediately | Missing config or secret | `aspire logs` for the AppHost's resources |
