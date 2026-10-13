---
name: dependabot
description: "Create or update .github/dependabot.yml so Dependabot keeps every package ecosystem current with grouped updates. Use when: setting up Dependabot for the first time, adding an ecosystem after a new technology, reducing Dependabot PR noise with groups, tuning schedules, reviewers, and labels, configuring security updates. DO NOT USE FOR: workflow files under .github/workflows (github-actions)."
---

# Dependabot

Keep one `.github/dependabot.yml` on the default branch: GitHub reads exactly one per
repository, so merge into an existing file instead of adding a second.

## Steps

1. Scan the repository for dependency manifests and list every ecosystem with its
   directories (root `/` and sub-paths).
2. Write one entry per ecosystem, weekly unless the user names another schedule, with the
   user's reviewers and labels when given. For a monorepo use `directories` (plural) with
   glob patterns; `directory` (singular) does not take globs.
3. Group minor and patch updates by default, keeping major updates separate for deliberate
   review:

   ```yaml
   groups:
     minor-and-patch:
       update-types: ["minor", "patch"]
   ```

4. Add a `github-actions` entry whenever `.github/workflows/` exists.
5. Report the path and one line per grouping decision.
