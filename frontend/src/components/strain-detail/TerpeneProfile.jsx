import TerpBadge from '../../shared/TerpBadge'
import { getTerpeneColor } from '../../utils/colors'

export default function TerpeneProfile({ terpenes }) {
  if (!terpenes?.length) return null

  const maxPct = Math.max(...terpenes.map(t => t.pct || 0), 1)

  return (
    <div>
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-[#6a7a6e] mb-3">
        Terpene Profile
      </h4>
      <div className="space-y-2">
        {terpenes.map((t) => {
          const color = getTerpeneColor(t.name)
          const widthPct = maxPct > 0 ? ((t.pct || 0) / maxPct) * 100 : 0

          return (
            <div key={t.name} className="flex items-center gap-3">
              <div className="w-24 flex-shrink-0">
                <TerpBadge name={t.name} pct={t.pct != null ? `${t.pct}%` : ''} />
              </div>
              <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: color,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
