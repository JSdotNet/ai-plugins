---
name: arc42-section-07
description: What arc42 section 7, Deployment View, holds — the infrastructure, the mapping of building blocks onto it, and the environments that differ — its inputs, and its output template.
---

# arc42 Section 7: Deployment View

Section 7 says where the building blocks of 5 run and how they get there.

## Rules

- Map every building block from Section 5 onto the infrastructure that runs it.
- Show the infrastructure nodes — servers, containers, cloud services — and the communication
  channels between them, naming the technologies, regions, and availability zones.
- Cover the network and security aspects, and the scalability the deployment provides.
- Document each environment that genuinely differs, and the deployment process that produces
  it.
- Draw the infrastructure with `deployment-diagram-generator` and the logical view with C4
  Level 2 (`c4-diagram-generator`).
- Keep a trivial deployment brief: a standard install or a plain three-tier web app needs a
  sentence, not a node catalogue.

## Inputs

The system, its infrastructure and cloud provider, which blocks run where, the environments
and how they differ, and the deployment process.

## Output

```markdown
# 7. Deployment View

<Infrastructure approach and deployment strategy.>

## Infrastructure

<Deployment Mermaid fence>

<Regions, zones, networks, and security boundaries the diagram does not say.>

## Node: <name>

- **Type:** <VM / container / managed service>, <location: region, zone>
- **Hosts:** <building blocks from section 5, with version and key configuration>
- **Quality:** <capacity, redundancy, scaling approach, security>
- **Deployment:** <method, tools, frequency>

| Target Node | Protocol | Port | Purpose |
| --- | --- | --- | --- |
| <Node> | <HTTPS> | <443> | <API calls> |

## Environments

| Environment | Differs from production in |
| --- | --- |
| <Staging> | <What is different> |
```

## Relationship to other sections

The hosted components are the blocks of 5; the technical context of 3 and the constraints of 2
shape the infrastructure; hosting and region choices link their decision records.
