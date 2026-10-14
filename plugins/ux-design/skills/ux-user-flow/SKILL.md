---
name: ux-user-flow
description: 'Create user flow diagrams, navigation trees, and journey maps in Mermaid and Markdown. Use when: creating a user, task, or navigation flow, mapping a journey from discovery to retention, documenting screen-to-screen navigation or UI state transitions, or drawing the happy path and error branches of a feature. DO NOT USE FOR: the layout of one screen (ux-wireframe).'
---

# UX User Flow

Map the paths users take through a product: task flows, navigation trees, state transitions,
and journey maps with emotions, pain points, and opportunities.

## Inputs

Ask only for what the request has not given:

- **Flow type**: task flow, navigation tree, user journey map, or state diagram.
- The **persona or role** performing the flow, its **starting point**, and its **goal**.
- **Key decision points**: branching conditions or error paths to include.
- **Output location**: default `docs/design/flows/`. Write the flow there or to the path the
  person gives; a flow is a deliverable, and the design devbook folder holds guidelines only.

## Steps

1. Read [ux-global.md](../../resources/ux-global.md) and
   [user-flow.md](../../resources/user-flow.md).
2. Choose the diagram type for the flow type from the "Artifact Types" table in user-flow.md.
3. Map the happy path from entry point to goal first, then every decision point, validation
   failure, empty state, and abandonment path, each with what happens next (retry, fallback
   screen, error message), until the flow carries all of "Required Flow Content".
4. Write one Markdown file per flow, named per user-flow.md: a preamble (persona, starting
   point, goal, scope), then the Mermaid diagram in a fenced block or the journey map table
   with its observations and opportunities, and open questions as `[TODO: clarify]`.
5. Save, and report the output path, the diagram type used, and each `[TODO: clarify]`.
