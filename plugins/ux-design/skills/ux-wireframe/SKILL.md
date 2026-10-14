---
name: ux-wireframe
description: 'Create low-, mid-, or high-fidelity wireframes as SVG, or Mermaid for simple navigation, for screens, components, or flows. Use when: creating a wireframe, mockup, or screen sketch, laying out the UI for a feature or user story, or preparing a deliverable for design review or developer handoff. DO NOT USE FOR: the path across screens (ux-user-flow).'
---

# UX Wireframe

Produce wireframes for new screens, redesigns, or component explorations: SVG by default,
Mermaid for simple navigation structures.

## Inputs

Confirm the platform, the fidelity, and the target user before producing anything. Ask in
one message for those and whatever else the request has not given:

- **Screen or component name**.
- **Platform**: web, mobile (iOS/Android), or desktop.
- **Fidelity**: low, mid, or high.
- **User goal**: who the user is and the task they complete on this screen.
- **Key elements**: the UI regions or components that must appear.
- **Style guide**: the project's design guidelines or tokens, when they exist.
- **Output location**: default `docs/design/wireframes/`. Write the wireframe there or to the
  path the person gives; a wireframe is a deliverable, and the design devbook folder holds
  guidelines only.

## Steps

1. Read [ux-global.md](../../resources/ux-global.md),
   [wireframe.md](../../resources/wireframe.md),
   [wireframe-patterns.md](../../resources/wireframe/wireframe-patterns.md), and the project
   style guide when one exists.
2. Pick the base layout from wireframe-patterns.md: dashboard, form, list-detail, card grid,
   wizard, and the rest.
3. Build the SVG to the fidelity, SVG, palette, and annotation rules in wireframe.md, and
   mark each unresolved decision `[TODO: clarify]`.
4. Save one file per screen or component, named and listed in the folder's companion
   `README.md` per "Naming and Storage" in wireframe.md.
5. Report the output path, the layout pattern, the fidelity, and each open question.
