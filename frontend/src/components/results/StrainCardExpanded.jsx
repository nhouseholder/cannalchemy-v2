import { useContext } from 'react'
import { QuizContext } from '../../context/QuizContext'
import WhyMatchTooltip from '../strain-detail/WhyMatchTooltip'
import CannabinoidProfile from '../strain-detail/CannabinoidProfile'
import TerpeneProfile from '../strain-detail/TerpeneProfile'
import MolecularScience from '../strain-detail/MolecularScience'
import SommelierReview from '../strain-detail/SommelierReview'
import ForumAnalysis from '../strain-detail/ForumAnalysis'
import LineageTree from '../strain-detail/LineageTree'
import DosageGuide from '../strain-detail/DosageGuide'

export default function StrainCardExpanded({ strain }) {
  const quiz = useContext(QuizContext)
  const tolerance = quiz?.state?.tolerance || 'beginner'
  const method = quiz?.state?.consumptionMethod || 'flower'

  // Build cannabinoids array from strain data
  const cannabinoids = strain.cannabinoids || [
    { name: 'THC', value: strain.thc || 0, color: '#32c864' },
    { name: 'CBD', value: strain.cbd || 0, color: '#3b82f6' },
    { name: 'CBN', value: strain.cbn || 0, color: '#a855f7' },
    { name: 'CBG', value: strain.cbg || 0, color: '#f59e0b' },
    { name: 'THCV', value: strain.thcv || 0, color: '#ef4444' },
    { name: 'CBC', value: strain.cbc || 0, color: '#22d3ee' },
  ]

  return (
    <div className="space-y-5 pt-4 border-t border-gray-200 dark:border-white/[0.06]">
      {/* 1. Why This Match */}
      {strain.whyMatch && (
        <WhyMatchTooltip text={strain.whyMatch} />
      )}

      {/* 2. Cannabinoid Profile */}
      <CannabinoidProfile cannabinoids={cannabinoids} />

      {/* 3. Terpene Profile (all terpenes) */}
      {strain.terpenes?.length > 0 && (
        <TerpeneProfile terpenes={strain.terpenes} />
      )}

      {/* 3b. Molecular Science (Cannalchemy receptor pathways) */}
      {(strain.effectPredictions?.length > 0 || strain.pathways?.length > 0) && (
        <MolecularScience
          effectPredictions={strain.effectPredictions}
          pathways={strain.pathways}
        />
      )}

      {/* 4. Sommelier Review */}
      {strain.sommelierScores && (
        <SommelierReview
          scores={strain.sommelierScores}
          notes={strain.sommelierNotes}
        />
      )}

      {/* 5. Forum / Community Analysis */}
      {(strain.forumAnalysis || strain.bestFor?.length > 0 || strain.sentimentScore != null) && (
        <ForumAnalysis
          data={strain.forumAnalysis}
          bestFor={strain.bestFor}
          notIdealFor={strain.notIdealFor}
          sentimentScore={strain.sentimentScore}
        />
      )}

      {/* 6. Lineage Tree */}
      {strain.lineage && (
        <LineageTree lineage={strain.lineage} />
      )}

      {/* 7. Dosage Guide */}
      <DosageGuide
        strain={strain}
        tolerance={tolerance}
        method={method}
      />
    </div>
  )
}
