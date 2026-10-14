---
name: update-jira-ticket
description: "Re-sync an existing Jira issue in project FIN from its Markdown story, epic, or bug without changing its text. Use when: the artifact has an Issue Key in Jira Fields and its summary, description, or test instructions changed. Acceptance criteria are create-only. DO NOT USE FOR: an artifact with no Issue Key (create-jira-ticket)."
---

# Update Jira Ticket

Re-sync an issue that already exists. Requires an **Atlassian MCP server** connected to the
session; the issue is edited through its update-issue tool. When none is connected, stop
and say so.

## Steps

1. Read the source file. `Issue Key` must be present in `## Jira Fields`; when it is
   missing, stop and ask — use `create-jira-ticket` for an artifact that has none.
2. Before building the payload, read [jira-sync.md](../../resources/jira-sync.md) and map
   `summary`, `description`, test instructions, and readiness per its Update column and
   uncertainty rendering.
3. Update the issue through the Atlassian MCP server, passing the issue key and the mapped
   fields. Change other metadata only when Jira rejects the update.
4. Return the result in exactly this form:

```text
Updated FIN-1234
https://innovadis.atlassian.net/browse/FIN-1234
```

**Acceptance criteria are create-only.** `customfield_11193` does not support update through
the Jira edit API. When acceptance criteria must be corrected, tell the person to change the
field in the Jira UI. Never delete or recreate the issue from this skill: deleting a Jira
issue permanently removes its key, history, comments, and links.
