---
name: deployment-diagram-generator
description: 'Generate deployment diagrams of cloud, on-premises, or hybrid hosting topology in Mermaid. Use when: documenting how the system is hosted, per-environment topology (production, staging, development), mapping containers to cloud services, VMs, or Kubernetes, or network zones and security boundaries for arc42 section 7. DO NOT USE FOR: logical containers without infrastructure (c4-diagram-generator).'
---

# Deployment Diagram Generator

## Inputs

- The environment, and the cloud provider or hosting platform.
- The infrastructure nodes, the network zones, and the scaling topology.
- Which C4 Level 2 containers run on each node.

## Workflow

1. Read [deployment-global.md](../../resources/deployment-global.md),
   [diagram-output.md](../../resources/diagram-output.md), and
   [deployment-diagram.prompt.md](prompts/deployment-diagram.prompt.md).
2. Confirm the environment, the provider, and the key nodes with the user.
3. Use `architecture-beta` when the target renderer runs Mermaid v11 or later; otherwise use
   the `graph TD` fallback template. Open with a `%% Deployment:` header line.
4. Land it in §7 Deployment View, link the C4 Level 2 Container diagram, state the Mermaid
   version the chosen type needs, and generate the SVG per diagram-output.md.
