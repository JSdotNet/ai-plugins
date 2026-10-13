---
name: sre
description: 'SRE practices for .NET services — SLIs and SLOs, error budgets and burn-rate alerts, health probes, resilience pipelines, runbooks, and incident context. Use when: diagnosing an incident, reviewing service reliability, defining an SLO, or adding health checks or retries to C# code. DO NOT USE FOR: pulling logs and traces (aspire-logging), OpenTelemetry setup (open-telemetry).'
---

# SRE — Site Reliability Engineering for .NET Services

Apply SRE practices to improve the reliability, observability, and incident response of .NET services.

## Core Concepts

| Concept | Definition |
|---|---|
| **SLI** (Service Level Indicator) | A measurable signal of service health (e.g., request success rate, p99 latency). |
| **SLO** (Service Level Objective) | A target for an SLI (e.g., 99.9% success rate over 30 days). |
| **Error budget** | The allowed failure margin before the SLO is breached (e.g., 0.1% of requests over 30 days). |
| **Toil** | Repetitive manual work that scales with service growth — eliminate through automation. |
| **Runbook** | Documented response procedure for a known failure mode. |

## Defining SLIs in .NET (OpenTelemetry Metrics)

```csharp
// Success rate SLI: track successes and total requests
private static readonly Meter Meter = new("MyService.Reliability");
private static readonly Counter<long> RequestsTotal =
    Meter.CreateCounter<long>("requests.total");
private static readonly Counter<long> RequestsSuccess =
    Meter.CreateCounter<long>("requests.success");

public async Task<Result> HandleAsync(Request req, CancellationToken ct)
{
    RequestsTotal.Add(1);
    try
    {
        var result = await _handler.ExecuteAsync(req, ct);
        RequestsSuccess.Add(1);
        return result;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Request failed for {RequestId}", req.Id);
        throw;
    }
}
```

Register the meter and export to Aspire dashboard or Azure Monitor (see `open-telemetry` skill).

## Health Checks

Add liveness and readiness endpoints for Kubernetes/Aspire probes. Health checks ship in the
ASP.NET Core shared framework, so a web project needs no package. Tag each check and filter per
endpoint, so the two probes answer different questions:

```csharp
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["live"])
    .AddCheck("database", () => /* check the database */ HealthCheckResult.Healthy(), tags: ["ready"])
    .AddCheck("dependency", () => /* check downstream */ HealthCheckResult.Healthy(), tags: ["ready"]);

// Liveness: the process responds. Dependency checks stay out, so an outage does not restart every instance.
app.MapHealthChecks("/alive", new HealthCheckOptions { Predicate = r => r.Tags.Contains("live") });
// Readiness: dependencies are reachable. A failure takes the instance out of rotation.
app.MapHealthChecks("/ready", new HealthCheckOptions { Predicate = r => r.Tags.Contains("ready") });
```

Aspire's `AddServiceDefaults()` registers a `live`-tagged `self` check, and `MapDefaultEndpoints()`
maps `/health` (every check) and `/alive` (`live` only) in Development.

## Resilience Patterns (Microsoft.Extensions.Resilience)

```bash
dotnet add package Microsoft.Extensions.Http.Resilience
```

```csharp
builder.Services.AddHttpClient<IMyClient, MyClient>()
    .AddStandardResilienceHandler();  // retry + circuit breaker + timeout
```

Custom policy:

```csharp
builder.Services.AddResiliencePipeline("my-pipeline", pipeline =>
{
    pipeline
        .AddRetry(new RetryStrategyOptions
        {
            MaxRetryAttempts = 3,
            Delay = TimeSpan.FromMilliseconds(200),
            BackoffType = DelayBackoffType.Exponential
        })
        .AddCircuitBreaker(new CircuitBreakerStrategyOptions
        {
            FailureRatio = 0.5,
            SamplingDuration = TimeSpan.FromSeconds(30)
        })
        .AddTimeout(TimeSpan.FromSeconds(10));
});
```

## Runbook Template

Store runbooks under `.wip/runbooks/<service-name>/<alert-name>.md`.

```markdown
# Runbook: <Alert Name>

## Alert Condition

<Describe what triggers this alert — metric threshold, error rate, etc.>

## Impact

<User-facing impact and severity.>

## Diagnostic Steps

1. Check `list_resources` in Aspire MCP — is the service running?
2. `list_structured_logs` for <service> — look for error patterns.
3. `list_traces` — identify failing request paths, then `list_trace_structured_logs` for one.
4. Check downstream dependencies (database, queues, external APIs).

## Mitigation

- **Quick fix**: <e.g., restart service, scale out>
- **Permanent fix**: <link to issue or fix description>

## Escalation

<Who to contact if mitigation fails and SLO breach is imminent.>
```

## Incident Context Collection

When investigating an incident, gather:

1. **When** — first occurrence timestamp, duration.
2. **What** — error messages, affected endpoints, impacted users.
3. **Where** — which service, which dependency, which region.
4. **Why** — trace ID and root cause from `list_traces` / `list_structured_logs`.
5. **How to fix** — immediate mitigation and long-term remediation.

Use the `aspire-logging` skill to retrieve logs and traces from running services — it also
records the current tool names and how to resolve their `mcp__` prefix.

## Error Budget Burn Tracking

Alert on burn rate with multiwindow thresholds (Google SRE workbook, 30-day SLO window), in
dashboards such as Azure Monitor or Grafana:

- **Fast burn** — 14.4× the budget rate over 1 hour (2% of the budget) → page on-call.
- **Medium burn** — 6× over 6 hours (5% of the budget) → page on-call.
- **Slow burn** — 1× over 3 days (10% of the budget) → open a ticket.
- **Within budget** → no action required.

## Reference

- Resilience in .NET: `https://learn.microsoft.com/en-us/dotnet/core/resilience/`
- Health checks: `https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks`
- SRE book (Google): `https://sre.google/sre-book/table-of-contents/`
- Alerting on SLOs (SRE workbook): `https://sre.google/workbook/alerting-on-slos/`
