---
name: domain-model-design
description: 'Design the tactical domain model of one bounded context: aggregate roots, entities, value objects, domain events, domain services, and invariants. Use when: designing aggregates, entities, value objects, domain events, or domain services within a context. DO NOT USE FOR: the class diagram of the result (aggregate-diagram) or boundaries between contexts (context-mapping).'
---

# Domain Model Design

## Inputs

- The bounded context's `context.md` (purpose, boundary, dependencies) and `domain.md`
  (ubiquitous language).
- The business rules and invariants of the context, and its use cases when there are any.

## Workflow

1. Read [ddd-global.md](../../resources/ddd-global.md) and
   [tactical-design.md](../../resources/tactical-design.md).
2. Find the aggregates: what must be consistent in one transaction is one aggregate, and what
   can be eventually consistent is split.
3. Per aggregate, design the root with its responsibilities and public interface, its internal
   entities, its value objects, its invariants, and the domain events it raises.
4. Put logic that spans aggregates, or belongs to no single entity, in a domain service.
5. When the user asks for a review, or a boundary or ownership choice is in doubt, read
   [ddd-checklist.md](../../resources/ddd-checklist.md) and
   [ddd-anti-patterns.md](../../resources/ddd-anti-patterns.md) and report what fails.
6. Write per
   [domain-documentation-structure.md](../../resources/domain-documentation-structure.md): the
   aggregates, events, and services on the context's domain page, and each invariant as its
   own `### Invariant:` chapter in that page's invariants subpage, with its `Enforced at:`
   line — `open` for a rule or hot spot nobody has settled — per "Invariant Documentation" in
   tactical-design.md.

## Output

- The updated domain page and invariants subpage.
- The design concerns and anti-patterns found, each with the chapter it affects.
