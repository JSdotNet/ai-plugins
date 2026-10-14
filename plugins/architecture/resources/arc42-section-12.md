---
name: arc42-section-12
description: What arc42 section 12, Glossary, holds — the domain and technical terms and acronyms the documentation uses, defined once — its inputs, and its output template.
---

# arc42 Section 12: Glossary

Section 12 defines the terms the documentation uses, so every reader means the same thing.

## Rules

- Define every domain term, acronym, and system-specific term the chapters use, sorted
  alphabetically; leave universally known words out.
- Write definitions that stand on their own: no circular definitions, no undefined terms
  inside one.
- Add an example for the terms that need one, and note synonyms and related terms.
- Keep the definitions consistent with the code and with the ubiquitous language of the domain
  model where one exists.
- Record a renamed term as deprecated with its replacement rather than dropping it.
- Lean: one alphabetical table of term and one-sentence definition.

## Inputs

The system, its domain, the key domain terms, the system-specific technical terms, the
acronyms, and the code entities that need a definition.

## Output

```markdown
# 12. Glossary

| Term | Definition | Category | Related |
| --- | --- | --- | --- |
| <Account> | <Clear definition in 1–3 sentences; an example where it helps> | <Business> | [<Order>](#order) |

## Acronyms

| Acronym | Full Form | Definition |
| --- | --- | --- |
| <SLA> | <Service Level Agreement> | <What it guarantees here> |

## Deprecated Terms

| Old Term | Replacement | Since |
| --- | --- | --- |
| <Shopping Basket> | <Cart> | <v2.0> |
```

Give a term its own `####` entry with synonyms and an example only when one table row cannot
hold it. Add a translations table only for a multilingual system.

## Relationship to other sections

Every external entity in 3 and every building block in 5 that carries a domain name is a term
here.
