---
name: github-actions
description: GitHub Actions security and authoring rules every workflow file under .github/workflows follows, written from scratch or edited.
---

# GitHub Actions rules

## Security

- Pin every action, first-party and third-party, to a full-length commit SHA with a version
  comment beside it: `actions/checkout@<sha> # v4.2.2`. A mutable reference (`@main`,
  `@latest`, a bare major tag such as `@v4`) is never acceptable.
- Set `permissions: contents: read` at the workflow level; widen only at the job that needs
  more.
- Read secrets through environment variables (`${{ secrets.NAME }}`); never echo, log, or
  expose them in outputs.
- Authenticate to a cloud provider with OIDC instead of a stored long-lived key.
- Treat `pull_request_target` as privileged: it runs in the base repository's context with
  its secrets, so never check out or run a fork's code under it.

## Structure

- Name files for what they do: `build-and-test.yml`, `deploy-production.yml`.
- Limit triggers explicitly with branch filters; add `workflow_dispatch` where a manual run
  helps.
- Use `concurrency` to cancel a stale run when a new one starts on the same ref.
- Cache dependencies keyed on the lock file hash.

## Keeping pins current

Keep action SHAs current through a `github-actions` entry in `.github/dependabot.yml`.
Dependabot keeps a full-SHA pin as a SHA and updates its version comment; check both in the
pull request before merging.
