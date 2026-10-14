---
name: arc42-section-03
description: What arc42 section 3, Context and Scope, holds — the system boundary, the business context, the optional technical context, and the external interfaces — its inputs, and its output template.
---

# arc42 Section 3: Context and Scope

Section 3 draws the system boundary: what is inside, what is outside, and what crosses it.

## Rules

- Draw the system boundary so what is inside and outside is unambiguous, with only external
  partners on the diagram — no internal components.
- Build the business context around what is communicated, in business terms, and list every
  external communication partner, the non-human ones (batch jobs, monitoring) included, with
  the data exchanged in each direction.
- Keep protocols and formats out of the business context. The technical context is optional,
  and earns its place only where the mapping is not obvious.
- Draw the context diagram as C4 Level 1 (`c4-diagram-generator`).
- Keep the external interfaces and the boundary identical to Level 1 in section 5.

## Inputs

The system, its external users and actors, the external systems it integrates with, the data
exchanged, and, for the technical context, the channels, protocols, and formats.

## Output

```markdown
# 3. Context and Scope

## 3.1 Business Context

<1–2 sentences: what the system does and who or what it interacts with.>

<C4 Level 1 Mermaid fence>

| Interface | Partner | Description | Input to System | Output from System |
| --- | --- | --- | --- | --- |
| IF-01 | <Partner> | <Purpose> | <Business data or events> | <Business data or events> |

## 3.2 Technical Context

| Interface | Technology | Protocol | Format | Endpoint | Security |
| --- | --- | --- | --- | --- | --- |
| IF-01 | <HTTPS> | <REST> | <JSON> | </api/v1> | <OAuth 2.0> |

<Infrastructure on the boundary that matters: gateways, brokers, load balancers.>
```

Use the same interface IDs in both tables. Drop 3.2 when the mapping is obvious.

## Relationship to other sections

Level 1 in 5 matches this boundary; the scenarios in 6 often start at an external partner; the
technical context feeds 7; every external entity named here is a term in 12.
