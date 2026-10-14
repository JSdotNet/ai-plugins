---
name: ideas
description: Rules for writing Idea artifacts — lightweight, refinement-friendly notes with a clear value hypothesis.
---

# Idea Writing Instructions

This contract governs Idea notes: lightweight, refinement-friendly, one page, ready to move
into epic or story work when they prove out. The shared procedure is
[document-authoring.md](document-authoring.md).

## Naming

Name the file `idea-<slug>.md`, `<slug>` the kebab-cased working title.

## Section Rules

Use the template below, with every section in its order.

- **Title** — concise and outcome-oriented.
- **Summary** — 2-3 sentences: what the idea is and why it matters now.
- **Problem and Audience** — the main pain point and the primary audience or stakeholders.
- **Value Hypothesis** — a testable statement of the outcome, not the implementation.
- **Initial Scope** — explicit `In scope` and `Out of scope` lists, kept light.
- **Assumptions and Open Questions** — every unknown, unresolved ones as `[TODO: clarify]`.
- **Next Step** — exactly one path: continue lightweight refinement, prepare an epic draft,
  request an analyst deep dive, or stop without creating work items.

Keep to one page with short paragraphs and one-line bullets. Stay at the problem and value
level; go into architecture or implementation only when the person asks for it.

## Template

```md
# Idea: <Working title>

## Summary

<2-3 sentence overview>

## Problem and Audience

- Problem: <pain point>
- Audience: <primary users/stakeholders>

## Value Hypothesis

If we <change>, then <audience outcome> improves by <expected effect>.

## Initial Scope

- In scope:
  - <item>
- Out of scope:
  - <item>

## Assumptions and Open Questions

- Assumption: <item>
- Open question: [TODO: clarify]

## Next Step

- <Continue refinement | Prepare epic draft | Request analyst deep dive | Stop without work items>
```
