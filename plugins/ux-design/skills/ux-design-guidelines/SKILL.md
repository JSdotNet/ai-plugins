---
name: ux-design-guidelines
description: 'Create or maintain a project design system or style guide: tokens, components, layout, interaction, and voice and tone. Use when: creating a design system or style guide, adding or updating a component pattern, defining or refreshing design tokens (colour, typography, spacing), or documenting interaction or voice-and-tone standards. DO NOT USE FOR: reviewing a screen against them (ux-design-review).'
---

# UX Design Guidelines

## Purpose

Use this skill to create a new design system or update an existing one. The output is a set of structured Markdown chapters that serve as the authoritative reference for the project's visual and interaction standards.

## Inputs

Ask for the following when not already provided:

- **Project name** — used in the document title and file name
- **Existing guidelines path** — if updating an existing document, provide the path
- **Brand assets** — primary brand colours, font families, logo guidelines (if available)
- **Platform** — web, mobile, or multi-platform?
- **Scope** — full design system, tokens only, or specific sections to add or update?
- **Output location** — where should the guidelines be saved? (default: the repository's
  `.devbook/design/` folder when it has one, else `docs/design/`)

## Required Resources

Load and apply before generating:

1. `resources/ux-global.md`
2. `resources/design-guidelines.md`
3. `resources/design/design-principles.md`

### Optional — `impeccable:impeccable`

When the `impeccable` plugin is installed, run its `impeccable:impeccable` skill before drafting design token values and component patterns, and use its UI-craft guidance to inform the choices. When it is absent, apply the built-in design principles resource as the primary reference.

## Workflow

1. **Confirm the scope**
   - New document or update to an existing one?
   - Which sections are in scope for this session?

2. **Gather brand inputs**
   - If brand colours or fonts are provided, use them.
   - If not, use accessible neutral defaults and mark with `[TODO: define brand tokens]`.

3. **Draft or update the document**
   - Lay the files out per "File Naming and Storage" in `resources/design-guidelines.md`: in `.devbook/design/`, one chapter per topic with `README.md` as the entry point; elsewhere, `design-guidelines.md` as the entry point.
   - Cover the sections of the document structure template in `resources/design-guidelines.md`.
   - For each section, apply the quality rules from that instruction file.
   - Mark missing content with `[TODO: define]` rather than inventing values.

4. **Validate completeness**
   - Check the chapters against "What a Design Guideline Document Must Cover" in `resources/design-guidelines.md`.
   - Flag any missing required sections explicitly.

5. **Save and confirm**
   - Save to the agreed location.
   - Report which sections were created, updated, or left as TODO.

## Output

- The guideline chapters, created or updated in the layout that "File Naming and Storage" in `resources/design-guidelines.md` sets
- Short confirmation note: output path, sections covered, and any `[TODO: define]` items
