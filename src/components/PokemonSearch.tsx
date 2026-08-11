import { useState } from 'react'
import { getAssetUrl } from '../api/champions'
import { matchesPokemonSearch } from '../data/pokemon'
import type { PokemonSearchOption } from '../types/pokemon'


/*============
* Interfaces
*============*/

interface PokemonSearchProps {
  options: PokemonSearchOption[]
  onSelect: (pokemon: PokemonSearchOption) => void
}


/*============
* Functions
*============*/

function PokemonSearch({
  options,
  onSelect,
}: PokemonSearchProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  const suggestions = query.trim()
    ? options
        .filter((pokemon) => matchesPokemonSearch(pokemon, query))
        .slice(0, 8)
    : []

  function selectPokemon(pokemon: PokemonSearchOption) {
    setQuery('')
    setActiveIndex(-1)
    onSelect(pokemon)
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (activeIndex >= 0) {
        selectPokemon(suggestions[activeIndex])
        return
    }

    if (suggestions.length > 0) {
        selectPokemon(suggestions[0])
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length === 0) {
        return
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault()

        setActiveIndex((currentIndex) =>
        currentIndex < suggestions.length - 1
            ? currentIndex + 1
            : 0,
        )
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault()

        setActiveIndex((currentIndex) =>
        currentIndex > 0
            ? currentIndex - 1
            : suggestions.length - 1,
        )
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault()
        selectPokemon(suggestions[activeIndex])
    }

    if (event.key === 'Escape') {
        setQuery('')
        setActiveIndex(-1)
    }
  }

  return (
    <div className="pokemon-search">
      <form onSubmit={handleSubmit}>
        <label htmlFor="pokemon-search">Pokémon</label>

        <div className="pokemon-search-control">
          <input
            id="pokemon-search"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={suggestions.length > 0}
            aria-controls="pokemon-suggestions"
            aria-activedescendant={
            activeIndex >= 0
                ? `pokemon-option-${activeIndex}`
                : undefined
            }
            value={query}
            onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(-1)
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            placeholder="Search Pokémon..."
          />

          <button type="submit">Search</button>
        </div>
      </form>

      {suggestions.length > 0 && (
        <ul 
            id="pokemon-suggestions"
            className="pokemon-suggestions"
            role="listbox"
        >
          {suggestions.map((pokemon, index) => (
            <li key={`${pokemon.name}-${pokemon.battleDataId}`}>
              <button
                id={`pokemon-option-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={
                    index === activeIndex
                    ? 'pokemon-suggestion pokemon-suggestion-active'
                    : 'pokemon-suggestion'
                }
                onClick={() => selectPokemon(pokemon)}
              >
                <img
                  src={getAssetUrl(pokemon.sprite)}
                  alt=""
                  width="48"
                  height="48"
                />

                <span>
                  <strong>{pokemon.name}</strong>
                  <small>{pokemon.types.join(' / ')}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PokemonSearch