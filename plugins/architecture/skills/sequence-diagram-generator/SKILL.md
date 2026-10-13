---
name: sequence-diagram-generator
description: 'Generate Mermaid sequence diagrams of runtime scenarios, integration flows, and API call chains. Use when: documenting a runtime scenario, use-case flow, or call chain, adding a runtime view to arc42 section 6, or making ordering, timing, or error handling explicit. DO NOT USE FOR: a lifecycle of states (state-diagram-generator) or static structure (c4-diagram-generator).'
---

# Sequence Diagram Generator

## Inputs

- Scenario name and triggering actor or event
- Participants involved (services, components, actors, external systems)
- Message sequence: what is sent, by whom, and in what order
- Error paths or alternative branches that are architecturally significant
- Relevant protocol or technology for each message (optional)

## Workflow

1. Load `resources/sequence-global.md`.
2. Confirm the scenario name, participants, and message flow with the user.
3. Load `skills/sequence-diagram-generator/prompts/sequence-diagram.prompt.md`.
4. Ask focused clarifying questions only for missing ordering decisions or error paths.
5. Generate the Mermaid `sequenceDiagram` with correctly typed arrows and labelled messages.
6. Add `alt`/`opt`/`loop` fragments for conditionals and error paths.
7. Write a prose summary (2–4 sentences) explaining key ordering decisions and error handling.
8. Add traceability notes to arc42 §6 and the related C4 diagram.
9. Run `scripts/generate-diagram-svgs.ps1 -Path <directory-of-output-file>` from the plugin root to generate an SVG alongside the Markdown output.

## Output

- Mermaid `sequenceDiagram` embedded in a fenced `mermaid` code block
- Prose summary of the scenario (2–4 sentences)
- Traceability links to arc42 §6 and the relevant C4 Container or Component diagram
- List of open questions or assumptions
