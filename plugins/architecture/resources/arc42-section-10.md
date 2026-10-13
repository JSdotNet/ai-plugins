---
name: arc42-section-10
description: What arc42 section 10, Quality Requirements, holds — the quality tree and measurable stimulus-response scenarios traced to the 1.2 goals — its inputs, and its output template.
---

# arc42 Section 10: Quality Requirements

Section 10 makes the quality goals of 1.2 testable: a quality tree and the scenarios that
prove each goal.

## Rules

- Build the quality tree from the Section 1.2 goals, and trace every scenario back to one.
- Write each scenario in stimulus-response form, with numbers, acceptance criteria, and a
  priority.
- Cover usage, change, and failure scenarios.
- Name each with a Q42 property (#reliable, #flexible, #efficient, #usable, #safe, #secure,
  #suitable, #operable) and the attribute under it — Availability, Response Time,
  Learnability.
- Every scenario is testable as written; say how it is tested.
- Lean: a two-level tree and a table of five to ten scenarios with acceptance criteria.

## Inputs

The system, the quality goals from 1.2, the attributes to test, the target metrics, and the
critical usage, change, and failure scenarios.

## Output

```markdown
# 10. Quality Requirements

## Quality Tree

### <Quality goal from 1.2>

- **<#reliable>** (Priority: High)
  - <Availability> (High) → QS-001
  - <Fault Tolerance> (Medium) → QS-002

## Quality Scenarios

### QS-001: <Scenario name>

**Attribute:** <#reliable > Availability> · **Priority:** <High> · **Category:** <Failure>

| Element | Description |
| --- | --- |
| Environment | <Production, normal load (1000 users)> |
| Stimulus | <Primary database hardware failure> |
| Component | <Database layer, connection pool> |
| Response | <Automatic failover to replica> |
| Measure | <Downtime < 30s, data loss = 0> |

**Acceptance criteria:** <each one checkable: detected within 10s, no manual step>
**Test approach:** <load test, chaos experiment, monitor>
```

Group scenarios by usage, change, and failure through the Category field, not a second list.

## Relationship to other sections

Each scenario checks a strategy in 4; some appear as runtime scenarios in 6; a scenario that
cannot be met is a risk in 11.
