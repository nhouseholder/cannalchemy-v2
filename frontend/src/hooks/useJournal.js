import { useContext, useCallback } from 'react'
import { UserContext } from '../context/UserContext'

export function useJournal() {
  const { state, dispatch, getJournalForStrain, getJournalStats } = useContext(UserContext)

  const addEntry = useCallback((entry) => {
    const newEntry = {
      ...entry,
      id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: newEntry })
    return newEntry
  }, [dispatch])

  const updateEntry = useCallback((entry) => {
    dispatch({ type: 'UPDATE_JOURNAL_ENTRY', payload: entry })
  }, [dispatch])

  const deleteEntry = useCallback((id) => {
    dispatch({ type: 'DELETE_JOURNAL_ENTRY', payload: id })
  }, [dispatch])

  return {
    entries: state.journal,
    addEntry,
    updateEntry,
    deleteEntry,
    getJournalForStrain,
    getJournalStats,
  }
}
