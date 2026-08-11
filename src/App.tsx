import { useEffect, useState } from "react"
import { fetchBattleData, fetchPokemonIndex, getAssetUrl } from "./api/champions"
import { getTopRowsByCategory, getTopPercentageRowsByCategory } from "./data/battleData"
import { buildPokemonSearchOptions } from "./data/pokemon"
import type { BattleRow } from "./types/battleData"
import type { PokemonIndexEntry, PokemonSearchOption } from "./types/pokemon"
import UsageBarChart from './components/UsageBarChart'
import PokemonSearch from "./components/PokemonSearch"
import TeammateRanking from "./components/TeammateRanking"

const battleCategories = [
  {
    key: 'move',
    label: 'Moves',
    title: 'Move Usage',
    visualization: 'percentage',
  },
  {
    key: 'held_item',
    label: 'Items',
    title: 'Held Item Usage',
    visualization: 'percentage',
  },
  {
    key: 'ability',
    label: 'Abilities',
    title: 'Ability Usage',
    visualization: 'percentage'
  },
  {
    key: 'teammate',
    label:'Teammates',
    title: 'Common Teammates',
    visualization: 'ranking',
  }
] as const

type BattleCategory = (typeof battleCategories)[number]['key']

function App(){

  /*================================
  * State and Variable Declarations
  * ===============================*/

  // State declarations
  const [battleRows, setBattleRows] = useState<BattleRow[]>([])
  const [selectedCategory, setSelectedCategory] = useState<BattleCategory>('move')
  const [error, setError] = useState<string | null>(null)
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
  const categoryConfig = battleCategories.find(
    (category) => category.key === selectedCategory,
  )!
  const chartRows = getTopPercentageRowsByCategory(
    battleRows,
    selectedCategory,
  )
  const teammateRows = getTopRowsByCategory(
    battleRows,
    'teammate',
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

        setBattleRows([])
        setError(null)
        setPokemonName('')

        const data = await fetchBattleData(selectedPokemon)

        setPokemonName(data.pokemon)

        if (data.rows.length === 0) {
          throw new Error('No battle data found')
        }

        setBattleRows(data.rows)

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
        <p>Unable to load battle data: {error}</p>
      ) : battleRows.length > 0 ? (
        <>
          <div
            className="category-switcher"
            role="group"
            aria-label="Battle data category"
          >
            {battleCategories.map((category) => (
              <button
                key={category.key}
                type="button"
                className={
                  selectedCategory === category.key
                  ? 'category-button category-button-active'
                  : 'category-button'
                }
                aria-pressed={selectedCategory === category.key}
                onClick={() => setSelectedCategory(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {categoryConfig.visualization === 'percentage' ? (
            chartRows.length > 0 ? (
              <UsageBarChart
                title={categoryConfig.title}
                rows={chartRows}
              />
            ) : (
              <p>
                No {categoryConfig.label.toLowerCase()} data available.
              </p>
            )
          ) : teammateRows.length > 0 ? (
            <TeammateRanking rows={teammateRows} />
          ) : (
            <p>No teammate data available.</p>
          )}
        </>
      ) : (
        <p>Loading move data...</p>
      )}
    </main>
  )

}

export default App