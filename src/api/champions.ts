import type { BattleDataResponse } from '../types/battleData'

const API_BASE_URL = 'https://championsbattledata.com/api'

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