import type { BattleRow, PercentageBattleRow } from '../types/battleData'

export function getTopRowsByCategory(
  rows: BattleRow[],
  category: string,
  limit = 10,
): PercentageBattleRow[] {
  return rows
    .filter(
      (row): row is PercentageBattleRow => 
        row.category === category &&
        row.percentage_value !== null,
    )
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
}