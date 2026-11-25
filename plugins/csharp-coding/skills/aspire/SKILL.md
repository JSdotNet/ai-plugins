---
name: aspire
description: 'Aspire 17 AppHost code for distributed C# applications: the AppHost project, adding .NET projects, wiring dependencies, browser logs, resource commands, and where tests meet the AppHost. Use when: adding Aspire to a solution, migrating an AppHost to Aspire 17, wiring services, databases, or queues in the AppHost, or testing against Aspire. DO NOT USE FOR: Aspire CLI commands and docs lookup (the aspire skill aspire agent init installs), reading logs or traces of a running app (aspire-logging), OpenTelemetry setup (open-telemetry).'
---

# Aspire — AppHost Code

`aspire agent init --skills aspire` installs the Aspire skill: the CLI (start, stop, wait,
describe, logs, add, update), the docs lookup, and when to restart. Run it once per repository
and follow it for everything the CLI does; this skill covers only the C# the AppHost holds.

**The AppHost (Aspire 17).** A `Microsoft.NET.Sdk` project referencing `Aspire.Hosting.AppHost`
and `Aspire.Hosting.Dotnet`, which adds each .NET project by path with `AddDotnetProject` — no
`ProjectReference`, no generated `Projects.*` type. `Aspire.AppHost.Sdk`, `AddProject<T>`, and
`AddCSharpApp` are obsolete (ASPIRE012 for the SDK, CS0618 for the calls): migrate rather
than suppress. `aspire update` does not rewrite these calls; migrate them by hand.

```csharp
var db = builder.AddPostgres("pg").AddDatabase("appdb");
var api = builder.AddDotnetProject("api", "../Shop.Api/Shop.Api.csproj")
    .WithReference(db).WaitFor(db);
#pragma warning disable ASPIREBROWSERLOGS001 // experimental; scoped to this call
builder.AddViteApp("web", "../Shop.Web").WithReference(api).WithBrowserLogs();
#pragma warning restore ASPIREBROWSERLOGS001
```

**Wiring.** Give a service `WithReference` for every dependency it calls and `WaitFor` for
each one it needs at startup. The reference injects configuration under the resource name —
`ConnectionStrings__appdb`, `services__api__http__0` — so the service reads it through its
client integration and holds no hand-written address.

**Frontends and commands.** Every frontend resource calls `.WithBrowserLogs()`
(`aspire add browsers`): a tracked browser opened from its `<frontend>-browser-logs` resource
streams console output and failed requests there. A routine development
action (reset or seed a database, clear a cache) is a `WithCommand` on its resource, not a
script.

**Hot reload.** A `DotnetProjectResource` has no Aspire watch: use `dotnet watch` on the
project, or keep a resource that depends on watch on `AddProject`, with CS0618 suppressed at
that call only and the exception recorded in the repository, until Aspire supports it.

**Tests.** Unit and integration tests never start the AppHost: an integration test hosts one
Api with `WebApplicationFactory` against throwaway containers. Only an end-to-end suite runs
through Aspire — `aspire start --isolated` in its global setup, the frontend URL read from
`aspire describe --format Json`, and a failed run on errors in `aspire otel logs` or a
`<frontend>-browser-logs` resource.
