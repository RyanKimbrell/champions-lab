# Champions Lab — Decision Log

## 2026-08-13 — Pivot from ranked-data visualization to metagame intelligence

### Decision

Champions Lab will no longer be designed primarily around the existing Pokémon Champions Battle Data API.

The project will instead focus on competitive metagame structure, team relationships, tournament analysis, and decision-support tools.

### Why

The prototype API proved useful for learning React, TypeScript, D3, API integration, and data visualization, but its update reliability is not sufficient to serve as the long-term foundation of Champions Lab.

The new product direction also provides more opportunity to create original analytical value rather than reproducing common usage-statistics interfaces.

---

## 2026-08-13 — Internal model will be source-independent

### Decision

Champions Lab domain types will describe competitive Pokémon concepts rather than the JSON or HTML structure of any external data provider.

External sources will eventually be handled through adapters.

### Why

This prevents the application from becoming tightly coupled to one provider and allows multiple data sources to feed the same analytics system.

---

## 2026-08-13 — Preserve source provenance

### Decision

Imported competitive records must retain information about their source and collection context.

### Why

Champions Lab should be able to explain where statistics come from and distinguish tournament, ranked, manually entered, and future data sources.

---

## 2026-08-13 — Core Explorer will be the first flagship analytics feature

### Decision

The first new analytical system after the pivot will focus on recurring Pokémon pairs and cores.

### Initial questions

- How frequently do Pokémon A and B occur together?
- How frequently would we expect them to occur together by chance?
- How much more strongly are they associated than expected?
- Which Pokémon commonly complete the core?
- Does the core appear disproportionately on successful teams?
- How does the core change over time?



## 2026-08-13 — Mega Evolution is modeled as a transformation, not a team identity

### Decision

A Pokémon capable of Mega Evolution is represented on a team by its pre-transformation Pokémon identity and held Mega Stone.

For example, an Audino carrying Audinite is represented as Audino with Audinite, not as a separate Mega Audino team member.

Mega forms will be modeled as possible or observed battle transformations.

### Why

Mega Evolution occurs during battle and is not a separately selected team slot. A Pokémon carrying its Mega Stone may also not necessarily Mega Evolve during a particular battle.

This distinction prevents team-structure analytics from incorrectly treating base and Mega states as separate Pokémon while still allowing transformed stats, typing, abilities, and other battle-state information to be modeled when relevant.