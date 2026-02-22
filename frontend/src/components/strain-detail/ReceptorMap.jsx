import { useMemo } from 'react'
import { GitBranch } from 'lucide-react'
import { getReceptorColor } from '../../utils/colors'

/**
 * ReceptorMap — Inline SVG 3-column flow diagram
 *
 * Molecules (left) → Receptors (center) → Effects (right)
 * Lines colored by receptor. Pure SVG, no external deps.
 */
export default function ReceptorMap({ pathways, effectPredictions }) {
  const { molecules, receptors, effects, links } = useMemo(() => {
    if (!pathways?.length) return { molecules: [], receptors: [], effects: [], links: [] }

    // Dedupe molecules and receptors from pathways
    const molSet = new Map()
    const recSet = new Map()
    const linkList = []

    for (const p of pathways) {
      if (!molSet.has(p.molecule)) {
        molSet.set(p.molecule, { name: p.molecule, ki: p.ki_nm })
      }
      if (!recSet.has(p.receptor)) {
        recSet.set(p.receptor, { name: p.receptor, action: p.action_type })
      }
      linkList.push({
        from: p.molecule,
        to: p.receptor,
        ki: p.ki_nm,
        action: p.action_type || 'modulator',
      })
    }

    // Dedupe effects from predictions
    const effSet = new Map()
    if (effectPredictions) {
      for (const ep of effectPredictions.slice(0, 5)) {
        const displayName = ep.effect
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
        if (!effSet.has(displayName)) {
          effSet.set(displayName, {
            name: displayName,
            probability: ep.probability,
            pathway: ep.pathway,
          })
        }
        // Link receptors to effects
        if (ep.pathway) {
          for (const recName of ep.pathway.split(',').map((s) => s.trim())) {
            if (recSet.has(recName)) {
              linkList.push({ from: recName, to: displayName, type: 'effect' })
            }
          }
        }
      }
    }

    return {
      molecules: [...molSet.values()],
      receptors: [...recSet.values()],
      effects: [...effSet.values()],
      links: linkList,
    }
  }, [pathways, effectPredictions])

  if (!molecules.length || !receptors.length) return null

  // Layout constants
  const W = 360
  const colX = [45, 180, 315] // molecule, receptor, effect columns
  const nodeH = 28
  const topPad = 10

  const molY = (i) => topPad + i * (nodeH + 6)
  const recY = (i) => topPad + i * (nodeH + 6)
  const effY = (i) => topPad + i * (nodeH + 6)
  const totalH =
    Math.max(
      molecules.length * (nodeH + 6),
      receptors.length * (nodeH + 6),
      effects.length * (nodeH + 6)
    ) + topPad + 10

  // Build position maps
  const molPos = Object.fromEntries(molecules.map((m, i) => [m.name, molY(i) + nodeH / 2]))
  const recPos = Object.fromEntries(receptors.map((r, i) => [r.name, recY(i) + nodeH / 2]))
  const effPos = Object.fromEntries(effects.map((e, i) => [e.name, effY(i) + nodeH / 2]))

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
          <GitBranch size={14} className="text-blue-400" />
        </div>
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-[#8a9a8e]">
          Receptor Pathway Map
        </h4>
      </div>

      <svg
        viewBox={`0 0 ${W} ${totalH}`}
        className="w-full"
        style={{ maxHeight: Math.min(totalH, 300) }}
      >
        {/* Column labels */}
        <text x={colX[0]} y={6} textAnchor="middle" className="fill-gray-400 dark:fill-[#6a7a6e] text-[7px] font-bold uppercase">
          Molecules
        </text>
        <text x={colX[1]} y={6} textAnchor="middle" className="fill-gray-400 dark:fill-[#6a7a6e] text-[7px] font-bold uppercase">
          Receptors
        </text>
        <text x={colX[2]} y={6} textAnchor="middle" className="fill-gray-400 dark:fill-[#6a7a6e] text-[7px] font-bold uppercase">
          Effects
        </text>

        {/* Molecule → Receptor lines */}
        {links
          .filter((l) => l.type !== 'effect')
          .map((l, i) => {
            const y1 = molPos[l.from]
            const y2 = recPos[l.to]
            if (y1 == null || y2 == null) return null
            const color = getReceptorColor(l.to)
            return (
              <line
                key={`mr-${i}`}
                x1={colX[0] + 40}
                y1={y1}
                x2={colX[1] - 35}
                y2={y2}
                stroke={color}
                strokeWidth={1.5}
                strokeOpacity={0.4}
              />
            )
          })}

        {/* Receptor → Effect lines */}
        {links
          .filter((l) => l.type === 'effect')
          .map((l, i) => {
            const y1 = recPos[l.from]
            const y2 = effPos[l.to]
            if (y1 == null || y2 == null) return null
            const color = getReceptorColor(l.from)
            return (
              <line
                key={`re-${i}`}
                x1={colX[1] + 35}
                y1={y1}
                x2={colX[2] - 40}
                y2={y2}
                stroke={color}
                strokeWidth={1.5}
                strokeOpacity={0.3}
                strokeDasharray="3,2"
              />
            )
          })}

        {/* Molecule nodes */}
        {molecules.map((m, i) => (
          <g key={`mol-${m.name}`}>
            <rect
              x={colX[0] - 38}
              y={molY(i)}
              width={76}
              height={nodeH}
              rx={6}
              className="fill-gray-50 dark:fill-white/[0.04] stroke-gray-200 dark:stroke-white/10"
              strokeWidth={1}
            />
            <text
              x={colX[0]}
              y={molY(i) + nodeH / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-700 dark:fill-[#c0d4c6] text-[8px] font-semibold"
            >
              {m.name.length > 10 ? m.name.slice(0, 9) + '...' : m.name}
            </text>
          </g>
        ))}

        {/* Receptor nodes */}
        {receptors.map((r, i) => {
          const color = getReceptorColor(r.name)
          return (
            <g key={`rec-${r.name}`}>
              <rect
                x={colX[1] - 32}
                y={recY(i)}
                width={64}
                height={nodeH}
                rx={14}
                fill={`${color}18`}
                stroke={color}
                strokeWidth={1.5}
              />
              <text
                x={colX[1]}
                y={recY(i) + nodeH / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={color}
                className="text-[8px] font-bold"
              >
                {r.name}
              </text>
            </g>
          )
        })}

        {/* Effect nodes */}
        {effects.map((e, i) => {
          const pct = Math.round((e.probability || 0) * 100)
          return (
            <g key={`eff-${e.name}`}>
              <rect
                x={colX[2] - 40}
                y={effY(i)}
                width={80}
                height={nodeH}
                rx={6}
                className="fill-leaf-500/[0.08] stroke-leaf-500/30"
                strokeWidth={1}
              />
              <text
                x={colX[2]}
                y={effY(i) + nodeH / 2 - 3}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-700 dark:fill-[#c0d4c6] text-[7px] font-semibold"
              >
                {e.name.length > 12 ? e.name.slice(0, 11) + '...' : e.name}
              </text>
              <text
                x={colX[2]}
                y={effY(i) + nodeH / 2 + 7}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-400 dark:fill-[#6a7a6e] text-[6px]"
              >
                {pct}% likely
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
