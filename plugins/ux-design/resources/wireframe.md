---
name: wireframe
description: Rules and conventions for creating wireframe artifacts as SVG or Mermaid diagrams.
---

# Wireframe Instructions

This contract governs how wireframe artifacts are built, annotated, and stored.

## Output Format

- **Default:** Pure SVG file — self-contained, portable, and source-control friendly.
- **Alternative:** Mermaid diagram block inside Markdown — use when the layout is flow-oriented and SVG overhead is not warranted.
- Do not use tool-specific proprietary formats (Figma, Sketch, Adobe XD files). Export or regenerate in SVG.

## SVG Wireframe Rules

- Always include `viewBox`, `<title>`, and `<desc>` elements.
- Use embedded `<style>` for all styling — no external stylesheets.
- Use `<g>` elements to group screen regions (header, nav, content, footer).
- Wireframe colour palette:
  - Background: `#FFFFFF`
  - Frame / border: `#CCCCCC`
  - Placeholder blocks: `#E8E8E8` fill, `#AAAAAA` stroke
  - Text labels: `#333333`
  - Interactive elements (buttons, links): `#4A90D9` fill, white label
  - Highlight / focus: `#FF6B00`
- Font family: `sans-serif` — do not embed web fonts in wireframes.
- Minimum text size: 12px in the SVG coordinate system.

## Annotation Rules

- Label every distinct UI region with its component type (e.g., `[Nav Bar]`, `[Search Input]`, `[Card Grid]`).
- Annotate interactive elements with their action (e.g., `→ Goes to Order Detail`).
- Mark placeholder content with `[Placeholder]` or `[Dynamic Content]`.
- Indicate keyboard focus order with small numbered badges when relevant.
- Note ARIA labels or roles for non-obvious interactive elements.

## Fidelity Levels

Match fidelity to the design stage.

| Fidelity | Purpose | SVG approach |
|---|---|---|
| Low | Explore layout and structure | Boxes and text labels only: no icons, real content, or colour |
| Mid | Validate flow and usability | Realistic labels, form fields, buttons, and state annotations |
| High | Prepare for developer handoff | The project's design tokens, typography, and icons via SVG symbols |

## Mermaid Wireframe Rules

Use Mermaid only for simple, linear layouts or screen-to-screen navigation maps.

- Use `flowchart TD` or `flowchart LR` for navigation trees.
- Use `stateDiagram-v2` for state-based screen transitions.
- Label each node with the screen or component name.
- Add edge labels for user actions that trigger transitions.

## Naming and Storage

- Name each file `<screen-name>-wireframe-<fidelity>.svg` (e.g., `checkout-flow-wireframe-mid.svg`).
- Keep a companion `README.md` in each wireframes folder listing every file, its fidelity, and
  its scope.
