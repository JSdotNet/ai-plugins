---
name: arc42-section-08
description: What arc42 section 8, Crosscutting Concepts, holds — only the concepts that apply across building blocks, each with rules, an example, and trade-offs — its inputs, and its output template.
---

# arc42 Section 8: Crosscutting Concepts

Section 8 holds the rules several building blocks share — security, persistence, error
handling, logging, API design, testing, the domain model — so no block restates them.

## Rules

- Include only the concepts that genuinely cut across THIS system, and delete the template
  subsections that do not apply.
- Give each concept actionable rules, a concrete example or code, the building blocks it
  affects, and its trade-offs.
- Name in one line the common concepts deliberately left out, so a reader knows they were
  considered.
- Leave building-block-specific detail to Section 5.
- Draw a shared lifecycle or protocol as a state diagram (`state-diagram-generator`).
- Lean: three to seven concepts, one paragraph each, linking any guideline that exists
  elsewhere.

## Inputs

The system, and which concerns are actually crosscutting in it.

## Output

````markdown
# 8. Crosscutting Concepts

<Which concerns are documented and why. Not applicable: <concept — reason>.>

## <Concept>

<What it is and why the system needs it, in 1–2 sentences.>

- <Rule a developer can follow>

```<language>
<Concrete example>
```

- **Trade-offs:** <what it costs>
- **Applies to:** <building blocks from section 5>
- **Tools:** <libraries or services that carry it>
````

## Relationship to other sections

The patterns named in 4 are detailed here; the constraints of 2 may mandate a concept; a
concept's technology choice links its decision record.
