import type { SourceRecord } from "./source";

export interface TeamMember {
    pokemonId: string
    heldItemId: string | null
    initialAbilityId: string
    moveIds?: string[]
}

export interface Team {
    id:string
    members: TeamMember[]
    source: SourceRecord
}