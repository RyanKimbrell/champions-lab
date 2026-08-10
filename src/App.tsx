import { useEffect, useState } from "react"
import { fetchBattleData, fetchPokemonIndex, getAssetUrl } from "./api/champions"
import { getTopMoves } from "./data/moves"
import { buildPokemonSearchOptions } from "./data/pokemon"
import PokemonSearch from "./components/PokemonSearch"
import type { BattleRow } from "./types/battleData"
import type { PokemonIndexEntry, PokemonSearchOption } from "./types/pokemon"



function App(){

  /*================================
  * State and Variable Declarations
  * ===============================*/

  // State declarations
  const [moves, setMoves] = useState<BattleRow[]>([])
  const [error, setError] = useState<string | null>(null)
  //const [searchInput, setSearchInput] = useState('garchomp')
  const [selectedPokemon, setSelectedPokemon] = useState('garchomp')
  const [pokemonName, setPokemonName] = useState('')
  const [pokemonIndex, setPokemonIndex] = useState<PokemonIndexEntry[]>([])
  const [selectedPokemonOption, setSelectedPokemonOption] = useState<PokemonSearchOption | null>(null)
  

  // Variable derivations
  const pokemonOptions = buildPokemonSearchOptions(pokemonIndex)
  const displayedPokemon = 
    selectedPokemonOption ??
    pokemonOptions.find(
      (pokemon) =>
        pokemon.battleDataId === selectedPokemon &&
      !pokemon.usesBaseBattleData
    )

  // load the roster on app start
  useEffect(() => {

    //function definition
    async function loadPokemonIndex() {
      try{
        const pokemon = await fetchPokemonIndex()
        setPokemonIndex(pokemon)
      } catch (error) {
        console.error('Unable to load Pokémon index:', error)
      }
    }
    //function call
    loadPokemonIndex()
  }, [])

/*===========================
* State Changing Hooks
* ==========================*/

  // fetching pokemon battle data
  useEffect(() => {

    //function definition
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

    //function call
    fetchPokemonData()
    
  }, [selectedPokemon])


  /*====================
  * Function Definitions
  *====================*/

  // autocomplete handler
  function handlePokemonSelect(pokemon: PokemonSearchOption) {
    setSelectedPokemonOption(pokemon)
    setSelectedPokemon(pokemon.battleDataId)
  }

  /*===============
  * Page Rendering
  * ==============*/
  return (
    <main>
      <h1>Champion's Lab</h1>

      <PokemonSearch
        options={pokemonOptions}
        onSelect={handlePokemonSelect}
      />

      {displayedPokemon && (
        <>
          <h2>{displayedPokemon.name}</h2>

          <img
            src={getAssetUrl(displayedPokemon.sprite)}
            alt={displayedPokemon.name}
            width="120"
            height="120"
          />

          <p>{displayedPokemon.types.join(' / ')}</p>

          {displayedPokemon.usesBaseBattleData && pokemonName && (
            <p>
              Battle usage data is reported under {pokemonName}
            </p>
          )}
        </>
      )}

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