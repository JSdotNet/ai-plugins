---
name: infographics
description: Rules for authoring SVG infographics — concise visual storytelling with accessible structure, style-guide alignment, and optional motion.
---

# Infographic Instructions

This contract governs infographics: self-contained **SVG** assets that give readers a fast,
scannable summary of a concept, process, comparison, or data story. Style comes from
[svg-style-guide.md](infographics/svg-style-guide.md) when no project guide is supplied;
layout from [renderer-and-layout-guide.md](infographics/renderer-and-layout-guide.md).

## Required SVG Structure

1. Root `<svg>` with `xmlns`, a stable `viewBox`, and width/height only when needed.
2. A `<title>` and `<desc>` that explain the infographic for assistive technologies.
3. An embedded `<style>` block for design tokens, typography, layout helpers, and optional
   motion classes.
4. Sections grouped with `<g>` elements (`header`, `summary`, `comparison`, `footer`) so the
   layout stays understandable and editable.
5. Everything inline: no external assets, fonts, scripts, or runtime dependencies.

## Content Rules

- Preserve the source meaning exactly; take statistics, dates, and decisions only from the
  source.
- Reduce the message to one primary headline and a small set of supporting facts.
- Use one dominant visual pattern, chosen from the layout guide's matrix.
- Use `[TODO: clarify]` only when required source information is missing and the gap cannot
  be resolved safely.

## Visual and Accessibility Rules

- Keep typography to one headline style, one body style, and one label style per asset.
- Use a limited palette with semantic roles (background, primary, accent, neutral, warning
  only when needed) and readable text contrast.
- Distinguish with text labels as well as colour.
- Align cards and callouts on a simple grid, and keep the reading order obvious, top to
  bottom or left to right.
- Size text to stay readable when the SVG is embedded in documentation; turn long prose into
  short labels, bullets, or callouts.
- Use icons and shapes only where they reinforce meaning.

## Motion Rules

- Default to a static-safe design that works fully without motion.
- Animate only to sequence a reveal, show the direction of flow, or emphasize one key metric
  or transition, with gentle opacity or position changes.
- Keep motion subtle: no flashing, rapid looping, or meaning carried by motion alone.
