import { createContext, useReducer, useCallback } from 'react'

const initialState = {
  strains: [],
  aiPicks: [],
  idealProfile: null,
  dispensaries: [],
  sortBy: 'match',
  filterType: 'all',
  isLoading: false,
  error: null,
  loadingPhase: 0,
  loadingMsg: '',
}

function resultsReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null, loadingPhase: 0, loadingMsg: '' }
    case 'SET_LOADING_PHASE':
      return { ...state, loadingPhase: action.payload.phase, loadingMsg: action.payload.msg }
    case 'SET_RESULTS':
      return {
        ...state,
        strains: action.payload.strains || [],
        aiPicks: action.payload.aiPicks || [],
        idealProfile: action.payload.idealProfile || null,
        isLoading: false,
        error: null,
      }
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    case 'SET_DISPENSARIES':
      return { ...state, dispensaries: action.payload }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload }
    case 'SET_FILTER':
      return { ...state, filterType: action.payload }
    case 'DISMISS_STRAIN':
      return { ...state, strains: state.strains.filter(s => s.name !== action.payload) }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export const ResultsContext = createContext(null)

export function ResultsProvider({ children }) {
  const [state, dispatch] = useReducer(resultsReducer, initialState)

  const getSortedStrains = useCallback(() => {
    let filtered = [...state.strains]
    if (state.filterType !== 'all') {
      filtered = filtered.filter(s => s.type?.toLowerCase() === state.filterType)
    }
    switch (state.sortBy) {
      case 'match':
        return filtered.sort((a, b) => (b.matchPct || 0) - (a.matchPct || 0))
      case 'thc':
        return filtered.sort((a, b) => (b.thc || 0) - (a.thc || 0))
      case 'cbd':
        return filtered.sort((a, b) => (b.cbd || 0) - (a.cbd || 0))
      case 'sentiment':
        return filtered.sort((a, b) => (b.sentimentScore || 0) - (a.sentimentScore || 0))
      default:
        return filtered
    }
  }, [state.strains, state.sortBy, state.filterType])

  return (
    <ResultsContext.Provider value={{ state, dispatch, getSortedStrains }}>
      {children}
    </ResultsContext.Provider>
  )
}
