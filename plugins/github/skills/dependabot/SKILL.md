---
name: dependabot
description: "Create or update .github/dependabot.yml so Dependabot keeps every package ecosystem current with grouped updates. Use when: setting up Dependabot for the first time, adding an ecosystem after a new technology, reducing Dependabot PR noise with groups, tuning schedules, reviewers, and labels, configuring security updates. DO NOT USE FOR: workflow files under .github/workflows (github-actions)."
---

# Dependabot

## Purpose

Use this skill to create or update `.github/dependabot.yml` so GitHub Dependabot automatically
keeps dependencies current and alerts on known vulnerabilities.

## Hard Constraints

- Configuration must be in `.github/dependabot.yml` on the default branch only.
- Do not create multiple `dependabot.yml` files — GitHub supports exactly one per repository.
- Use `directories` (plural) with glob patterns for monorepos; `directory` (singular) does not support globs.

## Inputs

- Repository root path to scan for package manifests.
- Optional: preferred schedule, reviewer list, label preferences.

## Execution Steps

1. Scan the repository for dependency manifests to identify all package ecosystems present.
2. Map directory locations for each ecosystem (root `/` and sub-paths).
3. Generate a `dependabot.yml` entry per ecosystem with a weekly schedule by default.
4. Apply grouping to reduce PR count (minor + patch together; major separate).
5. Add `github-actions` ecosystem entry if `.github/workflows/` is present.
6. Write the complete configuration to `.github/dependabot.yml`, merging into the existing file
   when there is one rather than creating a second.

## Ecosystem Detection Reference

| Technology | Ecosystem Value | Manifest Files |
| --- | --- | --- |
| npm / pnpm / yarn | `npm` | `package.json`, `package-lock.json` |
| pip / poetry | `pip` | `requirements.txt`, `pyproject.toml` |
| NuGet (.NET) | `nuget` | `*.csproj`, `packages.config` |
| Docker | `docker` | `Dockerfile` |
| GitHub Actions | `github-actions` | `.github/workflows/*.yml` |
| Go modules | `gomod` | `go.mod` |
| Cargo (Rust) | `cargo` | `Cargo.toml` |
| Maven (Java) | `maven` | `pom.xml` |
| Gradle (Java) | `gradle` | `build.gradle` |
| Terraform | `terraform` | `*.tf` |

## Grouping Strategy

Group minor and patch updates together to reduce PR count; keep major updates separate for
deliberate review:

```yaml
groups:
  minor-and-patch:
    update-types: ["minor", "patch"]
```

## Example Invocation

```text
/dependabot Set up Dependabot for this repository.
```

## Success Response Format

Writes `.github/dependabot.yml` with all detected ecosystems configured, and reports the path
with a short explanation of each grouping decision.
