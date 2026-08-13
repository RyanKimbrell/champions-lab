import { describe, expect, it } from 'vitest'
import { coreAnalysisFixture } from '../fixtures/coreAnalysisFixture'
import {
  calculateConditionalUsage,
  calculatePairLift,
  calculatePairSupport,
  calculatePokemonUsage,
  countTeamsWithPair,
  countTeamsWithPokemon,
} from './coreAnalysis'

const teams = coreAnalysisFixture.teams

describe('core analysis', () => {
    describe('countTeamsWithPokemon', () => {
        it('counts teams containing Garchomp', () => {
            expect(
            countTeamsWithPokemon(teams, 'garchomp'),
            ).toBe(5)
        })

        it('counts teams containing Sinistcha', () => {
            expect(
            countTeamsWithPokemon(teams, 'sinistcha'),
            ).toBe(5)
        })
    })

    describe('countTeamsWithPair', () => {
        it('counts teams containing Garchomp and Sinistcha', () => {
            expect(
                countTeamsWithPair(
                    teams,
                    'garchomp',
                    'sinistcha',
                ),
            ).toBe(3)
        })

        it('does not depend on Pokémon argument order', () => {
            expect(
                countTeamsWithPair(
                teams,
                'sinistcha',
                'garchomp',
                ),
            ).toBe(3)
        })
    })

    describe('calculatePokemonUsage', () => {
        it('calculates Garchomp usage', () => {
            expect(
                calculatePokemonUsage(
                    teams,
                    'garchomp',
                ),
            ).toBeCloseTo(0.5)
        })
    })

    describe('calculatePairSupport', () => {
        it('calculates Garchomp and Sinistcha support', () => {
            expect(
                calculatePairSupport(
                    teams,
                    'garchomp',
                    'sinistcha',
                ),
            ).toBeCloseTo(0.3)
        })
    })

    describe('calculateConditionalUsage', () => {
        it('calculates Sinistcha usage given Garchomp', () => {
            expect(
                calculateConditionalUsage(
                    teams,
                    'sinistcha',
                    'garchomp',
                ),
            ).toBeCloseTo(0.6)
        })
    })

    describe('calculatePairLift', () => {
        it('calculates Garchomp and Sinistcha lift', () => {
            expect(
                calculatePairLift(
                    teams,
                    'garchomp',
                    'sinistcha',
                ),
            ).toBeCloseTo(1.2)
        })

        it('does not depend on Pokémon argument order', () => {
            expect(
                calculatePairLift(
                    teams,
                    'sinistcha',
                    'garchomp',
                ),
            ).toBeCloseTo(1.2)
        })
    })

    describe('insufficient data', () => {
        it('returns null for usage when there are no teams', () => {
            expect(
                calculatePokemonUsage(
                    [],
                    'garchomp',
                ),
            ).toBeNull()
        })

        it('returns null for conditional usage when the given Pokémon never appears', () => {
            expect(
                calculateConditionalUsage(
                    teams,
                    'garchomp',
                    'missing-pokemon',
                ),
            ).toBeNull()
        })

        it('returns null for lift when a Pokémon never appears', () => {
            expect(
                calculatePairLift(
                    teams,
                    'garchomp',
                    'missing-pokemon',
                ),
            ).toBeNull()
        })
    })
})