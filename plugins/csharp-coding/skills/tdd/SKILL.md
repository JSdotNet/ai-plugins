---
name: tdd
description: 'C# .NET test-driven development: red before green in vertical slices, testing behaviour through the public interface at agreed seams, with xUnit, NUnit, or MSTest. Use when building a C# feature or fixing a C# bug test-first, writing integration tests, or deciding what to mock. Not for frontend code.'
---

# TDD — C# .NET

**Seams.** Test only at the seams the brief or the person names; with none named, ask "which public interface do we test?" before writing a test. Test behaviour through that public interface — never a `private` member, never through `InternalsVisibleTo`. A test survives any refactor that keeps behaviour.

**Loop.** One vertical slice per cycle: one failing test, then only the code that passes it. Run it and confirm it fails for the right reason — the assertion, not a compile error or a missing registration — before writing production code. Run the touched tests with `dotnet test --filter "FullyQualifiedName~<Class>"`, the whole suite once at the end. Refactoring and committing are not part of the loop.

**Defects.** Start from the failing test that reproduces the defect through the public interface; fix only once it is red.

**Shape.**
- Name the behaviour in the domain language — `Checkout_is_confirmed_for_a_valid_cart` — not `MethodName_Scenario_ExpectedBehavior`.
- Arrange-Act-Assert, one behaviour per test, no `if`, loop, or `switch` in a test.
- Take expected values from an independent source — a literal, a worked example, the spec.

**Mocking — the rule every C# skill points at.** Mock at system boundaries only: outbound HTTP (`HttpMessageHandler`), time (`TimeProvider` → `FakeTimeProvider`), randomness, queues and brokers, third-party SDKs. Never mock your own interfaces or collaborators — use the real ones. Prefer a real database through Testcontainers over a mocked repository.

**Anti-patterns** — rewrite on sight:
- *Implementation-coupled*: `Verify(…, Times.Once)` on your own collaborator, asserting through `DbContext` instead of reading back through the interface, testing a private method. It breaks on a refactor that keeps behaviour.
- *Tautological*: the expected value is computed the way the code computes it, so the test passes by construction.

Good and bad xUnit examples: [tests.md](tests.md).

**Integration seams.**

| Seam | Use |
|---|---|
| `WebApplicationFactory<TProgram>` | HTTP endpoints in-process; swap boundary services in `ConfigureTestServices` |
| Testcontainers (`Testcontainers.PostgreSql`, `.MsSql`, …) | A real database or broker per test class via `IAsyncLifetime` |
| `DistributedApplicationTestingBuilder` (`Aspire.Hosting.Testing`) | The whole AppHost; call resources with `app.CreateHttpClient("<resource>")` |

**Frameworks.** Use the one already in the solution.

| Framework | Test | Parameterized | Setup / Teardown |
|---|---|---|---|
| xUnit | `[Fact]` | `[Theory]` + `[InlineData]` | Constructor / `IDisposable`, `IAsyncLifetime` |
| NUnit | `[Test]` | `[TestCase]` | `[SetUp]` / `[TearDown]` |
| MSTest | `[TestMethod]` | `[DataRow]` | `[TestInitialize]` / `[TestCleanup]` |

Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) `skills/engineering/tdd`, MIT License, © 2026 Matt Pocock.
