---
name: pr-remarks-review
description: "Triage pull request review remarks one by one — classify each as fix, discuss, decline, or defer, and draft a reply the user can post. Drafts only: posts nothing and changes no code. Use when: working through PR review comments or open review threads, 'address the review', or a pasted list of reviewer remarks. DO NOT USE FOR: reviewing the pull request's code yourself."
---

# PR Remarks Review Skill

The calling agent supplies the domain knowledge about what is under review; this skill works
through the reviewer remarks. Drafts only: post nothing to the pull request and change no
code — the user posts the replies and makes the fixes.

Input: a PR URL or number, or a pasted list of remarks; optionally a filter (reviewer, file,
label, severity) and the target branch or files for context.

1. Collect every open remark, from the PR or the list, and group them by file or topic.
2. Per remark, summarise the concern in one sentence and classify it:
   - **Fix** — a clear defect or violation; name the change required, with the file, section,
     or line where known.
   - **Discuss** — a question or opinion; name the question or trade-off to settle with the
     reviewer before acting.
   - **Decline** — out of scope or already handled.
   - **Defer** — valid, but belongs in a follow-up issue; log it explicitly.
3. Draft a reply for each remark as inline reply text. A Decline or Defer reply carries a
   rationale the user can paste as is.
4. Return the summary table, then the open questions that need reviewer or stakeholder input
   before the PR can merge:

   | Remark | Classification | Proposed resolution | Draft reply | Status |
   |---|---|---|---|---|

Every remark leaves with a classification and a decision.
