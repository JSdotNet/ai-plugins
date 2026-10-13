---
name: domain-interaction-model
description: 'Model the interactions between bounded contexts: integration events, anti-corruption layers, shared kernels, published language, and communication patterns. Use when: defining integration contracts, designing event flows between contexts, or specifying anti-corruption layer mappings. DO NOT USE FOR: drawing the diagrams (domain-interaction-diagram) or choosing the boundaries (context-mapping).'
---

# Domain Interaction Model

## Inputs

- The context map with labelled relationships, from `context-mapping`.
- The bounded contexts' aggregate and event definitions.
- The communication requirements: synchronous, asynchronous, event-driven.

## Workflow

1. Read [ddd-global.md](../../resources/ddd-global.md) and
   [strategic-design.md](../../resources/strategic-design.md).
2. Per relationship on the context map, design what its pattern requires — the shared subset
   and change protocol for a Shared Kernel, the contract and its versioning for a Published
   Language or Open Host Service, what is accepted as-is for a Conformist.
3. For an anti-corruption layer, write a mapping table of upstream term → downstream term and
   how each value is transformed.
4. Per integration point, specify:
   - **Direction** — inbound or outbound relative to the context.
   - **Mechanism** — integration event, command, query, or shared data store.
   - **Communication pattern** — synchronous, asynchronous, or event-driven.
   - **Data contract** — what crosses the boundary and in what shape.
   - **Failure handling** — retry, compensating action, or circuit breaker.
5. Record each relationship in the dependency tables of the context that depends
   (`## Dependencies` in `context.md`, or `dependencies.md`), and each published language in
   `context-map.md`, per
   [domain-documentation-structure.md](../../resources/domain-documentation-structure.md).
   The diagrams are `domain-interaction-diagram`'s; it reads these tables.
