---
name: github-issues-sync
description: How a Markdown story, epic, or bug maps onto a GitHub issue on create and update, and the content rules every sync follows.
---

# GitHub issues sync

## Content

- The source Markdown file is the source of truth. Upload its content as written: never
  write, rewrite, summarize, translate, reorder, or correct it.
- The only edit to the source file is writing back `Issue Number` and `Issue URL` into
  `## GitHub Fields` after a create.
- Acceptance criteria and test instructions stay in the issue body unless project policy
  requires separate templates.

## Source

A Markdown artifact, typically `.wip/work/*/story-*.md`, `.wip/work/*/epic-*.md`, or
`.wip/work/*/bug-*.md`, with a `## GitHub Fields` section.

## Field mapping

| Markdown source | GitHub field | Required |
| --- | --- | --- |
| Title heading, with only the `# Story:`, `# Epic:`, or `# Bug:` prefix stripped | `title` | yes |
| Every section except the title heading and `## GitHub Fields` | `body` | — |
| `Repository` in `## GitHub Fields` (`owner/repo`) | `repository` | yes |
| `Issue Number` in `## GitHub Fields` | the issue to update | on update |
| `Labels` in `## GitHub Fields` | `labels` | no |
| `Assignees` in `## GitHub Fields` | `assignees` | no |
| `Milestone` in `## GitHub Fields` | `milestone` | no |

- The body never contains the title heading or the `## GitHub Fields` section.
- When a required value is missing, ask only for the missing fields.

## Tooling

Use the session's GitHub issue tooling: a GitHub MCP server when one is configured, the `gh`
CLI otherwise.

## Out of scope

Drafting tickets, improving wording or structure, status transitions, and project board
management.
