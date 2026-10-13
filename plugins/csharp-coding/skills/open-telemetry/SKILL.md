---
name: open-telemetry
description: 'Set up OpenTelemetry in .NET for distributed tracing, metrics, and logging — SDK setup, instrumentation, custom spans and meters, exporters (OTLP, Console, Azure Monitor), and Aspire service defaults. Use when: adding observability, tracing, or metrics to a C# service. DO NOT USE FOR: reading the logs or traces of a running Aspire app (aspire-logging), SLOs and alerting (sre).'
---

# OpenTelemetry for .NET

Add distributed tracing, metrics, and structured logging to C# services using the OpenTelemetry SDK.

## Core Packages

```bash
# SDK base
dotnet add package OpenTelemetry
dotnet add package OpenTelemetry.Extensions.Hosting

# Instrumentation
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Http
dotnet add package OpenTelemetry.Instrumentation.Runtime
dotnet add package OpenTelemetry.Instrumentation.EntityFrameworkCore  # if using EF Core

# Exporters — choose one or more
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol  # OTLP (Aspire, Jaeger, Tempo)
dotnet add package OpenTelemetry.Exporter.Console                # local dev
dotnet add package Azure.Monitor.OpenTelemetry.AspNetCore        # Azure Application Insights
```

## Minimal Setup (ASP.NET Core)

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation())
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddRuntimeInstrumentation())
    .WithLogging()
    .UseOtlpExporter();   // one OTLP exporter for all three signals: Aspire dashboard or a collector
```

`UseOtlpExporter()` reads `OTEL_EXPORTER_OTLP_ENDPOINT` and replaces the per-signal `AddOtlpExporter()` calls; the SDK throws when both are registered.

## Aspire Integration

Under Aspire, the wiring lives in the solution's ServiceDefaults project (created by the Aspire
templates or `aspire init`), not in a package. Reference that project and call:

```csharp
builder.AddServiceDefaults(); // ConfigureOpenTelemetry: instrumentation + UseOtlpExporter() when OTEL_EXPORTER_OTLP_ENDPOINT is set
```

Aspire sets `OTEL_EXPORTER_OTLP_ENDPOINT` for every resource it runs.

The Aspire dashboard displays traces, metrics, and logs without additional exporter config.

## Custom Tracing

```csharp
private static readonly ActivitySource Source = new("MyService.Orders");

public async Task ProcessOrderAsync(string orderId, CancellationToken ct)
{
    using var activity = Source.StartActivity("ProcessOrder");
    activity?.SetTag("order.id", orderId);

    // ... work ...
}
```

Register the source:

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(t => t.AddSource("MyService.Orders"));
```

## Custom Metrics

```csharp
private static readonly Meter Meter = new("MyService.Orders");
private static readonly Counter<long> OrdersProcessed =
    Meter.CreateCounter<long>("orders.processed");

public async Task ProcessOrderAsync(...)
{
    // ...
    OrdersProcessed.Add(1, new TagList { { "status", "success" } });
}
```

Register the meter:

```csharp
builder.Services.AddOpenTelemetry()
    .WithMetrics(m => m.AddMeter("MyService.Orders"));
```

## Best Practices

- Propagate `Activity` context through all async call chains.
- Use semantic conventions for tag names (e.g., `db.system`, `http.method`).
- Never log PII in trace tags or metric labels.
- Use `CancellationToken` in all instrumented operations.
- Prefer `AddServiceDefaults()` in Aspire projects over manual OTel wiring.

## Reference

- OpenTelemetry .NET: `https://opentelemetry.io/docs/languages/net/`
- Aspire observability: `https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/telemetry`
- Azure Monitor: `https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable`
