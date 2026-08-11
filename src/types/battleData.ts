export interface BattleRow {
    position: number
    category: string
    rank: number
    name: string
    percentage: string
    percentage_value: number | null
}

export type PercentageBattleRow = BattleRow & {
    percentage_value: number
}

export interface BattleDataResponse {
    pokemon: string
    showdownId: string
    format: string
    season: string
    rows: BattleRow[]
}

export interface DailyBattleSnapshot {
    season: string
    date: string
    source: string
    rows: BattleRow[]
}

export interface BattleHistoryResponse {
    pokemon: string
    showdownId: string
    format: string
    requestedDays: number
    season: string
    daily: DailyBattleSnapshot[]
}