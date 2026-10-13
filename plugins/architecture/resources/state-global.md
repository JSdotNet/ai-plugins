---
name: state-global
description: Defines rules, notation standards, and quality gates for state machine diagram generation.
---

# State Machine Diagrams — Global Instructions

Prose follows `prose.md`; where the diagram lands and what goes beside it, `diagram-output.md`.

## When Not to Use

- Simple two-state toggles (active/inactive) that are obvious from context.
- General flow charts or decision trees (use a flowchart instead).
- Modelling interactions between multiple participants (use a sequence diagram instead).

## Notation

Use `stateDiagram-v2`. Label every transition as `State --> NextState: event [guard] / action`,
with the guard and the action only where they apply. Use `[*]` for the initial and terminal
states, `state Name { }` for composite states, `entry:`/`exit:` for entry and exit actions, and
`<<fork>>`/`<<join>>` for concurrent regions.

## Naming Conventions

- Name states with a noun or noun phrase in PascalCase (e.g., `OrderPlaced`, `PaymentPending`).
- Name states in the domain's ubiquitous language (e.g., `Approved`, not `STATUS_3`).
- Label transitions with the domain event or command that triggers them (e.g., `submit`, `paymentReceived`).
- Add guard conditions in square brackets when the same event can lead to different states.

## Scope Guidance

- One diagram per entity or protocol.
- Limit to 10–15 states per diagram; extract sub-machines into separate diagrams if the state space grows larger.
- Show only the states and transitions that are architecturally significant; omit internal implementation states.

## Header

Open every diagram with a `%% State machine: <entity or protocol>` comment line.
