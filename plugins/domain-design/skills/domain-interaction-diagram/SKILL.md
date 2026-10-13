---
name: domain-interaction-diagram
description: 'Generate Mermaid flowcharts of integration contracts, communication patterns, and anti-corruption layer mappings between bounded contexts. Use when: visualising cross-context interactions once their contracts are defined, or refreshing them after a contract changes. DO NOT USE FOR: defining the contracts (domain-interaction-model).'
---

# Domain Interaction Diagram

## Inputs

- Each bounded context's dependency tables (`## Dependencies` in `context.md`, or
  `dependencies.md`) as `domain-interaction-model` records them. If none exist, report that and
  stop.
- `context-map.md`, to confirm the relationship patterns.

## Workflow

1. Read [ddd-global.md](../../resources/ddd-global.md) and
   [ddd-diagram.md](../../resources/ddd-diagram.md).
2. Per integration point, extract the two contexts, the integration pattern, the mechanism,
   the communication pattern, and the ACL translator where there is one.
3. Draw one Domain Interaction Overview `flowchart LR` per the Context Interaction Diagram
   Conventions in ddd-diagram.md: rectangles for contexts, a hexagon per ACL translator, a
   stadium per external system, and `<mechanism> / <sync|async|event>` edge labels.
4. Draw one ACL Translation `flowchart LR` per anti-corruption layer: upstream → translator →
   downstream, each edge labelled with that side's term.
5. Embed the overview in `context-map.md` under a **Domain Interaction Overview** section, and
   each ACL diagram beside the relationship it translates in the downstream context's
   dependency tables; generate the SVGs per "Landing and SVG" in ddd-diagram.md.
