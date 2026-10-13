---
name: context-mapping
description: 'Define and validate bounded context boundaries and map the relationships between contexts with DDD strategic patterns. Use when: finalising context boundaries, mapping which context depends on which and by what pattern, or validating existing context definitions. DO NOT USE FOR: the integration contract of one relationship (domain-interaction-model) or the subdomain overview picture (subdomain-landscape-diagram).'
---

# Context Mapping

## Inputs

- The domain exploration output: events, commands, subdomains, ubiquitous language.
- Existing bounded context definitions, when refining.
- Team structure and ownership, when known.

## Workflow

1. Read [ddd-global.md](../../resources/ddd-global.md) and
   [strategic-design.md](../../resources/strategic-design.md).
2. Define or validate each boundary with the identification heuristics in
   strategic-design.md.
3. Per bounded context, write its purpose and its ubiquitous language, and classify its
   deployment type as **Service** or **Module** per strategic-design.md.
4. Name each relationship between contexts with a pattern from strategic-design.md.
5. Draw the context map as a `flowchart LR` per the Context Map Diagram Conventions in
   [ddd-diagram.md](../../resources/ddd-diagram.md): pattern labels on edges as text, and each
   node coloured by deployment type with the Service/Module palette — never an edge.
6. Run the Context Boundary Validation checklist in strategic-design.md, and report each item
   that fails.
7. Write per [domain-documentation-structure.md](../../resources/domain-documentation-structure.md):
   the contexts, relationships, published languages, and the diagram in `context-map.md`; per
   context, its purpose and boundary in `context.md`, its terms under `## Ubiquitous Language`
   in `domain.md`, and its relationships in the dependency tables. Generate the SVG per
   "Landing and SVG" in ddd-diagram.md.
