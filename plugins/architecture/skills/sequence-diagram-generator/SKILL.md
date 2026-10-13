---
name: sequence-diagram-generator
description: 'Generate Mermaid sequence diagrams of runtime scenarios, integration flows, and API call chains. Use when: documenting a runtime scenario, use-case flow, or call chain, adding a runtime view to arc42 section 6, or making ordering, timing, or error handling explicit. DO NOT USE FOR: a lifecycle of states (state-diagram-generator) or static structure (c4-diagram-generator).'
---

# Sequence Diagram Generator

## Inputs

- The scenario name and its triggering actor or event.
- The participants and the messages between them, in order.
- The architecturally significant error paths and alternatives.

## Workflow

1. Read [sequence-global.md](../../resources/sequence-global.md),
   [diagram-output.md](../../resources/diagram-output.md), and
   [sequence-diagram.prompt.md](prompts/sequence-diagram.prompt.md).
2. Confirm the scenario, participants, and message flow with the user.
3. Draft one `sequenceDiagram` per scenario from the prompt's template, opening with a
   `%% Scenario:` header line.
4. Land it in §6 Runtime View, write what goes beside it, and generate the SVG per
   diagram-output.md.
