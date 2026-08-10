import type { BattleRow } from '../types/battleData'

export function getTopMoves(
  rows: BattleRow[],
  limit = 10,
): BattleRow[] {
  return rows
    .filter((row) => row.category === 'move')
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
}