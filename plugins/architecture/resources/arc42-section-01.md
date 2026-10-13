---
name: arc42-section-01
description: What arc42 section 1, Introduction and Goals, holds — requirements overview, measurable quality goals, stakeholders — its inputs, and its output template.
---

# arc42 Section 1: Introduction and Goals

Section 1 says why the system exists, what matters most, and who cares, before any structure.

## Rules

- Start with the quality goals (1.2); no architecture work begins before major stakeholders
  sign them. Mark unsigned goals as such.
- Keep to three to five goals, ordered by priority, each concrete and measurable — "< 200ms
  p95 response", not "fast" — and named with a Q42 property (#reliable, #flexible,
  #efficient, #usable, #safe, #secure, #suitable, #operable) or an ISO 25010 characteristic.
- Keep quality goals architectural: a project goal is not one.
- Keep the requirements overview under a page, listing only architecturally relevant
  features, and link to the requirements document rather than copying it.
- Explain the business value, and list every relevant stakeholder with their expectations.
- Write so an outsider understands the section in five to ten minutes.

## Inputs

The system and its purpose, the business problem and who benefits, five to ten essential
features, the top quality goals, the key stakeholders, and any existing requirements document.

## Output

```markdown
# 1. Introduction and Goals

## 1.1 Requirements Overview

<1–2 sentences: what the system does and why it exists.>

- <Essential feature: one line>

<One paragraph of business context: the problem solved, who benefits.>
Requirements: <document name, version, link>

## 1.2 Quality Goals

| Priority | Quality Goal | Concrete Scenario |
| --- | --- | --- |
| 1 | <Q42 property (attribute)> | <measurable scenario with numbers and scope> |

## 1.3 Stakeholders

| Role/Name | Contact | Expectations |
| --- | --- | --- |
| <Role> | <Email/Link> | <What they need from the architecture> |
```

A worked goal: `#efficient (Response Time)` — API responses complete in < 200ms at p95 under
normal load (1000 concurrent users). It carries a number a monitor can check and a scope that
says what "normal load" means.

## Relationship to other sections

The goals drive the strategy in 4 and expand into the scenarios of 10; a goal that cannot be
met becomes a risk in 11.
