import { useEffect, useState } from "react"
import { fetchBattleData } from "./api/champions"
import { getTopMoves } from "./data/moves"
import type { BattleRow } from "./types/battleData"



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

        const data = await fetchBattleData(selectedPokemon)

        setPokemonName(data.pokemon)

        const moveRows = getTopMoves(data.rows)

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