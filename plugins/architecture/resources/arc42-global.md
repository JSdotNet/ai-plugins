---
name: arc42-global
description: 'Defines global rules and quality standards for arc42 architecture documentation.'
---

# arc42 Architecture Documentation - Global Instructions

Prose follows `prose.md`. Where the repository has `.devbook/arc42/`, its folder rule governs
file names, metadata, and status, and wins over this contract on any conflict. Each section's
content, inputs, and output template live in `arc42-section-NN.md`, one file per section.

## Economy

- Every section is optional. Write a chapter only when it has real content, in whatever order
  the project needs; the reading order 1 to 12 is for readers, not for authoring.
- Prefer the abstract over the detailed, and an aggregate over every element. Detail that the
  code already shows belongs in the code.
- Correctness outranks completeness: mark an unconfirmed fact as an assumption, never write it
  as settled.

## Detail level

Ask for the level when the user has not given one.

| Level | Covers |
| --- | --- |
| LEAN | 1.2 quality goals, 3 context, 5 Level 1, 9 decisions, 12 glossary; one to three pages per section |
| ESSENTIAL | LEAN plus 1.1 requirements overview, 1.3 stakeholders, 2 critical constraints, 4 solution strategy |
| THOROUGH | All twelve sections, deeper building-block levels, full quality scenarios and deployment detail |

## Diagrams

Draw each diagram as a Mermaid fence inside its chapter with the matching diagram skill —
`c4-diagram-generator`, `sequence-diagram-generator`, `state-diagram-generator`,
`deployment-diagram-generator` — per `diagram-output.md`. Where a section template shows a
diagram, it is that fence, never a link to an image file. One topic per diagram.

## Cross-section consistency

Reconcile these on every change, and report each mismatch you cannot settle:

- Every 1.2 quality goal has a strategy in 4 and scenarios in 10; every scenario in 10 traces
  back to a goal.
- Sections 4, 5, 7, and 8 respect every constraint in 2.
- The external interfaces and the system boundary in 3 match Level 1 in 5.
- The participants in 6 and the hosted components in 7 are the building blocks of 5.
- A goal or scenario that cannot be met, or a constraint that conflicts, is a risk in 11.
- Section 9 links the `adr/` index and section 11 links the `tdr/` index; neither restates a
  record.
- The terms in 12 match the ubiquitous language of the domain model where one exists.
