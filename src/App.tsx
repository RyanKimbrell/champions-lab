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

  const [topMove, setTopMove] = useState<BattleRow | null>(null)
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

        const topMoveRow = data.rows.find(
          (row) => row.category === 'move' && row.rank === 1,
        )

        if (!topMoveRow) {
          throw new Error('No top move found')
        }

        setTopMove(topMoveRow)
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
      ) : topMove ? (
        <p>
          Most-used Doubles move: {topMove.name} ({topMove.percentage})
        </p>
      ) : (
        <p>Loading move data...</p>
      )}
    </main>
  )

}

export default App