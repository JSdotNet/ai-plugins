---
name: testing-contract
description: Test shape, what to mock, the test anti-patterns, the integration seams, and the filter syntax per test runner for C# .NET tests.
---

# Testing contract — C# .NET

## Shape

- Test behaviour through the public interface at an agreed seam, so a test survives any
  refactor that keeps behaviour.
- Name the behaviour in the domain language — `Checkout_is_confirmed_for_a_valid_cart` — not
  `MethodName_Scenario_ExpectedBehavior`.
- Arrange-Act-Assert, one behaviour per test, no `if`, loop, or `switch` in a test.
- Take expected values from an independent source — a literal, a worked example, the spec.
- Use the test framework already in the solution.

## Mock at system boundaries only

The boundaries: outbound HTTP (`HttpMessageHandler`), time (`TimeProvider` →
`FakeTimeProvider`), randomness, queues and brokers, third-party SDKs. Use the real
implementation of your own interfaces and collaborators. Prefer a real database through
Testcontainers over a mocked repository.

## Anti-patterns — rewrite on sight; a review rates each one Important

- *Implementation-coupled*: `Verify(…, Times.Once)` on your own collaborator, asserting
  through `DbContext` or another side channel instead of reading back through the interface,
  testing a `private` member or reaching one through `InternalsVisibleTo`. It breaks on a
  refactor that keeps behaviour.
- *Tautological*: the expected value is computed the way the code computes it, so the test
  passes by construction.

Good and bad xUnit examples: [../skills/tdd/tests.md](../skills/tdd/tests.md).

## Integration seams

| Seam | Use |
|---|---|
| `WebApplicationFactory<TProgram>` | HTTP endpoints in-process; swap boundary services in `ConfigureTestServices` |
| Testcontainers (`Testcontainers.PostgreSql`, `.MsSql`, …) | A real database or broker per test class via `IAsyncLifetime` |
| `DistributedApplicationTestingBuilder` (`Aspire.Hosting.Testing`) | The whole AppHost; call resources with `app.CreateHttpClient("<resource>")` |

## Running a subset

Use the filter syntax of the runner the solution uses. xUnit v3 runs on
Microsoft.Testing.Platform (MTP) when the project sets `UseMicrosoftTestingPlatformRunner`;
drop the `--` when the SDK runs MTP natively (`global.json` `"test": { "runner":
"Microsoft.Testing.Platform" }`).

| Runner | By class | By trait |
|---|---|---|
| VSTest | `dotnet test --filter "FullyQualifiedName~<Class>"` | `dotnet test --filter "Category=Unit"` |
| xUnit v3 on MTP | `dotnet test -- --filter-class "*.<Class>"` | `dotnet test -- --filter-trait "Category=Unit"` |

Run the touched tests while working and the whole suite once at the end.
