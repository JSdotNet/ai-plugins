---
name: refactor
description: 'Behaviour-preserving refactoring of C# .NET code in small, tested steps — extract method, rename, break up large methods, remove code smells, improve type safety, apply a design pattern. Use when: restructuring or cleaning up code without changing what it does, or preparing code for a change. DO NOT USE FOR: performance work (code-optimization), new behaviour or a bug fix (tdd).'
---

# Refactor — C# .NET

Change structure, never behaviour. This skill owns structure and readability; performance
goes through [../code-optimization/SKILL.md](../code-optimization/SKILL.md).

1. Confirm the tests over the code pass. With none, name the gap before the first step.
2. Make one concern per step — a rename, an extraction, a move — and run `dotnet test` after
   each; keep a step only when it passes.
3. Rename through a symbol-aware rename (the IDE or language server), not a text replace.
4. Enable nullable reference types and remove each `!` suppression by fixing the flow it hides.

Readability targets: long methods become named helpers, magic numbers named constants,
complex conditions named predicates, and if-else or cast chains switch expressions and
pattern matching.
