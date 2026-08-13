import type { ChampionsDataset } from '../domain/dataset'
import type { PokemonIdentity } from '../domain/pokemon'
import type { SourceRecord } from '../domain/source'
import type { Team } from '../domain/team'

const fixtureSource: SourceRecord = {
  type: 'manual',
  name: 'Champions Lab core-analysis fixture',
}

function basePokemon(
  id: string,
  displayName: string,
): PokemonIdentity {
  return {
    id,
    displayName,
    baseSpecies: displayName,
    formKind: 'base',
  }
}

function makeTeam(
  id: string,
  pokemonIds: string[],
): Team {
  return {
    id,
    source: fixtureSource,
    members: pokemonIds.map((pokemonId) => ({
      pokemonId,
    })),
  }
}

const pokemon: PokemonIdentity[] = [
  basePokemon('garchomp', 'Garchomp'),
  basePokemon('sinistcha', 'Sinistcha'),
  basePokemon('incineroar', 'Incineroar'),
  basePokemon('whimsicott', 'Whimsicott'),
  basePokemon('kingambit', 'Kingambit'),
  basePokemon('primarina', 'Primarina'),
  basePokemon('farigiraf', 'Farigiraf'),
  basePokemon('raichu', 'Raichu'),
  basePokemon('corviknight', 'Corviknight'),
  basePokemon('milotic', 'Milotic'),
  basePokemon('aegislash', 'Aegislash'),
  basePokemon('talonflame', 'Talonflame'),

  {
    id: 'basculegion-male',
    displayName: 'Basculegion (Male)',
    baseSpecies: 'Basculegion',
    form: 'Male',
    formKind: 'gender',
  },
]

const teams: Team[] = [
  makeTeam('fixture-team-01', [
    'garchomp',
    'sinistcha',
    'incineroar',
    'whimsicott',
    'kingambit',
    'primarina',
  ]),

  makeTeam('fixture-team-02', [
    'garchomp',
    'sinistcha',
    'incineroar',
    'farigiraf',
    'kingambit',
    'basculegion-male',
  ]),

  makeTeam('fixture-team-03', [
    'garchomp',
    'sinistcha',
    'incineroar',
    'whimsicott',
    'raichu',
    'primarina',
  ]),

  makeTeam('fixture-team-04', [
    'garchomp',
    'raichu',
    'incineroar',
    'corviknight',
    'primarina',
    'kingambit',
  ]),

  makeTeam('fixture-team-05', [
    'garchomp',
    'raichu',
    'whimsicott',
    'talonflame',
    'milotic',
    'aegislash',
  ]),

  makeTeam('fixture-team-06', [
    'sinistcha',
    'kingambit',
    'incineroar',
    'basculegion-male',
    'farigiraf',
    'primarina',
  ]),

  makeTeam('fixture-team-07', [
    'sinistcha',
    'kingambit',
    'incineroar',
    'farigiraf',
    'milotic',
    'corviknight',
  ]),

  makeTeam('fixture-team-08', [
    'incineroar',
    'whimsicott',
    'primarina',
    'corviknight',
    'milotic',
    'aegislash',
  ]),

  makeTeam('fixture-team-09', [
    'incineroar',
    'kingambit',
    'talonflame',
    'basculegion-male',
    'primarina',
    'aegislash',
  ]),

  makeTeam('fixture-team-10', [
    'raichu',
    'whimsicott',
    'corviknight',
    'milotic',
    'basculegion-male',
    'talonflame',
  ]),
]

const fixtureEventId = 'fixture-event-01'

const events = [
  {
    id: fixtureEventId,
    name: 'Champions Lab Fixture Invitational',
    startDate: '2026-08-01',
    format: 'doubles' as const,
    regulationId: 'fixture-regulation',
    playerCount: 10,
    topCutSize: 4,
    source: fixtureSource,
  },
]

const entries = [
  {
    id: 'fixture-entry-01',
    eventId: fixtureEventId,
    playerName: 'Player 1',
    placement: 1,
    teamId: 'fixture-team-01',
    source: fixtureSource,
  },
  {
    id: 'fixture-entry-02',
    eventId: fixtureEventId,
    playerName: 'Player 2',
    placement: 4,
    teamId: 'fixture-team-02',
    source: fixtureSource,
  },
  {
    id: 'fixture-entry-03',
    eventId: fixtureEventId,
    playerName: 'Player 3',
    placement: 8,
    teamId: 'fixture-team-03',
    source: fixtureSource,
  },
  {
    id: 'fixture-entry-04',
    eventId: fixtureEventId,
    playerName: 'Player 4',
    placement: 2,
    teamId: 'fixture-team-04',
    source: fixtureSource,
  },
  {
    id: 'fixture-entry-05',
    eventId: fixtureEventId,
    playerName: 'Player 5',
    placement: 10,
    teamId: 'fixture-team-05',
    source: fixtureSource,
  },
  {
    id: 'fixture-entry-06',
    eventId: fixtureEventId,
    playerName: 'Player 6',
    placement: 3,
    teamId: 'fixture-team-06',
    source: fixtureSource,
  },
  {
    id: 'fixture-entry-07',
    eventId: fixtureEventId,
    playerName: 'Player 7',
    placement: 7,
    teamId: 'fixture-team-07',
    source: fixtureSource,
  },
  {
    id: 'fixture-entry-08',
    eventId: fixtureEventId,
    playerName: 'Player 8',
    placement: 5,
    teamId: 'fixture-team-08',
    source: fixtureSource,
  },
  {
    id: 'fixture-entry-09',
    eventId: fixtureEventId,
    playerName: 'Player 9',
    placement: 6,
    teamId: 'fixture-team-09',
    source: fixtureSource,
  },
  {
    id: 'fixture-entry-10',
    eventId: fixtureEventId,
    playerName: 'Player 10',
    placement: 9,
    teamId: 'fixture-team-10',
    source: fixtureSource,
  },
]

export const coreAnalysisFixture: ChampionsDataset = {
  pokemon,
  transformations: [],
  events,
  entries,
  teams,
}