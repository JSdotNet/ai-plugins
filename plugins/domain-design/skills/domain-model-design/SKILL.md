---
name: domain-model-design
description: 'Design tactical domain models within a bounded context — aggregate roots, entities, value objects, domain events, and invariants.'
---

# Domain Model Design

Use this skill to design the tactical domain model for a specific bounded context.

## Trigger Conditions

Use when the user needs to design aggregates, entities, value objects, domain events, or domain services within a bounded context.

## Inputs

- Bounded context file with purpose, ubiquitous language, and integration contracts.
- Business rules and invariants for the context.
- Use cases or user stories scoped to this context (optional).

## Workflow

1. Apply `resources/ddd-global.md` and `resources/tactical-design.md`.
2. Identify **aggregates** within the context:
   - Determine consistency boundaries: what must be immediately consistent in a single transaction?
   - Identify the aggregate root for each aggregate.
   - Keep aggregates small. Split if two concepts can be eventually consistent.
3. For each aggregate, design:
   - **Aggregate root** — name, responsibilities, and public interface.
   - **Internal entities** — entities that exist only within this aggregate.
   - **Value objects** — immutable concepts defined by their attributes.
   - **Invariants** — business rules that must always hold within this aggregate.
   - **Domain events** — events raised when significant state changes occur.
4. Validate the design against `resources/ddd-checklist.md`.
5. Check for anti-patterns using `resources/ddd-anti-patterns.md`.
6. Document domain services for logic that spans multiple aggregates or does not belong to a single entity.
7. Update the bounded context following `resources/domain-documentation-structure.md`: the
   aggregates, events, and services on its domain page, and each invariant as its own
   `### Invariant:` chapter in that page's invariants subpage, per "Invariant Documentation" in
   `resources/tactical-design.md`.

## Output

- Updated domain page with aggregate designs, domain events, and domain services.
- Updated invariants subpage with one `### Invariant:` chapter per rule, each with its `Enforced at:` line.
- Flagged anti-patterns or design concerns.
