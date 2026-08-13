# Champions Lab — Project Brief

## Mission

Champions Lab is a competitive Pokémon Champions analytics platform designed to help players understand how the metagame is structured, how it changes over time, and how individual Pokémon fit into successful teams.

The project should go beyond displaying raw usage statistics. Its purpose is to derive useful, explainable information from competitive data and present it through interactive analysis and visualization.

## Primary Users

### Developing players

Players learning competitive team building who want help understanding:

- what roles Pokémon commonly fill
- which Pokémon work well together
- how common cores function
- what a team may be missing
- how the current metagame is structured

### Advanced and tournament players

Players who want deeper tools for investigating:

- pair and core relationships
- conditional usage
- association strength
- tournament representation
- successful team structures
- archetype evolution
- metagame changes over time
- differences between ladder and tournament play

## Product Principles

### Analysis over aggregation

Raw usage data is an input, not the final product.

Champions Lab should derive information that helps answer competitive questions.

### Explainability

The product should clearly distinguish between:

- observed data
- mathematically derived statistics
- inferred strategic conclusions

Inferences should expose the evidence used to reach them.

### Data provenance

Every dataset should retain information about where it came from, when it was collected, and what it represents.

### Source independence

The internal Champions Lab data model should describe competitive Pokémon concepts rather than mirror the structure of any particular website or API.

External sources should be translated into the Champions Lab model through adapters.

## Initial Flagship Feature

### Core Explorer

Core Explorer will analyze how Pokémon appear together on tournament teams.

Initial metrics may include:

- frequency
- conditional usage
- support
- lift
- common third Pokémon
- core variants
- tournament representation
- top-cut representation
- changes over time

## Future Major Features

- Role Profiler
- Metagame archetype discovery
- Core evolution
- Tournament vs ladder analysis
- Team-building decision support
- Personal matchup analytics
- Independently collected ranked battle data

## Current Status

The first phase of Champions Lab was a ranked-data visualization prototype built with React, TypeScript, and D3.

That prototype is preserved in Git as:

`ranked-prototype-v0.1`

The project is now pivoting toward independently modeled competitive analytics.