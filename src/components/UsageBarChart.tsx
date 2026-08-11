import type { PercentageBattleRow } from '../types/battleData'


/*============
* Interfaces
*============*/

interface UsageBarChartProps {
  title: string
  rows: PercentageBattleRow[]
}

/*============
* Functions
*============*/

function UsageBarChart({
  title,
  rows,
}: UsageBarChartProps) {
  return (
    <section className="usage-chart">
      <h3>{title}</h3>

      <div className="move-chart">
        {rows.map((row) => (
          <div className="move-row" key={row.name}>
            <div className="move-label">
              <span>{row.name}</span>
              <span>{row.percentage}</span>
            </div>

            <div className="move-track">
              <div
                className="move-bar"
                style={{ width: `${row.percentage_value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default UsageBarChart