---
name: state-diagram-generator
description: 'Generate Mermaid stateDiagram-v2 state machines for entity lifecycles, workflows, and protocol states. Use when: documenting an aggregate or entity lifecycle (Order, Subscription, Payment), an approval workflow with explicit transitions, clarifying complex transitions, or a protocol state machine (circuit breaker, connection). DO NOT USE FOR: message ordering between participants (sequence-diagram-generator).'
---

# State Diagram Generator

## Inputs

- Entity or protocol name being modelled
- List of possible states
- Events or commands that trigger transitions
- Guard conditions for conditional transitions (if any)
- Entry, exit, or transition actions (if any)
- Composite or concurrent sub-states (if any)

## Workflow

1. Load `resources/state-global.md`.
2. Confirm the entity name, states, and key transitions with the user.
3. Load `skills/state-diagram-generator/prompts/state-diagram.prompt.md`.
4. Ask focused clarifying questions only for missing guards, terminal states, or sub-state structure.
5. Generate the Mermaid `stateDiagram-v2` with labelled transitions and composite states where needed.
6. Write a prose summary (2–4 sentences) explaining the lifecycle, key guards, and any side effects.
7. Add traceability notes to arc42 §6 or §8 and the related domain model.
8. Run `scripts/generate-diagram-svgs.ps1 -Path <directory-of-output-file>` from the plugin root to generate an SVG alongside the Markdown output.

## Output

- Mermaid `stateDiagram-v2` embedded in a fenced `mermaid` code block
- Prose summary of the lifecycle (2–4 sentences)
- Traceability links to arc42 §6 (scenario) or §8 (crosscutting pattern) and the related domain definition
- List of open questions or assumptions
