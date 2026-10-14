---
name: aggregate-diagram
description: 'Generate a Mermaid class diagram of the aggregates, entities, value objects, and domain events in one bounded context. Use when: visualising a tactical model once its aggregates are designed, or refreshing the diagram after an aggregate changes. DO NOT USE FOR: designing the aggregates themselves (domain-model-design).'
---

# Aggregate Diagram

## Inputs

The bounded context's `domain.md` with its aggregates. If it has none yet, report that and stop.

## Workflow

1. Read [ddd-global.md](../../resources/ddd-global.md) and
   [ddd-diagram.md](../../resources/ddd-diagram.md).
2. From `domain.md`, extract each aggregate root, the entities and value objects it owns, its
   cross-aggregate ID references, and the domain events it raises.
3. Draw one `classDiagram` per the Aggregate Class Diagram Conventions in ddd-diagram.md:
   stereotypes, relationship syntax, and one `style <ClassName> fill:...,stroke:...,color:...`
   line per class. Use `style`, never `classDef` or `:::` — Mermaid ignores those on
   `classDiagram` nodes.
4. Confirm with the user before overwriting an existing diagram.
5. Embed it in the context's `model.md`, the structural model, per
   [domain-documentation-structure.md](../../resources/domain-documentation-structure.md), and
   generate the SVG per "Landing and SVG" in ddd-diagram.md.
