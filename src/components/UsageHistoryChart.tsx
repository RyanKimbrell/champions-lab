import { extent, line, max, min, scaleLinear, scaleTime } from 'd3'
import { useState } from 'react'
import type { UsageHistoryPoint } from '../data/history'


const dateFormatter = new Intl.DateTimeFormat(
    'en-US',
    {
        month: 'short',
        day: 'numeric',
    }
)

interface UsageHistoryChartProps {
    title: string
    data: UsageHistoryPoint[]
}

function UsageHistoryChart({
    title,
    data,
}: UsageHistoryChartProps) {
    
    const [hoveredPoint, setHoveredPoint] = useState<UsageHistoryPoint | null>(null)
    
    const width = 700
    const height = 320
    
    const margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 50
    }

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    if (data.length < 2) {
        return (
            <section>
                <h3>{title}</h3>
                <p>Not enough historical data to draw a trend.</p>
            </section>
        )
    }

    const dateExtent = extent(
        data,
        (point) => point.date,
    )

    if (!dateExtent[0] || !dateExtent[1]) {
        return null
    }

    const xScale = scaleTime().domain(dateExtent).range([0, innerWidth])

    const minPercentage = min(data, (point) => point.percentage)
    const maxPercentage = max(data, (point) => point.percentage)

    if (minPercentage === undefined || maxPercentage === undefined) {
        return null
    }

    const yPadding = Math.max((maxPercentage - minPercentage) * 0.2, 2)
    
    const yScale = scaleLinear().domain([
        Math.max(0, minPercentage - yPadding),
        Math.min(100, maxPercentage + yPadding)
    ]).range([innerHeight, 0])

    const lineGenerator = line<UsageHistoryPoint>()
        .x((point) => xScale(point.date))
        .y((point) => yScale(point.percentage))

    const pathData = lineGenerator(data)

    const xTicks = xScale.ticks(
        Math.min(data.length, 7),
    )
    const yTicks = yScale.ticks(5)

    const tooltipWidth = 120
    const tooltipHeight = 52

    const tooltipX = hoveredPoint
        ? Math.min(
            Math.max(
                xScale(hoveredPoint.date) - tooltipWidth / 2,
                0,
            ),
            innerWidth - tooltipWidth,
        ) 
    : 0

    const tooltipY = hoveredPoint
        ? Math.max(
            yScale(hoveredPoint.percentage) - tooltipHeight - 12,
            0,
        )
    : 0 

    return (
        <section className='history-chart'>
            <h3>{title}</h3>

            <svg
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label={`${title} over time`}
            >
                <g 
                    transform={`translate(${margin.left}, ${margin.top})`}
                >

                    {/* horizontal gridlines + y labels */}
                    {yTicks.map((tick) => (
                        <g
                            key={tick}
                            transform={`translate(0, ${yScale(tick)})`}
                        >
                            <line
                                x1={0}
                                x2={innerWidth}
                                stroke="#ddd"
                            />

                            <text
                                x={-10}
                                y={0}
                                textAnchor="end"
                                dominantBaseline="middle"
                                fontSize="12"
                            >
                                {tick}%
                            </text>
                        </g>
                    ))}

                    {/* historical trend */}
                    <path
                        d={pathData ?? undefined}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />

                    {/* observations */}
                    {data.map((point) => (
                        <circle
                            key={point.date.toISOString()}
                            cx={xScale(point.date)}
                            cy={yScale(point.percentage)}
                            r={hoveredPoint === point ? 7 : 4}
                            fill="currentColor"
                            tabIndex={0}
                            onMouseEnter={() => setHoveredPoint(point)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            onFocus={() => setHoveredPoint(point)}
                            onBlur={() => setHoveredPoint(null)}
                        />
                    ))}

                    {/* tooltip */}
                    {hoveredPoint && (
                        <g
                            className='history-tooltip'
                            transform={`translate(${tooltipX}, ${tooltipY})`}
                            pointerEvents="none"
                        >
                            <rect
                                width={tooltipWidth}
                                height={tooltipHeight}
                                rx="6"
                                fill="white"
                                stroke="currentColor"
                            />

                            <text
                                x={tooltipWidth / 2}
                                y="20"
                                textAnchor="middle"
                                fontSize="12"
                            >
                                {dateFormatter.format(hoveredPoint.date)}
                            </text>

                            <text
                                x={tooltipWidth / 2}
                                y="39"
                                textAnchor='middle'
                                fontSize="14"
                                fontWeight="bold"
                            >
                                {hoveredPoint.percentage.toFixed(1)}%
                            </text>
                        </g>
                    )}

                    {/* x axis */}
                    <line
                        x1={0}
                        x2={innerWidth}
                        y1={innerHeight}
                        y2={innerHeight}
                        stroke="currentColor"
                    />

                    {/* date ticks */}
                    {xTicks.map((tick) => (
                        <g
                            key={tick.toISOString()}
                            transform={`translate(${xScale(tick)}, ${innerHeight})`}
                        >
                            <line
                                y2={6}
                                stroke="currentColor"
                            />

                            <text
                                y={22}
                                textAnchor="middle"
                                fontSize="12"
                            >
                                {dateFormatter.format(tick)}
                            </text>
                        </g>
                    ))}
                </g>
            </svg>
        </section>
    )
}

export default UsageHistoryChart