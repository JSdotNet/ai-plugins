---
name: arc42-section-11
description: What arc42 section 11, Risks and Technical Debt, holds — a prioritized risk register and a link to the tdr/ index, never the debt itself — its inputs, and its output template.
---

# arc42 Section 11: Risks and Technical Debt

Section 11 makes the known risks visible and points at the technical debt records.

## Rules

- Record the known risks honestly, each with its probability, impact, mitigation,
  contingency, owner, and review date.
- Prioritize with the risk matrix (probability × impact) rather than marking everything
  critical.
- Link to the `tdr/` index for technical debt and restate no debt item — no register table,
  impact, plan, or status. Each item is a numbered, dated record defined by `tdr-global.md`;
  log a new one with the `create-technical-debt-record` skill.
- Keep probability and impact specific enough to compare, and refresh the assessment on its
  review dates.
- Lean: the register table with a one-line mitigation per risk, and the index link.

- Probability: Very Low < 10%, Low 10–30%, Medium 30–60%, High 60–90%, Very High > 90%.
- Impact: Low, a minor inconvenience; Medium, noticeable; High, significant disruption;
  Critical, system failure.

## Inputs

The system, its known technical, organizational, and external risks with probability and
impact, the mitigation plans, and the path to `tdr/`.

## Output

```markdown
# 11. Risks and Technical Debt

## Risks

| ID | Risk | Probability | Impact | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| R-001 | <Risk> | <High> | <High> | <Critical> | <Under Observation> |

### R-001: <Risk>

<What could happen, its category, and the building blocks it touches.>

- **Prevention:** <reduce likelihood>
- **Containment:** <reduce impact>
- **Contingency:** <plan if it occurs>
- **Owner:** <name or role> · **Review:** <date>

## Technical Debt

See [the technical debt records](tdr/README.md).
```

Status is one of New, Under Observation, Mitigated, Occurred, Closed.

## Relationship to other sections

Goals from 1.2 and scenarios from 10 that cannot be met, and conflicting constraints from 2,
are risks here.
