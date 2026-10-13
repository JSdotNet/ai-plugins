---
name: arc42-section-02
description: What arc42 section 2, Constraints, holds — technical, organizational, political constraints and conventions with rationale, authority, and negotiability — its inputs, and its output template.
---

# arc42 Section 2: Constraints

Section 2 says where the architects are not free to choose, and why.

## Rules

- Categorize each constraint as technical, organizational, political, or a convention.
- Give each one its rationale, the authority that imposed it, whether it is negotiable, and
  its impact on the architecture. A constraint without a reason is not documented.
- Name constraints concretely: "must use Java 17+", not "must be modern".
- Keep to the architecturally significant ones, and record them honestly — the inconvenient
  ones included.
- Link each constraint to the decision records it drives, and keep constraints separate from
  requirements.
- Lean: one table of constraint and rationale, non-negotiable constraints first.

## Inputs

The system, and its technical, organizational, and political constraints and its conventions.

## Output

```markdown
# 2. Constraints

## 2.1 Technical Constraints

| Constraint | Rationale | Authority | Negotiable |
| --- | --- | --- | --- |
| <Must use PostgreSQL 14+> | <Enterprise license contract> | <CTO> | <No> |

## 2.2 Organizational Constraints

| Constraint | Rationale | Authority | Negotiable |
| --- | --- | --- | --- |
| <Go-live 2025-06-30> | <Market window> | <Executive Board> | <No> |

## 2.3 Political Constraints

| Constraint | Rationale | Authority | Negotiable |
| --- | --- | --- | --- |
| <All data stays in the EU> | <GDPR> | <Legal> | <No> |

## 2.4 Conventions

| Convention | Rationale | Authority | Negotiable |
| --- | --- | --- | --- |
| <Commits reference a ticket ID> | <Traceability> | <Process> | <Yes> |
```

Drop a subsection that has no constraint.

## Relationship to other sections

Constraints limit the strategy in 4, the technology in 5 and 7, the patterns in 8, and the
options a decision record weighs; an unreasonable or conflicting constraint is a risk in 11.
