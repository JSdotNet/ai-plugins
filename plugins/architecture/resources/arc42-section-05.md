---
name: arc42-section-05
description: What arc42 section 5, Building Block View, holds — the mandatory Level 1 whitebox, black-box descriptions, and refinement into building-blocks/ — its inputs, and its output template.
---

# arc42 Section 5: Building Block View

Section 5 is the static map of the system: its building blocks, what each is responsible for,
and the interfaces between them.

## Rules

- Level 1 is mandatory: the top-level building blocks with every interface between them, and
  every external interface matching Section 3.
- Give every building block a black-box description: responsibility, interfaces, source
  location, and open issues.
- Explain the decomposition rationale, and link building blocks to their source locations.
- Keep one abstraction level per view, with consistent notation and no circular dependencies.
- Refine to Level 2 or 3 only for the complex or critical blocks, and stop above source-code
  detail.
- Draw Level 1 as C4 Level 2 and a refinement as C4 Level 3 (`c4-diagram-generator`).
- Where the repository has `.devbook/arc42/building-blocks/`, a block whose whitebox is read
  on its own gets its own file there, in the shape the folder rule gives. This chapter then
  links the folder's index and restates nothing about that block.

## Inputs

The system, its top-level blocks and their responsibilities, the interfaces between them, the
blocks that need refinement, and the source directory layout.

## Output

```markdown
# 5. Building Block View

## Level 1: Overall System

<C4 Level 2 Mermaid fence>

| Building Block | Responsibility | Interfaces | Source |
| --- | --- | --- | --- |
| <Block> | <What it owns> | <IF-01, IF-02> | `<src/path/>` |

<Decomposition rationale: the criteria used, linked to section 4.>

## <Block> (Black-box)

<Responsibility in prose.>

| Interface | Description | Provided/Required | Technology |
| --- | --- | --- | --- |
| IF-01 | <What it offers> | Provided | <REST API> |

Open issues: <known limitations, linked to their debt records>.

## Level 2: <Block>

<Why this block is refined; C4 Level 3 Mermaid fence; its inner blocks, each as a black box.>
```

## Relationship to other sections

The blocks here are the participants in 6 and the hosted components in 7; the strategy in 4
explains why the system is cut this way.
