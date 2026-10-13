---
name: diagram-output
description: Where a C4, sequence, state, or deployment diagram lands in arc42, what prose and links go with it, and how its SVG is generated.
---

# Diagram Output

The shared tail of the four diagram skills. The type's own `*-global.md` owns its notation;
this file owns everything after the diagram is drafted.

## Before drafting

Ask focused questions only for what is missing or conflicting. Record every detail the user
did not confirm as an assumption instead of settling it by invention.

## Where it lands

Embed the diagram in a fenced `mermaid` block inside the chapter it documents, under
`.devbook/arc42/` when that folder exists and per that folder's rule; otherwise ask for a path.

| Diagram | Chapter |
| --- | --- |
| C4 Level 1 — System Context | §3 Context and Scope |
| C4 Level 2 — Container | §5 Building Block View, and §7 Deployment View |
| C4 Level 3 — Component | §5, at the level of the container it refines |
| C4 Level 4 — Code | §5, beside the Level 3 diagram of its container |
| Sequence | §6 Runtime View |
| State | §6 for one scenario's lifecycle, §8 Crosscutting Concepts for a shared pattern |
| Deployment | §7 Deployment View |

## Beside the diagram

Write per [prose.md](prose.md): what the diagram cannot show — why it is this way, what to
watch out for — never a narration of the boxes.

| Diagram | Summary | It covers |
| --- | --- | --- |
| C4 Levels 1–3 | 3–5 sentences | key relationships and design decisions |
| C4 Level 4 | 2–4 sentences | the patterns applied, and why this component needs Level 4 |
| Sequence | 2–4 sentences | ordering decisions, error handling, timing constraints |
| State | 2–4 sentences | the lifecycle, key guards, side effects |
| Deployment | 3–5 sentences | hosting choices, scaling, security boundaries, and the Mermaid version it needs |

Then:

- Link the decision record behind every technology, protocol, hosting, or state-management
  choice the diagram shows.
- Cross-link the structural view: a sequence diagram to its C4 Container or Component diagram,
  a state diagram to the aggregate or domain definition, a deployment diagram to the C4
  Level 2 diagram, a Level 4 diagram to its Level 3 diagram.
- List the open questions and assumptions.

## SVG

Run [generate-diagram-svgs.ps1](../scripts/generate-diagram-svgs.ps1) with
`-Path <directory of the chapter>`. It scans every Markdown file under that path and writes
`diagrams/<file>-<heading-slug>.svg` beside each one that holds a `mermaid` block.

- A `Failed:` line means Mermaid rejected the diagram: fix the fence and run it again.
- When PowerShell (`pwsh`, or `powershell` on Windows) or the Mermaid CLI `mmdc` is missing,
  skip the SVG. The fence in the chapter is the deliverable; say in the report that no SVG was
  generated and that `npm install -g @mermaid-js/mermaid-cli` enables it.
