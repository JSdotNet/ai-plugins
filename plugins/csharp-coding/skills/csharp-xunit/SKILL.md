---
name: csharp-xunit
description: 'xUnit (v3 and v2) practice for C# .NET tests — project setup, facts and theories, fixtures, assertions, cancellation, skipping, and filtering by runner. Use when: writing or reviewing xUnit tests, or setting up or running an xUnit test project. DO NOT USE FOR: the test-first loop, seams, and what to mock (tdd).'
---

# xUnit — C# .NET

Before writing or reviewing a test, read
[../../resources/testing-contract.md](../../resources/testing-contract.md): test shape, what to
mock, and the filter syntax per runner.

Use the xUnit version already in the solution. A new test project is `<ProjectName>.Tests` on
xUnit v3: `xunit.v3`, `xunit.runner.visualstudio`, `Microsoft.NET.Test.Sdk`, and
`<OutputType>Exe</OutputType>`; set
`<UseMicrosoftTestingPlatformRunner>true</UseMicrosoftTestingPlatformRunner>` to run it on
Microsoft.Testing.Platform. xUnit v2 is the `xunit` package.

xUnit v3 gotchas:

- Pass `TestContext.Current.CancellationToken` to every async call, so a cancelled or timed-out
  run stops the test.
- Skip at runtime with `Assert.Skip("reason")`; skip unconditionally with
  `[Fact(Skip = "reason")]`.
- The filter syntax differs between VSTest and Microsoft.Testing.Platform — take it from the
  contract's table.

Libraries:

- Assertions: the library already in the project. For a new one, choose **AwesomeAssertions**
  (Apache-2.0) over **FluentAssertions** 8+, which needs a paid commercial licence.
- Mocks: **Moq** or **NSubstitute**, whichever is already in the solution, at the boundaries the
  contract lists.
