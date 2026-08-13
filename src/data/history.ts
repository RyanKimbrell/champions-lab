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

export interface UsageChange {
    startPercentage: number
    endPercentage: number
    delta: number
}

export function getUsageChange(
    data: UsageHistoryPoint[],
): UsageChange | null {
    if (data.length < 2) {
        return null
    }

    const firstPoint = data[0]
    const lastPoint = data[data.length - 1]

    return {
        startPercentage: firstPoint.percentage,
        endPercentage: lastPoint.percentage,
        delta: lastPoint.percentage - firstPoint.percentage
    }
}

export interface MoveUsageChange {
    name: string
    startPercentage: number
    endPercentage: number
    delta: number
}

export function getMoveUsageChanges(
    snapshots: DailyBattleSnapshot[],
    moveNames: string[],
): MoveUsageChange[] {
    return moveNames
    .map((moveName) => {
        const history = getMoveUsageHistory(
            snapshots,
            moveName,
        )

        const change = getUsageChange(history)

        if (!change) {
            return null
        }

        return {
            name: moveName,
            startPercentage: change.startPercentage,
            endPercentage: change.endPercentage,
            delta: change.delta,
        }
    })
    .filter(
        (change): change is MoveUsageChange =>
            change !== null,
    )
    .sort(
        (a,b) => Math.abs(b.delta) - Math.abs(a.delta)
    )
}