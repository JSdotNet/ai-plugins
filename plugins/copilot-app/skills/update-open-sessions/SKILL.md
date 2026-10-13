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

## Purpose

Fetch the latest commits from the source branch and apply them to every open
Copilot session branch, keeping all in-progress work in sync with the trunk.

## Inputs

- Source branch to update from (default: repository default branch, usually `main` or `master`).
- Update strategy: `rebase` (default) or `merge`.
- Sessions to update: `all` (default) or a specific list of session branch names.
- Conflict behaviour: `skip` (default — leave conflicted sessions untouched and report them)
  or `abort` (roll back the update for any session with conflicts).

## Workflow

### Phase 1 — Discover Open Sessions

1. Fetch the source branch once, so every comparison below runs against the remote state:
   ```bash
   git fetch origin <source-branch>
   git --no-pager log origin/<source-branch> -1 --oneline
   ```
2. List all git worktrees to discover open session branches:
   ```bash
   git --no-pager worktree list
   ```
3. For each worktree, collect:
   - Uncommitted changes — `git -C <worktree> status --porcelain`. A worktree with any output
     is marked **Dirty — skipped** and is never updated.
   - Commits behind — `git --no-pager log <session-branch>..origin/<source-branch> --oneline`.
   - The pre-update SHA — `git rev-parse <session-branch>`. Record it; it is the rollback point.
   - Whether the branch is already pushed — `git rev-parse --verify <session-branch>@{u}`.
4. Present the status table to the user and ask for confirmation before proceeding:

| Session | Branch | Behind by | Action |
|---------|--------|-----------|--------|
| `<name>` | `feature/x` | 3 commits | Will rebase |
| `<name>` | `feature/y` | 0 commits | Up to date — skip |
| `<name>` | `feature/w` | 2 commits | Dirty — skip |

### Phase 2 — Update Each Session

5. For each clean session that is behind (in order):
   a. Change into the worktree directory.
   b. Apply the chosen update strategy:

   **Rebase:**
   ```bash
   git rebase origin/<source-branch>
   ```

   **Merge:**
   ```bash
   git merge --no-edit origin/<source-branch>
   ```

   c. If the operation exits with conflicts, first run `git rebase --abort` or
      `git merge --abort` in that worktree, then follow the conflict behaviour:
      - `skip`: mark the session **Conflict — skipped** and continue to the next session.
      - `abort`: for every session this run already updated, run
        `git -C <worktree> reset --hard <pre-update-sha>` to put its branch back where it was.
        Only clean worktrees were updated, so this discards nothing but this run's own
        changes. Report each rolled-back session and stop.

6. After a successful update, record the new HEAD for the session.

### Phase 3 — Summary

7. Output a final summary table:

| Session | Branch | Result | New HEAD |
|---------|--------|--------|----------|
| `<name>` | `feature/x` | ✅ Updated | `abc1234` |
| `<name>` | `feature/y` | ⏭ Already up to date | `def5678` |
| `<name>` | `feature/z` | ⚠️ Conflict — skipped | — |
| `<name>` | `feature/w` | ⏭ Dirty — skipped | — |

8. For any session marked **Conflict — skipped**:
   - List the conflicting files.
   - Suggest the user open that session and resolve conflicts manually before
     re-running this automation.
9. For any session marked **Dirty — skipped**, list its uncommitted files and ask the user to
   commit or set them aside before re-running.
10. For every rebased session whose branch was already pushed, say that its history was
    rewritten and the next push needs `git push --force-with-lease`. Never push it here.

## Canvas Interface

This skill reports progress through the `orch-dashboard` canvas extension
(`plugins/copilot-app/extensions/orch-dashboard/`). Follow the shared **Dashboard Reporting
Contract** in [`resources/dashboard-contract.md`](../../resources/dashboard-contract.md) to
resolve the provider and for the availability fallback.

- Open the dashboard per the shared contract, then call `start_run` with
  `skillId: "update-open-sessions"` and these stages: Discover Open Sessions,
  Update Each Session, Summary.
- Call `finish_run` with the final status and a summary once every session has
  been updated.

See `plugins/copilot-app/extensions/orch-dashboard/README.md` for the full
canvas action contract.

## Output

- All sessions behind the source branch are updated (rebased or merged).
- Summary table with result per session.
- Conflict report with file list for any sessions that could not be updated.

## Notes

- This automation only modifies local worktree branches; it does not push to remote.
  Push manually or via the session's normal PR workflow after reviewing the update.
- If worktrees are managed by the Copilot app rather than plain git, use the app's
  session management tools to list sessions and update branches instead of raw git commands.
