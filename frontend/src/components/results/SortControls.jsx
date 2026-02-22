import { useContext } from 'react'
import clsx from 'clsx'
import { ArrowUpDown, Filter } from 'lucide-react'
import { ResultsContext } from '../../context/ResultsContext'

const SORT_OPTIONS = [
  { key: 'match', label: 'Match %' },
  { key: 'sentiment', label: 'Sentiment' },
  { key: 'thc', label: 'THC Level' },
  { key: 'cbd', label: 'CBD Level' },
]

const FILTER_OPTIONS = [
  { key: 'all', label: 'All', color: null },
  { key: 'indica', label: 'Indica', color: '#9350ff' },
  { key: 'sativa', label: 'Sativa', color: '#ff8c32' },
  { key: 'hybrid', label: 'Hybrid', color: '#32c864' },
]

export default function SortControls() {
  const { state, dispatch } = useContext(ResultsContext)

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      {/* Sort pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <ArrowUpDown size={12} className="text-gray-400 dark:text-[#6a7a6e] flex-shrink-0" />
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={clsx(
              'inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500',
              state.sortBy === opt.key
                ? 'bg-leaf-500/15 text-leaf-400 border border-leaf-500/30'
                : 'bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-[#8a9a8e] border border-transparent hover:bg-gray-200 dark:hover:bg-white/[0.08]'
            )}
            onClick={() => dispatch({ type: 'SET_SORT', payload: opt.key })}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px bg-gray-200 dark:bg-white/[0.06] mx-1" />

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <Filter size={12} className="text-gray-400 dark:text-[#6a7a6e] flex-shrink-0" />
        {FILTER_OPTIONS.map((opt) => {
          const isActive = state.filterType === opt.key

          return (
            <button
              key={opt.key}
              type="button"
              className={clsx(
                'inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500',
                isActive && opt.color
                  ? 'border'
                  : isActive
                    ? 'bg-leaf-500/15 text-leaf-400 border border-leaf-500/30'
                    : 'bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-[#8a9a8e] border border-transparent hover:bg-gray-200 dark:hover:bg-white/[0.08]'
              )}
              style={
                isActive && opt.color
                  ? {
                      backgroundColor: `${opt.color}18`,
                      borderColor: `${opt.color}44`,
                      color: opt.color,
                    }
                  : undefined
              }
              onClick={() => dispatch({ type: 'SET_FILTER', payload: opt.key })}
            >
              {opt.color && (
                <span
                  className="w-1.5 h-1.5 rounded-full mr-1.5"
                  style={{ backgroundColor: opt.color }}
                />
              )}
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
