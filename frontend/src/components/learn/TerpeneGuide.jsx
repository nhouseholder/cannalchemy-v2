import { useState } from 'react'
import clsx from 'clsx'
import terpenes from '../../data/terpenes.json'
import { TERPENE_COLORS } from '../../utils/colors'
import Card from '../shared/Card'
import { ChevronDown, ChevronUp, Thermometer, Leaf, Beaker } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Hardcoded supplemental data                                        */
/* ------------------------------------------------------------------ */
const ALSO_FOUND_IN = {
  myrcene: ['Mangoes', 'Lemongrass', 'Hops'],
  limonene: ['Citrus fruits', 'Juniper', 'Peppermint'],
  caryophyllene: ['Black Pepper', 'Cloves', 'Cinnamon'],
  linalool: ['Lavender', 'Basil', 'Birch bark'],
  pinene: ['Pine needles', 'Rosemary', 'Basil'],
  terpinolene: ['Nutmeg', 'Tea tree', 'Cumin'],
  humulene: ['Hops', 'Coriander', 'Basil'],
  ocimene: ['Mint', 'Parsley', 'Orchids'],
  bisabolol: ['Chamomile', 'Candeia tree'],
}

const BOILING_POINTS = {
  myrcene: '334\u00b0F',
  limonene: '349\u00b0F',
  caryophyllene: '266\u00b0F',
  linalool: '388\u00b0F',
  pinene: '311\u00b0F',
  terpinolene: '365\u00b0F',
  humulene: '222\u00b0F',
  ocimene: '122\u00b0F',
  bisabolol: '307\u00b0F',
}

/* ------------------------------------------------------------------ */
/*  Single terpene card                                                */
/* ------------------------------------------------------------------ */
function TerpeneCard({ terpeneKey, terp }) {
  const [expanded, setExpanded] = useState(false)
  const color = TERPENE_COLORS[terpeneKey] || TERPENE_COLORS.default
  const effectKeys = Object.entries(terp.effectWeight || {})
    .filter(([, v]) => v >= 0.5)
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => k)

  return (
    <Card
      className={clsx('overflow-hidden transition-all duration-200')}
      hoverable
      onClick={() => setExpanded((prev) => !prev)}
      aria-expanded={expanded}
      aria-label={`${terp.name} terpene card`}
    >
      {/* Color-coded left border */}
      <div className="flex">
        <div
          className="w-1.5 flex-shrink-0 rounded-l-2xl"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />

        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <h3 className="text-sm font-bold text-gray-900 dark:text-[#e8f0ea]">
                {terp.name}
              </h3>
            </div>
            {expanded ? (
              <ChevronUp size={14} className="text-gray-400 dark:text-[#5a6a5e]" />
            ) : (
              <ChevronDown size={14} className="text-gray-400 dark:text-[#5a6a5e]" />
            )}
          </div>

          {/* Key effects */}
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#5a6a5e]">
              Key Effects
            </span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {effectKeys.map((eff) => (
                <span
                  key={eff}
                  className="px-1.5 py-0.5 rounded text-[10px] capitalize font-medium"
                  style={{
                    backgroundColor: `${color}15`,
                    color: color,
                  }}
                >
                  {eff.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Aroma */}
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#5a6a5e]">
              Aroma
            </span>
            <p className="text-xs text-gray-600 dark:text-[#8a9a8e] mt-0.5">
              {terp.aroma.join(', ')}
            </p>
          </div>

          {/* Also found in */}
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#5a6a5e]">
              Also Found In
            </span>
            <p className="text-xs text-gray-600 dark:text-[#8a9a8e] mt-0.5">
              {(ALSO_FOUND_IN[terpeneKey] || terp.alsoFoundIn || []).join(', ')}
            </p>
          </div>

          {/* Boiling point */}
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-100 dark:border-white/[0.04]">
            <Thermometer size={10} className="text-gray-400 dark:text-[#5a6a5e]" />
            <span className="text-[10px] text-gray-400 dark:text-[#5a6a5e]">
              Boiling point: {BOILING_POINTS[terpeneKey] || terp.boilingPoint}
            </span>
          </div>

          {/* Expanded details */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.04] animate-fade-in-fast space-y-3">
              {/* Description */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Leaf size={11} className="text-leaf-500" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-[#6a7a6e]">
                    Description
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-[#8a9a8e] leading-relaxed">
                  {terp.description}
                </p>
              </div>

              {/* Published research (informational only) */}
              {terp.medicalResearch && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Beaker size={11} className="text-purple-400" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-[#6a7a6e]">
                      Published Research (Informational)
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-[#8a9a8e] leading-relaxed">
                    {terp.medicalResearch}
                  </p>
                </div>
              )}

              {/* Full effect weight breakdown */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-[#6a7a6e] block mb-1.5">
                  Effect Profile
                </span>
                <div className="space-y-1">
                  {Object.entries(terp.effectWeight || {})
                    .filter(([, v]) => v !== 0)
                    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
                    .map(([effect, weight]) => (
                      <div key={effect} className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 dark:text-[#6a7a6e] w-20 capitalize truncate">
                          {effect.replace(/_/g, ' ')}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.abs(weight) * 100}%`,
                              backgroundColor: weight < 0 ? '#f06595' : color,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-[#5a6a5e] w-8 text-right">
                          {weight < 0 ? weight.toFixed(1) : weight.toFixed(1)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  TerpeneGuide                                                       */
/* ------------------------------------------------------------------ */
export function TerpeneGuide() {
  const terpeneEntries = Object.entries(terpenes)

  return (
    <section aria-labelledby="terpene-guide-heading">
      <h2
        id="terpene-guide-heading"
        className="text-xl font-bold text-gray-900 dark:text-[#e8f0ea] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Terpene Guide
      </h2>
      <p className="text-sm text-gray-600 dark:text-[#8a9a8e] mb-6 leading-relaxed max-w-2xl">
        Terpenes are aromatic compounds produced by cannabis and many other plants. They shape
        the taste, smell, and -- most importantly -- the effects of each strain. Click any card
        to explore the full profile, including published research summaries and community-reported effect information.
      </p>

      <div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Terpene cards"
      >
        {terpeneEntries.map(([key, terp]) => (
          <div key={key} role="listitem">
            <TerpeneCard terpeneKey={key} terp={terp} />
          </div>
        ))}
      </div>
    </section>
  )
}
