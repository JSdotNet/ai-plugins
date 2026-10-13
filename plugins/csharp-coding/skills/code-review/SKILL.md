---
name: code-review
description: 'C# .NET code review checklist that reports findings by severity and changes nothing. Use when: reviewing a C# pull request, diff, or file for correctness, SOLID, async/await, error handling, security, and tests. DO NOT USE FOR: non-C# code or a language-agnostic bug hunt over a diff (the built-in code review), applying the fixes (refactor).'
---

# Code Review — C# .NET

Perform a structured review of C# code. Report findings grouped by severity. Do not make changes; report only.

## Severity Levels

- **Blocking** — Must be fixed before merge (bugs, security issues, broken contracts).
- **Important** — Should be fixed soon (SOLID violations, poor error handling, missing tests).
- **Suggestion** — Nice to have (naming, readability, minor optimizations).

## Review Checklist

### Correctness

- [ ] Logic is correct for all input cases including null and empty.
- [ ] Null guards use `ArgumentNullException.ThrowIfNull(x)` or `string.IsNullOrWhiteSpace(x)`.
- [ ] No off-by-one errors or incorrect comparisons.
- [ ] Return values and out parameters are used correctly.

### SOLID Principles

- [ ] Single Responsibility: each class/method has one reason to change.
- [ ] Open/Closed: open for extension, closed for modification.
- [ ] Liskov Substitution: derived types are substitutable for base types.
- [ ] Interface Segregation: interfaces are focused, not fat.
- [ ] Dependency Inversion: code depends on abstractions at boundaries and seams (I/O, external services, time); elsewhere on concrete types.

### Async/Await

- [ ] All async methods end with `Async`.
- [ ] `CancellationToken` is accepted and passed through.
- [ ] No sync-over-async (`.Result`, `.Wait()`).
- [ ] `ConfigureAwait(false)` used in library/helper code.
- [ ] No fire-and-forget without proper handling.

### Error Handling

- [ ] Specific exception types used (not base `Exception`).
- [ ] No silent catches — handle the exception, or let it bubble to the boundary that logs it once; a log-and-rethrow logs it twice.
- [ ] External calls have timeout and retry where appropriate.

### Security

- [ ] No secrets in source code.
- [ ] Input is validated before use.
- [ ] SQL uses parameterized queries (no string interpolation in queries).
- [ ] Sensitive data is not logged.

### Testing

- [ ] New and changed public APIs have tests.
- [ ] Tests follow AAA pattern and are independent.
- [ ] Assertions are specific and cover edge cases.
- [ ] No implementation-coupled test: no `Verify(…, Times.Once)` on an own collaborator, no assertion through `DbContext` or another side channel, no test of a private member (Important).
- [ ] No tautological test: no expected value computed the way the code computes it (Important).
- [ ] `dotnet test` passes.

### Naming and Readability

- [ ] Names reflect intent and domain concepts.
- [ ] No abbreviations that reduce clarity.
- [ ] Comments explain *why*, not *what*.
- [ ] No dead code or commented-out code.

### Design

- [ ] Interfaces and abstractions only at the boundaries and seams Dependency Inversion names; none for a single in-process implementation.
- [ ] No new layers introduced without clear need.
- [ ] Least-exposure rule: `private` > `internal` > `protected` > `public`.
- [ ] Auto-generated files are not manually edited.

## Reporting Format

```markdown
## Code Review: <file or PR title>

### Blocking

- [File:Line] <finding description>

### Important

- [File:Line] <finding description>

### Suggestion

- [File:Line] <finding description>
```
