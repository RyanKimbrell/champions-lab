import type { ChampionsDataset } from '../domain/dataset'
import type { Team } from '../domain/team'
import type { TournamentEntry } from '../domain/tournament'
import { countTeamsWithAllPokemon } from './coreAnalysis'

function resolveKnownTeams(
    entries: TournamentEntry[],
    teamLookup: Map<string, Team>,
): Team[] {
    return entries.flatMap((entry) => {
        if (!entry.teamId) {
            return[]
        }

        const team = teamLookup.get(entry.teamId)

        return team ? [team] : []
    })
}

export function getKnownTeamsForEvent(
    dataset: ChampionsDataset,
    eventId: string,
): Team[] {
    const eventEntries = dataset.entries.filter(
        (entry) => entry.eventId === eventId,
    )

    const teamLookup = new Map(
        dataset.teams.map((team) => [
            team.id,
            team,
        ]),
    )

    return resolveKnownTeams(
        eventEntries,
        teamLookup,
    )
}

export function getKnownTopCutTeamsForEvent(
    dataset: ChampionsDataset,
    eventId: string,
): Team[] | null {
    const event = dataset.events.find(
        (event) => event.id === eventId,
    )

    if (
        !event ||
        event.topCutSize === undefined
    ) {
        return null
    }

    const topCutEntries = dataset.entries.filter(
        (entry) =>
            entry.eventId === eventId &&
            entry.placement !== undefined &&
            entry.placement <= event.topCutSize!,
    )

    const teamLookup = new Map(
        dataset.teams.map((team) => [
            team.id,
            team
        ]),
    )

    return resolveKnownTeams(
        topCutEntries,
        teamLookup,
    )
}

export interface CoreTournamentPerformance {
    eventId: string
    
    knownTeamCount: number
    coreTeamCount: number
    fieldSupport: number | null

    knownTopCutTeamCount: number |null
    topCutCoreTeamCount: number | null
    topCutSupport: number | null

    topCutDifferential: number | null
    topCutRepresentationRatio: number | null
}

export function analyzeCoreTournamentPerformance(
    dataset: ChampionsDataset,
    eventId: string,
    corePokemonIds: string[],
): CoreTournamentPerformance | null {
    const event = dataset.events.find(
        (event) => event.id === eventId,
    )

    if (!event) {
        return null
    }

    const fieldTeams = getKnownTeamsForEvent(
        dataset,
        eventId,
    )

    const coreTeamCount = countTeamsWithAllPokemon(
        fieldTeams,
        corePokemonIds,
    )

    const fieldSupport = 
        fieldTeams.length > 0
            ? coreTeamCount / fieldTeams.length
            : null

    const topCutTeams =
        getKnownTopCutTeamsForEvent(
            dataset,
            eventId
        )

    if (topCutTeams === null) {
        return {
            eventId,
            knownTeamCount: fieldTeams.length,
            coreTeamCount,
            fieldSupport,

            knownTopCutTeamCount: null,
            topCutCoreTeamCount: null,
            topCutSupport: null,

            topCutDifferential: null,
            topCutRepresentationRatio: null
        }
    }

    const topCutCoreTeamCount = 
        countTeamsWithAllPokemon(
            topCutTeams,
            corePokemonIds
        )

    const topCutSupport = 
        topCutTeams.length > 0
            ? topCutCoreTeamCount / topCutTeams.length
            : null

    const topCutDifferential = 
        fieldSupport !== null &&
        topCutSupport !== null
        ? topCutSupport - fieldSupport
        : null

    const topCutRepresentationRatio =
        fieldSupport !== null &&
        fieldSupport > 0 &&
        topCutSupport != null
        ? topCutSupport / fieldSupport
        : null

    return {
        eventId,

        knownTeamCount: fieldTeams.length,
        coreTeamCount,
        fieldSupport,

        knownTopCutTeamCount: topCutTeams.length,
        topCutCoreTeamCount,
        topCutSupport,

        topCutDifferential,
        topCutRepresentationRatio,
    }
}