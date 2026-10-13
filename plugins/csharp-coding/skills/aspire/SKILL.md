---
name: aspire
description: 'Aspire orchestration for distributed C# applications: AppHost wiring, service discovery, integrations, and AppHost integration tests. Use when: adding Aspire to a solution, wiring services, databases, or queues in the AppHost, adding an Aspire integration (Redis, Postgres, Service Bus), or testing against a running AppHost. DO NOT USE FOR: reading logs or traces of a running app (aspire-logging), OpenTelemetry setup (open-telemetry).'
---

# .NET Aspire — Distributed App Orchestration

Orchestrate distributed .NET applications with Aspire AppHost.

## Using the Aspire MCP Server

When the Aspire MCP server is available (`aspire agent mcp`), query the official docs through it:

```
list_integrations                  — list the Aspire hosting integrations
get_integration_docs               — docs for one integration package
list_docs / search_docs / get_doc  — browse, search, and read aspire.dev pages
```

The tool set differs between Aspire CLI versions — take the names from your tool list. Without
the server, fetch the pages at `https://aspire.dev` directly.

## Quick Start

```bash
# Install the Aspire CLI as a .NET global tool (WinGet, Homebrew, and npm: see "Install Aspire CLI" on aspire.dev)
dotnet tool install -g Aspire.Cli

# Add Aspire to existing solution
aspire init

# Run the distributed app
aspire run
```

## AppHost Wiring (C#)

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var redis = builder.AddRedis("cache");
var db = builder.AddPostgres("pg").AddDatabase("appdb");

var api = builder.AddProject<Projects.MyApi>("api")
    .WithReference(redis)
    .WithReference(db)
    .WaitFor(db);

builder.Build().Run();
```

## Service Discovery

Services reference each other by resource name. Aspire injects connection strings automatically:

- Database: `ConnectionStrings__appdb`
- HTTP service: `services__api__http__0`

No manual config needed when using `.WithReference()`.

## Adding an Integration

```bash
aspire add redis          # adds Redis hosting + client integration
aspire add postgres       # adds Postgres hosting + client integration
```

Or manually:

```bash
dotnet add AppHost package Aspire.Hosting.Redis
dotnet add MyService package Aspire.StackExchange.Redis
```

## Integration Testing

```bash
dotnet add package Aspire.Hosting.Testing
```

```csharp
[Fact]
public async Task Api_reports_healthy()
{
    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
    var ct = cts.Token;

    var appHost = await DistributedApplicationTestingBuilder
        .CreateAsync<Projects.AppHost>(ct);
    await using var app = await appHost.BuildAsync(ct);
    await app.StartAsync(ct);

    await app.ResourceNotifications.WaitForResourceHealthyAsync("api", ct);
    using var client = app.CreateHttpClient("api");

    using var response = await client.GetAsync("/health", ct); // MapDefaultEndpoints maps it in Development
    response.EnsureSuccessStatusCode();
}
```

## Reference

- Aspire docs: `https://aspire.dev`
- Integrations: `https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/integrations-overview`
- Samples: `https://github.com/dotnet/aspire-samples`
