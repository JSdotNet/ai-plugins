---
name: ddd-diagram
description: Mermaid diagram conventions for DDD domain design artifacts.
---

# DDD Diagram Instructions

The one diagram contract for this plugin: every diagram skill reads it, and none restates it.
Over the 60-line budget by design: it holds the conventions for six diagram types, each with
the example that fixes its syntax.

## General Rules

- Keep diagrams focused: one diagram per concept or process.
- Use domain language (ubiquitous language) for all node and participant labels.
- Use subgraph labels and annotations, not hard-coded hex colours, so diagrams render in light and dark themes. **Exception:** aggregate class diagrams and context map diagrams use the palettes below. Colour goes on nodes and classes only, never on lines or edges, and always adds to a text annotation or label rather than replacing it.
- Optionally add `click NodeId "tooltip text"` to `flowchart`/`classDiagram`/`stateDiagram`/`sequenceDiagram` nodes to surface extra detail in interactive Mermaid viewers without changing the diagram's visual layout.

## Aggregate Class Diagram Conventions (`classDiagram`)

Use `classDiagram` for visualising tactical models within a bounded context.

### Annotations

- Aggregate roots: `<<AggregateRoot>>`
- Entities: `<<Entity>>`
- Value objects: `<<ValueObject>>`
- Domain events: `<<DomainEvent>>`

### Relationships

| Relationship | Syntax | Use for |
|---|---|---|
| Composition | `AggregateRoot *-- Entity` | Entity owned and contained by aggregate |
| Composition | `AggregateRoot *-- ValueObject` | Value object owned by aggregate |
| Reference by ID | `AggregateRoot ..> OtherRoot : uses id` | Cross-aggregate reference (by ID only) |
| Raises | `AggregateRoot ..> DomainEvent : raises` | Domain event emitted by aggregate |

### Color Conventions

Colour each class by its stereotype using a `style <ClassName> fill:...,stroke:...,color:...` line per class, in addition to (never instead of) the `<<...>>` annotation. Use `style`, not `classDef`/`:::` — Mermaid's `classDiagram` renderer does not apply `classDef`-based styling to class nodes (verified: it renders the theme default fill regardless of any `:::styleClass` suffix). Colour is applied to class boxes only — never to relationship lines.

| Stereotype | Fill | Border | Font |
| --- | --- | --- | --- |
| `<<AggregateRoot>>` | `#1168BD` | `#0B4884` | `#FFFFFF` |
| `<<Entity>>` | `#85BBF0` | `#5D82A8` | `#000000` |
| `<<ValueObject>>` | `#27AE60` | `#1E8449` | `#FFFFFF` |
| `<<DomainEvent>>` | `#E67E22` | `#B9670F` | `#FFFFFF` |

### Example

```mermaid
classDiagram
    class Order {
        <<AggregateRoot>>
        +OrderId id
        +place()
        +cancel()
    }
    class OrderLine {
        <<Entity>>
        +ProductId productId
        +Quantity quantity
    }
    class Money {
        <<ValueObject>>
        +decimal amount
        +string currency
    }
    class OrderPlaced {
        <<DomainEvent>>
        +OrderId orderId
    }
    Order *-- OrderLine
    Order *-- Money
    Order ..> OrderPlaced : raises
    Order ..> Product : uses id

    style Order fill:#1168BD,stroke:#0B4884,color:#FFFFFF
    style OrderLine fill:#85BBF0,stroke:#5D82A8,color:#000000
    style Money fill:#27AE60,stroke:#1E8449,color:#FFFFFF
    style OrderPlaced fill:#E67E22,stroke:#B9670F,color:#FFFFFF
```

## Event Flow Diagram Conventions (`sequenceDiagram`)

Use `sequenceDiagram` for visualising the command-event-policy chain in a business process.

### Participant Naming

- Actors: short role names (`Customer`, `System`, `Scheduler`).
- Aggregates: `ContextName::AggregateName` format (e.g., `Orders::Order`).
- Policies: suffix with `Policy` (e.g., `ReservationPolicy`).

### Arrow Styles

| Arrow | Use for |
|---|---|
| `->>` | Command (synchronous request) |
| `-->>` | Domain event (asynchronous notification) |
| `--)` | Fire-and-forget policy trigger |

### Bounded Context Boundaries

Use `Note over Participant: [ContextName]` to mark where a bounded context begins in the flow.

### Example

```mermaid
sequenceDiagram
    participant Customer
    participant Orders::Order
    participant ReservationPolicy
    participant Inventory::Stock

    Note over Orders::Order: Orders Context
    Customer->>Orders::Order: PlaceOrder
    Orders::Order-->>ReservationPolicy: OrderPlaced

    Note over Inventory::Stock: Inventory Context
    ReservationPolicy->>Inventory::Stock: ReserveStock
    Inventory::Stock-->>Customer: StockReserved
```

