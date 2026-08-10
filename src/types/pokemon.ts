export interface PokemonForm {
  form_name: string
  saved_name: string
  slug: string
  form_kind: string
  image_path: string
  types: string[]
}

export interface PokemonSummary {
  sprite: string
  types: string[]
  forms?: PokemonForm[]
}

export interface PokemonIndexEntry {
  name: string
  showdownId: string
  summary: PokemonSummary
}

export interface PokemonIndexResponse {
  pokemon: PokemonIndexEntry[]
}

export interface PokemonSearchOption {
  name: string
  battleDataId: string
  sprite: string
  types: string[]
  searchTerms: string[]
  usesBaseBattleData: boolean
}