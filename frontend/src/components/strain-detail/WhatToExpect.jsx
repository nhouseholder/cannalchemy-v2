import { memo } from 'react'
import { Zap, ThumbsUp, ThumbsDown } from 'lucide-react'
import { EffectBadge } from '../shared/Badge'

function StrengthDots({ probability }) {
  const pct = Math.round((probability ?? 0) * 100)
  const filled = pct > 70 ? 3 : pct > 40 ? 2 : 1
  const label = pct > 70 ? 'Strong' : pct > 40 ? 'Moderate' : 'Mild'
  const color = pct > 70 ? 'bg-leaf-500' : pct > 40 ? 'bg-amber-400' : 'bg-gray-400'

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i <= filled ? color : 'bg-gray-200 dark:bg-white/10'}`}
          />
        ))}
      </div>
      <span className="text-[9px] text-gray-400 dark:text-[#6a7a6e]">{label}</span>
    </div>
  )
}

export default memo(function WhatToExpect({ bestFor, notIdealFor, effectPredictions, effects }) {
  // Fallback: if bestFor is empty, derive from top effects
  const displayBestFor = bestFor?.length > 0
    ? bestFor
    : (effects || []).slice(0, 3)

  const topPredictions = (effectPredictions || []).slice(0, 4)

  if (!displayBestFor.length && !topPredictions.length) return null

  return (
    <div className="rounded-xl border border-leaf-500/15 bg-leaf-500/[0.03] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} className="text-leaf-400" />
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-leaf-400">
          What To Expect
        </h4>
      </div>

      {/* Best For / Not Ideal For tags */}
      {(displayBestFor.length > 0 || notIdealFor?.length > 0) && (
        <div className="space-y-2 mb-3">
          {displayBestFor.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <ThumbsUp size={10} className="text-leaf-400 flex-shrink-0" />
              <span className="text-[9px] font-semibold text-leaf-500/70 dark:text-leaf-400/60 uppercase tracking-wider mr-0.5">
                Best for
              </span>
              {displayBestFor.map(tag => (
                <EffectBadge key={tag} effect={tag} variant="positive" />
              ))}
            </div>
          )}
          {notIdealFor?.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <ThumbsDown size={10} className="text-red-400/70 flex-shrink-0" />
              <span className="text-[9px] font-semibold text-red-400/50 uppercase tracking-wider mr-0.5">
                Not ideal for
              </span>
              {notIdealFor.map(tag => (
                <EffectBadge key={tag} effect={tag} variant="negative" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top predicted effects with strength indicators */}
      {topPredictions.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-leaf-500/10">
          <p className="text-[9px] text-gray-400 dark:text-[#5a6a5e] mb-1">
            Predicted effects based on molecular profile
          </p>
          {topPredictions.map(pred => {
            const displayName = (pred.effect || '')
              .replace(/-/g, ' ')
              .replace(/\b\w/g, c => c.toUpperCase())
            return (
              <div key={pred.effect} className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-gray-700 dark:text-[#c0d4c6]">
                  {displayName}
                </span>
                <StrengthDots probability={pred.probability} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})
