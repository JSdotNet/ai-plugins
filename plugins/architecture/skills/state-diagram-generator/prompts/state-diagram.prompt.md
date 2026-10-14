---
name: state-diagram
description: Prompt for generating a Mermaid state machine diagram for an entity lifecycle or protocol.
---

# State Diagram Prompt

## Pre-Draft Checklist

Confirm the following before generating the diagram:

1. What is the entity or protocol being modelled? (e.g., `Order`, `PaymentTransaction`, `CircuitBreaker`)
2. What are all the possible states?
3. What events or commands trigger each transition?
4. Are there guard conditions on any transitions? (e.g., `[retries exhausted]`)
5. Are there entry, exit, or transition actions that are architecturally relevant?
6. Are there composite or concurrent sub-states?
7. What is the initial state? Are there one or more terminal states?

## Mermaid Template

```mermaid
stateDiagram-v2
  %% State machine: {Entity / Protocol Name}
  [*] --> {InitialState}

  {InitialState} --> {NextState}: {event}
  {NextState} --> {HappyState}: {event} [{guard}] / {action}
  {NextState} --> {FailState}: {errorEvent}

  state {CompositeState} {
    [*] --> {SubState1}
    {SubState1} --> {SubState2}: {event}
    {SubState2} --> [*]
  }

  {HappyState} --> [*]
  {FailState} --> {InitialState}: {recoveryEvent}
```

## Guidance

- Add actions after a `/` only when they are architecturally significant (e.g., `/ emitEvent`, `/ notifyObserver`).
- Use composite states (`state Name { }`) for nested lifecycles rather than duplicating transitions.

## Output Requirements

- One `stateDiagram-v2` fenced `mermaid` code block with a `%% State machine:` comment header.
- Initial (`[*]`) and terminal states explicit.
- All transitions labelled; guards and actions added where relevant.
- Domain language used for all state and event names.
- Composite states used for nested lifecycles.

The summary, links, assumptions, and SVG follow [diagram-output.md](../../../resources/diagram-output.md).
