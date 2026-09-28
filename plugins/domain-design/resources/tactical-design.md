---
name: tactical-design
description: Guidelines for aggregate design, entity and value object modelling, domain events, and repository boundaries.
---

# Tactical Design Instructions

## Purpose

Guide tactical domain model design within a bounded context.

## Aggregate Design Rules

1. **One aggregate, one transaction.** Each business operation should modify exactly one aggregate per transaction.
2. **Reference by identity.** Aggregates reference other aggregates by ID only, never by direct object reference.
3. **Protect invariants through the root.** All state changes must go through the aggregate root. External code must never modify internal entities or collections directly.
4. **Keep aggregates small.** Include only the entities and value objects that must be immediately consistent. If two concepts can be eventually consistent, they belong in separate aggregates.
5. **Design for concurrency.** Consider optimistic concurrency on aggregate roots to detect conflicting updates.

## Entity Design

- Entities have identity that persists across state changes.
- Encapsulate state behind behavior methods. Avoid public setters.
- Validate state transitions within the entity. Invalid transitions must throw domain exceptions.
- Name entities using ubiquitous language, not technical patterns.

## Value Object Design

- Value objects are immutable. Equality is based on all component values.
- Validate all constraints in the constructor. A value object must always be valid.
- Use value objects for concepts defined by their attributes rather than identity (for example: money, address, email, date range).
- Prefer value objects over primitive types for domain concepts.

## Domain Event Design

- Name domain events in past tense to describe what happened (for example: `OrderPlaced`, `PaymentReceived`, `InventoryReserved`).
- Include only the data needed by consumers: aggregate ID and relevant business data.
- Never include full entity references in domain events. Use IDs and flattened data.
- Ensure event handlers are idempotent.

## Domain Service Design

- Use domain services for business logic that does not naturally belong to a single entity or value object.
- Domain services are stateless. They receive all data through parameters.
- Name domain services using ubiquitous language verbs or business process names.

## Repository Boundaries

- Define one repository per aggregate root.
- Repository interfaces belong to the domain layer. Implementations belong to the infrastructure layer.
- Repositories load and persist entire aggregates, not individual entities within an aggregate.

## Invariant Documentation

Write each rule an aggregate guarantees as its own `### Invariant: <name>` chapter under the
aggregate's `## <AggregateName>` chapter in the invariants subpage of its domain page, per
`domain-documentation-structure.md`:

- One sentence stating a claim that is true or false, in the domain's words, with the rejection
  code in parentheses where the type has one — ``(`order-already-confirmed`)``.
- An `Enforced at:` line: `constructor`, a named transition (`Confirm()`), `all mutations`, or
  `open` for a rule nobody has settled.
- No `#### Scenario:` — the `unit` test in its `tests` proves it; Given/When/Then belongs to
  `requirements.md`.
