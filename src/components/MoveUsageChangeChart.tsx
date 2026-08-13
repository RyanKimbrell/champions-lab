import {
  max,
  scaleBand,
  scaleLinear,
} from 'd3'

import type { MoveUsageChange } from '../data/history'

interface MoveUsageChangeChartProps {
  title: string
  data: MoveUsageChange[]
}

function MoveUsageChangeChart({
  title,
  data,
}: MoveUsageChangeChartProps) {
  const width = 700
  const rowHeight = 42

  const margin = {
    top: 30,
    right: 80,
    bottom: 40,
    left: 140,
  }

  const innerWidth =
    width - margin.left - margin.right

  const innerHeight =
    data.length * rowHeight

  const height =
    innerHeight +
    margin.top +
    margin.bottom

  if (data.length === 0) {
    return null
  }

  const maxAbsoluteDelta =
    max(
      data,
      (change) => Math.abs(change.delta),
    ) ?? 0

  const domainMagnitude =
    Math.max(maxAbsoluteDelta, 1)

  const xScale = scaleLinear()
    .domain([
      -domainMagnitude,
      domainMagnitude,
    ])
    .range([0, innerWidth])

  const yScale = scaleBand<string>()
    .domain(
      data.map((change) => change.name),
    )
    .range([0, innerHeight])
    .padding(0.25)

  const zeroX = xScale(0)

  return (
    <section className="move-change-chart">
      <h3>{title}</h3>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={title}
      >
        <g
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <line
            x1={zeroX}
            x2={zeroX}
            y1={0}
            y2={innerHeight}
            stroke="currentColor"
          />

          {data.map((change) => {
            const y = yScale(change.name)

            if (y === undefined) {
              return null
            }

            const valueX = xScale(change.delta)

            const barX = Math.min(
              zeroX,
              valueX,
            )

            const barWidth = Math.abs(
              valueX - zeroX,
            )

            const labelX =
              change.delta >= 0
                ? valueX + 8
                : valueX - 8

            return (
              <g key={change.name}>
                <text
                  x={-10}
                  y={y + yScale.bandwidth() / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="12"
                >
                  {change.name}
                </text>

                <rect
                  x={barX}
                  y={y}
                  width={barWidth}
                  height={yScale.bandwidth()}
                  fill="currentColor"
                />

                <text
                  x={labelX}
                  y={y + yScale.bandwidth() / 2}
                  textAnchor={
                    change.delta >= 0
                      ? 'start'
                      : 'end'
                  }
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {change.delta >= 0
                    ? '+'
                    : ''}
                  {change.delta.toFixed(1)} pp
                </text>
              </g>
            )
          })}

          <text
            x={0}
            y={innerHeight + 28}
            fontSize="12"
          >
            Declining
          </text>

          <text
            x={innerWidth}
            y={innerHeight + 28}
            textAnchor="end"
            fontSize="12"
          >
            Rising
          </text>
        </g>
      </svg>
    </section>
  )
}

export default MoveUsageChangeChart