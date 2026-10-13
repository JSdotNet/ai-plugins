---
name: c4-level4-code
description: Prompt for generating a C4 Level 4 Code diagram using Mermaid class diagram notation.
---

# C4 Level 4 — Code Diagram Prompt

## When to Use

Use Level 4 only when the class structure is architecturally significant or non-obvious. Good candidates include:

- A component that applies a non-trivial design pattern (Strategy, Specification, Chain of Responsibility, etc.)
- A core domain model with important invariants and aggregation rules
- An adapter or anti-corruption layer with complex mapping logic

Do not use Level 4 for straightforward CRUD components or simple service classes.

## Pre-Draft Checklist

Confirm the following before generating the diagram:

1. Which component is being zoomed into?
2. What are the key classes or interfaces that define the component's structure?
3. What inheritance, composition, or dependency relationships exist between them?
4. Which design patterns are applied? (e.g., Repository, Strategy, Factory, Specification)
5. What are the primary public responsibilities of each class?
6. Are there any important invariants or constraints enforced at this level?

## Mermaid Template

```mermaid
classDiagram
  class {InterfaceName} {
    <<interface>>
    +{method}({param}: {type}): {returnType}
  }

  class {AbstractClass} {
    <<abstract>>
    #{field}: {type}
    +{method}(): {returnType}
  }

  class {ConcreteClass} {
    -{field}: {type}
    +{method}({param}: {type}): {returnType}
  }

  {InterfaceName} <|.. {ConcreteClass} : implements
  {AbstractClass} <|-- {ConcreteClass} : extends
  {ConcreteClass} --> {DependencyClass} : uses
  {ConcreteClass} *-- {ValueObject} : owns
```

## Guidance

- Use Mermaid `classDiagram` notation; do not use `C4Dynamic` for Level 4 code diagrams.
- Show key public and protected members only; omit private implementation details unless they are architecturally relevant.
- Use stereotypes to label relationships: `implements`, `extends`, `uses`, `creates`, `owns`.
- Prefer composition (`*--`) and aggregation (`o--`) indicators over generic dependency arrows where the relationship type is clear.
- Do not attempt to show every class in the codebase; limit to 5–10 classes that form the core structural pattern.
- Add a `<<interface>>` or `<<abstract>>` classifier where applicable.

## Output Requirements

- One `classDiagram` fenced `mermaid` code block.
- Key public members shown for each class or interface.
- All relationships labelled with a stereotype or verb phrase.

The summary, links, assumptions, and SVG follow [diagram-output.md](../../../resources/diagram-output.md).
