---
name: arc42-section-06
description: What arc42 section 6, Runtime View, holds — the few architecturally significant scenarios, their failure paths, and their diagrams — its inputs, and its output template.
---

# arc42 Section 6: Runtime View

Section 6 shows how the building blocks of 5 cooperate at runtime, scenario by scenario.

## Rules

- Pick one to five architecturally significant scenarios; leave the trivial CRUD paths out.
- Cover the normal paths and the failure paths, with the error handling shown; include at
  least one failure scenario.
- Show the sequence of interactions step by step, and the data exchanged.
- Use the building blocks named in Section 5, at their level of abstraction.
- Draw each scenario as a sequence diagram (`sequence-diagram-generator`) and a lifecycle as a
  state diagram (`state-diagram-generator`); keep each one readable.
- Lean: numbered steps naming the participating blocks, and the error handling in one line.

## Inputs

The system, its three to five key scenarios, the participating building blocks, the data
exchanged, and the failures worth documenting.

## Output

```markdown
# 6. Runtime View

<Which scenarios are documented and why these.>

## <Scenario name>

<Brief description of what happens.>

<sequenceDiagram Mermaid fence>

1. **<Actor>** → **<Block A>**: <action> — data: <what is sent>
2. **<Block A>** → **<Block B>**: <action> — processing: <what A does>

### Error Handling

- **<Error>** — condition: <trigger>; handling: <response>; recovery: <how it recovers>.

### Quality Aspects

<Response time, security checks, and fallbacks this scenario must meet, linked to section 10.>
```

Repeat the scenario block per scenario. Drop the step list where the diagram already says it.

## Relationship to other sections

The participants are the blocks of 5; a scenario that tests a quality goal links its scenario
in 10; a scenario crossing one block only belongs in that block's file under
`building-blocks/` where the repository has one.
