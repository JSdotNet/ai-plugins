---
name: context-mapping
description: 'Define and validate bounded context boundaries and map the relationships between contexts with DDD strategic patterns. Use when: finalising context boundaries, mapping which context depends on which and by what pattern, or validating existing context definitions. DO NOT USE FOR: the integration contract of one relationship (domain-interaction-model) or the subdomain overview picture (subdomain-landscape-diagram).'
---

# Context Mapping

Use this skill to define bounded context boundaries and map their relationships.

## Inputs

- Domain exploration output (events, commands, subdomains, ubiquitous language).
- Existing bounded context definitions (if refining).
- Team structure and ownership information (optional).

## Workflow

1. Apply `resources/ddd-global.md` and `resources/strategic-design.md`.
2. Validate or define bounded context boundaries using the five heuristics:
   - Language boundary
   - Business capability boundary
   - Team boundary
   - Data consistency boundary
   - Change frequency boundary
3. For each bounded context:
   - Write a clear purpose statement.
   - Define the ubiquitous language within the context.
   - Verify the context can be developed and evolved independently.
   - Classify its deployment type as **Service** or **Module** (see `resources/strategic-design.md`).
4. Map relationships between contexts using DDD patterns:
   - Shared Kernel, Customer-Supplier, Conformist, Anti-Corruption Layer, Open Host Service, Published Language, Separate Ways, Partnership.
5. Produce a context map diagram in Mermaid showing all contexts and labelled relationships. Colour-code each bounded context node by deployment type (Service vs Module) per `resources/strategic-design.md`; do not colour edges/lines.
6. Run the boundary validation checklist from `resources/strategic-design.md`.
7. Update or create output files following `resources/domain-documentation-structure.md`.

## Output

- Updated `context-map.md` with the bounded contexts, their relationships, and published languages.
- One folder per bounded context: its purpose and boundary in `context.md`, its terms under
  `## Ubiquitous Language` in `domain.md`, its relationships in the dependency tables — layout per
  `resources/domain-documentation-structure.md`.
- Context map diagram (Mermaid).
