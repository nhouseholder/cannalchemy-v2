import { useAuth } from '../context/AuthContext'

const FREE_LIMIT = 1

export function useSubscription() {
  const { isPremium, user } = useAuth()

  // Guest users (no login) and free users both get 1 result
  const canViewResult = (index) => isPremium || index < FREE_LIMIT

  return {
    isPremium,
    canViewResult,
    FREE_LIMIT,
    user,
    isGuest: !user,
  }
}
