import type { BattleDataResponse } from '../types/battleData'
import type { PokemonIndexEntry, PokemonIndexResponse } from '../types/pokemon'

const SITE_BASE_URL = 'https://championsbattledata.com'
const API_BASE_URL = `${SITE_BASE_URL}/api`

export async function fetchBattleData(
  pokemon: string,
): Promise<BattleDataResponse> {
  const response = await fetch(
    `${API_BASE_URL}/battle/Doubles/${pokemon}`,
  )

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const data: BattleDataResponse = await response.json()

  return data
}

export async function fetchPokemonIndex(): Promise<PokemonIndexEntry[]> {
    const response = await fetch(API_BASE_URL)

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }

    const data: PokemonIndexResponse = await response.json()

    return data.pokemon
}

export function getAssetUrl(path:string): string {
    return new URL(path, `${SITE_BASE_URL}/`).toString()
}