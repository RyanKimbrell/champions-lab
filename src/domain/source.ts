export type SourceType = 
    | 'tournament'
    | 'ranked'
    | 'manual' 
    | 'community'


export interface SourceRecord {
    type: SourceType
    name: string
    url?: string
    externalId?: string
    retrievedAt?: string
}