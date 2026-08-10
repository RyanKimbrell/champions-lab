import type {
  PokemonIndexEntry,
  PokemonSearchOption,
} from '../types/pokemon'

export function normalizePokemonSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function buildPokemonSearchOptions(
  entries: PokemonIndexEntry[],
): PokemonSearchOption[] {
  const options: PokemonSearchOption[] = entries.map((entry) => ({
    name: entry.name,
    battleDataId: entry.showdownId,
    sprite: entry.summary.sprite,
    types: entry.summary.types,
    searchTerms: [entry.name, entry.showdownId],
    usesBaseBattleData: false,
  }))

  const existingNames = new Set(
    options.map((option) => normalizePokemonSearch(option.name)),
  )

  for (const entry of entries) {
    for (const form of entry.summary.forms ?? []) {
      const normalizedFormName = normalizePokemonSearch(form.form_name)

      if (existingNames.has(normalizedFormName)) {
        continue
      }

      options.push({
        name: form.form_name,
        battleDataId: entry.showdownId,
        sprite: form.image_path,
        types: form.types,
        searchTerms: [
          form.form_name,
          form.saved_name,
          form.slug,
          entry.name,
        ],
        usesBaseBattleData: true,
      })

      existingNames.add(normalizedFormName)
    }
  }

  return options
}

export function matchesPokemonSearch(
  pokemon: PokemonSearchOption,
  query: string,
): boolean {
  const normalizedQuery = normalizePokemonSearch(query)

  if (!normalizedQuery) {
    return false
  }

  return pokemon.searchTerms.some((term) =>
    normalizePokemonSearch(term).includes(normalizedQuery),
  )
}