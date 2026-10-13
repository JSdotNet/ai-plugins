---
name: explanations
description: Rules for writing Explanations — conceptual, rationale-driven documentation for developers and stakeholders.
---

# Explanation Instructions

This contract governs Explanations — architecture rationale, domain concepts, design
trade-offs, and decision context — for developers and stakeholders who need understanding,
not procedural steps. The shared procedure is [document-authoring.md](document-authoring.md).

## Structure

Use this section order when it improves clarity.

1. `# Title`
2. `## Overview` — what concept is explained and for whom.
3. `## Context` — background, constraints, assumptions, and non-goals.
4. `## Explanation` — the core concept in clear subsections.
5. `## Trade-offs` — alternatives, pros and cons, and why this approach.
6. `## Practical Impact` — what this means in day-to-day work, and when to apply it.
7. `## References` — related docs, ADRs, specs, or links, when there are any.

## Writing Rules

- Define the concept before discussing implementation details.
- Explain a term before using project-specific shorthand.
- Use cause-and-effect phrasing so the reasoning is explicit.
- Include at least one trade-off or alternative whenever a decision is described.
- Split a dense topic into short subsections; use bullets for comparisons and key points.
- Keep the explanation aligned with the project's current conventions.
