---
name: jira-sync
description: How a Markdown story, epic, or bug maps onto a Jira issue in project FIN on create and update, with the content, uncertainty-rendering, and readiness rules every sync follows.
---

# Jira sync

## Content

- The source Markdown file is the source of truth. Upload its content as written: never
  write, rewrite, summarize, translate, reorder, or correct it, and never infer missing
  acceptance criteria. The only Jira-side change is the uncertainty rendering below.
- The only edit to the source file is writing back `Issue Key` and `Issue URL` into
  `## Jira Fields` after a create.
- Add no workflow step beyond the sync itself: no transitions, board routing, or branch or
  worktree setup.

## Source

A Markdown artifact, typically `.wip/work/*/story-*.md`, `.wip/work/*/epic-*.md`, or
`.wip/work/*/bug-*.md`, with a `## Jira Fields` section (`Type`, `Epic Link`, `Labels`,
and after a create `Issue Key`, `Issue URL`).

## Field mapping

| Markdown source | Jira field | Create | Update |
| --- | --- | --- | --- |
| — | `project_key`: `FIN` | yes | — |
| `Type` in `## Jira Fields` (`Story` only when omitted) | `issue_type` | yes | — |
| Title heading, with only the `# Story:`, `# Epic:`, or `# Bug:` prefix stripped | `summary` | yes | yes |
| Every section except the title, `## Acceptance Criteria`, `## Test Instructions`, and `## Jira Fields` | `description` | yes | yes |
| `## Acceptance Criteria` (Story and Bug) | `customfield_11193` | yes | **no — create only** |
| `## Test Instructions` when present (Story and Bug) | test-instructions custom field | when configured | when configured |
| `Epic Link` (Story and Bug) | `additional_fields`: `{"parent":{"key":"<Epic Link>"}}` | yes | — |
| `Labels` when present | `additional_fields` labels | yes | — |
| `⚠️` open questions present in the description | readiness custom field: `Red` | when configured | when configured |

- `Epic Link` goes in `parent`: Jira Cloud replaced the Epic Link field with it.
- This plugin records no field id for the test-instructions or the readiness custom field.
  When the session cannot resolve one, leave it unset and say so in the response.
- When a required value is missing, stop and ask only for that value.

## Uncertainty rendering

- Render each line marked `⚠️` in red in every Jira field that supports color.
- In a field without red text, keep the `⚠️` and prefix the line with `[ONDUIDELIJK]`.

## Browse URL

`https://innovadis.atlassian.net/browse/<KEY>`.
