import { useState, useMemo, useCallback } from 'react'
import strainsData from '../data/strains.json'

export function useStrainSearch() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query || query.length < 2) return []
    const lower = query.toLowerCase()
    return strainsData
      .filter(s =>
        s.name.toLowerCase().includes(lower) ||
        s.type.toLowerCase().includes(lower) ||
        s.effects?.some(e => e.toLowerCase().includes(lower)) ||
        s.flavors?.some(f => f.toLowerCase().includes(lower))
      )
      .slice(0, 20)
  }, [query])

  const getStrainByName = useCallback((name) => {
    return strainsData.find(s => s.name.toLowerCase() === name?.toLowerCase())
  }, [])

  const getStrainById = useCallback((id) => {
    return strainsData.find(s => s.id === id)
  }, [])

  return { query, setQuery, results, getStrainByName, getStrainById, allStrains: strainsData }
}
