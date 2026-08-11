import { getAssetUrl } from '../api/champions'
import type { BattleRow } from '../types/battleData'
import type { PokemonSearchOption } from '../types/pokemon'

interface TeammateRankingItem {
    row: BattleRow
    pokemon:PokemonSearchOption | undefined
}

interface TeammateRankingProps {
    items: TeammateRankingItem[]
}

function TeammateRanking({
    items,
}: TeammateRankingProps) {
    return (
        <section className='teammate-ranking'>
            <h3>Common Teammates</h3>

            <ol className='teammate-list'>
                {items.map(({ row, pokemon }) => (
                    <li
                        className='teammate-card'
                        key={row.name}
                    >
                        <span className='teammate-rank'>
                            #{row.rank}
                        </span>

                        {pokemon && (
                            <img
                                src={getAssetUrl(pokemon.sprite)}
                                alt=""
                                width="72"
                                height="72"
                            />
                        )}

                        <strong>{row.name}</strong>

                        {pokemon && (
                            <span className='teammate-types'>
                                {pokemon.types.join(' / ')}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </section>
    )
}

export default TeammateRanking