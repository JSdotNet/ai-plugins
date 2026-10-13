---
name: create-pull-request
description: "Open a pull request for the current branch — push it, derive title and body from the commits and the linked issue, apply the repository PR template, and set labels, reviewers, and issue links. Use when: opening a PR, raising a PR for a finished branch, or turning a draft PR ready for review. DO NOT USE FOR: updating or fixing a PR that is already open for review (delivery:update-pr-branch, delivery:fix-pr-checks)."
---

# Create Pull Request

Inputs: base branch (default: the repository default branch), draft or ready (default draft
when the branch has open TODOs or failing local checks), linked issue, reviewers, labels.
`gh` must be authenticated; configured GitHub MCP tools may stand in for any `gh` call.

## Before drafting

- On the default branch: stop and ask the user to create a feature branch first.
- Uncommitted changes: list them and ask whether to commit them into the PR or leave them
  behind. Never stash silently. Keep secrets, `.env` files, and local settings out of the
  staged diff.
- A PR already exists for the branch: open and draft — report the URL and ask whether to
  publish it; on yes, mark it ready (`gh pr ready`) and go to the report; on no, stop. Open
  and not a draft — report the URL and stop. Closed, merged, or none — continue.

## Draft

- Ground the body in `origin/<base>..HEAD` after a fetch: describe only what the diff changes.
- Linked issue: an `#123` or `owner/repo#123` in a commit message or trailer, else a number in
  the branch name, else ask when the repository requires one.
- Title in the style of recent merged PR titles. Body from the repository PR template when
  one exists, otherwise `## Summary`, `## Changes`, `## Validation` (only what was actually
  run), then the issue line.
- Write `Closes #<n>` only when merging genuinely resolves the issue; otherwise `Refs #<n>`.

## Confirm, push, create

1. Show the user the title, the full body, the base branch, and draft or ready. Wait for an
   explicit confirmation of all of them; push nothing and create nothing before it.
2. Push with `--set-upstream`. Never force-push. When the remote rejects the push because the
   branch diverged, stop and hand off to `delivery:update-pr-branch`; when that plugin is not
   installed, report the divergence and stop.
3. Create the PR with the body written to a temporary file (`--body-file`), adding `--draft`
   unless it is ready; then apply the requested labels and reviewers.

## Report

PR number, URL, base, draft state, linked issue, and the check status. Right after creation an
empty check list means pending — report pending, never passing. Failing checks: hand off to
`delivery:fix-pr-checks`; when a hand-off's plugin is absent, report the state and URL and stop.

Dashboard: per [orch-dashboard-contract.md](../../resources/orch-dashboard-contract.md),
`start_run` with `skillId: "create-pull-request"` and stages Assess Branch State, Collect
Change Context, Draft Title and Body, Push the Branch, Create the Pull Request, Report;
`finish_run` with the final status and the PR URL once the PR exists.
