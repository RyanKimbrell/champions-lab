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
  const [searchInput, setSearchInput] = useState('garchomp')
  const [selectedPokemon, setSelectedPokemon] = useState('garchomp')
  const [pokemonName, setPokemonName] = useState('')

  useEffect(() => {

    async function fetchPokemonData() {

      try {

        setMoves([])
        setError(null)
        setPokemonName('')

        const response = await fetch(
          `https://championsbattledata.com/api/battle/Doubles/${selectedPokemon}`,
        )

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data: BattleDataResponse = await response.json()

        setPokemonName(data.pokemon)

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

    fetchPokemonData()
    
  }, [selectedPokemon])

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedInput = searchInput.trim().toLowerCase()

    if (normalizedInput) {
      setSelectedPokemon(normalizedInput)
    }
  }

  return (
    <main>
      <h1>Champion's Lab</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="pokemon-search">Pokémon</label>

        <input
          id="pokemon-search"
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {pokemonName && <h2>{pokemonName}</h2>}

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