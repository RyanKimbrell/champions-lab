import type { Team } from "../domain/team";

export function countTeamsWithPokemon(
    teams: Team[],
    pokemonId: string,
): number {
    return teams.filter((team) =>
        team.members.some(
            (member) => member.pokemonId === pokemonId
        ),
    ).length
}

export function countTeamsWithPair(
    teams: Team[],
    firstPokemonId: string,
    secondPokemonId: string,
): number {
    return teams.filter((team) => {
        const hasFirstPokemon = team.members.some(
            (member) =>
                member.pokemonId === firstPokemonId,
        )

        const hasSecondPokemon = team.members.some(
            (member) =>
                member.pokemonId === secondPokemonId,
        )

        return hasFirstPokemon && hasSecondPokemon
    }).length
}

export function calculatePokemonUsage(
    teams: Team[],
    pokemonId: string,
): number | null {
    if (teams.length === 0) {
        return null
    }

    return (
        countTeamsWithPokemon(teams, pokemonId) / teams.length
    )
}

export function calculatePairSupport(
    teams: Team[],
    firstPokemonId: string,
    secondPokemonId:string,
): number | null {
    if(teams.length === 0) {
        return null
    }

    return (
        countTeamsWithPair(
            teams,
            firstPokemonId,
            secondPokemonId,
        ) / teams.length
    )
}

export function calculateConditionalUsage(
    teams: Team[],
    targetPokemonId: string,
    givenPokemonId: string,
): number | null {
    const givenPokemonCount =
        countTeamsWithPokemon(
            teams,
            givenPokemonId,
        )
    if (givenPokemonCount === 0) {
        return null
    }

    return (
        countTeamsWithPair(
            teams,
            targetPokemonId,
            givenPokemonId,
        ) / givenPokemonCount
    )
}

export function calculatePairLift(
    teams: Team[],
    firstPokemonId: string,
    secondPokemonId: string,
): number | null {
    const firstUsage = calculatePokemonUsage(
        teams,
        firstPokemonId,
    )

    const secondUsage = calculatePokemonUsage(
        teams,
        secondPokemonId,
    )

    const pairSupport = calculatePairSupport(
        teams,
        firstPokemonId,
        secondPokemonId,
    )

    if (
        firstUsage === null ||
        secondUsage === null ||
        pairSupport === null ||
        firstUsage === 0 ||
        secondUsage === 0
    ) {
        return null
    }

    return (
        pairSupport / 
        (firstUsage * secondUsage)
    )
}

export interface PokemonPartnerAnalysis {
    pokemonId: string
    pairCount: number
    support: number
    conditionalUsage: number
    lift:number
}

function getUniquePokemonIds(
    teams: Team[],
): string[] {
    const pokemonIds = new Set<string>()

    for (const team of teams) {
        for (const member of team.members) {
            pokemonIds.add(member.pokemonId)
        }
    }

    return [...pokemonIds]
}

export function analyzePokemonPartners(
    teams: Team[],
    focalPokemonId: string,
): PokemonPartnerAnalysis[] {
    const focalPokemonCount =
        countTeamsWithPokemon(
            teams,
            focalPokemonId,
        )
    if (
        teams.length === 0 ||
        focalPokemonCount === 0
    ) {
        return []
    }

    const candidatePokemonIds = 
        getUniquePokemonIds(teams)
            .filter(
                (pokemonId) =>
                    pokemonId !== focalPokemonId,
            )

    return candidatePokemonIds
        .map((pokemonId) => {
            const pairCount = countTeamsWithPair(
                teams,
                focalPokemonId,
                pokemonId,
            )

            const support = calculatePairSupport(
                teams,
                focalPokemonId,
                pokemonId,
            )

            const conditionalUsage = calculateConditionalUsage(
                teams,
                pokemonId,
                focalPokemonId
            )

            const lift = calculatePairLift(
                teams,
                focalPokemonId,
                pokemonId,
            )

            if (
                pairCount === 0 ||
                support === null ||
                conditionalUsage === null ||
                lift === null
            ) {
                return null
            }

            return {
                pokemonId,
                pairCount,
                support,
                conditionalUsage,
                lift,
            }
        })
        .filter(
            (
                analysis,
            ): analysis is PokemonPartnerAnalysis =>
                analysis !== null,
        )
        .sort((a, b) => {
            if (b.pairCount !== a.pairCount) {
                return b.pairCount - a.pairCount
            }

            return b.lift - a.lift
        })
}