import {
  describe,
  expect,
  it,
} from 'vitest'

import { coreAnalysisFixture } from '../fixtures/coreAnalysisFixture'

import {
  analyzeCoreTournamentPerformance,
  getKnownTeamsForEvent,
  getKnownTopCutTeamsForEvent,
} from './tournamentAnalysis'

const eventId = 'fixture-event-01'

describe('tournament analysis', () => {
  it('finds all known teams for an event', () => {
    expect(
      getKnownTeamsForEvent(
        coreAnalysisFixture,
        eventId,
      ),
    ).toHaveLength(10)
  })

  it('finds known top-cut teams', () => {
    expect(
      getKnownTopCutTeamsForEvent(
        coreAnalysisFixture,
        eventId,
      ),
    ).toHaveLength(4)
  })

  it('analyzes Garchomp and Sinistcha tournament performance', () => {
    const performance =
      analyzeCoreTournamentPerformance(
        coreAnalysisFixture,
        eventId,
        [
          'garchomp',
          'sinistcha',
        ],
      )

    expect(performance).not.toBeNull()

    expect(
      performance?.knownTeamCount,
    ).toBe(10)

    expect(
      performance?.coreTeamCount,
    ).toBe(3)

    expect(
      performance?.fieldSupport,
    ).toBeCloseTo(0.3)

    expect(
      performance?.knownTopCutTeamCount,
    ).toBe(4)

    expect(
      performance?.topCutCoreTeamCount,
    ).toBe(2)

    expect(
      performance?.topCutSupport,
    ).toBeCloseTo(0.5)

    expect(
      performance?.topCutDifferential,
    ).toBeCloseTo(0.2)

    expect(
      performance?.topCutRepresentationRatio,
    ).toBeCloseTo(5 / 3)
  })

  it('returns null for an unknown event', () => {
    expect(
      analyzeCoreTournamentPerformance(
        coreAnalysisFixture,
        'missing-event',
        [
          'garchomp',
          'sinistcha',
        ],
      ),
    ).toBeNull()
  })
})