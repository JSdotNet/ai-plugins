---
name: create-github-issue
description: "Create a GitHub issue from an already written Markdown story, epic, or bug without rewriting its content, and write the issue number and URL back. Use when: upload this ticket to GitHub, open a GitHub issue for this backlog artifact, the artifact has no Issue Number yet. DO NOT USE FOR: an artifact that already has an Issue Number (update-github-issue), or drafting ticket content."
---

# Create GitHub Issue (Upload Only)

Upload a ticket that is already fully written in Markdown. Before building the payload, read
[github-issues-sync.md](../../resources/github-issues-sync.md): its content rules and field
mapping govern every value sent.

Input: the path to the artifact, for example
`/create-github-issue .wip/work/regeling-uitvoer/story-uitvoer-algemeen.md`. When it already
carries an `Issue Number`, use `update-github-issue` instead.

## Steps

1. Read the source file and map its fields per the contract; `Repository` must be present.
2. Ask only for the required values that are missing.
3. Create the issue with the session's GitHub issue tooling.
4. Write `Issue Number` and `Issue URL` back into `## GitHub Fields` — the only edit to the
   source file.
5. Return the result in exactly this form:

```text
Created #1234
https://github.com/<owner>/<repo>/issues/1234
```
