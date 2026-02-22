import ProgressBar from '../../shared/ProgressBar'

const DEFAULT_CANNABINOIDS = [
  { name: 'THC', color: '#32c864' },
  { name: 'CBD', color: '#3b82f6' },
  { name: 'CBN', color: '#a855f7' },
  { name: 'CBG', color: '#f59e0b' },
  { name: 'THCV', color: '#ef4444' },
  { name: 'CBC', color: '#22d3ee' },
]

export default function CannabinoidProfile({ cannabinoids }) {
  const items = cannabinoids?.length
    ? cannabinoids
    : DEFAULT_CANNABINOIDS.map(d => ({ ...d, value: 0 }))

  return (
    <div>
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-[#6a7a6e] mb-3">
        Cannabinoid Profile
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
        {items.map((c) => (
          <ProgressBar
            key={c.name}
            label={c.name}
            value={typeof c.value === 'number' ? c.value : 0}
            max={c.name === 'THC' ? 35 : 20}
            color={c.color || '#32c864'}
          />
        ))}
      </div>
    </div>
  )
}
