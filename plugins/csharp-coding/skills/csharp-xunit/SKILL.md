---
name: csharp-xunit
description: 'xUnit (v3 and v2) practice for C# .NET tests — project setup, facts and theories, fixtures, assertions, cancellation, skipping, and filtering by runner. Use when: writing or reviewing xUnit tests, or setting up or running an xUnit test project. DO NOT USE FOR: the test-first loop, seams, and what to mock (tdd).'
---

# xUnit Best Practices for C#

Write effective unit tests with xUnit covering standard and data-driven approaches.

## Project Setup

- Separate test project: `[ProjectName].Tests`
- Use the xUnit version already in the solution. A new project uses xUnit v3: `xunit.v3`,
  `xunit.runner.visualstudio`, `Microsoft.NET.Test.Sdk`, and `<OutputType>Exe</OutputType>`;
  set `<UseMicrosoftTestingPlatformRunner>true</UseMicrosoftTestingPlatformRunner>` to run it on
  Microsoft.Testing.Platform. xUnit v2 is the `xunit` package.
- Run tests: `dotnet test`

## Test Structure

- No class attribute required (unlike MSTest/NUnit).
- Use `[Fact]` for single-behavior tests.
- Use `[Theory]` + `[InlineData]` for parameterized tests.
- Name tests and structure them per [../tdd/SKILL.md](../tdd/SKILL.md).
- Use constructor for setup and `IDisposable.Dispose()` for teardown.
- Use `IClassFixture<T>` for shared context within a class.
- Use `ICollectionFixture<T>` for shared context across classes.
- xUnit v3: pass `TestContext.Current.CancellationToken` to every async call, so a cancelled or
  timed-out run stops the test.

## Assertion Guidelines

- `Assert.Equal(expected, actual)` — value equality.
- `Assert.Same(expected, actual)` — reference equality.
- `Assert.Throws<T>(() => ...)` / `await Assert.ThrowsAsync<T>(...)` — exception testing.
- `Assert.Contains` / `Assert.DoesNotContain` — collection membership.
- Use the fluent assertion library already in the project. For a new one, choose
  **AwesomeAssertions** (Apache-2.0) over **FluentAssertions** 8+, which needs a paid commercial
  licence.

## Data-Driven Tests

```csharp
[Theory]
[InlineData(1, 2, 3)]
[InlineData(-1, 1, 0)]
public void Adding_two_numbers_gives_their_sum(int a, int b, int expected)
{
    var result = Calculator.Add(a, b);
    Assert.Equal(expected, result);
}
```

For method-based or class-based data, use `[MemberData]` or `[ClassData]`.

## Mocking

- What to mock: the boundary-mocking rule in [../tdd/SKILL.md](../tdd/SKILL.md).
- Use **Moq** or **NSubstitute**, whichever is already in the solution.

## Test Organization

- Group by feature or component.
- Use `[Trait("Category", "...")]` for categorization.
- Use `ITestOutputHelper` for diagnostic output.
- Skip unconditionally with `[Fact(Skip = "reason")]`; skip at runtime with `Assert.Skip("reason")` (xUnit v3).

## Validation

```bash
dotnet test
# Filter by trait, VSTest runner:
dotnet test --filter "Category=Unit"
# Filter by trait, xUnit v3 on Microsoft.Testing.Platform (drop the -- when the SDK runs MTP natively):
dotnet test -- --filter-trait "Category=Unit"
```
