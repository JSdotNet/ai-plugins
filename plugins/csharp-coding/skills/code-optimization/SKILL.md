---
name: code-optimization
description: 'Optimize C# .NET code for performance, readability, and maintainability. Use when profiling reveals hot paths, or when code has excessive allocations, sync-over-async, or unnecessary complexity. DO NOT USE FOR: structural cleanup with no performance goal (refactor).'
---

# Code Optimization — C# .NET

Performance work only; structure and readability go through [../refactor/SKILL.md](../refactor/SKILL.md).

1. Measure first: a BenchmarkDotNet benchmark with `[MemoryDiagnoser]` for a method,
   `dotnet-counters` or `dotnet-trace` for a running process. When nothing can be measured,
   say so and propose the benchmark rather than guess.
2. Change hot paths only; leave cold paths as readable as they are.
3. Keep behaviour unchanged: `dotnet test` passes before and after.
4. Report the before and after numbers beside each change.

House calls:

- `ValueTask` only where a measurement shows it helps; default to `Task`.
- Stream a large HTTP payload: `GetAsync(url, HttpCompletionOption.ResponseHeadersRead, ct)`,
  then `ReadAsStreamAsync(ct)`.
- Replace an N+1 query — one query per row — with one batched query, `Include`, or projection.
