import { useAuth } from '../context/AuthContext'

// Paywall disabled — all results are free for now
const FREE_LIMIT = Infinity

export function useSubscription() {
  const { isPremium, user } = useAuth()

  const canViewResult = () => true

  return {
    isPremium,
    canViewResult,
    FREE_LIMIT,
    user,
    isGuest: !user,
  }
}
