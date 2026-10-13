---
name: sequence-global
description: Defines rules, notation standards, and quality gates for sequence diagram generation.
---

# Sequence Diagrams — Global Instructions

Prose follows `prose.md`; where the diagram lands and what goes beside it, `diagram-output.md`.

## Scope Guidance

- One diagram per scenario.
- Prefer 3–8 participants per diagram; split complex flows into sub-scenarios.
- Cover the happy path first; add error and edge-case flows as separate diagrams only when architecturally significant.

## Message Types

| Arrow | Meaning |
| --- | --- |
| `->>` | Synchronous call (solid line, open arrowhead) |
| `-->>` | Synchronous reply (dashed line, open arrowhead) |
| `-)` | Asynchronous message (solid line, open arrowhead) |
| `--)` | Asynchronous reply or event (dashed line, open arrowhead) |
| `-x` | Failed or rejected message (solid line, cross at the end) |
| `--x` | Failed / error reply (dashed line, cross at the end) |

Use `actor` for human participants and `participant` for systems, services, or components.
Wrap conditionals and error paths in `alt`/`else`, optional steps in `opt`, retries and polling
in `loop`, and show processing time with `activate`/`deactivate`.

## Naming Conventions

- Use short, role-based names for participants (e.g., `"Order Service"`, not `"com.example.OrderServiceImpl"`).
- Alias participant identifiers to readable display names using `as "..."`.
- Prefix scenario titles with the triggering actor or event (e.g., `"Customer places order"`).

## Header

Open every diagram with a `%% Scenario: <title>` comment line.
