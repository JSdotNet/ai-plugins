---
name: domain-documentation-structure
description: Where domain design artifacts are written, and which convention owns their structure.
---

# Domain Documentation Structure Instructions

## Purpose

Say where domain artifacts land. It does not restate their structure: when the repository has
a `.devbook/domain/` folder, that folder's own rule file is the single owner of the layout, the
chapter set, and the metadata, and a second spec here would only drift from it.

## When The Repository Has A Domain Folder

Write there, and follow the folder's own rule for everything else. The layout, as of devbook
1.5.0 (contract 16):

```
.devbook/domain/
  context-map.md        # strategic view: subdomains, context map, published languages
  <bounded-context>/    # kebab-case, matching the name used in code and ADRs
    context.md          # the boundary, feature flags, settings, deployment values;
                        # actors and dependencies until they outgrow it
    domain.md           # aggregates, domain services, events; terms under Ubiquitous Language
    features.md         # what a user can do, in business language — or skills.md, never both
    requirements.md     # one SHALL sentence per chapter, with the scenarios that prove it
    invariants.md       # one rule per chapter, where it is enforced, and its proof
    model.md            # structural model only
    flow.md             # optional: lifecycle and process flows
    actors.md           # optional: split out of context.md once it is too small for them
    dependencies.md     # optional: same, for the dependency tables
    <base>.<name>.md    # optional: one chapter split out of the file it is named after
```

Four things follow from that convention and are the ones most often got wrong:

- One **folder** per bounded context. A new context starts with `context.md`, `domain.md`,
  `model.md`, one of `features.md` or `skills.md`, `requirements.md`, and `invariants.md`.
- There is no `naming.md` and no glossary file: a term that is already a chapter carries its
  surface names in `aliases`; any other term is a `term` chapter in `domain.md`.
- Every rule that is kept or broken lives in `requirements.md` or `invariants.md`, not in prose.
  A deployment or environment value is a `setting` chapter in `context.md`, not a flag.
- `status` follows `devbook-chapter-metadata.md`: absent reads as `active`, so a settled chapter
  omits it. There is no `done` — a domain model is the current agreed model, not a task queue.

Read that folder's rule file before writing, and never hand-edit anything under `_meta/` — it is
generated.

## When It Does Not

Ask for a path, defaulting to `docs/domain/`, and keep the same shape one level flatter: a
`context-map.md` overview plus one kebab-case file per bounded context, cross-linked, each
opening with `title`, `context`, and `last-updated` frontmatter.

## Either Way

- File names kebab-case. Aggregate names PascalCase as the ubiquitous language uses them.
  Domain events PascalCase and past tense — `OrderPlaced`.
- Terms as domain experts actually say them, with synonyms recorded as aliases rather than as
  separate terms.
- Adding a context adds its folder or file and updates the context map. Modifying one touches
  only that context and the cross-references that name it.
- Record unresolved domain decisions explicitly rather than resolving them by invention.
