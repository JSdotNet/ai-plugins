---
name: suggestion-review
description: "Propose ranked improvements to any artifact — code, stories, documentation, architecture — each with benefit, effort, and risk, in a phased plan. Use when: the user asks for future improvements, extension ideas, hardening, or 'what could be better' beyond current scope. DO NOT USE FOR: answering specific questions (question-review) or reviewer remarks on a PR (pr-remarks-review)."
---

# Suggestion Review Skill

The calling agent supplies the domain knowledge; this skill proposes improvements to a target
— a file, folder, or document set — against an objective the user names (quality,
maintainability, speed, usability, clarity, scalability, completeness) and within any
constraint they give (budget, timeline, complexity, capacity).

Return the suggestions ranked by value against effort:

| # | Suggestion | Benefit | Effort | Risk |
|---|---|---|---|---|
| 1 | <change> | <what it buys, tied to the objective> | small / medium / large | low / medium / high |

Then a phased plan — **Quick wins**, **Next iteration**, **Longer term** — with at least one
quick win and one longer-term item, and one line justifying the ranking.
