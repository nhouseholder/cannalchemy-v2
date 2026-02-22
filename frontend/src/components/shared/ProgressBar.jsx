import clsx from 'clsx'

export default function ProgressBar({ value, max = 100, label, color = '#32c864', height = 6, className }) {
  const pct = typeof value === 'number' ? Math.min((value / max) * 100, 100) : 0

  return (
    <div className={clsx('w-full mb-1.5', className)}>
      <div className="flex justify-between text-[11px] mb-0.5">
        <span className="text-gray-500 dark:text-[#8a9a8e]">{label}</span>
        <span style={{ color }}>{typeof value === 'number' ? `${value}%` : value}</span>
      </div>
      <div
        className="w-full rounded-full bg-gray-200 dark:bg-white/[0.06]"
        style={{ height }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${typeof value === 'number' ? `${value}%` : value}`}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
      </div>
    </div>
  )
}
