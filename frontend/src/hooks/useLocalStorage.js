import { useState, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    try {
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (e) {
      console.warn(`Failed to save to localStorage key "${key}":`, e)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    localStorage.removeItem(key)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
