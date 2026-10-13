---
name: tdd
description: 'C# .NET test-driven development: red before green in vertical slices, testing behaviour through the public interface at agreed seams, with xUnit, NUnit, or MSTest. Use when building a C# feature or fixing a C# bug test-first, writing integration tests, or deciding what to mock. DO NOT USE FOR: frontend code, or xUnit project setup and filtering (csharp-xunit).'
---

# TDD — C# .NET

Before writing a test, read [../../resources/testing-contract.md](../../resources/testing-contract.md):
test shape, what to mock, the anti-patterns, the integration seams, and the filter syntax per
runner.

**Seams first.** Test only at the seams the brief or the person names. With none named, ask
"which public interface do we test?" and wait for the answer before writing a test.

**Loop.** One vertical slice per cycle:

1. Write one failing test through the public interface.
2. Run it and confirm it fails for the right reason — the assertion, not a compile error or a
   missing registration.
3. Write only the code that passes it, and run the touched tests with the runner's filter.
4. Start the next slice. Run the whole suite once at the end.

Refactoring and committing are not part of the loop.

**Defects.** Start from a failing test that reproduces the defect through the public
interface; fix only once it is red.

Good and bad xUnit examples: [tests.md](tests.md).

Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) `skills/engineering/tdd`, MIT License, © 2026 Matt Pocock.
