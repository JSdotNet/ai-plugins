---
name: create-jira-ticket
description: "Create a Jira issue in project FIN from an already written Markdown story, epic, or bug, without changing its text, and write the new key back. Use when: upload this ticket to Jira, create the Jira issue for this story/epic/bug, the artifact has no Issue Key yet. DO NOT USE FOR: an artifact that already has an Issue Key (update-jira-ticket), or drafting ticket content."
---

# Create Jira Ticket (Upload Only)

Upload a ticket that is already fully written in Markdown to project FIN. Requires an
**Atlassian MCP server** connected to the session; the issue is created through its
create-issue tool. When none is connected, stop and say so.

Input: the path to the artifact, for example
`/create-jira-ticket .wip/work/regeling-uitvoer/story-uitvoer-algemeen.md`. When it already
carries an `Issue Key`, use `update-jira-ticket` instead.

## Steps

1. Before building the payload, read [jira-sync.md](../../resources/jira-sync.md): its content
   rules, field mapping (Create column), and uncertainty rendering govern every value sent.
2. Read the source file. For a Story or Bug, `## Acceptance Criteria` and `Epic Link` must be
   present; stop and ask only for what is missing, and never infer acceptance criteria.
   Acceptance criteria can be set only now: `customfield_11193` accepts no later update.
3. When `⚠️` open questions appear in the description, set the readiness field to `Red`
   where it is configured.
4. Create the issue through the Atlassian MCP server. Change metadata after creation only
   when Jira rejects the create and names a required field.
5. Write `Issue Key` and `Issue URL` back into `## Jira Fields`.
6. Return the result in exactly this form:

```text
Created FIN-1234
https://innovadis.atlassian.net/browse/FIN-1234
```
