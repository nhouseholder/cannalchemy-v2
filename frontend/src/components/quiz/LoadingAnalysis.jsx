export default function LoadingAnalysis({ message = 'Analyzing your preferences...', phase = 1, totalPhases = 3 }) {
  const progress = Math.min((phase / totalPhases) * 100, 100)
  const isFinalizing = phase >= totalPhases

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 animate-fade-in">
      {/* Spinner */}
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <div className="absolute inset-0 w-16 h-16 rounded-full bg-leaf-500/20 animate-pulse-glow" />
        {/* Spinning circle */}
        <div className="w-16 h-16 rounded-full border-[3px] border-leaf-500/20 border-t-leaf-500 animate-spin-slow" />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-leaf-500" />
        </div>
      </div>

      {/* Phase message */}
      <p className="text-lg font-display text-gray-900 dark:text-white mb-2 text-center">
        {message}
      </p>

      {/* Phase counter */}
      <p className="text-sm text-gray-500 dark:text-[#8a9a8e] mb-6">
        {isFinalizing ? 'Finalizing...' : `Phase ${phase} of ${totalPhases}`}
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-leaf-500 to-leaf-400 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={phase}
            aria-valuemin={1}
            aria-valuemax={totalPhases}
            aria-label={`Analysis progress: phase ${phase} of ${totalPhases}`}
          />
        </div>
      </div>
    </div>
  )
}