## Subdomain Landscape Diagram Conventions (`flowchart`)

Use `flowchart TD` for the subdomain landscape view.

### Subgraph Structure

Group bounded contexts by subdomain type using named subgraphs:

```mermaid
flowchart TD
    subgraph Core["🎯 Core"]
        A[Order Management]
        B[Pricing]
    end
    subgraph Supporting["🔧 Supporting"]
        C[Notifications]
        D[Reporting]
    end
    subgraph Generic["📦 Generic"]
        E[Identity and Access]
        F[Payment Gateway]
    end
    A --> C
    B --> A
```

Edges carry direction only. The relationship pattern (`Customer-Supplier`, `Published Language`)
is labelled on the context map, never on the landscape.

### Node Shapes

- Bounded contexts: rectangle `[ContextName]`.
- External systems: stadium shape `([SystemName])`.

## Context Interaction Diagram Conventions (`flowchart LR`)

Use `flowchart LR` for two diagram types produced by the `domain-interaction-diagram` skill.

### Domain Interaction Overview

Show all bounded contexts and the mechanisms that connect them in a single overview diagram.

#### Node Shapes

| Shape | Syntax | Represents |
|---|---|---|
| Rectangle | `[ContextName]` | Bounded context |
| Hexagon | `{ACL: TranslatorName}` | Anti-corruption layer translator |
| Stadium | `([SystemName])` | External system |

#### Edge Labels

Edge labels must include two parts separated by a slash: the mechanism name and the communication pattern abbreviation.

- Communication pattern abbreviations: `sync`, `async`, `event`.
- Example: `OrderPlaced / event` or `GetCustomer / sync`.

#### Example

```mermaid
flowchart LR
    Orders[Order Management]
    Inventory[Inventory]
    Payment([Payment Gateway])
    ACL{ACL: Payment Translator}

    Orders -->|OrderPlaced / event| Inventory
    Orders -->|InitiatePayment / sync| ACL
    ACL -->|ChargeRequest / sync| Payment
    Payment -->|PaymentConfirmed / async| ACL
    ACL -->|PaymentProcessed / async| Orders
```

### ACL Translation Diagram

Show how a single upstream concept is translated to the downstream model by the ACL.

Use three nodes in a left-to-right chain: upstream context → ACL translator → downstream context. Label each edge with the term used on that side of the boundary.

#### Example

```mermaid
flowchart LR
    Upstream[Payment Gateway]
    ACL{ACL: Payment Translator}
    Downstream[Order Management]

    Upstream -->|"ChargeResult { status, transactionId }"| ACL
    ACL -->|"PaymentOutcome { outcome, reference }"| Downstream
```

## Context Map Diagram Conventions (`flowchart LR`)

Label every edge with its relationship pattern from `strategic-design.md`, as text only. Colour
each bounded context node by its deployment type, classified per `strategic-design.md`: define
both classes once per diagram with `classDef`, then assign each node with
`class <nodeId> service` or `class <nodeId> module`. (`classDef` works on `flowchart` nodes; it
is `classDiagram` that ignores it.)

| Deployment Type | Fill | Border | Font |
| --- | --- | --- | --- |
| Service | `#1168BD` | `#0B4884` | `#FFFFFF` |
| Module | `#85BBF0` | `#5D82A8` | `#000000` |

```mermaid
flowchart LR
    classDef service fill:#1168BD,stroke:#0B4884,color:#FFFFFF
    classDef module fill:#85BBF0,stroke:#5D82A8,color:#000000

    A[Order Management] -->|Customer-Supplier| B[Inventory]
    A -->|Anti-Corruption Layer| C[Payment Gateway]
    B -->|Published Language| D[Warehouse]

    class A,C service
    class B,D module
```

## Landing and SVG

Embed each diagram in a fenced `mermaid` block in the domain file its skill names — never a
standalone diagram file. Then run [generate-diagram-svgs.ps1](../scripts/generate-diagram-svgs.ps1)
with `-Path <directory of that file>`; it writes `diagrams/<file>-<heading-slug>.svg` beside
every Markdown file under that path that holds a `mermaid` block.

- A `Failed:` line means Mermaid rejected the diagram: fix the fence and run it again.
- When PowerShell (`pwsh`, or `powershell` on Windows) or the Mermaid CLI `mmdc` is missing,
  skip the SVG. The fence is the deliverable; say in the report that no SVG was generated and
  that `npm install -g @mermaid-js/mermaid-cli` enables it.
