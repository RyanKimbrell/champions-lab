import type { BattleRow } from '../types/battleData'

interface TeammateRankingProps {
    rows: BattleRow[]
}

function TeammateRanking({
    rows,
}: TeammateRankingProps) {
    return (
        <section className='teammate-ranking'>
            <h3>Common Teammates</h3>

            <ol className='teammate-list'>
                {rows.map((row) => (
                    <li
                        className='teammate-card'
                        key={row.name}
                    >
                        <span className='teammate-rank'>
                            #{row.rank}
                        </span>

                        <strong>{row.name}</strong>
                    </li>
                ))}
            </ol>
        </section>
    )
}

export default TeammateRanking