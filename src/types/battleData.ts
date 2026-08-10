export interface BattleRow {
    position: number
    category: string
    rank: number
    name: string
    percentage: string
    percentage_value: number
}

export interface BattleDataResponse {
    pokemon: string
    showdownId: string
    format: string
    season: string
    rows: BattleRow[]
}