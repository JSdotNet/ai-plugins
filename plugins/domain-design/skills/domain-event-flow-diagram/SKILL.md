---
name: domain-event-flow-diagram
description: 'Generate Mermaid sequence diagrams of how domain events flow from commands through aggregates and policies, within or across bounded contexts. Use when: visualising the event flow of a business process once its commands, events, and policies are known. DO NOT USE FOR: a technical runtime call chain (architecture:sequence-diagram-generator).'
---

# Domain Event Flow Diagram

Use this skill to produce event flow diagrams that visualise the command-to-event-to-policy chain for one or more business processes.

## Inputs

- The bounded contexts' `domain.md` with commands, domain events, and policies, and `context-map.md` for flows that cross contexts.
- Optionally: a named business process to focus the diagram on.

## Workflow

1. Apply `resources/ddd-global.md` and `resources/ddd-diagram.md`.
2. Confirm scope with the user:
   - **Single process** — one end-to-end business process (e.g., "Place Order").
   - **Cross-context flow** — events crossing one or more bounded context boundaries.
   - **Full domain** — all significant processes across the bounded contexts.
3. For each in-scope process:
   - Identify the actor or external trigger.
   - Trace the chain: actor → command → aggregate → domain event → policy → next command.
   - Mark every bounded context transition with a `Note over` separator.
4. Produce a Mermaid `sequenceDiagram` per process following `resources/ddd-diagram.md`:
   - Participants: actors, `ContextName::AggregateName` pairs, and named policies.
   - Commands: solid arrows (`->>`).
   - Domain events: dashed arrows (`-->>`).
   - Policy triggers: fire-and-forget arrows (`--)`).
5. Store each diagram in the `flow.md` of the context whose process it draws — for a cross-context flow, the context where it starts — per `resources/domain-documentation-structure.md`.
6. Produce one diagram per significant process; do not combine unrelated processes in a single diagram.
7. Run `scripts/generate-diagram-svgs.ps1 -Path <directory-of-output-file>` from the plugin root to generate SVG files alongside the Markdown output.

## Output

- One or more Mermaid `sequenceDiagram` blocks showing the command-event-policy chain for each identified process.
- Diagrams embedded in the owning contexts' `flow.md`.
