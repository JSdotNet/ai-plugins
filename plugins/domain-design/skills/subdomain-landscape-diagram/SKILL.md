---
name: subdomain-landscape-diagram
description: 'Generate a Mermaid landscape diagram of the subdomains, classified core, supporting, or generic, with their bounded contexts. Use when: the subdomains have been classified, or refreshing the landscape after contexts are added or reclassified. DO NOT USE FOR: the relationship patterns between contexts (context-mapping).'
---

# Subdomain Landscape Diagram

Use this skill to produce a high-level visual of the domain's subdomain landscape, classifying each subdomain and its bounded contexts by type.

## Inputs

- `context-map.md` with the subdomain classification and its bounded contexts. If it has none, report that and stop.
- Context map (optional) to show cross-context relationships on the diagram.

## Workflow

1. Apply `resources/ddd-global.md` and `resources/ddd-diagram.md`.
2. Read `context-map.md` and extract:
   - All subdomains with their type (core, supporting, generic).
   - All bounded contexts and their owning subdomain.
   - Cross-context relationships from the context map (optional).
3. Build a Mermaid `flowchart TD` with three labelled subgraphs following `resources/ddd-diagram.md`:
   - **🎯 Core** — competitive-advantage subdomains.
   - **🔧 Supporting** — necessary but non-differentiating subdomains.
   - **📦 Generic** — commodity subdomains.
4. Place each bounded context as a rectangle node inside its owning subdomain's subgraph.
5. If context map relationships are available, add simplified directional edges between bounded context nodes — direction only, no pattern labels, to keep the landscape readable; the patterns are labelled on the context map, not here.
6. External systems referenced by any bounded context appear as stadium-shape nodes `([SystemName])` outside the subgraphs.
7. Insert or update the diagram in `context-map.md` under a **Subdomain Landscape** section, positioned above the context map.
8. Run `scripts/generate-diagram-svgs.ps1 -Path <directory-of-context-map.md>` from the plugin root to generate an SVG alongside the Markdown output.

## Output

- Updated `context-map.md` with an embedded Mermaid `flowchart TD` subdomain landscape diagram.
