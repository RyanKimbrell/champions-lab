import type { DailyBattleSnapshot } from "../types/battleData";


export interface UsageHistoryPoint {
    date: Date
    percentage: number
}

export function getMoveUsageHistory(
    snapshots: DailyBattleSnapshot[],
    moveName: string,
): UsageHistoryPoint[] {
    return snapshots
    .map((snapshot) => {
        const moveRow = snapshot.rows.find(
            (row) =>
                row.category === 'move' &&
                row.name === moveName &&
                row.percentage_value !== null,
        )

        if (!moveRow) {
            return null
        }

        const [day, month, year] = snapshot.date.split('_').map(Number)

        return {
            date: new Date(year, month - 1, day),
            percentage: moveRow.percentage_value,
        }
    })
    .filter(
        (point): point is UsageHistoryPoint =>
            point !== null,
    )
    .sort(
        (a, b) => a.date.getTime() - b.date.getTime()
    )
}