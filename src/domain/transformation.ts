export type TransformationKind = 
    | 'mega'

export interface PokemonTransformation {
    id: string
    kind: TransformationKind

    fromPokemonId: string
    transformedName: string

    requiredItemId?: string

    transformedTypes?: string[]
    transformedAbilityId: string

    transformedStats?: {
        hp: number
        attack: number
        defense: number
        specialAttack: number
        specialDefense: number
        speed: number
    }
}