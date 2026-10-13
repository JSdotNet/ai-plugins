---
name: microsoft-code-reference
description: 'Verify Microsoft .NET and Azure API signatures and pull official code samples from Microsoft Learn before writing code against them. Use when: calling an unfamiliar .NET, ASP.NET Core, EF Core, or Azure SDK API, checking that a method or overload exists or is deprecated, finding the right NuGet package, or confirming the C# version a language feature needs. DO NOT USE FOR: Aspire docs (aspire).'
---

# Microsoft Code Reference

Verify Microsoft API signatures and retrieve official code samples before generating implementation code.

## Core Workflow

1. **Search docs** — find the type or method to confirm it exists and retrieve the correct namespace.
2. **Fetch API page** — get full overloads, parameters, and return type details.
3. **Pull code samples** — retrieve language-specific examples from official documentation.
4. **Implement** — write code based on verified signatures and patterns.

## Using Microsoft Learn MCP Server

Use the `microsoft-learn` MCP server (`https://learn.microsoft.com/api/mcp`) when it is
available; without it, fetch the pages under Fallback.

```
Tool: microsoft_docs_search
query: "<type/method name> <context>"
```

```
Tool: microsoft_code_sample_search
query: "<SDK method or pattern>"
language: "csharp"
```

Fetch a full page from a search result with `microsoft_docs_fetch`.

## Fallback: Fetch the Docs

When the MCP server is unavailable, fetch these official pages directly:

- .NET API browser: `https://learn.microsoft.com/en-us/dotnet/api/`
- Azure SDK docs: `https://learn.microsoft.com/en-us/dotnet/azure/`
- What's new in .NET: `https://learn.microsoft.com/en-us/dotnet/core/whats-new`
- What's new in C#: `https://learn.microsoft.com/en-us/dotnet/csharp/whats-new`
