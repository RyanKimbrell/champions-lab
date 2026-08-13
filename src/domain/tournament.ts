import type { SourceRecord } from "./source";

export type TournamentFormat = 
    | 'singles'
    | 'doubles'

export interface TournamentEvent {
    id: string
    name: string

    startDate: string
    endDate?: string

    format: TournamentFormat
    regulationId?: string

    playerCount?: number
    topCutSize?: number

    source: SourceRecord
}

export interface TournamentRecord {
    wins: number
    losses: number
    ties?: number
}

export interface TournamentEntry {
    id: string
    eventId: string

    playerName?: string

    placement?: number
    record?: TournamentRecord

    teamId?: string

    source:SourceRecord
}