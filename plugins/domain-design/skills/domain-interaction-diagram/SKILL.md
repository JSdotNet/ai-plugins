---
name: domain-interaction-diagram
description: 'Generate Mermaid flowcharts of integration contracts, communication patterns, and anti-corruption layer mappings between bounded contexts. Use when: visualising cross-context interactions once their contracts are defined, or refreshing them after a contract changes. DO NOT USE FOR: defining the contracts (domain-interaction-model).'
---

# Domain Interaction Diagram

Use this skill to produce integration diagrams that show how bounded contexts communicate — what crosses each boundary, by which mechanism, and through which integration pattern.

## Inputs

- Each bounded context's dependency tables (`## Dependencies` in `context.md`, or `dependencies.md`) as `domain-interaction-model` records them. If none exist, report that and stop.
- Context map (from `context-mapping`) to confirm relationship patterns.

## Workflow

1. Apply `resources/ddd-global.md` and `resources/ddd-diagram.md`.
2. Read the dependency tables of every bounded context and extract for each integration point:
   - The two participating contexts.
   - The integration pattern (ACL, Customer-Supplier, Published Language, Open Host Service, Shared Kernel, Conformist).
   - The mechanism: integration event, command, query, or shared data.
   - The communication pattern: synchronous, asynchronous, or event-driven.
   - The ACL translator name (if an anti-corruption layer is present).
3. Produce a **Domain Interaction Overview** diagram using `flowchart LR` following `resources/ddd-diagram.md`:
   - One rectangle node per bounded context.
   - One hexagon node per ACL translator between contexts.
   - Labelled directional edges showing the mechanism and communication pattern.
   - External systems as stadium-shape nodes.
4. For each anti-corruption layer, produce a dedicated **ACL Translation** diagram using `flowchart LR` following `resources/ddd-diagram.md`:
   - Show the upstream concept, the ACL translator, and the downstream concept as three nodes.
   - Label the upstream edge with the upstream term and the downstream edge with the translated term.
5. Insert the Domain Interaction Overview diagram into `context-map.md` under a **Domain Interaction Overview** section.
6. Insert each ACL Translation diagram beside the relationship it translates in the downstream context's dependency tables.
7. Run `scripts/generate-diagram-svgs.ps1 -Path <directory-of-output-file>` from the plugin root to generate SVG files alongside the Markdown output.

## Output

- `context-map.md` updated with a Domain Interaction Overview `flowchart LR` diagram.
- Downstream contexts' dependency tables updated with ACL Translation `flowchart LR` diagrams where anti-corruption layers exist.
