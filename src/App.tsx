import { useEffect, useState } from "react"

interface BattleRow {
  position: number
  category: string
  rank: number
  name: string
  percentage: string
  percentage_value: number
}

interface BattleDataResponse {
  pokemon: string
  showdownId: string
  format: string
  season: string
  rows: BattleRow[]
}



function App(){

  const [moves, setMoves] = useState<BattleRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {

    async function fetchGarchompData() {
      try {
        const response = await fetch(
          'https://championsbattledata.com/api/battle/Doubles/garchomp',
        )

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data: BattleDataResponse = await response.json()

        const moveRows = data.rows
        .filter((row) => row.category === 'move')
        .sort((a,b) => a.rank - b.rank)
        .slice(0,10)

        if (moveRows.length === 0) {
          throw new Error('No top move found')
        }

        setMoves(moveRows)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unknown error occurred')
        }
      }
    }

    fetchGarchompData()
    
  }, [])

  return (
    <main>
      <h1>Champion's Lab</h1>
      <h2>Garchomp</h2>
      {error ? (
        <p>Unable to load move data: {error}</p>
      ) : moves.length > 0 ? (
       <div className="move-chart">
        {moves.map((move) => (
          <div className="move-row" key={move.name}>
            <div className="move-label">
              <span>{move.name}</span>
              <span>{move.percentage}</span>
            </div>
            <div className="move-track">
              <div 
                className="move-bar"
                style={{ width: `${move.percentage_value}%` }}
              />
            </div>
          </div>
        ))}
       </div>
      ) : (
        <p>Loading move data...</p>
      )}
    </main>
  )

}

export default App