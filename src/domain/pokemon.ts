export type PokemonFormKind =
    | 'base'
    | 'regional'
    | 'gender'
    | 'alternate'

export interface PokemonIdentity {
    id: string
    displayName: string
    baseSpecies: string
    form?: string
    formKind: PokemonFormKind
}