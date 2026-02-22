import { useMemo } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import clsx from 'clsx'

/**
 * Distinctive chart colors for up to 3 strains.
 * Indica purple, Sativa orange, Hybrid green.
 */
const CHART_COLORS = [
  { stroke: '#9350ff', fill: '#9350ff' },  // indica purple
  { stroke: '#ff8c32', fill: '#ff8c32' },  // sativa orange
  { stroke: '#32c864', fill: '#32c864' },  // hybrid green
]

/**
 * Normalizes a value to 0-100 range given a max.
 */
function normalize(value, max) {
  if (value == null || max === 0) return 0
  const num = typeof value === 'number' ? value : parseFloat(value)
  if (Number.isNaN(num)) return 0
  return Math.min(100, Math.max(0, (num / max) * 100))
}

/**
 * Builds radar chart data from an array of strains.
 * Axes: THC, CBD, Match %, Sentiment, Terpene Count, Effect Count
 */
function buildRadarData(strains) {
  const axes = [
    {
      axis: 'THC',
      getVal: (s) => normalize(s.thc, 35),
    },
    {
      axis: 'CBD',
      getVal: (s) => normalize(s.cbd, 20),
    },
    {
      axis: 'Match %',
      getVal: (s) => normalize(s.matchPct, 100),
    },
    {
      axis: 'Sentiment',
      getVal: (s) => normalize(s.sentimentScore, 5),
    },
    {
      axis: 'Terpene Count',
      getVal: (s) => {
        const count = Array.isArray(s.terpenes) ? s.terpenes.length : 0
        return normalize(count, 10)
      },
    },
    {
      axis: 'Effect Count',
      getVal: (s) => {
        const count = Array.isArray(s.effects) ? s.effects.length : 0
        return normalize(count, 10)
      },
    },
  ]

  return axes.map(({ axis, getVal }) => {
    const point = { axis }
    strains.forEach((strain, idx) => {
      point[`strain_${idx}`] = getVal(strain)
    })
    return point
  })
}

/**
 * Custom axis tick that respects dark mode.
 */
function CustomAxisTick({ payload, x, y, cx, cy }) {
  const dx = x - cx
  const dy = y - cy
  const angle = Math.atan2(dy, dx)
  const offsetX = Math.cos(angle) * 14
  const offsetY = Math.sin(angle) * 14

  return (
    <text
      x={x + offsetX}
      y={y + offsetY}
      textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
      dominantBaseline="central"
      className="fill-gray-600 dark:fill-[#8a9a8e] text-[11px] font-medium"
    >
      {payload.value}
    </text>
  )
}

export function CompareRadarChart({ strains = [] }) {
  const data = useMemo(() => buildRadarData(strains), [strains])

  if (strains.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400 dark:text-[#6a7a6e]">
        Select strains to compare
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'w-full rounded-2xl border p-4',
        'bg-white dark:bg-surface border-gray-200 dark:border-surface-border'
      )}
      role="img"
      aria-label={`Radar chart comparing ${strains.map((s) => s.name).join(', ')}`}
    >
      <h3
        className="text-center text-sm font-semibold text-gray-700 dark:text-[#b0c4b4] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Profile Comparison
      </h3>

      <ResponsiveContainer width="100%" height={340}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid
            stroke="currentColor"
            className="text-gray-200 dark:text-white/10"
          />
          <PolarAngleAxis
            dataKey="axis"
            tick={<CustomAxisTick />}
          />

          {strains.map((strain, idx) => {
            const color = CHART_COLORS[idx] || CHART_COLORS[0]
            return (
              <Radar
                key={strain.name}
                name={strain.name}
                dataKey={`strain_${idx}`}
                stroke={color.stroke}
                fill={color.fill}
                fillOpacity={0.15}
                strokeWidth={2}
                dot={{ r: 3, fill: color.stroke }}
              />
            )
          })}

          <Legend
            wrapperStyle={{
              fontSize: '12px',
              fontFamily: "'DM Sans', sans-serif",
            }}
            formatter={(value) => (
              <span className="text-gray-700 dark:text-[#b0c4b4]">{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Accessible data summary for screen readers */}
      <div className="sr-only">
        <table>
          <caption>Radar chart data</caption>
          <thead>
            <tr>
              <th>Metric</th>
              {strains.map((s) => (
                <th key={s.name}>{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.axis}>
                <td>{row.axis}</td>
                {strains.map((_, idx) => (
                  <td key={idx}>{Math.round(row[`strain_${idx}`])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
