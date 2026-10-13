---
name: deployment-global
description: Defines rules, notation standards, and quality gates for deployment and infrastructure diagram generation.
---

# Deployment Diagrams — Global Instructions

Prose follows `prose.md`; where the diagram lands and what goes beside it, `diagram-output.md`.

A deployment diagram shows *where* the C4 Level 2 containers run; reference that diagram for
the logical view instead of repeating it.

## Preferred Notation: Mermaid Architecture Diagram

Prefer the Mermaid `architecture-beta` diagram type for infrastructure and cloud topologies. It renders native cloud/infra icons and supports grouping by logical boundary.

> **Note:** `architecture-beta` requires Mermaid v11 or later. Verify renderer compatibility before use. Fall back to `graph TD` when the target environment does not support v11+.

Available icon types: `cloud`, `server`, `database`, `disk`, `internet`, `function`, `gateway`.
The templates for both types are in
[deployment-diagram.prompt.md](../skills/deployment-diagram-generator/prompts/deployment-diagram.prompt.md).

## Scope Guidance

- One diagram per environment or per deployment tier when environments differ significantly.
- Show production as the primary diagram; add staging or development diagrams only when they differ architecturally.
- Include network zones (VPC, subnet, DMZ) and security boundaries when they are architecturally relevant.

## Naming Conventions

- Name nodes using their role and technology (e.g., `"API Gateway [AWS API GW]"`, `"Primary DB [PostgreSQL 16]"`).
- Label groups with environment and cloud region (e.g., `"Production — AWS eu-west-1"`).
- Label relationships with the protocol and port where relevant (e.g., `HTTPS:443`, `TCP:5432`).
