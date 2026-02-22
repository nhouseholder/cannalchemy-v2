import { useState, useMemo } from 'react'
import { Search, Check, X } from 'lucide-react'
import clsx from 'clsx'
import { getTypeColor } from '../../utils/colors'

export function CompareSelector({
  strains = [],
  selectedStrains = [],
  onToggleStrain,
  maxCompare = 3,
}) {
  const [query, setQuery] = useState('')

  const isMaxReached = selectedStrains.length >= maxCompare
  const selectedIds = useMemo(
    () => new Set(selectedStrains.map((s) => s.name)),
    [selectedStrains]
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return strains
    const lower = query.toLowerCase()
    return strains.filter((s) => s.name?.toLowerCase().includes(lower))
  }, [strains, query])

  return (
    <div
      className="flex flex-col gap-3"
      role="region"
      aria-label="Strain comparison selector"
    >
      {/* Search input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#6a7a6e] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search strains by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={clsx(
            'w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border transition-colors duration-200',
            'bg-white dark:bg-surface text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#6a7a6e]',
            'border-gray-200 dark:border-surface-border',
            'focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent'
          )}
          aria-label="Search strains to compare"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#6a7a6e] hover:text-gray-600 dark:hover:text-[#b0c4b4] transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Selection count & max message */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-gray-500 dark:text-[#8a9a8e]">
          {selectedStrains.length} of {maxCompare} selected
        </span>
        {isMaxReached && (
          <span className="text-xs text-amber-500 dark:text-amber-400 font-medium">
            Max strains selected
          </span>
        )}
      </div>

      {/* Strain list */}
      <ul
        className={clsx(
          'flex flex-col gap-2 max-h-80 overflow-y-auto pr-1',
          'scrollbar-thin'
        )}
        role="listbox"
        aria-label="Available strains"
        aria-multiselectable="true"
      >
        {filtered.length === 0 && (
          <li className="py-6 text-center text-sm text-gray-400 dark:text-[#6a7a6e]">
            No strains found matching &ldquo;{query}&rdquo;
          </li>
        )}

        {filtered.map((strain) => {
          const isSelected = selectedIds.has(strain.name)
          const isDisabled = !isSelected && isMaxReached
          const tc = getTypeColor(strain.type)

          return (
            <li key={strain.name} role="option" aria-selected={isSelected}>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onToggleStrain?.(strain)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-leaf-900',
                  isSelected
                    ? 'border-leaf-500/40 dark:border-leaf-500/40 bg-leaf-50 dark:bg-leaf-500/[0.08]'
                    : 'border-gray-200 dark:border-surface-border bg-white dark:bg-surface hover:bg-gray-50 dark:hover:bg-surface-hover',
                  isDisabled && 'opacity-40 cursor-not-allowed'
                )}
                aria-label={`${isSelected ? 'Remove' : 'Add'} ${strain.name} ${isDisabled ? '(max reached)' : ''}`}
              >
                {/* Checkbox indicator */}
                <div
                  className={clsx(
                    'flex items-center justify-center w-5 h-5 rounded-md border-2 flex-shrink-0 transition-colors duration-200',
                    isSelected
                      ? 'bg-leaf-500 border-leaf-500 text-white'
                      : 'border-gray-300 dark:border-white/20'
                  )}
                  aria-hidden="true"
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>

                {/* Strain info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-semibold text-gray-900 dark:text-white truncate"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {strain.name}
                    </span>
                    {/* Type badge */}
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex-shrink-0"
                      style={{
                        backgroundColor: `${tc.hex}22`,
                        borderColor: `${tc.hex}55`,
                        color: tc.hex,
                      }}
                    >
                      {tc.label}
                    </span>
                  </div>
                  {strain.genetics && (
                    <p className="text-[10px] italic text-gray-400 dark:text-[#6a7a6e] mt-0.5 truncate">
                      {strain.genetics}
                    </p>
                  )}
                </div>

                {/* Match % */}
                {strain.matchPct != null && (
                  <div
                    className="flex items-center justify-center min-w-[40px] h-8 rounded-lg text-xs font-bold border flex-shrink-0"
                    style={{
                      backgroundColor: `${tc.hex}18`,
                      borderColor: `${tc.hex}44`,
                      color: tc.hex,
                    }}
                  >
                    {Math.round(strain.matchPct)}%
                  </div>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
