import { memo, useState, useRef, useEffect } from 'react'
import { FlaskConical, ChevronDown } from 'lucide-react'
import EffectVerification from './EffectVerification'
import MolecularScience from './MolecularScience'
import LineageTree from './LineageTree'
import ReceptorMap from './ReceptorMap'
import ScienceExplanation from './ScienceExplanation'

/**
 * DeepScience — Collapsible accordion wrapping the 5 advanced science sections.
 *
 * Default: collapsed. Beginners never need to see it.
 * Enthusiasts click to expand and explore molecular pathways, genetics, etc.
 */
export default memo(function DeepScience({ strain }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef(null)
  const [maxHeight, setMaxHeight] = useState(0)

  useEffect(() => {
    if (open && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight)
    }
  }, [open])

  // Don't render if there's nothing to show
  const hasEffectVerification = strain.effectPredictions?.length > 0 && strain.forumAnalysis
  const hasMolecularScience = strain.effectPredictions?.length > 0 || strain.pathways?.length > 0
  const hasLineage = !!strain.lineage
  const hasReceptorMap = strain.pathways?.length > 0
  const hasScienceExplanation = true // always shows the "generate" button

  if (!hasEffectVerification && !hasMolecularScience && !hasLineage && !hasReceptorMap) {
    return null
  }

  return (
    <div className="rounded-2xl border border-purple-500/15 bg-purple-500/[0.02] overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between p-4 hover:bg-purple-500/[0.04] transition-colors duration-200"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <FlaskConical size={14} className="text-purple-400" />
          </div>
          <div className="text-left">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
              Deep Science
            </h4>
            <p className="text-[9px] text-gray-400 dark:text-[#5a6a5e]">
              Molecular pathways, genetics & AI analysis
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-purple-400/60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expandable content */}
      <div
        ref={contentRef}
        className="transition-[max-height] duration-500 ease-in-out overflow-hidden"
        style={{ maxHeight: open ? `${maxHeight}px` : '0px' }}
      >
        <div className="px-4 pb-4 space-y-5">
          {/* 1. Predicted vs Reported */}
          {hasEffectVerification && (
            <EffectVerification
              predictions={strain.effectPredictions}
              forumData={strain.forumAnalysis}
            />
          )}

          {/* 2. How It Works (effect probabilities + receptor cards) */}
          {hasMolecularScience && (
            <MolecularScience
              effectPredictions={strain.effectPredictions}
              pathways={strain.pathways}
            />
          )}

          {/* 3. Genetics & Lineage */}
          {hasLineage && (
            <LineageTree lineage={strain.lineage} />
          )}

          {/* 4. Molecular Pathways (flow graph) */}
          {hasReceptorMap && (
            <ReceptorMap
              pathways={strain.pathways}
              effectPredictions={strain.effectPredictions}
            />
          )}

          {/* 5. AI Analysis */}
          {hasScienceExplanation && (
            <ScienceExplanation strain={strain} />
          )}
        </div>
      </div>
    </div>
  )
})
