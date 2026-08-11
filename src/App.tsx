import { useEffect, useState } from "react"
import { fetchBattleData, fetchPokemonIndex, getAssetUrl, fetchBattleHistory } from "./api/champions"
import { getTopRowsByCategory, getTopPercentageRowsByCategory } from "./data/battleData"
import { buildPokemonSearchOptions, findPokemonSearchOption } from "./data/pokemon"
import type { BattleRow, DailyBattleSnapshot } from "./types/battleData"
import type { PokemonIndexEntry, PokemonSearchOption } from "./types/pokemon"
import { getMoveUsageHistory } from "./data/history"
import UsageBarChart from './components/UsageBarChart'
import PokemonSearch from "./components/PokemonSearch"
import TeammateRanking from "./components/TeammateRanking"
import UsageHistoryChart from "./components/UsageHistoryChart"

/*============
* Global Constants
*============*/

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

const historyRanges = [7, 14, 31] as const 


/*================
* Global Types
*================*/

type BattleCategory = (typeof battleCategories)[number]['key']
type HistoryRange = (typeof historyRanges)[number]



/*================
* App Main Function
*================*/

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
  const [historySnapshots, setHistorySnapshots] = useState<DailyBattleSnapshot[]>([])
  const [selectedHistoryMoves, setSelectedHistoryMoves] = useState<string[]>([])
  const [selectedHistoryDays, setSelectedHistoryDays] = useState<HistoryRange>(7)
  

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
  const teammateItems = teammateRows.map((row) => ({
    row,
    pokemon: findPokemonSearchOption(
      pokemonOptions,
      row.name,
    ),
  }))
  const historyMoveOptions = getTopPercentageRowsByCategory(
    battleRows,
    'move',
    10,
  )
  const historySeries = selectedHistoryMoves
    .map((moveName) => ({
      name: moveName,
      data: getMoveUsageHistory(
        historySnapshots,
        moveName,
      ),
    }))
    .filter(
      (historySeries) =>
        historySeries.data.length >= 2,
    )

  /*===========================
  * State Change useEffects
  * ==========================*/

  // Loading Pokemon Index Data
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

  // Loading Historic Battle Data
  useEffect(() => {
    async function loadBattleHistory() {
      try {
        setHistorySnapshots([])

        const history = await fetchBattleHistory(
          selectedPokemon,
          selectedHistoryDays,
        )

        setHistorySnapshots(history.daily)
      } catch (error) {
        console.error(
          'Unable to load battle history:',
          error,
        )
      }
    }

    loadBattleHistory()
  }, [selectedPokemon, selectedHistoryDays])


  // Fetching Pokemon Battle Data, and Rendering
  useEffect(() => {

    //function definition
    async function fetchPokemonData() {

      try {

        setBattleRows([])
        setError(null)
        setPokemonName('')
        setSelectedHistoryMoves([])

        // fetching the current battle data
        const data = await fetchBattleData(selectedPokemon)

        setPokemonName(data.pokemon)

        if (data.rows.length === 0) {
          throw new Error('No battle data found')
        }

        setBattleRows(data.rows)

        const topMove = getTopPercentageRowsByCategory(
          data.rows,
          'move',
          1,
        )[0]

        if (topMove) {
          setSelectedHistoryMoves([topMove.name])
        }



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

  // toggle function
  function toggleHistoryMove(moveName: string) {
    setSelectedHistoryMoves((currentMoves) => {
      if (currentMoves.includes(moveName)) {
        if(currentMoves.length === 1) {
          return currentMoves
        }

        return currentMoves.filter(
          (name) => name !== moveName,
        )
      }

      if (currentMoves.length >= 3) {
        return currentMoves
      }

      return [...currentMoves, moveName]
    })
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
            <TeammateRanking 
              items={teammateItems}
              onSelect={handlePokemonSelect} 
            />
          ) : (
            <p>No teammate data available.</p>
          )}

          {historySnapshots.length > 0 && (
            <section className="history-explorer">
              <div className="history-controls">
                <label htmlFor="history-move">
                  Historical Move Usage
                </label>

                <div
                  className="history-range-switcher"
                  role="group"
                  aria-label="Historical Date Range"
                >
                  {historyRanges.map((days) => (
                    <button
                      key={days}
                      type="button"
                      className={
                        selectedHistoryDays === days
                        ? 'history-range-button history-range-button-active'
                        : 'history-range-button'
                      }
                      aria-pressed={selectedHistoryDays === days}
                      onClick={() => setSelectedHistoryDays(days)}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>

                <div
                  className="history-move-selector"
                  role="group"
                  aria-label="Moves to compare"
                >
                  {historyMoveOptions.map((move) => {
                    const isSelected =
                      selectedHistoryMoves.includes(move.name)

                    const selectionLimitReached =
                      selectedHistoryMoves.length >= 3

                    return (
                      <button
                        key={move.name}
                        type="button"
                        className={
                          isSelected
                            ? 'history-move-button history-move-button-active'
                            : 'history-move-button'
                        }
                        aria-pressed={isSelected}
                        disabled={
                          !isSelected &&
                          selectionLimitReached
                        }
                        onClick={() =>
                          toggleHistoryMove(move.name)
                        }
                      >
                        {move.name}
                      </button>
                    )
                  })}
                </div>

                <p className="history-selection-note">
                  Compare up to three moves.
                </p>
              </div>

              {historySeries.length > 0 ? (
                <UsageHistoryChart
                  title={`Move Usage - Last ${selectedHistoryDays} Days`}
                  series={historySeries}
                />
              ) : (
                <p>
                  Not enough historical data for the selected moves.
                </p>
              )}
            </section>
          )}

        </>
      ) : (
        <p>Loading move data...</p>
      )}
    </main>
  )

}

export default App