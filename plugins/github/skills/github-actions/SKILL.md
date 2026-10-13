---
name: github-actions
description: "Create, review, and harden GitHub Actions workflow files under .github/workflows: SHA pinning, least-privilege permissions, OIDC, caching, reusable workflows. Use when: writing a CI or CD workflow, auditing a workflow for security or speed, upgrading actions after a Dependabot PR, setting up OIDC to AWS, Azure, or GCP, adding a workflow_call workflow. DO NOT USE FOR: .github/dependabot.yml (dependabot)."
---

# GitHub Actions

Create, review, or optimize a workflow under `.github/workflows/`. Before writing or reviewing
any workflow, read [github-actions.md](../../resources/github-actions.md) and apply every rule
in it, whether the file is new or existing. Resolve each pin to the SHA of the release you
name in the version comment; never invent a SHA.

## Review

When auditing an existing workflow, report each rule it breaks with the file and line, and
the fixed line.

## OIDC trust claims

| Provider | Action | Trust policy claim |
| --- | --- | --- |
| AWS | `aws-actions/configure-aws-credentials` | `sub: repo:owner/repo:ref:refs/heads/main`, `aud: sts.amazonaws.com` |
| Azure | `azure/login` with `client-id` and workload identity federation | `repo:owner/repo:ref:refs/heads/main` |
| GCP | `google-github-actions/auth` | `sub: repo:owner/repo:ref:refs/heads/main` |

## Output

The complete `.github/workflows/<name>.yml`, ready to commit, plus a short summary of the
security decisions made.
