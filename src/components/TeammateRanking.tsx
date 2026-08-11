import { getAssetUrl } from '../api/champions'
import type { BattleRow } from '../types/battleData'
import type { PokemonSearchOption } from '../types/pokemon'

interface TeammateRankingItem {
    row: BattleRow
    pokemon:PokemonSearchOption | undefined
}

interface TeammateRankingProps {
    items: TeammateRankingItem[]
    onSelect: (pokemon: PokemonSearchOption) => void
}

function TeammateRanking({
    items,
    onSelect,
}: TeammateRankingProps) {
    return (
        <section className='teammate-ranking'>
            <h3>Common Teammates</h3>

            <ol className='teammate-list'>
                {items.map(({ row, pokemon }) => (
                    <li key={row.name}>
                        {pokemon ? (
                            <button
                                type='button'
                                className='teammate-card teammate-card-button'
                                onClick={() => onSelect(pokemon)}
                            >
                                <span className='teammate-rank'>
                                    #{row.rank}
                                </span>

                                <img
                                    src={getAssetUrl(pokemon.sprite)}
                                    alt=""
                                    width="72"
                                    height="72"
                                />

                                <strong>{row.name}</strong>

                                <span className='teammate-types'>
                                    {pokemon.types.join(' / ')}
                                </span>
                            </button>
                        ) : (
                            <div className='teammate-card'>
                                <span className='teammate-rank'>
                                    #{row.rank}
                                </span>

                                <strong>{row.name}</strong>
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </section>
    )
}

export default TeammateRanking