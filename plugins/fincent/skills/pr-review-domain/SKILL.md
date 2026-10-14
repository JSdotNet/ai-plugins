---
name: pr-review-domain
description: >
  Review a Fincent pull request's domain-layer code from the Domain Architect perspective:
  ubiquitous language, bounded context boundaries, aggregate invariants, domain event naming,
  and domain layer purity. Use when: "domain review of this PR", a PR touches aggregates,
  entities, value objects, events, or business rules. DO NOT USE FOR: layers outside the domain
  (pr-review-architecture), story coverage (pr-review-story), or a story before development
  (story-review-domain).
---

# PR Review — Domain Architect

Review only the PR's domain-layer files — `**/Domain/**`, `**/Aggregates/**`,
`**/Events/**`, `**/Policies/**`, `**/ValueObjects/**`; other layers belong to
`pr-review-architecture`.

1. Load the PR diff and, when a `FIN` key is given, the story per
   [jira-discovery.md](../../resources/jira-discovery.md). Load the ubiquitous language
   glossary and context map from `.devbook/domain/` when the repository has them; otherwise
   take the established names in the codebase.
2. Check each changed domain file:
   - **Ubiquitous language** — verify every class, method, property, and event name against
     the glossary or the codebase; flag abbreviations and technical synonyms.
   - **Context boundaries** — no type from another bounded context; cross-context work goes
     through integration events or the anti-corruption layer.
   - **Aggregates** — state changes only through the root, and invariants enforced inside it.
   - **Domain events** — past tense business language (`PaymentInitiated`), raised inside the
     aggregate, carrying only what consumers need.
   - **Purity** — no EF annotations, HTTP clients, loggers, or repository implementations in
     the domain layer; business rules modelled explicitly, not as application conditionals.

## Output

- Per file or change, each criterion it violates: ⚠️ minor issue or ❌ violation.
- For each finding the exact correction: the rename, the move, or the pattern to apply.
- Overall: ✅ **Domain ready** (mergeable), ⚠️ **Minor issues** (mergeable; address soon), or
  ❌ **Domain violation** (rework before merge).
