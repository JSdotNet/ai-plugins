---
name: pr-remarks-github
description: The GitHub calls, the reply content per remark class, and the report template pr-remarks-resolve uses to collect, answer, and resolve pull request review remarks.
---

# PR remarks on GitHub

A thread has two identifiers: reply on its **first comment's `databaseId`**, resolve it by
its **thread node `id`**. Capture both while collecting.

## Collect

Inline review threads with their state:

```bash
gh api graphql -F owner=OWNER -F repo=REPO -F number=PR_NUMBER -f query='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100){nodes{id isResolved isOutdated path line originalLine comments(first:20){nodes{databaseId author{login} body createdAt}}}}}}}'
```

PR-level review bodies and discussion comments: `gh pr view PR_NUMBER --json reviews,comments`.

## Reply

```bash
gh api --method POST repos/OWNER/REPO/pulls/PR_NUMBER/comments/COMMENT_DATABASE_ID/replies -f body="..."
```

A PR-level remark gets `gh pr comment PR_NUMBER --body "..."`.

| Class | When | The reply contains |
|---|---|---|
| Fix | A defect or guideline violation; needs a code change | What changed, the commit SHA, and the test that proves it |
| Discuss | A question or opinion; align before acting | The question or trade-off, and the option you lean towards with the reason |
| Decline | Out of scope or already handled | Why the remark does not apply here, with the evidence: file, existing test, or ADR |
| Defer | Valid, but belongs in a follow-up story | Why it is out of this story's scope, and the follow-up story key or issue link |

Keep replies short, factual, and friendly, without apologising or restating the remark. A
Defer reply always carries the link.

## Resolve

```bash
gh api graphql -F threadId=THREAD_NODE_ID -f query='mutation($threadId:ID!){resolveReviewThread(input:{threadId:$threadId}){thread{id isResolved}}}'
```

## Report

```text
## PR Remarks Resolved: #N — [PR title]  (FIN-xxx)

**Pushed**: <n> commits · **Checks**: pass / attention
**Remarks**: <n> total — <n> fixed · <n> discuss · <n> declined · <n> deferred

| # | File:line | Class | Action taken | Commit | Replied | Resolved |
|---|---|---|---|---|---|---|
| 1 | Domain/Order.cs:42 | Fix | Guard moved to ctor + test | abc1234 | yes | yes |
| 2 | Api/OrdersController.cs:17 | Discuss | Question posted | — | yes | open |

### Waiting on the reviewer
- #2 — @bob: whether the read path moves to a query handler in this PR.

### Follow-ups created
- FIN-456 — Add caching to the orders page.
```
