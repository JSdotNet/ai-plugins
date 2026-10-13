---
name: write-story
description: "Draft or refine a concise Scrum user story that is ready for backlog refinement and Jira synchronization. Use when: writing a user story, 'as a … I want …', acceptance criteria for a feature, or refining a story before a sprint. DO NOT USE FOR: an epic (write-epic) or a defect (write-bug)."
---

# Write Story

Use this skill to write or improve story artifacts only.

## Rules

- Load [stories.md](../../resources/stories.md) before writing.
- Store the file per `wip-convention:wip-align` when that plugin is installed; without it, at
  `.wip/work/<module>/story-<short-title>.md`.
- Keep output focused on backlog clarity and testability.
- Keep Jira synchronization as a separate step handled by the `jira` plugin's skills.
