---
name: update-github-issue
description: "Re-sync an existing GitHub issue from its Markdown story, epic, or bug without rewriting its content: title, body, labels, assignees, milestone. Use when: the artifact has an Issue Number in GitHub Fields and has changed, sync this ticket to its GitHub issue. DO NOT USE FOR: an artifact with no Issue Number (create-github-issue)."
---

# Update GitHub Issue

Re-sync an issue that already exists. Before building the payload, read
[github-issues-sync.md](../../resources/github-issues-sync.md): its content rules and field
mapping govern every value sent. `Repository` and `Issue Number` must be present in
`## GitHub Fields`; without an `Issue Number`, use `create-github-issue` instead of creating
an issue here. Ask only for the required values that are missing.

## Steps

1. Read the source file and map title, body, labels, assignees, and milestone per the contract.
2. Update the issue with the session's GitHub issue tooling.
3. Make labels and assignees end as exactly the source's set; when `Labels` or `Assignees`
   is absent from the source, leave that field on the issue untouched. `gh issue edit` only
   adds with `--add-label` / `--add-assignee`, so read the current set first
   (`gh issue view <number> --json labels,assignees`), add the missing ones, and drop the
   extra ones with `--remove-label` / `--remove-assignee`.
4. Return the result in exactly this form:

```text
Updated #1234
https://github.com/<owner>/<repo>/issues/1234
```
