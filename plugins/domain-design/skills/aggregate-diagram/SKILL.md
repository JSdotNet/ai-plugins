---
name: aggregate-diagram
description: 'Generate a Mermaid class diagram of the aggregates, entities, value objects, and domain events in one bounded context. Use when: visualising a tactical model once its aggregates are designed, or refreshing the diagram after an aggregate changes. DO NOT USE FOR: designing the aggregates themselves (domain-model-design).'
---

# Aggregate Diagram

Use this skill to produce a visual class diagram of the tactical domain model for a bounded context.

## Inputs

- The bounded context's `domain.md` with aggregate designs (aggregate roots, entities, value objects, domain events). If it has no aggregates yet, report that and stop.
- `resources/tactical-design.md` (already loaded if `domain-model-design` ran earlier).

## Workflow

1. Apply `resources/ddd-global.md` and `resources/ddd-diagram.md`.
2. Read the context's `domain.md` and extract:
   - Aggregate roots with their key responsibilities.
   - Internal entities and the aggregate that owns them.
   - Value objects and the aggregate that owns them.
   - Cross-aggregate ID references.
   - Domain events raised by each aggregate.
3. Build a Mermaid `classDiagram` following `resources/ddd-diagram.md`:
   - Annotate each aggregate root with `<<AggregateRoot>>`.
   - Annotate each entity with `<<Entity>>`.
   - Annotate each value object with `<<ValueObject>>`.
   - Annotate each domain event with `<<DomainEvent>>`.
   - Use composition (`*--`) for entities and value objects contained within an aggregate.
   - Use dashed dependency (`..>`) labelled `uses id` for cross-aggregate references.
   - Use dashed dependency (`..>`) labelled `raises` for domain events emitted by an aggregate.
   - Apply the Color Conventions from `resources/ddd-diagram.md` to every class via a `style <ClassName> fill:...,stroke:...,color:...` line (not `classDef`/`:::`, which Mermaid does not apply to `classDiagram` nodes), colouring class boxes only — never relationship lines.
4. Insert the diagram into the context's `model.md`, the structural model, per `resources/domain-documentation-structure.md`.
5. Confirm with the user before overwriting an existing diagram.
6. Run `scripts/generate-diagram-svgs.ps1 -Path <directory-of-model.md>` from the plugin root to generate an SVG alongside the Markdown output.

## Output

- Updated `model.md` with an embedded Mermaid `classDiagram` of the aggregate model.
