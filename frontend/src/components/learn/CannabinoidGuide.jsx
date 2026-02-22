import { useState } from 'react'
import clsx from 'clsx'
import { CANNABINOIDS } from '../../data/cannabinoids'
import Card from '../shared/Card'
import { ChevronDown, ChevronUp, Shield, Zap, Scale } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Hardcoded educational content per cannabinoid                      */
/* ------------------------------------------------------------------ */
const CANNABINOID_DETAILS = {
  thc: {
    benefits: [
      'Pain relief and anti-inflammatory',
      'Appetite stimulation',
      'Nausea reduction',
      'Euphoria and mood elevation',
      'Muscle relaxant',
    ],
    howItWorks:
      'THC binds directly to CB1 receptors in the brain and central nervous system, mimicking the endocannabinoid anandamide. This activation triggers the release of dopamine, producing feelings of euphoria. It also modulates pain signaling, appetite, and memory formation.',
    legalStatus:
      'Federally illegal in the US (Schedule I). Legal for recreational use in 24+ states and medically in 38+ states. Legal in Canada, Uruguay, and parts of Europe. Regulations vary widely by jurisdiction.',
  },
  cbd: {
    benefits: [
      'Anxiety and stress reduction',
      'Anti-inflammatory properties',
      'Seizure reduction (FDA-approved for epilepsy)',
      'Neuroprotective potential',
      'May reduce THC-induced anxiety',
    ],
    howItWorks:
      'CBD does not bind strongly to CB1 or CB2 receptors. Instead, it modulates the endocannabinoid system indirectly by inhibiting the breakdown of anandamide, enhancing endocannabinoid tone. It also interacts with serotonin 5-HT1A receptors, TRPV1 pain receptors, and GPR55 receptors.',
    legalStatus:
      'Legal federally in the US when derived from hemp (under 0.3% THC) per the 2018 Farm Bill. Widely available as supplements, oils, and topicals. FDA-approved as Epidiolex for certain seizure disorders. Legal in most countries with varying regulations.',
  },
  cbn: {
    benefits: [
      'Sedative and sleep aid',
      'Mild pain relief',
      'Anti-inflammatory',
      'Appetite stimulation',
      'Antibacterial properties',
    ],
    howItWorks:
      'CBN forms as THC oxidizes and degrades over time. It has weak affinity for CB1 receptors (about 10% of THC\'s potency) and stronger affinity for CB2 receptors. Its sedative effects may be enhanced by the entourage effect when combined with other cannabinoids and terpenes like myrcene.',
    legalStatus:
      'Legal status is ambiguous in many jurisdictions. Generally treated similarly to CBD when derived from hemp. Not specifically scheduled federally in the US but exists in a gray area. Available in specialty sleep products in legal markets.',
  },
  cbg: {
    benefits: [
      'Anti-inflammatory effects',
      'May support focus and concentration',
      'Appetite stimulation',
      'Antibacterial potential (including MRSA)',
      'Neuroprotective properties',
    ],
    howItWorks:
      'CBG is the precursor molecule from which all other cannabinoids are synthesized (hence "mother cannabinoid"). CBGA converts into THCA, CBDA, and CBCA via specific enzymes. CBG interacts with both CB1 and CB2 receptors as a partial agonist and also influences alpha-2 adrenergic receptors and 5-HT1A serotonin receptors.',
    legalStatus:
      'Legal when derived from hemp in the US under the 2018 Farm Bill. Non-psychoactive. Increasingly available in specialty products. Not specifically regulated in most jurisdictions. Growing commercial interest due to therapeutic potential.',
  },
  thcv: {
    benefits: [
      'Appetite suppression (low doses)',
      'Energizing and clear-headed effects',
      'May help regulate blood sugar',
      'Shorter duration of psychoactive effects',
      'Potential for anxiety reduction',
    ],
    howItWorks:
      'THCV acts as a CB1 receptor antagonist at low doses (blocking the receptor and suppressing appetite) but becomes a CB1 agonist at higher doses (producing psychoactive effects). This dose-dependent behavior makes it unique among cannabinoids. It also activates CB2 and 5-HT1A receptors.',
    legalStatus:
      'Legal gray area in the US. When derived from hemp with less than 0.3% Delta-9 THC, it may be considered legal federally. However, its psychoactive potential at higher doses complicates classification. Found primarily in African sativa strains.',
  },
  cbc: {
    benefits: [
      'Anti-inflammatory properties',
      'May support neurogenesis (brain cell growth)',
      'Mood elevation via anandamide regulation',
      'Analgesic effects',
      'Amplifies other cannabinoids via entourage effect',
    ],
    howItWorks:
      'CBC does not bind well to CB1 or CB2 receptors directly. Instead, it interacts with TRPV1 and TRPA1 receptors (involved in pain perception) and inhibits the reuptake of anandamide, allowing this natural endocannabinoid to remain in the bloodstream longer. This mechanism may contribute to mood elevation and pain relief.',
    legalStatus:
      'Generally legal when derived from hemp in the US. Non-psychoactive. Not specifically scheduled or regulated in most jurisdictions. Available in some full-spectrum products. Less commercially developed than CBD or CBG.',
  },
}

