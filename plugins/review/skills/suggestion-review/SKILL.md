---
name: suggestion-review
description: "Propose ranked improvements to any artifact — code, stories, documentation, architecture — each with benefit, effort, and risk, in a phased plan. Use when: the user asks for future improvements, extension ideas, hardening, or 'what could be better' beyond current scope. DO NOT USE FOR: answering specific questions (question-review) or reviewer remarks on a PR (pr-remarks-review)."
---

# Suggestion Review Skill

The calling agent provides the domain knowledge about the review target; this skill drives the suggestion-focused review workflow.

## Input Expectations

- Review target location (file, folder, or document set) and its type (code, story, docs, architecture, etc.).
- Improvement objective (quality, maintainability, speed, usability, clarity, scalability, or completeness).
- Optional constraints (budget, timeline, complexity, or team capacity).

## Workflow

1. Establish the current state and review objective.
2. Identify improvement opportunities across:
   - Structure and organization
   - Quality and consistency
   - Coverage and completeness
   - Extensibility and maintainability
3. Propose suggestions with:
   - Expected benefit
   - Effort estimate (small, medium, large)
   - Risk level (low, medium, high)
4. Rank suggestions by value versus effort.
5. Return a phased recommendation plan:
   - Quick wins
   - Next iteration
   - Longer-term opportunities

## Output Expectations and Quality Checks

- Value, effort, and risk are provided for each suggestion.
- Ranking is clear and justified.
- Plan includes at least one quick win and one longer-term idea.
