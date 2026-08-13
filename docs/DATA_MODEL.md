# Champions Lab — Data Model

This document describes the source-independent competitive domain model used by Champions Lab.

The model will evolve as real tournament data is introduced.

## Core Entities

### TournamentEvent

Represents one competitive event.

Potential fields:

- id
- name
- startDate
- endDate
- format
- regulation
- playerCount
- source

### TournamentEntry

Represents one player's entry in an event.

Potential fields:

- id
- eventId
- playerName
- placement
- record
- team

### Team

Represents one six-Pokémon competitive team.

Potential fields:

- id
- members
- source
- eventContext

### TeamMember

Represents one Pokémon occupying one slot on a team.

Potential fields:

- pokemon
- item
- ability
- moves
- stat configuration
- form

Not every source will provide every field.

### PokemonIdentity

Represents a canonical Pokémon or form.

Potential fields:

- id
- displayName
- species
- form

### Regulation

Represents the rules governing Pokémon eligibility for a competitive period.

Potential fields:

- id
- name
- format
- startDate
- endDate

### SourceRecord

Describes where imported information came from.

Potential fields:

- sourceType
- sourceName
- sourceUrl
- retrievedAt
- externalId

## Important Modeling Rule

Missing information is different from negative information.

For example:

`item: undefined`

should mean:

"The source did not provide this Pokémon's item."

It should not mean:

"This Pokémon had no held item."

## Relationship Structure

A tournament event contains tournament entries.

A tournament entry has one team.

A team contains Pokémon team members.

Each team member refers to a canonical Pokémon identity.

Imported records retain source provenance.

## Analytics Derived From Teams

The normalized model should eventually support calculations such as:

- Pokémon usage
- pair frequency
- three-Pokémon core frequency
- conditional usage
- association lift
- archetype clustering
- placement-weighted representation
- top-cut representation
- core evolution over time