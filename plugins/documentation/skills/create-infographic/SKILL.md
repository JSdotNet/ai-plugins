---
name: create-infographic
description: 'Create a branded infographic as a pure SVG from a Markdown file or a direct prompt, with optional motion. Use when: creating an infographic from a Markdown file or a fresh concept, turning a proposal, explanation, article, process, or KPI summary into a visual, or producing a documentation-friendly SVG. DO NOT USE FOR: architecture diagrams (architecture:c4-diagram-generator) or wireframes (ux-design:ux-wireframe).'
---

# Create Infographic

Turn a Markdown file or a direct prompt into one self-contained infographic. Generate **pure
SVG** by default: portable, embeddable in documentation, and reviewable in source control.

Follow [document-authoring.md](../../resources/document-authoring.md) for asking, what may be
published, and saving; its Markdown format step does not apply to an SVG. Inputs:

- **Source:** a Markdown file path to summarize, or a prompt describing goal and content.
- **Audience** and the one **primary message** it must carry at a glance.
- **Style guide** path or rules, when one exists; **motion**: static, or subtle animation.
- **Default path:** `documents/infographics/`.

## Steps

1. Read [infographics.md](../../resources/infographics.md),
   [svg-style-guide.md](../../resources/infographics/svg-style-guide.md), and
   [renderer-and-layout-guide.md](../../resources/infographics/renderer-and-layout-guide.md).
2. Build a brief: audience, primary message, supporting facts or KPIs, tone, style
   constraints, motion, and output path. From a Markdown file, extract its message,
   sections, facts, steps, tables, and repeated themes; from a prompt, normalize it into the
   same brief. Write `[TODO: clarify]` for a missing fact instead of inventing one.
3. Map the content to one primary layout pattern with the layout guide's matrix: timeline,
   process flow, comparison, KPI snapshot, hierarchy, or roadmap.
4. Style from the supplied guide first, else from the SVG style guide.
5. Generate the SVG to the structure in infographics.md. Default to static-safe output; add
   subtle SVG/CSS animation only when requested or clearly useful, and only where it
   reinforces meaning the static frame already carries.

## Output

The SVG file, and a short note: its path, the layout pattern chosen, each `[TODO: clarify]`
left in, and whether motion was included.
