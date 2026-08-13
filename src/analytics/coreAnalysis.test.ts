import { describe, expect, it } from 'vitest'
import { coreAnalysisFixture } from '../fixtures/coreAnalysisFixture'
import {
  calculateConditionalUsage,
  calculatePairLift,
  calculatePairSupport,
  calculatePokemonUsage,
  countTeamsWithPair,
  countTeamsWithPokemon,
  analyzeCoreComplements,
  countTeamsWithAllPokemon
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

    describe('countTeamsWithAllPokemon', () => {
        it('counts teams containing a three-Pokémon core', () => {
            expect(
                countTeamsWithAllPokemon(
                    teams,
                    [
                    'garchomp',
                    'sinistcha',
                    'incineroar',
                    ],
                ),
            ).toBe(3)
        })

        it('ignores duplicate Pokémon IDs in the requested core', () => {
            expect(
                countTeamsWithAllPokemon(
                    teams,
                    [
                    'garchomp',
                    'sinistcha',
                    'garchomp',
                    ],
                ),
            ).toBe(3)
        })
    })

    describe('analyzeCoreComplements', () => {
        it('discovers Incineroar as the most common complement to Garchomp and Sinistcha', () => {
            const complements =
            analyzeCoreComplements(
                teams,
                [
                'garchomp',
                'sinistcha',
                ],
            )

            expect(complements[0]?.pokemonId)
            .toBe('incineroar')

            expect(complements[0]?.teamCount)
            .toBe(3)

            expect(
            complements[0]?.conditionalUsage,
            ).toBeCloseTo(1)

            expect(
            complements[0]?.overallUsage,
            ).toBeCloseTo(0.8)

            expect(complements[0]?.lift)
            .toBeCloseTo(1.25)
        })

        it('finds Whimsicott as a frequent core complement', () => {
            const complements =
            analyzeCoreComplements(
                teams,
                [
                'garchomp',
                'sinistcha',
                ],
            )

            const whimsicott =
            complements.find(
                (complement) =>
                complement.pokemonId ===
                'whimsicott',
            )

            expect(whimsicott).toBeDefined()

            expect(whimsicott?.teamCount)
            .toBe(2)

            expect(
            whimsicott?.conditionalUsage,
            ).toBeCloseTo(2 / 3)

            expect(
            whimsicott?.overallUsage,
            ).toBeCloseTo(0.5)

            expect(whimsicott?.lift)
            .toBeCloseTo(4 / 3)
        })

        it('does not return Pokémon already in the core', () => {
            const complements =
            analyzeCoreComplements(
                teams,
                [
                'garchomp',
                'sinistcha',
                ],
            )

            expect(
                complements.some(
                    (complement) =>
                    complement.pokemonId ===
                        'garchomp' ||
                    complement.pokemonId ===
                        'sinistcha',
                ),
            ).toBe(false)
        })

        it('returns an empty result when the core does not occur', () => {
            expect(
                analyzeCoreComplements(
                    teams,
                    [
                    'garchomp',
                    'missing-pokemon',
                    ],
                ),
            ).toEqual([])
        })
    })
})