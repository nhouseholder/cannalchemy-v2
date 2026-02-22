import { Lightbulb } from 'lucide-react'

export default function WhyMatchTooltip({ text }) {
  if (!text) return null

  return (
    <div className="rounded-xl border border-leaf-500/20 bg-leaf-500/[0.06] p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Lightbulb size={16} className="text-leaf-400" />
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-leaf-400 mb-1.5">
            Why This Match
          </h4>
          <p className="text-xs leading-relaxed text-gray-600 dark:text-[#b0c4b4]">
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}