/* ------------------------------------------------------------------ */
/*  Single cannabinoid card                                            */
/* ------------------------------------------------------------------ */
function CannabinoidCard({ cannabinoid }) {
  const [expanded, setExpanded] = useState(false)
  const details = CANNABINOID_DETAILS[cannabinoid.id] || {}

  return (
    <Card
      className="overflow-hidden transition-all duration-200"
      hoverable
      onClick={() => setExpanded((prev) => !prev)}
      aria-expanded={expanded}
      aria-label={`${cannabinoid.name} cannabinoid card`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                backgroundColor: `${cannabinoid.color}20`,
                color: cannabinoid.color,
              }}
            >
              {cannabinoid.name}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-[#e8f0ea]">
                {cannabinoid.name}
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-[#5a6a5e]">
                {cannabinoid.fullName}
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp size={14} className="text-gray-400 dark:text-[#5a6a5e] flex-shrink-0" />
          ) : (
            <ChevronDown size={14} className="text-gray-400 dark:text-[#5a6a5e] flex-shrink-0" />
          )}
        </div>

        {/* Brief description */}
        <p className="text-xs text-gray-600 dark:text-[#8a9a8e] leading-relaxed mb-3">
          {cannabinoid.description}
        </p>

        {/* Key benefits pills */}
        {details.benefits && (
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#5a6a5e]">
              Key Benefits
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {details.benefits.slice(0, expanded ? undefined : 3).map((benefit) => (
                <span
                  key={benefit}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{
                    backgroundColor: `${cannabinoid.color}15`,
                    color: cannabinoid.color,
                  }}
                >
                  {benefit}
                </span>
              ))}
              {!expanded && details.benefits.length > 3 && (
                <span className="text-[10px] text-gray-400 dark:text-[#5a6a5e] px-1 py-0.5">
                  +{details.benefits.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Expanded detail sections */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.04] animate-fade-in-fast space-y-3">
            {/* How it works */}
            {details.howItWorks && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap size={11} className="text-amber-400" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-[#6a7a6e]">
                    How It Works
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-[#8a9a8e] leading-relaxed">
                  {details.howItWorks}
                </p>
              </div>
            )}

            {/* Legal status */}
            {details.legalStatus && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Scale size={11} className="text-blue-400" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-[#6a7a6e]">
                    Legal Status
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-[#8a9a8e] leading-relaxed">
                  {details.legalStatus}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  CannabinoidGuide                                                   */
/* ------------------------------------------------------------------ */
export function CannabinoidGuide() {
  return (
    <section aria-labelledby="cannabinoid-guide-heading">
      <h2
        id="cannabinoid-guide-heading"
        className="text-xl font-bold text-gray-900 dark:text-[#e8f0ea] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Cannabinoid Guide
      </h2>
      <p className="text-sm text-gray-600 dark:text-[#8a9a8e] mb-6 leading-relaxed max-w-2xl">
        Cannabinoids are the active chemical compounds in cannabis that interact with your
        endocannabinoid system. Each one produces different effects, and understanding them
        helps you make better choices. Click any card to expand details on mechanism of action
        and legal status.
      </p>

      <div
        className="grid gap-3 sm:grid-cols-2"
        role="list"
        aria-label="Cannabinoid cards"
      >
        {CANNABINOIDS.map((cann) => (
          <div key={cann.id} role="listitem">
            <CannabinoidCard cannabinoid={cann} />
          </div>
        ))}
      </div>
    </section>
  )
}
