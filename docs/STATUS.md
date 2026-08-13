# Champions Lab — Current Status

## Current Phase

Tournament analytics foundation.

## Completed

- React + TypeScript + Vite application created
- GitHub repository established
- D3 installed
- Pokémon autocomplete implemented
- ranked battle-data exploration prototype implemented
- move, item, ability, and teammate exploration implemented
- teammate navigation implemented
- historical usage visualization implemented
- multi-series move comparison implemented
- usage-change analysis implemented
- prototype preserved as Git tag `ranked-prototype-v0.1`
- project pivoted toward metagame and team analytics
- project documentation structure created

## Current Architecture

Existing prototype:

`API → data transformation → React state → visualization`

New architecture being developed:

`external sources → adapters → normalized domain model → analytics → visualization`

## Current Product Direction

Champions Lab should answer questions such as:

- Which Pokémon form meaningful competitive cores?
- How surprising is a Pokémon relationship relative to individual usage?
- Which Pokémon commonly complete a core?
- Which team structures are becoming more or less common?
- What role does a Pokémon usually perform?
- Which structures perform disproportionately well in tournaments?
- How does ladder behavior differ from tournament behavior?

## Current Priority

Build and validate a source-independent tournament domain model.

## Immediate Next Step

Create initial TypeScript domain types for:

- source provenance
- tournament events
- tournament entries
- teams
- team members
- Pokémon identities

Then create a tiny hand-written fixture dataset before importing any external tournament source.

## Later

- write automated analytics tests
- implement pair frequency
- implement conditional usage
- implement support
- implement lift
- build Core Explorer MVP
- investigate real tournament ingestion
- investigate independent ranked-data collection