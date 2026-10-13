---
name: arc42-section-04
description: What arc42 section 4, Solution Strategy, holds — the technology choices, the decomposition, and the approach to each quality goal — its inputs, and its output template.
---

# arc42 Section 4: Solution Strategy

Section 4 is the short bridge from the goals in 1.2 to the detail of 5 to 8: how the
architecture means to meet each goal.

## Rules

- Address every quality goal from Section 1.2, and link each choice to the goals it supports.
- Give the rationale for every technology choice, and the alternatives considered.
- Explain the decomposition strategy, and state the trade-offs it costs.
- Be concrete: "horizontal scaling via Kubernetes", not "scalable".
- Keep to two to five pages — the detail belongs in the later sections.
- Stay consistent with the Section 2 constraints.
- Summarize a choice that has a decision record in one line and link the record; its
  context, reasons, and consequences live there.

## Inputs

The system, the quality goals from 1.2, the technology stack, the architectural approach, and
the key patterns.

## Output

```markdown
# 4. Solution Strategy

<2–3 sentences: the overall approach and how it meets the quality goals.>

## Technology Stack

| Category | Technology | Rationale | Alternatives | Quality Goals |
| --- | --- | --- | --- | --- |
| <Backend> | <Tech> | <Why> | <What lost> | <#reliable> |

## Decomposition

<Approach — layered, modular monolith, services by capability — why, and what it costs.>

## Quality Goal Strategies

### <Quality goal from 1.2>

- **Approach:** <pattern or strategy>
- **Technologies:** <what supports it>
- **Trade-offs:** <what it costs>

## Key Decisions

- <Decision in one line> — [<concern>](adr/<concern>.md)
```

## Relationship to other sections

The decomposition defines the building blocks of 5; the technology choices shape 6 and 7; the
patterns named here are detailed in 8; each strategy is checked by the scenarios in 10.
