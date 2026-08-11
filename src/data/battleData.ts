import type { BattleRow, PercentageBattleRow } from '../types/battleData'

export function getTopRowsByCategory(
  rows: BattleRow[],
  category: string,
  limit = 10,
): BattleRow [] {
  return rows
    .filter((row) => row.category === category)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
}

export function getTopPercentageRowsByCategory(
  rows: BattleRow[],
  category: string,
  limit = 10,
): PercentageBattleRow[] {
  return getTopRowsByCategory(rows, category, limit).filter(
    (row): row is PercentageBattleRow =>
      row.percentage_value !== null,
  )
}