import { extent, line, max, min, scaleLinear, scaleTime, scaleOrdinal, schemeTableau10 } from 'd3'
import { useState } from 'react'
import { getUsageChange } from '../data/history'
import type { UsageHistoryPoint } from '../data/history'


const dateFormatter = new Intl.DateTimeFormat(
    'en-US',
    {
        month: 'short',
        day: 'numeric',
    }
)

export interface UsageHistorySeries {
    name: string
    data: UsageHistoryPoint[]
}

interface UsageHistoryChartProps {
    title: string
    series: UsageHistorySeries[]
}

function UsageHistoryChart({
    title,
    series,
}: UsageHistoryChartProps) {

    interface HoveredHistoryPoint {
        seriesName: string
        point: UsageHistoryPoint
    }

    const [hoveredPoint, setHoveredPoint] = useState<HoveredHistoryPoint | null>(null)
    
    const allPoints = series.flatMap(
        (historySeries) => historySeries.data,
    )

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

    if (allPoints.length < 2) {
        return (
            <section>
                <h3>{title}</h3>
                <p>Not enough historical data to draw a trend.</p>
            </section>
        )
    }

    const dateExtent = extent(
        allPoints,
        (point) => point.date,
    )

    if (!dateExtent[0] || !dateExtent[1]) {
        return null
    }

    const xScale = scaleTime().domain(dateExtent).range([0, innerWidth])

    const minPercentage = min(allPoints, (point) => point.percentage)
    const maxPercentage = max(allPoints, (point) => point.percentage)

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
        .y((point) => yScale(point.percentage)
    )

    const xTicks = xScale.ticks(
        Math.min(allPoints.length, 7),
    )
    const yTicks = yScale.ticks(5)

    const tooltipWidth = 140
    const tooltipHeight = 70

    const tooltipX = hoveredPoint
        ? Math.min(
            Math.max(
                xScale(hoveredPoint.point.date) - tooltipWidth / 2,
                0,
            ),
            innerWidth - tooltipWidth,
        ) 
    : 0

    const tooltipY = hoveredPoint
        ? Math.max(
            yScale(hoveredPoint.point.percentage) - tooltipHeight - 12,
            0,
        )
    : 0 

    const colorScale = scaleOrdinal<string, string>()
        .domain(series.map((historySeries) => historySeries.name))
        .range(schemeTableau10)

    return (
        <section className='history-chart'>
            <h3>{title}</h3>

            <div className="history-legend">
                {series.map((historySeries) => {
                    const change = getUsageChange(
                        historySeries.data,
                    )

                    return (
                        <div
                            className="history-legend-item"
                            key={historySeries.name}
                        >
                            <span
                                className="history-legend-swatch"
                                style={{
                                    background: colorScale(
                                    historySeries.name,
                                    ),
                                }}
                            />

                            <span>{historySeries.name}</span>

                            {change && (
                                <span className="history-legend-change">
                                    {change.delta >= 0 ? '+' : ''}
                                    {change.delta.toFixed(1)} pp
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>

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
                    {series.map((historySeries) => {
                        const pathData = lineGenerator(historySeries.data)
                        const color = colorScale(historySeries.name)

                        return (
                            <g key={historySeries.name}>
                                <path 
                                    d={pathData ?? undefined}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="3"
                                />

                                {historySeries.data.map((point) => {
                                    const isHovered =
                                        hoveredPoint?.seriesName === historySeries.name &&
                                        hoveredPoint.point === point
                                    
                                    return (
                                        <circle
                                            key={point.date.toISOString()}
                                            cx={xScale(point.date)}
                                            cy={yScale(point.percentage)}
                                            r={isHovered ? 7 : 4}
                                            fill={color}
                                            tabIndex={0}
                                            onMouseEnter={() => 
                                                setHoveredPoint({
                                                    seriesName: historySeries.name,
                                                    point,
                                                })
                                            }
                                            onBlur={() => setHoveredPoint(null)}
                                        />
                                    )
                                })}
                            </g>
                        )
                    })}

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
                                y="18"
                                textAnchor='middle'
                                fontSize="12"
                                fontWeight="bold"
                            >
                                {hoveredPoint.seriesName}
                            </text>

                            <text
                                x={tooltipWidth / 2}
                                y="39"
                                textAnchor="middle"
                                fontSize="12"
                            >
                                {dateFormatter.format(hoveredPoint.point.date)}
                            </text>

                            <text
                                x={tooltipWidth / 2}
                                y="59"
                                textAnchor='middle'
                                fontSize="14"
                                fontWeight="bold"
                            >
                                {hoveredPoint.point.percentage.toFixed(1)}%
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