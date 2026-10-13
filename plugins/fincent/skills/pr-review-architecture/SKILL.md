---
name: pr-review-architecture
description: >
  Review a Fincent pull request from the Software Architect perspective: layer boundaries,
  dependency direction, ADR consistency, NFRs, security and compliance, integration and error
  handling. Use when: "architecture review of this PR", a PR touches system structure,
  cross-cutting concerns, infrastructure, or integration points. DO NOT USE FOR: domain model
  semantics (pr-review-domain), story coverage (pr-review-story), or a story before
  development (story-review-dev).
---

# PR Review — Architecture

Review structure and non-functional correctness across every changed layer; domain-model
semantics belong to `pr-review-domain`.

1. Load the PR diff, the ADRs in `.devbook/arc42/adr/`, and, when a `FIN` key is given, the
   story per [jira-discovery.md](../../resources/jira-discovery.md).
2. Review every changed file — `**/Application/**`, `**/Infrastructure/**`, `**/Api/**`,
   configuration and deployment files — for:
   - **Dependency direction** — inward only (Infrastructure → Application → Domain).
   - **ADR consistency** — no conflict with an existing ADR; a new decision has an ADR
     drafted or referenced; ADR patterns applied the same way throughout.
   - **Integration** — when the codebase has them, integration events go through the outbox
     and external APIs through the anti-corruption layer or adapter; event schemas stay
     backward-compatible.
   - **Security and compliance**, on every PR — auth policies on new endpoints, PII and
     financial data masked in logs, caches, and responses, secrets from configuration, and
     PSD2, GDPR, and AML implications.
   - **NFRs and errors** — performance, scaling, resilience, observability, the codebase's
     result or exception pattern, and validation at the API boundary.
3. Before raising a violation, check the ADRs: a pattern may be deliberately non-standard.

## Output

- One finding per criterion: ✅ compliant, ⚠️ minor issue, or ❌ violation.
- For each ⚠️ and ❌ the exact correction: the refactor, the pattern, or the ADR to apply.
- Overall: ✅ **Architecturally sound** (mergeable), ⚠️ **Minor issues** (mergeable; track
  the fixes), or ❌ **Architectural violation** (resolve before merge).
