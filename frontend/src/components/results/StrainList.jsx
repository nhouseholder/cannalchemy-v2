import { useState, useContext } from 'react'
import { ResultsContext } from '../../context/ResultsContext'
import { useFavorites } from '../../hooks/useFavorites'
import StrainCard from './StrainCard'
import SortControls from './SortControls'

export default function StrainList() {
  const { getSortedStrains } = useContext(ResultsContext)
  const { isFavorite, toggleFavorite } = useFavorites()
  const [expandedStrain, setExpandedStrain] = useState(null)

  const strains = getSortedStrains()

  const handleToggle = (strainName) => {
    setExpandedStrain((prev) => (prev === strainName ? null : strainName))
  }

  if (strains.length === 0) {
    return null
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-xl font-bold text-gray-900 dark:text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          For You
        </h2>
        <span className="text-[11px] text-gray-400 dark:text-[#6a7a6e]">
          {strains.length} strain{strains.length !== 1 ? 's' : ''}
        </span>
      </div>

      <SortControls />

      <div className="space-y-3">
        {strains.map((strain) => (
          <StrainCard
            key={strain.name}
            strain={strain}
            expanded={expandedStrain === strain.name}
            onToggle={() => handleToggle(strain.name)}
            isFavorite={isFavorite(strain.name)}
            onFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  )
}
