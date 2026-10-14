---
name: update-open-sessions
description: >
  Rebase or merge all open Copilot sessions onto the latest source branch.
  Use when: syncing open feature branches before review, pulling in upstream fixes,
  keeping worktrees up to date, preparing sessions for PR submission.
  DO NOT USE FOR: one pull request branch with conflicts to resolve and push
  (delivery:update-pr-branch).
---

# Update Open Sessions

Inputs: source branch (default: the repository default branch), strategy `rebase` (default)
or `merge`, sessions `all` (default) or a list, and on conflict `skip` (default) or `abort`
(roll back the whole run).
When the Copilot app manages the worktrees, list and update sessions with its session tools
rather than raw git.

1. **Fetch** `origin/<source>` once, so every comparison runs against the remote state.
2. **Compare** each session worktree: uncommitted changes (any `status --porcelain` output
   marks it **Dirty — skipped**, never updated), commits behind `origin/<source>`, the
   pre-update SHA (record it — the rollback point), and whether the branch has an upstream.
3. **Confirm**: show this table and wait for the user's go-ahead before changing any branch.

   | Session | Branch | Behind by | Action |
   |---------|--------|-----------|--------|
   | `<name>` | `feature/x` | 3 commits | Will rebase |
   | `<name>` | `feature/y` | 0 commits | Up to date — skip |
   | `<name>` | `feature/w` | 2 commits | Dirty — skip |

4. **Update** each clean session that is behind, one at a time, inside its worktree. On a
   conflict, abort that rebase or merge first, then: `skip` — mark it **Conflict — skipped**,
   list its conflicting files, and continue; `abort` — `git -C <worktree> reset --hard
   <pre-update-sha>` every session this run already updated (only clean worktrees were
   touched, so this discards only this run's changes), report each, and stop.
5. **Summarize**:

   | Session | Branch | Result | New HEAD |
   |---------|--------|--------|----------|
   | `<name>` | `feature/x` | ✅ Updated | `abc1234` |
   | `<name>` | `feature/y` | ⏭ Already up to date | `def5678` |
   | `<name>` | `feature/z` | ⚠️ Conflict — skipped | — |
   | `<name>` | `feature/w` | ⏭ Dirty — skipped | — |

   Ask the user to resolve each conflicted session and to commit or set aside each dirty one
   before re-running. Changes stay local: push nothing. For every rebased branch that already
   had an upstream, say its history was rewritten and its next push needs
   `--force-with-lease`.

Canvas: per [dashboard-contract.md](../../resources/dashboard-contract.md), `start_run` with
`skillId: "update-open-sessions"` and stages Discover Open Sessions, Update Each Session,
Summary; `finish_run` with the final status and the summary.
