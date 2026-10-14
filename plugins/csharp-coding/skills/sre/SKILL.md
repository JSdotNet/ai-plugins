---
name: sre
description: 'SRE practices for .NET services — SLIs and SLOs, error budgets and burn-rate alerts, health probes, resilience pipelines, runbooks, and incident context. Use when: diagnosing an incident, reviewing service reliability, defining an SLO, or adding health checks or retries to C# code. DO NOT USE FOR: pulling logs and traces (aspire-logging), OpenTelemetry setup (open-telemetry).'
---

# SRE — .NET Services

**Health probes.** Expose liveness and readiness as distinct endpoints, filtered by tag.
Liveness carries no dependency check, so an outage does not restart every instance; a failed
readiness check takes the instance out of rotation. Health checks ship in the ASP.NET Core
shared framework.

```csharp
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["live"])
    .AddCheck("database", () => /* check the database */ HealthCheckResult.Healthy(), tags: ["ready"]);
app.MapHealthChecks("/alive", new HealthCheckOptions { Predicate = r => r.Tags.Contains("live") });
app.MapHealthChecks("/ready", new HealthCheckOptions { Predicate = r => r.Tags.Contains("ready") });
```

Under Aspire, `AddServiceDefaults()` registers a `live`-tagged `self` check and
`MapDefaultEndpoints()` maps `/health` (every check) and `/alive` (`live` only) in Development.

**Resilience — the house default.** Give every outbound `HttpClient`
`.AddStandardResilienceHandler()` (`Microsoft.Extensions.Http.Resilience`: retry, circuit
breaker, timeouts); under Aspire, `AddServiceDefaults()` already adds it to every client.
Build a custom `AddResiliencePipeline` only for a dependency the standard handler does not
cover.

**Burn-rate alerts** — multiwindow, per the Google SRE workbook, on a 30-day SLO window:

- **Fast burn** — 14.4× the budget rate over 1 hour (2% of the budget) → page on-call.
- **Medium burn** — 6× over 6 hours (5% of the budget) → page on-call.
- **Slow burn** — 1× over 3 days (10% of the budget) → open a ticket.

**Incidents and runbooks.** Pull logs and traces with
[../aspire-logging/SKILL.md](../aspire-logging/SKILL.md). Record when (first occurrence,
duration), what (errors, endpoints, users), where (service, dependency, region), why (trace
id, root cause), and the fix (mitigation, remediation). Write one runbook per alert from
[../../resources/runbook-template.md](../../resources/runbook-template.md), every section
filled, at `.wip/runbooks/<service-name>/<alert-name>.md` — placed and named by
`wip-convention:wip-align` instead when that plugin is installed.
