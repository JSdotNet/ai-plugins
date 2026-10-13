---
name: refactor
description: 'Behaviour-preserving refactoring of C# .NET code in small, tested steps — extract method, rename, break up large methods, remove code smells, improve type safety, apply a design pattern. Use when: restructuring or cleaning up code without changing what it does, or preparing code for a change. DO NOT USE FOR: performance work (code-optimization), new behaviour or a bug fix (tdd).'
---

# Refactor

Use this skill for safe, behavior-preserving refactoring of C# .NET code.

## Principles

- Keep behavior unchanged.
- Make small, testable steps.
- Prefer one refactor concern at a time.
- Validate continuously with `dotnet test` after each step.

## Common Refactoring Patterns

### Extract Method

Split large methods into smaller, named helpers with a single responsibility.

### Rename for Clarity

Update variable, method, or class names to reflect intent and domain language. Rename through a symbol-aware rename refactoring (the IDE or language server), not a text replace, so every reference updates.

### Remove Code Smells

| Smell | Fix |
|---|---|
| God class | Extract focused classes by responsibility |
| Long method | Extract method, reduce nesting |
| Feature envy | Move method closer to the data it uses |
| Primitive obsession | Introduce value objects or records |
| Duplicate code | Extract shared helper or base class |
| Magic numbers | Replace with named constants or enums |

### Apply Design Patterns

- **Strategy** — replace conditional dispatch with polymorphism.
- **Factory** — centralize complex object creation.
- **Decorator** — add behavior without modifying existing classes.
- **Command** — encapsulate operations for undo/redo or queuing.

### Improve Type Safety

- Replace `string` sentinel values with enums or discriminated unions (records).
- Use `record` types for immutable value objects.
- Enable nullable reference types and eliminate `!` suppressions.

## Validation

Run after every change, and keep a step only when it passes:

```bash
dotnet test
```
