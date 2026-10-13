---
name: subdomain-landscape-diagram
description: 'Generate a Mermaid landscape diagram of the subdomains, classified core, supporting, or generic, with their bounded contexts. Use when: the subdomains have been classified, or refreshing the landscape after contexts are added or reclassified. DO NOT USE FOR: the relationship patterns between contexts (context-mapping).'
---

# Subdomain Landscape Diagram

## Inputs

`context-map.md` with the subdomain classification and its bounded contexts, and its context
map for the relationships. If it has no classification, report that and stop.

## Workflow

1. Read [ddd-global.md](../../resources/ddd-global.md) and
   [ddd-diagram.md](../../resources/ddd-diagram.md).
2. Extract every subdomain with its type, every bounded context with its owning subdomain, the
   relationships between contexts, and the external systems they name.
3. Draw one `flowchart TD` per the Subdomain Landscape Diagram Conventions in ddd-diagram.md:
   three subgraphs — **🎯 Core**, **🔧 Supporting**, **📦 Generic** — each context as a
   rectangle inside its subdomain's subgraph, external systems as stadium nodes outside them,
   and edges with direction only, never a pattern label.
4. Embed it in `context-map.md` under a **Subdomain Landscape** section, positioned above the
   context map, and generate the SVG per "Landing and SVG" in ddd-diagram.md.
