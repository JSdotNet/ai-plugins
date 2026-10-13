---
name: ux-design-guidelines
description: 'Create or maintain a project design system or style guide: tokens, components, layout, interaction, and voice and tone. Use when: creating a design system or style guide, adding or updating a component pattern, defining or refreshing design tokens (colour, typography, spacing), or documenting interaction or voice-and-tone standards. DO NOT USE FOR: reviewing a screen against them (ux-design-review).'
---

# UX Design Guidelines

Create or update the project's design system as Markdown chapters: the authoritative
reference for its visual and interaction standards.

## Inputs

Ask only for what the request has not given:

- **Project name**, for titles and file names, and the **existing guidelines path** when
  updating.
- **Brand assets**: colours, font families, and logo rules, when available.
- **Platform**: web, mobile, or multi-platform.
- **Scope**: the full system, tokens only, or named sections to add or update.
- **Output location**: the repository's `.devbook/design/` folder when it has one, else
  `docs/design/`.

## Steps

1. Read [ux-global.md](../../resources/ux-global.md),
   [design-guidelines.md](../../resources/design-guidelines.md), and
   [design-principles.md](../../resources/design/design-principles.md).
2. When the `impeccable` plugin is installed, run its `impeccable:impeccable` skill before
   drafting token values and component patterns, and use its UI-craft guidance to inform the
   choices. When it is absent, use design-principles.md as the primary reference.
3. Use the brand colours and fonts given; otherwise use accessible neutral defaults marked
   `[TODO: define brand tokens]`.
4. Lay the files out per "File Naming and Storage" in design-guidelines.md: in
   `.devbook/design/`, one chapter per topic with `README.md` as the entry point; elsewhere,
   `design-guidelines.md` as the entry point.
5. Cover every section "What a Design Guideline Document Must Cover" lists, applying its
   rules. Write `[TODO: define]` for a missing value instead of inventing one, and flag each
   required section still missing.
6. Save, and report the output path and the sections created, updated, or left as TODO.
