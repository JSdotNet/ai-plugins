---
name: domain-interaction-model
description: 'Model the interactions between bounded contexts: integration events, anti-corruption layers, shared kernels, published language, and communication patterns. Use when: defining integration contracts, designing event flows between contexts, or specifying anti-corruption layer mappings. DO NOT USE FOR: drawing the diagrams (domain-interaction-diagram) or choosing the boundaries (context-mapping).'
---

# Domain Interaction Model

Use this skill to design and document how bounded contexts interact with each other.

## Inputs

- Context map with labelled relationships (from `context-mapping` skill).
- Bounded context files with aggregate and event definitions.
- Communication requirements (synchronous, asynchronous, event-driven).

## Workflow

1. Apply `resources/ddd-global.md` and `resources/strategic-design.md`.
2. For each relationship on the context map, design the interaction:
   - **Shared Kernel** — document the shared model subset, ownership rules, and change protocol.
   - **Customer-Supplier** — define the upstream API contract, downstream expectations, and negotiation process.
   - **Anti-Corruption Layer** — specify translation mappings between upstream and downstream models. Document which terms change meaning and how values are transformed.
   - **Published Language** — define the shared schema or contract format, versioning strategy, and evolution rules.
   - **Open Host Service** — specify the protocol, endpoints or event channels, and consumer registration process.
   - **Conformist** — document what is accepted as-is from upstream and any limitations this creates.
3. For each integration point, specify:
   - **Direction** — inbound or outbound relative to the context.
   - **Mechanism** — integration event, command, query, or shared data store.
   - **Communication pattern** — synchronous (request-response), asynchronous (fire-and-forget), or event-driven (publish-subscribe).
   - **Data contract** — what data crosses the boundary and in what shape.
   - **Failure handling** — what happens when the interaction fails (retry, compensating action, circuit breaker).
4. Leave the diagrams to the `domain-interaction-diagram` skill, which reads the tables this skill writes.
5. Record each relationship in the dependency tables of the context that depends (`## Dependencies` in `context.md`, or `dependencies.md`), and each published language in `context-map.md`, following `resources/domain-documentation-structure.md`.

## Output

- Updated dependency tables per bounded context, and published languages in `context-map.md`.
- Anti-corruption layer mapping tables where applicable.
