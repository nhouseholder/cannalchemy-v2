export function loadFromStorage(key, fallback = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`Failed to save to localStorage "${key}":`, e)
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch {}
}

export function clearAllAppStorage() {
  const keys = ['sf-theme', 'sf-quiz', 'sf-results', 'sf-user-favorites', 'sf-user-journal', 'sf-user-recent', 'sf-user-dismissed']
  keys.forEach(k => localStorage.removeItem(k))
}
