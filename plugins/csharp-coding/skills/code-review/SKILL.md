---
name: code-review
description: 'C# .NET code review checklist that reports findings by severity and changes nothing. Use when: reviewing a C# pull request, diff, or file for correctness, SOLID, async/await, error handling, security, and tests. DO NOT USE FOR: non-C# code or a language-agnostic bug hunt over a diff (the built-in code review), applying the fixes (refactor).'
---

# Code Review — C# .NET

Report findings only and change nothing. Whether a finding is fixed, and by whom, is the
caller's decision.

## Severity

- **Blocking** — must be fixed before merge: a bug, a security issue, a broken contract.
- **Important** — fix soon: an abstraction outside a seam, poor error handling, a missing test.
- **Suggestion** — naming, readability, a minor optimization.

## House checks

Beyond correctness, async, error handling, security, and tests, check:

- Null guards use `ArgumentNullException.ThrowIfNull(x)`; string guards `string.IsNullOrWhiteSpace(x)`.
- Every async method ends with `Async`, accepts a `CancellationToken`, and passes it through;
  library code uses `ConfigureAwait(false)`.
- An exception is handled, or bubbles to the boundary that logs it once; a log-and-rethrow
  logs it twice.
- An outbound HTTP call carries the resilience default in [../sre/SKILL.md](../sre/SKILL.md).
- Abstractions only at boundaries and seams (I/O, external services, time); a single in-process
  implementation stays a concrete type, and no layer is added without a need.
- Least exposure: `private` > `internal` > `protected` > `public`.
- Generated files are regenerated, never edited by hand.
- New and changed public APIs have tests; rate each anti-pattern in
  [../../resources/testing-contract.md](../../resources/testing-contract.md) Important.

## Report

```markdown
## Code Review: <file or PR title>
### Blocking
- [File:Line] <finding>
### Important
- [File:Line] <finding>
### Suggestion
- [File:Line] <finding>
```
