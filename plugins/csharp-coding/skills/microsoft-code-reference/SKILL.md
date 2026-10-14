---
name: microsoft-code-reference
description: 'Verify Microsoft .NET and Azure API signatures and pull official code samples from Microsoft Learn before writing code against them. Use when: calling an unfamiliar .NET, ASP.NET Core, EF Core, or Azure SDK API, checking that a method or overload exists or is deprecated, finding the right NuGet package, or confirming the C# version a language feature needs. DO NOT USE FOR: Aspire docs (aspire).'
---

# Microsoft Code Reference

Verify every .NET or Azure API you are unsure of, or that may be newer than your training
cutoff, before writing code against it: that it exists, its namespace and package, its
overloads, and whether it is deprecated.

1. `microsoft_docs_search` with `query: "<type or method> <context>"` — confirm it exists.
2. `microsoft_docs_fetch` with the result's `url` — read the overloads, parameters, and return type.
3. `microsoft_code_sample_search` with `query` and `language: "csharp"` — official samples.
4. Write the code from the verified signature, and name in the report any API you could not verify.

The tools come from the `microsoft-learn` MCP server (`https://learn.microsoft.com/api/mcp`).
Without it, fetch these pages directly: the .NET API browser
`https://learn.microsoft.com/en-us/dotnet/api/`, the Azure SDK docs
`https://learn.microsoft.com/en-us/dotnet/azure/`, and what's new in .NET
`https://learn.microsoft.com/en-us/dotnet/core/whats-new` and in C#
`https://learn.microsoft.com/en-us/dotnet/csharp/whats-new`.
