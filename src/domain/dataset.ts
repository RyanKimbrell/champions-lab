import type { PokemonIdentity } from "./pokemon";
import type { Team } from "./team";
import type { TournamentEntry, TournamentEvent} from './tournament'
import type { PokemonTransformation } from "./transformation";

export interface ChampionsDataset {
    pokemon: PokemonIdentity[]
    transformations: PokemonTransformation[]
    events: TournamentEvent[]
    entries: TournamentEntry[]
    teams: Team[]
}