---
name: c4-diagram-generator
description: 'Generate C4 diagrams (System Context, Container, Component, Code) as Mermaid in Markdown. Use when: creating or refreshing a C4 diagram, showing system boundaries, containers, or component relationships, adding a diagram to arc42 sections 3, 5, 6, or 7, or an architecture overview for one audience. DO NOT USE FOR: a runtime flow (sequence-diagram-generator) or hosting topology (deployment-diagram-generator).'
---

# C4 Diagram Generator

## Inputs

- The system or container in scope, its users, and its external systems.
- For Levels 2 and 3, the containers or components with their technology.
- The audience, which sets the level; ask for it when it is ambiguous.

## Workflow

1. Read [c4-global.md](../../resources/c4-global.md) and
   [diagram-output.md](../../resources/diagram-output.md).
2. Pick the level and read its prompt:
   [Level 1 — System Context](prompts/c4-level1-system-context.prompt.md),
   [Level 2 — Container](prompts/c4-level2-container.prompt.md),
   [Level 3 — Component](prompts/c4-level3-component.prompt.md),
   [Level 4 — Code](prompts/c4-level4-code.prompt.md).
3. Draft the diagram from that prompt's template, and style every element with
   `UpdateElementStyle` in the c4-global.md Color Conventions palette.
4. Land it, write what goes beside it, and generate the SVG per diagram-output.md.
