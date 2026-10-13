---
name: aspire
description: 'Aspire orchestration for distributed C# applications: AppHost wiring, service discovery, integrations, and AppHost integration tests. Use when: adding Aspire to a solution, wiring services, databases, or queues in the AppHost, adding an Aspire integration (Redis, Postgres, Service Bus), or testing against a running AppHost. DO NOT USE FOR: reading logs or traces of a running app (aspire-logging), OpenTelemetry setup (open-telemetry).'
---

# Aspire — AppHost Orchestration

Install the CLI with `dotnet tool install -g Aspire.Cli` (WinGet, Homebrew, and npm: "Install
Aspire CLI" on aspire.dev); `aspire init` adds Aspire to a solution and `aspire run` starts it.
Query the docs through the Aspire MCP server (`aspire agent mcp`) — integrations, search, and
pages, with tool names taken from your tool list, since they differ between CLI versions.
Without the server, fetch the pages at `https://aspire.dev` directly.

**Wiring.** Give a service `WithReference` for every dependency it calls, and `WaitFor` for
each one it needs at startup. The reference injects configuration under the resource name —
`ConnectionStrings__appdb` for a database, `services__api__http__0` for an HTTP endpoint — so
the service reads it through its client integration and holds no hand-written address.

```csharp
var db = builder.AddPostgres("pg").AddDatabase("appdb");
builder.AddProject<Projects.MyApi>("api").WithReference(db).WaitFor(db);
```

**Integrations.** `aspire add <name>` (`aspire add redis`) adds the hosting package to the
AppHost; add the client package (`Aspire.StackExchange.Redis`) to the consuming service.

**Tests.** `Aspire.Hosting.Testing` is the seam for testing against the whole AppHost:

```csharp
var appHost = await DistributedApplicationTestingBuilder.CreateAsync<Projects.AppHost>(ct);
await using var app = await appHost.BuildAsync(ct);
await app.StartAsync(ct);
await app.ResourceNotifications.WaitForResourceHealthyAsync("api", ct);
using var client = app.CreateHttpClient("api");
using var response = await client.GetAsync("/health", ct); // MapDefaultEndpoints maps it in Development
response.EnsureSuccessStatusCode();
```

Bound `ct` with a timeout (`new CancellationTokenSource(TimeSpan.FromSeconds(60))`), so a
resource that never turns healthy fails the test instead of hanging it.
