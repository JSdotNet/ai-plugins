---
name: state-diagram-generator
description: 'Generate Mermaid stateDiagram-v2 state machines for entity lifecycles, workflows, and protocol states. Use when: documenting an aggregate or entity lifecycle (Order, Subscription, Payment), an approval workflow with explicit transitions, clarifying complex transitions, or a protocol state machine (circuit breaker, connection). DO NOT USE FOR: message ordering between participants (sequence-diagram-generator).'
---

# State Diagram Generator

## Inputs

- The entity or protocol, its states, and the events or commands between them.
- Guards, entry and exit actions, and composite or concurrent sub-states, where they exist.

## Workflow

1. Read [state-global.md](../../resources/state-global.md),
   [diagram-output.md](../../resources/diagram-output.md), and
   [state-diagram.prompt.md](prompts/state-diagram.prompt.md).
2. Confirm the entity, its states, and its key transitions with the user.
3. Draft one `stateDiagram-v2` from the prompt's template, opening with a
   `%% State machine:` header line.
4. Land it in §6 when it models one scenario's lifecycle and in §8 when it models a shared
   pattern, write what goes beside it, and generate the SVG per diagram-output.md.
