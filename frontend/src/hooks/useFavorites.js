import { useContext, useCallback } from 'react'
import { UserContext } from '../context/UserContext'

export function useFavorites() {
  const { state, dispatch, isFavorite } = useContext(UserContext)

  const toggleFavorite = useCallback((strainName) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: strainName })
  }, [dispatch])

  return {
    favorites: state.favorites,
    isFavorite,
    toggleFavorite,
  }
}
