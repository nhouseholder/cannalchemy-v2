import { createContext, useReducer, useCallback } from 'react'

const initialState = {
  strains: [],
  aiPicks: [],
  idealProfile: null,
  isLoading: false,
  error: null,
}

function resultsReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null }
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
    return [...state.strains].sort((a, b) => (b.matchPct || 0) - (a.matchPct || 0))
  }, [state.strains])

  return (
    <ResultsContext.Provider value={{ state, dispatch, getSortedStrains }}>
      {children}
    </ResultsContext.Provider>
  )
}
