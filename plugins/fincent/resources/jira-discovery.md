---
name: jira-discovery
description: How a Fincent story or pull request skill reaches Jira — listing stories by status, fetching one, writing findings or an estimate back, creating an enabler — and what to do when Jira is not reachable.
---

# Jira discovery

Project key, fields, and statuses are in [jira-setup.md](jira-setup.md). The sprint-review
pipeline never uses this file: it reads Jira only through the scripts named there.

## Operations

Reach Jira through an Atlassian MCP server connected to the session. The `jira` plugin's
skills only upload or re-sync a Markdown artifact, so they serve the enabler row alone.

| Operation | Use | When it is absent |
|---|---|---|
| List the stories in a status | The server's issue search, every page | Ask the user to paste one story and run on that story alone |
| Fetch one story by key | The server's get-issue | Ask the user to paste the story text |
| Write review findings back | The server's add-comment: one comment per story, opening with the review's name and overall label, so a later review can read the verdict back | Skip it and record "skipped — no Jira write access" for the story |
| Write an estimate | The server's edit-issue, on Story Points (`customfield_10016`) | Same as above |
| Create an enabler | `jira:create-jira-ticket` on the saved Markdown draft when the `jira` plugin is installed, else the server's create-issue | Keep the draft and report the enabler as not created |

## Rules

- Find a story's earlier verdicts in its comments: the newest comment opened by that
  review's name holds the current one.
- With no server connected and nothing pasted, stop and say Jira is not reachable.
