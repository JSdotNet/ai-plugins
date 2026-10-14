---
name: domain-event-flow-diagram
description: 'Generate Mermaid sequence diagrams of how domain events flow from commands through aggregates and policies, within or across bounded contexts. Use when: visualising the event flow of a business process once its commands, events, and policies are known. DO NOT USE FOR: a technical runtime call chain (architecture:sequence-diagram-generator).'
---

# Domain Event Flow Diagram

## Inputs

- The bounded contexts' `domain.md` with commands, domain events, and policies, and
  `context-map.md` for flows that cross contexts.
- Optionally, a named business process to focus on.

## Workflow

1. Read [ddd-global.md](../../resources/ddd-global.md) and
   [ddd-diagram.md](../../resources/ddd-diagram.md).
2. Confirm the scope with the user: one process, a cross-context flow, or every significant
   process in the domain.
3. Per process, trace actor → command → aggregate → domain event → policy → next command.
4. Draw one `sequenceDiagram` per process — never two unrelated processes in one — per the
   Event Flow Diagram Conventions in ddd-diagram.md: `Context::Aggregate` participants, the
   arrow table for commands, events, and policy triggers, and a `Note over` at every bounded
   context transition.
5. Embed each in the `flow.md` of the context whose process it draws — for a cross-context
   flow, the context where it starts — per
   [domain-documentation-structure.md](../../resources/domain-documentation-structure.md), and
   generate the SVG per "Landing and SVG" in ddd-diagram.md.
