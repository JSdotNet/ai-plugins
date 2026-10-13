---
name: pr-remarks-resolve
description: >
  Collect the open review remarks on a Fincent pull request, propose a solution per remark,
  get one batch approval, then implement, push, reply to each thread, and resolve the fixed
  ones. Use when: "address the review comments", "resolve the PR remarks", a reviewer is
  waiting for changes, a new review round left remarks. DO NOT USE FOR: failing checks
  (delivery:fix-pr-checks), base-branch conflicts (delivery:update-pr-branch), or drafting
  replies without pushing (review:pr-remarks-review).
---

# PR Remarks — Propose, Approve, Push, Reply

Answer the open review remarks on a Fincent pull request, from the sibling `pr-review-*`
skills or any reviewer. Failing checks belong to `delivery:fix-pr-checks`, base-branch
conflicts to `delivery:update-pr-branch`; without the `delivery` plugin, report them and
stop. The GitHub calls, remark classes, reply content, and report are in
[pr-remarks-github.md](../../resources/pr-remarks-github.md).

Inputs: the PR (default: the current branch's), an optional reviewer, file, or path filter,
and whether to include resolved threads (default no).

1. **Load** the PR; stop and report when the working tree is dirty or not on its
   up-to-date head branch. Note the `FIN-` key from the title, body, or branch.
2. **Collect** every review thread and PR-level remark. Keep for each: the thread node `id`
   (to resolve it), the first comment's `databaseId` (to reply to it), file, line, reviewer,
   and text. Skip resolved threads. For an outdated thread, check whether a later commit
   already fixed it; if so, plan a reply naming that commit.
3. **Read the code** at each remark's file and line, also around a suggestion block. Judge
   by the sibling review skills' criteria and the repository's coding guidelines, else the
   surrounding code, saying so. Group a remark repeated on several lines into one item.
4. **Propose** one table: `# | File:line | Reviewer | Remark (1 line) | Class | Proposed
   solution | Effort`, with a class from the contract per remark. Under it, state which items
   change code, which only get a reply, and what the user must decide.
5. **Approve.** Stop and ask the user to approve the plan as a whole. Change, commit, push,
   or reply to nothing until the user has explicitly approved the plan in this conversation.
   A partial approval is fine — the user may drop items, reclassify them, or change a
   solution; re-present the table only when the changes are substantial.
6. **Implement** each approved Fix, smallest first: the change, plus the test that proves it
   when the remark is about behaviour. One commit per remark or coherent group, the message
   naming the remark, with no unrelated clean-up. Fix the concern itself; weakening a test,
   deleting an assertion, or suppressing a lint rule does not answer a remark.
7. **Push.** Build and run the tests and fix anything red; then push and read the PR checks.
   When the push turns a check red, fix it with `delivery:fix-pr-checks` before replying —
   without that plugin, report the red checks and stop before replying.
8. **Reply**, only now, each remark in its own thread on the first comment's `databaseId`,
   or as a PR comment for a PR-level remark, with the content per class. For a Defer,
   create the follow-up first — a Fincent story per
   [jira-discovery.md](../../resources/jira-discovery.md), or a GitHub issue for a
   repository task — and link it. Claim test coverage only for a test that exists and
   passes. Only add replies; never edit or delete a reviewer's comment.
9. **Resolve**, by thread node `id`, only the Fix threads whose change is pushed. Discuss,
   Decline, and Defer threads stay open: the reviewer settles those.
10. **Report** with the template.
