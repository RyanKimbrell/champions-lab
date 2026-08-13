import type { TeamMember } from "./team";
import type { PokemonTransformation } from "./transformation";

export function getAvailableTransformations(
    member: TeamMember,
    transformations: PokemonTransformation[],
): PokemonTransformation[] {
    return transformations.filter((transformation) => {
        if (transformation.fromPokemonId !== member.pokemonId) {
            return false
        }

        if (
            transformation.requiredItemId &&
            transformation.requiredItemId !== member.heldItemId
        ) {
            return false
        }

        return true
    })
}