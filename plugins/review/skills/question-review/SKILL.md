---
name: question-review
description: "Answer the user's explicit review questions about any artifact — code, stories, documentation, architecture — each with a direct answer, evidence, and a confidence level. Use when: the user brings specific questions to review an artifact against, 'review this and tell me whether…', 'does this handle X?'. DO NOT USE FOR: open-ended improvement ideas (suggestion-review) or a TODO sweep (todo-review)."
---

# Question Review Skill

The calling agent provides the domain knowledge about the review target; this skill drives the question-driven review workflow.

## Input Expectations

- Review target location (file, folder, or document set) and its type (code, story, docs, architecture, etc.).
- One or more review questions.
- Optional response format preferences.

## Workflow

1. Confirm the complete list of questions to answer.
2. Inspect the target artifacts relevant to each question.
3. Answer each question with:
   - Direct answer
   - Supporting evidence from the reviewed artifact
   - Confidence level (high, medium, or low)
4. Identify gaps where the artifact cannot fully answer a question.
5. Add follow-up recommendations for unresolved or low-confidence areas.

## Output Expectations and Quality Checks

- Every input question is answered or explicitly marked unresolved.
- Evidence is cited from the reviewed artifact.
- Confidence levels are provided for each answer.
