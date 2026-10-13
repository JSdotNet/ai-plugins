---
name: question-review
description: "Answer the user's explicit review questions about any artifact — code, stories, documentation, architecture — each with a direct answer, evidence, and a confidence level. Use when: the user brings specific questions to review an artifact against, 'review this and tell me whether…', 'does this handle X?'. DO NOT USE FOR: open-ended improvement ideas (suggestion-review) or a TODO sweep (todo-review)."
---

# Question Review Skill

The calling agent supplies the domain knowledge; this skill answers the user's questions
about a target — a file, folder, or document set — and nothing beyond them.

Confirm the complete list of questions first. Then return, per question:

| Question | Answer | Evidence | Confidence |
|---|---|---|---|
| <as asked> | <direct answer, or **unresolved**> | <file and line or section it rests on> | high / medium / low |

- Every question is answered or explicitly marked unresolved; never dropped.
- Evidence cites the reviewed artifact, not general knowledge.
- After the table, name what the artifact cannot answer and a follow-up for each unresolved
  or low-confidence answer.
