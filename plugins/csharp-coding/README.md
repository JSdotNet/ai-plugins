# csharp-coding

Installable GitHub Copilot CLI plugin for C# .NET coding expertise.

A focused, single-agent plugin for writing, reviewing, optimizing, and testing C# .NET code.

## Includes

- Agents:
  - `agents/coding.agent.md`
- Skills:
  - `skills/tdd/SKILL.md` (with `tests.md`)
  - `skills/code-review/SKILL.md`
  - `skills/code-optimization/SKILL.md`
  - `skills/refactor/SKILL.md`
  - `skills/nuget-manager/SKILL.md`
  - `skills/csharp-xunit/SKILL.md`
  - `skills/microsoft-code-reference/SKILL.md`
  - `skills/feature-proposal/SKILL.md`
  - `skills/azure/SKILL.md`
  - `skills/aspire/SKILL.md`
  - `skills/open-telemetry/SKILL.md`
  - `skills/aspire-logging/SKILL.md`
  - `skills/sre/SKILL.md`
- Resources:
  - `resources/testing-contract.md` — test shape, mocking, anti-patterns, seams, runner filters
  - `resources/runbook-template.md` — the runbook the `sre` skill writes

## MCP Servers (optional, enhance capabilities)

| MCP Server | Purpose |
|---|---|
| Microsoft Learn | Official .NET/C# API docs and code samples |
| Aspire CLI (`aspire docs`) | Aspire orchestration and integration docs; the Aspire MCP server only on a host without a shell |
| JSdotNet Project Guideline MCP | Project-specific coding standards |

The agent works without MCP servers by fetching the official docs directly.

## What the Coding Agent Can Do

- **Write code** — idiomatic C# for .NET 11 and C# 15 (unions, the union `Result<T>`, `closed` hierarchies) with SOLID, async/await, and proper error handling.
- **Review code** — structured review with Blocking / Important / Suggestion severity levels.
- **Optimize code** — measured performance and allocation improvements.
- **TDD** — Red-Green-Refactor cycle with test framework detection.
- **Test feedback** — review and improve existing test projects.
- **Refactor** — behavior-preserving structure and readability improvements.
- **Package management** — NuGet add, remove, and update via dotnet CLI.
- **Feature proposals** — scoped proposals stored under `.wip/proposals/`.
- **Learning resources** — official docs via Microsoft Learn MCP or web fetch.

- **Azure SDK** — Azure service integrations with `DefaultAzureCredential`.
- **Aspire** — Aspire 17 AppHost code (`Microsoft.NET.Sdk`, `AddDotnetProject`, browser logs) and where tests meet it. Run `aspire agent init --skills aspire` for the Aspire CLI skill this plugin defers to.
- **OpenTelemetry** — tracing, metrics, and logging setup.
- **Aspire logging** — diagnose a running app from its logs, traces, and browser logs through the Aspire CLI.
- **SRE** — error budgets, resilience patterns, health checks, and runbooks.

## Handoffs

The coding agent names where out-of-scope work belongs — `architecture:architect` for
architectural concerns, `aikido:aikido` for security findings, `react-coding:frontend` for
React work — and says why. Whether that needs approval is the calling flow's business, not
this agent's; used bare, it simply reports.

## Install

```bash
copilot plugin install JSdotNet/ai-plugins:plugins/csharp-coding
copilot plugin list
```

## Reinstall After Changes

```bash
copilot plugin install JSdotNet/ai-plugins:plugins/csharp-coding
```

## Uninstall

```bash
copilot plugin uninstall csharp-coding
```
