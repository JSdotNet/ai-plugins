---
name: open-telemetry
description: 'Set up OpenTelemetry in .NET for distributed tracing, metrics, and logging — SDK setup, instrumentation, custom spans and meters, exporters (OTLP, Console, Azure Monitor), and Aspire service defaults. Use when: adding observability, tracing, or metrics to a C# service. DO NOT USE FOR: reading the logs or traces of a running Aspire app (aspire-logging), SLOs and alerting (sre).'
---

# OpenTelemetry for .NET

**Under Aspire,** the wiring lives in the solution's ServiceDefaults project (created by the
Aspire templates or `aspire init`), not in a package. Reference that project and call
`builder.AddServiceDefaults()`: its `ConfigureOpenTelemetry` adds the instrumentation and calls
`UseOtlpExporter()` when `OTEL_EXPORTER_OTLP_ENDPOINT` is set, which Aspire does for every
resource it runs. Extend `ConfigureOpenTelemetry` rather than wiring OpenTelemetry a second time.

**Outside Aspire,** export with one `.UseOtlpExporter()` on `AddOpenTelemetry()` for all three
signals. It reads `OTEL_EXPORTER_OTLP_ENDPOINT` and replaces the per-signal
`AddOtlpExporter()` calls; the SDK throws when both are registered.

**Custom spans and meters.** Register every `ActivitySource` and `Meter` name you create —
an unregistered one records nothing:

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(t => t.AddSource("MyService.Orders"))
    .WithMetrics(m => m.AddMeter("MyService.Orders"));
```

Name tags by the OpenTelemetry semantic conventions, and keep PII out of every span tag and
metric label.
